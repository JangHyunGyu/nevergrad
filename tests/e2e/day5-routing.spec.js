const {test,expect}=require('playwright/test');
for(const lang of ['ko','en','ja','es','fr','de','pt','zh']){
 test(`real Day 5 choices, save migration and hallucination boundaries: ${lang}`,async({page},info)=>{
  test.setTimeout(120000);
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/,r=>r.abort());
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(lang==='ko'?'/':`/${lang}/`);
  await page.waitForFunction(()=>window.game?.i18n?.loaded?.day5);
  const result=await page.evaluate(async()=>{
   const sleep=ms=>new Promise(r=>setTimeout(r,ms));
   let visited=[],spoken=[],sweeps=[];
   const load=game._loadScene.bind(game),type=game.dialogue.type.bind(game.dialogue);
   game._loadScene=id=>{const result=load(id);visited.push(game.state.currentScene);return result;};
   game.dialogue.type=(name,text,done,opts={})=>{spoken.push({id:game.state.currentScene,text,speaker:opts.charId});return type(name,text,done,{...opts,typingSpeed:0,typingPause:0});};
   game.audio.playFootstepsPanSweep=()=>sweeps.push(game.state.currentScene);
   function seed(flags=[]){
    game._prepareNewRun();game.state.startNewRun();game.state.currentDay=5;game.state.playerName='QA';
    game.state.stats.eunsu.affinity=60;game.state.stats.seolhwa.affinity=30;
    flags.forEach(f=>game.state.setFlag(f));game.settings.set('textSpeed',0);game._showScreen('game-screen');
    visited=[];spoken=[];sweeps=[];
   }
   async function walk(start,answers={}){
    game._loadScene(start);
    for(let n=0;n<900;n++){
     await sleep(2);
     if(game.renderer.cgTransition?.active || game._waitingForCG){await sleep(50);n--;continue;}
     const id=game.state.currentScene,scene=game.currentSceneData;
     if(scene.endingTitle)return {ending:scene.endingTitle,visited:visited.slice(),spoken:spoken.slice(),sweeps:sweeps.slice()};
     if(game.dialogue.isTyping)continue;
     if(scene.choices){
      const answer=answers[id]??0;
      if(scene.timedChoice)game._handleTimedResult(scene,answer==='timeout'?-1:answer,game.i18n.get(id).choices);
      else{
       const buttons=document.querySelectorAll('#choice-panel .choice-btn');
       if(!buttons[answer])continue;
       buttons[answer].click();
       for(let k=0;k<600&&game.state.currentScene===id;k++)await sleep(5);
      }
     }else game._advanceScene();
    }
    throw Error('Route stalled at '+game.state.currentScene);
   }
   const routes=[];
   for(const [answer,ending]of [[0,'TRUE'],[1,'FORGET'],[2,'RESIST'],['timeout','GHOST']]){
    seed(['has_evidence']);routes.push({...await walk('day5_lunch_chase_10',{day5_after_final_choice:answer}),expected:ending});
   }
   seed(['complicit_route','complicit_ready','route_complicit','high_eunsu_affinity']);
   const sea=await walk('day5_lunch_chase_10',{day5_lunch_left_choice:2});
   seed(['complicit_route','complicit_ready','high_eunsu_affinity']);const cage=await walk('day5_morning_proposal_timer');
   seed(['complicit_route']);const complicit=await walk('day5_morning_start');
   seed(['route_true','has_evidence']);const legacy=await walk('day5_night_start');
   seed(['route_resist']);const legacyResist=await walk('day5_night_start');
   seed(['has_evidence']);game.state.currentScene='day5_lunch_eunsu_final';
   const saved=game.save.saveToSlot(9);game.state.clearFlag('has_evidence');const loaded=game.save.loadFromSlot(9);
   const migrated=game.state.currentScene;game._loadScene(migrated);await sleep(25);
   const migration={saved,loaded,id:game.state.currentScene,evidence:game.state.hasFlag('has_evidence'),labels:Array.from(document.querySelectorAll('#choice-panel .choice-btn'),el=>el.textContent),expected:game.i18n.get('day5_after_final_choice').choices};
   const required=Object.keys(SCENARIO[5]).filter(id=>/^day5_after_(confront_|final_choice$|true_|resist_|forget_|ghost_)/.test(id));
   return {routes,sea,cage,complicit,legacy,legacyResist,migration,required};
  });
  for(const route of result.routes){
   expect(route.ending).toBe(route.expected+' END');
   expect(route.visited.filter(id=>id==='day5_after_final_choice')).toHaveLength(1);
   expect(route.visited.some(id=>id.startsWith('day5_lunch_eunsu_'))).toBe(false);
  }
  const normal=result.routes.flatMap(r=>r.visited);
  for(const id of result.required)expect(normal,id).toContain(id);
  const trueRoute=result.routes[0];expect(trueRoute.sweeps).toEqual(['day5_after_true_3','day5_after_true_4','day5_after_true_5']);
  expect(trueRoute.visited).not.toContain('day5_ending_true_14a');
  const resist=result.routes[2];
  for(const id of ['day5_after_resist_9','day5_after_resist_10'])expect(resist.spoken.find(s=>s.id===id)?.speaker,id).toBe('me');
  expect(result.sea.ending).toBe('CAGE END');expect(result.sea.visited).toContain('day5_ending_cage_sea_1');
  expect(result.cage.ending).toBe('CAGE END');expect(result.cage.visited).toContain('day5_after_cage_1');
  for(const route of [result.sea,result.cage])expect(route.visited.some(id=>id.startsWith('day5_ending_complicit_'))).toBe(false);
  expect(result.complicit.ending).toBe('COMPLICIT END');
  expect(result.complicit.visited.some(id=>/day5_morning_(dawn|rescue)|day5_lunch_chase|day5_after_cage/.test(id))).toBe(false);
  expect(result.legacy.ending).toBe('TRUE END');
  expect(result.legacy.spoken.find(s=>s.id==='day5_ending_true_14a')?.speaker).toBe('me');
  expect(result.legacyResist.ending).toBe('RESIST END');
  for(const id of ['day5_ending_resist_11','day5_ending_resist_12','day5_ending_resist_13'])expect(result.legacyResist.spoken.find(s=>s.id===id)?.speaker,id).toBe('me');
  expect(result.migration).toMatchObject({saved:true,loaded:true,id:'day5_after_final_choice',evidence:true});
  expect(result.migration.labels).toEqual(result.migration.expected);
  await info.attach('day5-runtime-paths.json',{body:Buffer.from(JSON.stringify(result)),contentType:'application/json'});
 });
}
