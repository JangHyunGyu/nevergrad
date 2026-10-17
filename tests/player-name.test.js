const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('assets/js/modules/GameEngine.js','utf8');
function method(name){const start=source.indexOf('    '+name+'(');const end=source.indexOf('\n    }',start)+6;return source.slice(start,end);}
test('all name-screen start buttons show a popup and preserve the run when a name contains symbols or Hangul jamo',async()=>{
 const sandbox={window:{},document:{},console};
 vm.runInNewContext('globalThis.valid=({'+method('_validPlayerName')+'})._validPlayerName;',sandbox);
 for(const name of ['이지원','Alex Kim 2','みなと','Élodie','이지원'])assert.equal(sandbox.valid(name),true,name);
 const start=source.indexOf("        startButton?.addEventListener('click', async () => {");
 const end=source.indexOf('\n        });',start)+12;
 const callback=source.slice(start,end).replace("        startButton?.addEventListener('click', async () => {",'globalThis.start = async function() {').replace(/\}\);\s*$/,'};');
 for(const name of ['Alex!','ㅋㅋ','ㅏㅏ','ᄏᄏ','ᄆᄆ','지원ㅋ','\uffa1']){
  let warnings=0,resets=0;const field={value:name,setAttribute(){},focus(){}};
  const context={nameInput:field,window:{alert(){warnings++;}}};vm.runInNewContext(callback,context);
  await context.start.call({_validPlayerName:sandbox.valid,i18n:{getUI:()=> 'Invalid name'},_prepareNewRun(){resets++;}});
  assert.equal(warnings,1,name);assert.equal(resets,0,name);
 }
});
