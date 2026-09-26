'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
function runtime(cookie='',search='?gate=1&lang=ja#record') {
  const env={window:{},document:{cookie},location:{href:`https://cupid.archerlab.dev/${search}`,hostname:'cupid.archerlab.dev',protocol:'https:'},URL,Date,
    history:{state:{entry:1},replaceState(state,title,url){this.url=url;env.location.href='https://cupid.archerlab.dev'+url;}}};
  vm.createContext(env);vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js/cross-world.js'),'utf8'),env);return env;
}
test('a fresh handoff carries a bounded name once and preserves unrelated URL state',()=>{
  const record={target:'cupid',name:'<지민>\n',at:Date.now()};
  const env=runtime('archer_crossing_v1='+encodeURIComponent(JSON.stringify(record)));
  assert.equal(env.window.CrossWorld.takeArrival('cupid').name,'지민');
  assert.equal(env.history.url,'/?lang=ja#record');
  assert.match(env.document.cookie,/Max-Age=0/);
  assert.equal(env.window.CrossWorld.takeArrival('cupid'),null);
});
test('expired, malformed, future and wrong-destination cookies never supply a name',()=>{
  for(const data of ['%broken',JSON.stringify({target:'cupid',name:'old',at:Date.now()-600001}),JSON.stringify({target:'cupid',name:'future',at:Date.now()+60000}),JSON.stringify({target:'nevergrad',name:'wrong',at:Date.now()})]){
    const env=runtime('archer_crossing_v1='+encodeURIComponent(data));
    assert.equal(env.window.CrossWorld.takeArrival('cupid').name,'');
  }
});
test('blocked cookies still permit arrival and non-arrival visits do not touch storage',()=>{
  const env=runtime();Object.defineProperty(env.document,'cookie',{get(){throw Error('blocked')},set(){throw Error('blocked')}});
  assert.equal(env.window.CrossWorld.takeArrival('cupid').name,'');
  const regular=runtime('untouched','?lang=ko');assert.equal(regular.window.CrossWorld.takeArrival('cupid'),null);assert.equal(regular.document.cookie,'untouched');
});
test('every explicit visit gets an arrival without a permanent session suppression flag',()=>{
  const env=runtime('', '?from=riin');assert.ok(env.window.CrossWorld.takeArrival('nevergrad'));
  env.location.href='https://nevergrad.archerlab.dev/?from=riin';assert.ok(env.window.CrossWorld.takeArrival('nevergrad'));
});


test('fresh shared completion supersedes old local records, with strict values and storage fallback',()=>{
  const source=fs.readFileSync(path.join(__dirname,'../assets/js/modules/CrossoverSystem.js'),'utf8');
  const detect=(cookie,local={})=>{
    const env={window:{},document:{cookie},localStorage:{getItem(key){if(local===null)throw Error('blocked');return local[key]??null;}}};
    vm.runInNewContext(source,env);const system=new env.window.CrossoverSystem({});system.detect();return system.getData();
  };
  const latest=detect('cupid_cycle_01=complete; cupid_heroine=nurse; cupid_subject_compliance=100',{cupid_cycle_01:'incomplete',cupid_heroine:'yuna',cupid_subject_compliance:'20'});
  assert.equal(latest.completed,true);assert.equal(latest.heroine,'nurse');assert.equal(latest.compliance,100);
  for(const value of ['100junk','-1','101','2.5','']){
    const bad=detect(`cupid_heroine=unknown; cupid_subject_compliance=${value}`,null);
    assert.equal(bad.heroine,null);assert.equal(bad.compliance,null);
  }
  assert.equal(detect('',{cupid_cycle_01:'complete'}).completed,true);
  assert.equal(detect('',null).completed,false);
});
