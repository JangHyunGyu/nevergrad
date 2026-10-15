'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={SCENARIO:{}};
vm.runInNewContext(fs.readFileSync('assets/js/config.js','utf8')+'\nglobalThis.config=CONFIG;',context);
for(const file of ['day5_1_morning.js','day5_2_lunch.js','day5_3_afterschool.js','day5_4_night.js'])vm.runInNewContext(fs.readFileSync('assets/js/scenario/'+file,'utf8'),context);
const scenes=context.SCENARIO[5],aliases=context.config.SCENE_ALIASES;
function walk(start,{flags=[],eunsu=60,answers={}}={}){
 const state=new Set(flags),seen=[],stats={eunsu,sea:50,seolhwa:30,yuna:50};let id=start;
 const check=c=>[].concat(c||[]).every(f=>state.has(f));
 const apply=node=>{(node.clearFlags||[]).forEach(f=>state.delete(f));(node.setFlags||[]).forEach(f=>state.add(f));if(node.setFlag)state.add(node.setFlag);for(const[ch,values]of Object.entries(node.stats||{}))stats[ch]=(stats[ch]||0)+(values.affinity||0);};
 for(let n=0;n<450;n++){
  id=aliases[id]||id;const node=scenes[id];assert.ok(node,id);
  if(node.condition&&!check(node.condition)){id=node.fallback;continue;}
  seen.push(id);apply(node);
  if(node.endingTitle)return {seen,flags:state,ending:node.endingTitle};
  if(node.choices){const answer=answers[id]??0;if(answer==='timeout'){apply({setFlags:node.timeoutFlags});id=node.timeoutNext;}else{const choice=node.choices[answer];assert.ok(choice,id);apply(choice);id=choice.next;}continue;}
  const branch=(node.branches||[]).find(b=>check(b.condition)&&(!b.excludeCondition||!state.has(b.excludeCondition)));
  const aff=(node.affinityBranches||[]).find(b=>stats[node.affinityChar]>=b.minAffinity);
  id=branch?.next||aff?.next||node.next;
 }
 assert.fail('route did not terminate: '+seen.join(' -> '));
}
const witnesses=[];
for(const [answer,ending]of [[0,'TRUE'],[1,'FORGET'],[2,'RESIST'],['timeout','GHOST']]){
 test(`actual lunch chase reaches the single final choice and ${ending} outcome`,()=>{
  const result=walk('day5_lunch_chase_10',{answers:{day5_after_final_choice:answer},flags:['has_evidence']});
  assert.equal(result.ending,ending+' END');
  assert.equal(result.seen.filter(id=>id==='day5_after_final_choice').length,1);
  assert.equal(result.seen.filter(id=>id==='day5_after_confront_1').length,1);
  assert.equal(result.seen.some(id=>id.startsWith('day5_lunch_eunsu_')),false);
  if(ending==='TRUE'){
   for(const n of [3,4,5])assert.ok(result.seen.includes('day5_after_true_'+n));
   assert.equal(result.seen.includes('day5_ending_true_14a'),false);
   assert.equal(result.seen.filter(id=>id==='day5_ending_true_16'||id==='day5_ending_true_16_clear').length,1);
  }
  witnesses.push(...result.seen);
 });
}
test('all restored confrontation/outcome nodes have flag-aware normal-play witnesses',()=>{
 const required=Object.keys(scenes).filter(id=>/^day5_after_(confront_|final_choice$|true_|resist_|forget_|ghost_)/.test(id));
 for(const id of required)assert.ok(witnesses.includes(id),'unwitnessed: '+id);
});
test('COMPLICIT requires an explicit Day 5 commitment and skips rescue and CAGE',()=>{
 const result=walk('day5_morning_start',{flags:['complicit_route']});
 assert.equal(result.ending,'COMPLICIT END');
 assert.equal(walk('day5_morning_start',{flags:['complicit_route'],eunsu:50}).ending,'COMPLICIT END');
 assert.ok(result.seen.includes('day5_morning_complicit_offer'));
 assert.ok(result.seen.includes('day5_lunch_complicit_1'));
 assert.equal(result.seen.some(id=>/day5_morning_(dawn|rescue)|day5_lunch_chase|day5_after_cage/.test(id)),false);
 const low=walk('day5_morning_start',{flags:['complicit_route'],eunsu:49});
 assert.equal(low.seen.includes('day5_morning_complicit_offer'),false);
 assert.notEqual(low.ending,'COMPLICIT END');
 const declined=walk('day5_morning_start',{flags:['complicit_route'],answers:{day5_morning_complicit_offer:1}});
 assert.notEqual(declined.ending,'COMPLICIT END');
});
test('Sea CAGE cannot be hijacked by earlier compliance, readiness or Eunsu affinity',()=>{
 const result=walk('day5_lunch_chase_10',{flags:['complicit_route','complicit_ready','route_complicit','high_eunsu_affinity'],answers:{day5_lunch_left_choice:2}});
 assert.equal(result.ending,'CAGE END');
 assert.ok(result.seen.includes('day5_ending_cage_sea_1'));
 assert.equal(result.seen.some(id=>id.startsWith('day5_ending_complicit_')),false);
 const legacy=walk('day5_night_start',{flags:['stayed_with_sea','route_complicit','complicit_ready','route_true','has_evidence']});
 assert.equal(legacy.ending,'CAGE END');assert.ok(legacy.seen.includes('day5_ending_cage_sea_1'));
});
test('Eunsu CAGE and explicit COMPLICIT never play each other’s classroom/contract sequence',()=>{
 const cage=walk('day5_morning_proposal_timer',{flags:['complicit_route','high_eunsu_affinity','complicit_ready']});
 assert.equal(cage.ending,'CAGE END');assert.ok(cage.seen.includes('day5_after_cage_1'));
 assert.equal(cage.seen.some(id=>id.startsWith('day5_ending_complicit_')),false);
});
test('legacy final-choice saves migrate to the same three choices and timeout',()=>{
 assert.equal(aliases.day5_lunch_eunsu_final,'day5_after_final_choice');
 for(const [answer,ending]of [[0,'TRUE'],[1,'FORGET'],[2,'RESIST'],['timeout','GHOST']])assert.equal(walk('day5_lunch_eunsu_final',{answers:{day5_after_final_choice:answer}}).ending,ending+' END');
 for(const target of Object.values(aliases))assert.ok(scenes[target],target);
});
test('legacy TRUE and RESIST paths cannot make Eunsu hear Seolhwa or drop a second syringe',()=>{
 assert.equal(scenes.day5_ending_true_14a.character,null);
 assert.equal(scenes.day5_ending_true_14b.sfx,undefined);
 for(const id of ['day5_after_resist_9','day5_after_resist_10','day5_ending_resist_11','day5_ending_resist_12','day5_ending_resist_13'])assert.equal(scenes[id].character,'eunsu_shaking');
});
test('both wrapped and flat legacy saves load canonical scenes without losing flags or stats',()=>{
 context.CONFIG=context.config;
 vm.runInNewContext(fs.readFileSync('assets/js/modules/SaveManager.js','utf8')+'\nglobalThis.Manager=SaveManager;',context);
 for(const wrapped of [false,true])for(const[id,target]of Object.entries(aliases)){
  const original={currentDay:5,currentScene:id,currentSlot:'lunch',flags:{has_evidence:true},stats:{seolhwa:{affinity:25}}};
  const manager=Object.create(context.Manager.prototype);manager._getItem=()=>JSON.stringify(wrapped?{gameState:original}:original);
  const result=manager._readSlot(1);assert.ok(result,id);
  assert.equal(result.gameState.currentScene,target);assert.equal(result.gameState.currentSlot,'afterschool');
  assert.equal(result.gameState.flags.has_evidence,true);assert.equal(result.gameState.stats.seolhwa.affinity,25);
 }
 const manager=Object.create(context.Manager.prototype);
 const history={day5_lunch_eunsu_final:{index:2,text:'Together',time:1},day5_lunch_eunsu_24:{index:1,text:'Listen',time:1}};
 manager._getItem=()=>JSON.stringify(history);
 assert.equal(manager.getPreviousChoice('day5_after_final_choice').index,2);
 assert.equal(manager.getPreviousChoice('day5_after_confront_observe').index,1);
 history.day5_after_final_choice={index:0,text:'Remember',time:2};
 assert.equal(manager.getPreviousChoice('day5_after_final_choice').index,0);
});
