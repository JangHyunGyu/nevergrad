'use strict';
const { test, expect } = require('playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const filesAndIds = [
    ['day1_morning', ['day1_sea_meet_11', 'day1_seolhwa_greet_3']],
    ['day3_lunch', ['day3_lunch_door_open_11', 'day3_lunch_riin_choice']],
    ['day4_afterschool', ['day4_after_sea_12loop_7', 'day4_after_eunsu_14']],
    ['day4_lunch', ['day4_lunch_yuna_17']],
    ['day4_night', ['day4_night_save_glitch_14']],
    ['day5_morning', ['day5_morning_grad_14', 'day5_morning_true_31', 'day5_morning_proposal_2']],
    ['day5_lunch', ['day5_lunch_chase_3']],
    ['day5_afterschool', ['day5_after_ghost_7', 'day5_after_ghost_10']]
];

for (const lang of ['ko', 'en', 'ja', 'es', 'fr', 'de', 'pt', 'zh']) {
    for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
        test(`reviewed translations load and render: ${lang} ${viewport.width}`, async ({page}, info) => {
            await page.setViewportSize(viewport);
            await page.emulateMedia({reducedMotion:'reduce'});
            await page.route(/^https?:\/\//, route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.fallback() : route.abort());
            await page.goto(lang === 'ko' ? '/' : `/${lang}/`, {waitUntil:'domcontentloaded'});
            await page.waitForFunction(() => window.game && I18nManager.prototype.__nevergradCausalityI18n);
            const expected = {};
            for (const [file, ids] of filesAndIds) {
                const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../../assets/js/i18n', lang, `${file}.json`), 'utf8'));
                for (const id of ids) expected[id] = data[id];
            }
            const loaded = await page.evaluate(async ids => {
                await game.i18n.loadAll();
                const all = Object.fromEntries(ids.map(id => [id, game.i18n.get(id)]));
                for (const day of [1, 3, 4, 5]) {
                    delete game.i18n.loaded[`day${day}`];
                    await game.i18n.loadDay(day);
                }
                return {all, reload:Object.fromEntries(ids.map(id => [id, game.i18n.get(id)]))};
            }, Object.keys(expected));
            expect(loaded.all).toEqual(expected);
            expect(loaded.reload).toEqual(expected);
            await page.evaluate(() => {
                game._prepareNewRun();
                game.state.startNewRun();
                game.state.playerName = 'Tester';
                game.settings.set('textSpeed', 0);
                game._showScreen('game-screen');
            });
            for (const id of ['day1_sea_meet_11', 'day4_after_sea_12loop_7', 'day4_after_eunsu_14', 'day5_morning_grad_14', 'day5_after_ghost_10']) {
                await page.evaluate(id => {
                    game.state.currentDay = Number(id.match(/^day(\d)/)[1]);
                    game.state.currentSlot = id.includes('_morning_') ? 'morning' : 'afterschool';
                    game._loadScene(id);
                }, id);
                await page.waitForFunction(id => game.state.currentScene === id && !game.dialogue.isTyping && !game._clickLocked, id);
                await expect(page.locator('#dialogue-box')).toContainText(expected[id].text.replaceAll('{name}', 'Tester').replaceAll('*', ''));
                const bounds = await page.locator('#dialogue-box').boundingBox();
                expect(bounds.x).toBeGreaterThanOrEqual(-1);
                expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width + 1);
                await page.screenshot({path:info.outputPath(`${id}.png`)});
            }
        });
    }
}
