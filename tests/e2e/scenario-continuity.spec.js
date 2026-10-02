'use strict';
const {test,expect}=require('playwright/test');
const fs=require('node:fs');
const path=require('node:path');

for(const lang of ['ko','en','ja','es','fr','de','pt','zh']) {
    test(`first-night gifts follow the received items: ${lang}`,async({page})=>{
        await page.setViewportSize({width:390,height:844});
        await page.emulateMedia({reducedMotion:'reduce'});
        await page.route(/^https?:\/\//,route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.fallback():route.abort());
        await page.goto(lang==='ko'?'/':`/${lang}/`,{waitUntil:'domcontentloaded'});
        await page.waitForFunction(()=>window.game&&I18nManager.prototype.__nevergradCausalityI18n);
        await page.evaluate(async()=>{await game.i18n.loadAll();game.settings.set('textSpeed',0);});
        const text=JSON.parse(fs.readFileSync(path.join(__dirname,'../../assets/js/i18n',lang,'day1_night.json'),'utf8'));
        const cases=[
            {flags:[],shown:[]},
            {flags:['received_sea_milk'],shown:['day1_night_sleep_milk']},
            {flags:['received_yuna_photo'],shown:['day1_night_sleep_photo']},
            {flags:['received_riin_tea'],shown:['day1_night_sleep_tea']},
            {flags:['received_sea_milk','received_yuna_photo'],shown:['day1_night_sleep_milk','day1_night_sleep_photo']},
            {flags:['received_sea_milk','received_riin_tea'],shown:['day1_night_sleep_milk','day1_night_sleep_tea']}
        ];
        for(const c of cases){
            await page.evaluate(flags=>{
                game._prepareNewRun();game.state.startNewRun();
                game.state.currentDay=1;game.state.currentSlot='night';
                flags.forEach(flag=>game.state.setFlag(flag));
                game._showScreen('game-screen');game._loadScene('day1_night_sleep_2');
            },c.flags);
            for(const id of c.shown){
                await page.waitForFunction(id=>game.state.currentScene===id&&!game.dialogue.isTyping&&!game._clickLocked,id);
                await expect(page.locator('#dialogue-box')).toContainText(text[id].text.replaceAll('*',''));
                await page.locator('#dialogue-box').click();
            }
            await page.waitForFunction(()=>game.state.currentScene==='day1_night_sleep_3'&&!game.dialogue.isTyping);
            await expect(page.locator('#dialogue-box')).toContainText(text.day1_night_sleep_3.text.replaceAll('*',''));
        }
    });
}
