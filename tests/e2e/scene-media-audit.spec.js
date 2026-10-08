const {test,expect}=require('playwright/test');
const fs=require('node:fs'),path=require('node:path');
const report=require('../../docs/qa/scene-media-audit-2026-10-08.json');

async function boot(page){
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/,route=>route.abort());
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.game?._preloadImages&&game.i18n.loaded.day5);
    await page.waitForTimeout(4500);
}

test('all reviewed runtime scenes retain their audited media contracts and valid assets',async({page},info)=>{
    await boot(page);
    const actual=await page.evaluate(()=>Object.entries(SCENARIO).flatMap(([day,scenes])=>Object.entries(scenes).map(([id,scene])=>({id,day,scene}))));
    expect(actual.map(r=>r.id).sort()).toEqual(report.ledger.map(r=>r.id).sort());
    for(const {id,scene}of actual){
        const corrected=report.expectedCorrections[id];
        if(corrected)for(const[field,value]of Object.entries(corrected.fields))expect(scene[field],`${id}.${field}`).toEqual(value);
    }
    const assets=await page.evaluate(()=>Object.values(CONFIG.BACKGROUNDS).concat(Object.values(CONFIG.EXPRESSIONS).flatMap(Object.values),Object.values(CONFIG.SUBJECT_FACE_IMAGES)).filter(Boolean));
    for(const asset of new Set(assets))expect(fs.existsSync(path.join(__dirname,'../..',asset)),asset).toBe(true);
    const rows=await page.evaluate(()=>{
        const result=[],empty=()=>{};
        game._prepareNewRun();game.state.startNewRun();game._showScreen('game-screen');
        game.glitchAdvanced=null;game.deviceGimmick=null;game.metaHorror=null;
        game._handleGlitch=empty;game._pulseCrossGlitch=empty;game._checkLatenightGimmick=empty;game._checkHeadphoneHint=empty;
        game._showEndingTitle=empty;game._saveProgress=()=>true;game.save.save=()=>true;
        game.dialogue.type=empty;game.dialogue.typeMessenger=empty;
        game.audio.playSFX=empty;game.audio.stopSFX=empty;game.audio.stopBGM=empty;
        game.renderer.playBGM=empty;game.renderer.setMediaOverlay=empty;
        let drawn={};game.renderer.setCharacter=(pos,src)=>{if(src)drawn[pos]=src;else delete drawn[pos];};
        game.renderer.clearCharacters=()=>{drawn={};};game.renderer.clearCharacterSlot=pos=>{delete drawn[pos];};
        game.renderer.setBackground=src=>{game.state.currentBackground=src;};
        for(const[day,scenes]of Object.entries(SCENARIO))for(const[id,scene]of Object.entries(scenes)){
            game.state.currentDay=Number(day);game.state.flags={ending_recorded:true};
            for(const flag of [].concat(scene.condition||[]))game.state.setFlag(flag);
            game._endingReached=false;game._cageMode=false;drawn={};game._loadScene(id);
            const expected={};
            if(scene.character){const src=game._resolveCharImage(scene.character);if(src)expected.center=src;}
            for(const[pos,key]of Object.entries(scene.characters||{})){if(key){const src=game._resolveCharImage(key);if(src)expected[pos]=src;}}
            result.push({id,loaded:game.state.currentScene,drawn:{...drawn},expected});
        }
        game._prepareNewRun();return result;
    });
    for(const row of rows){expect(row.loaded,row.id).toBe(row.id);expect(row.drawn,row.id).toEqual(row.expected);}
    await test.info().attach('all-scene-bindings.json',{body:Buffer.from(JSON.stringify(rows)),contentType:'application/json'});
});

test('location transitions, hidden departures and news overlays follow the actual scene',async({page})=>{
    await boot(page);
    await page.evaluate(()=>{game.settings.set('textSpeed',0);game.state.playerName='Tester';game._showScreen('game-screen');});
    for(const {day,ids,bg,absent} of [
        {day:3,ids:['day3_lunch_rooftop_1','day3_lunch_door_open','day3_lunch_door_open_8'],bg:'corridor.webp'},
        {day:3,ids:['day3_xover_glitch_2','day3_xover_glitch_6','day3_night_seolhwa'],bg:'home.webp'},
        {day:4,ids:['day4_lunch_yuna_10','day4_lunch_yuna_17','day4_lunch_yuna_18'],bg:'old_basement_door.webp',absent:true},
        {day:5,ids:['day5_after_confront_1'],bg:'emergency_corridor.webp'},
        {day:5,ids:['day5_ending_cage_eunsu_6'],bg:'classroom_afternoon.webp'},
        {day:5,ids:['day5_ending_forget_21','day5_ending_forget_22'],bg:'school_gate.webp'}
    ]){
        await page.evaluate(day=>{game._prepareNewRun();game.state.startNewRun();game.state.currentDay=day;game._showScreen('game-screen');},day);
        for(const id of ids){
            await page.evaluate(id=>game._loadScene(id),id);
            await page.waitForFunction(()=>!game.dialogue.isTyping&&!game._clickLocked);
        }
        await expect(page.locator('#bg-layer')).toHaveCSS('background-image',new RegExp(bg.replace('.','\\.')));
        if(absent)await expect(page.locator('#char-center')).toHaveAttribute('src','');
    }
    await page.evaluate(()=>{game._prepareNewRun();game.state.currentDay=5;game._loadScene('day5_ending_true_25');});
    await expect(page.locator('#media-overlay')).not.toHaveClass(/visible/);
    await page.evaluate(()=>game._loadScene('day5_ending_true_26'));
    await expect(page.locator('#media-overlay')).toHaveAttribute('data-media-type','newsArticle');
});

test('every Riin infirmary route keeps the casual outfit and PA voices never spawn Eunsu',async({page})=>{
    await boot(page);
    const result=await page.evaluate(()=>({
        casual:Object.entries(SCENARIO[5]).filter(([id,s])=>/^day5_lunch_(right_|pills_)/.test(id)&&s.character?.startsWith('riin_')).map(([id,s])=>({id,key:s.character,path:game._resolveCharImage(s.character)})),
        pa:[SCENARIO[2].day2_broadcast_4,...Array.from({length:7},(_,i)=>SCENARIO[5][`day5_morning_broadcast_${i+1}`]),...Array.from({length:3},(_,i)=>SCENARIO[5][`day5_lunch_chase_${i+4}`])].map(s=>s.character),
        pill:CONFIG.BACKGROUNDS.cg_riin_two_pills,subject:CONFIG.SUBJECT_FACE_IMAGES[7]
    }));
    for(const row of result.casual){expect(row.key,row.id).toMatch(/^riin_casual/);expect(row.path,row.id).toContain('/riin_casual');}
    expect(result.pa.every(value=>value===null)).toBe(true);
    expect(result.pill).toContain('cg_riin_two_pills_casual.webp');expect(result.subject).toContain('subject_07_long_hair.png');
});
