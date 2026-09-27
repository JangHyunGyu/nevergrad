'use strict';
const {test, expect} = require('playwright/test');
const fs = require('node:fs');
const path = require('node:path');

// Exercise the real bootloader and its loadDay/loadAll wrappers: reading JSON
// alone missed a legacy overlay that silently restored obsolete narration.
for (const lang of ['ko','en','ja','es','fr','de','pt']) {
  test(`reviewed scenario copy survives runtime overlays: ${lang}`, async ({page}, info) => {
    await page.setViewportSize({width:320,height:568});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.route(/^https?:\/\//, route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.fallback() : route.abort());
    await page.goto(lang === 'ko' ? '/' : `/${lang}/`, {waitUntil:'domcontentloaded'});
    await page.waitForFunction(() => window.game && I18nManager.prototype.__nevergradCausalityI18n);
    const expected = {};
    for (const [file, keys] of [
      ['day2_night', ['day2_night_ft_groupchat','day2_night_ft_groupchat_2','day2_night_ft_putdown','day2_night_ft_putdown_2']],
      ['day3_morning', ['day3_morning_photo_back','day3_morning_photo_look']]
    ]) {
      const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../../assets/js/i18n',lang,`${file}.json`),'utf8'));
      for (const key of keys) expected[key]=data[key];
    }
    const loaded = await page.evaluate(async keys => {
      await game.i18n.loadAll();
      const all = Object.fromEntries(keys.map(key=>[key,game.i18n.get(key)]));
      for (const day of [2,3]) { delete game.i18n.loaded[`day${day}`]; await game.i18n.loadDay(day); }
      return {all, reload:Object.fromEntries(keys.map(key=>[key,game.i18n.get(key)]))};
    },Object.keys(expected));
    expect(loaded.all).toEqual(expected);
    expect(loaded.reload).toEqual(expected);
    await page.evaluate(() => {
      game._prepareNewRun(); game.state.startNewRun();
      game.settings.set('textSpeed',0); game._showScreen('game-screen');
      game.renderer.setBackground(CONFIG.BACKGROUNDS.hallway);
    });
    for (const key of Object.keys(expected)) {
      await page.evaluate(key => {
        game.state.currentDay=Number(key.match(/^day(\d)/)[1]);
        game.state.currentSlot=key.startsWith('day2')?'night':'morning';
        game._loadScene(key);
      },key);
      await page.waitForFunction(key=>game.state.currentScene===key&&!game.dialogue.isTyping&&!game._clickLocked,key);
      await expect(page.locator('#dialogue-box')).toContainText(expected[key].text.replaceAll('*',''));
      if (key.startsWith('day3_morning_photo_')) {
        await expect(page.locator('#binaural-toast')).toHaveCount(0);
        await page.screenshot({path:info.outputPath(`${key}.png`)});
        await page.locator('#dialogue-box').click();
        await page.waitForFunction(()=>game.state.currentScene==='day3_morning_photo_1'&&!game.dialogue.isTyping&&!game._clickLocked);
        await page.locator('#dialogue-box').click();
        await page.waitForFunction(()=>game.state.currentScene==='day3_morning_photo_2'&&!game.dialogue.isTyping&&!game._clickLocked);
      }
    }
    await page.screenshot({path:info.outputPath('reviewed-copy.png')});
  });
}
