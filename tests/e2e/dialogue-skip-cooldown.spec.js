'use strict';
const { test, expect } = require('playwright/test');
const text = 'This complete line must remain visible after a manual reveal.';

async function boot(page) {
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    await page.goto('/');
    await page.waitForFunction(() => window.game?._preloadImages && game.i18n.loaded.day1);
    await page.evaluate(text => {
        window.qaSkipTime = 1000;
        Object.defineProperty(performance, 'now', { configurable: true, value: () => window.qaSkipTime });
        game._showScreen('game-screen');
        game.state.currentDay = 1;
        for (const [id, next] of [['day1_qa_skip_a', 'day1_qa_skip_b'], ['day1_qa_skip_b', 'day1_qa_skip_c'], ['day1_qa_skip_c', null]]) {
            SCENARIO[1][id] = { next, typingSpeed: 1000 };
            game.i18n.texts.day1[id] = { text };
        }
        game._loadScene('day1_qa_skip_a');
    }, text);
    await page.waitForFunction(() => !game._clickLocked && game.dialogue.isTyping);
}

for (const width of [1280, 844]) test.describe(`250ms manual reveal guard at ${width}px`, () => {
    test.use({ viewport: { width, height: width === 844 ? 390 : 800 }, hasTouch: width === 844 });
    const activate = locator => width === 844 ? locator.tap() : locator.click();

    test('click or touch reveals immediately and repeated input cannot advance before 250ms', async ({ page }, testInfo) => {
        await boot(page);
        await activate(page.locator('#dialogue-box'));
        await expect(page.locator('#dialogue-text')).toHaveText(text);
        await page.evaluate(() => { window.qaSkipTime = 1249; });
        await activate(page.locator('#dialogue-box'));
        await page.evaluate(() => { for (let i = 0; i < 20; i++) document.querySelector('#dialogue-box').click(); });
        await page.locator('#dialogue-box').press('Enter');
        expect(await page.evaluate(() => game.state.currentScene)).toBe('day1_qa_skip_a');
        await page.screenshot({ path: testInfo.outputPath('manual-reveal.png'), animations: 'disabled' });
        await page.evaluate(() => { window.qaSkipTime = 1250; });
        expect(await page.evaluate(() => game.state.currentScene)).toBe('day1_qa_skip_a');
        await activate(page.locator('#dialogue-box'));
        await expect.poll(() => page.evaluate(() => game.state.currentScene)).toBe('day1_qa_skip_b');
    });

    test('natural completion and loading another scene remain immediately advanceable', async ({ page }) => {
        await boot(page);
        await page.evaluate(() => {
            SCENARIO[1].day1_qa_skip_a.typingSpeed = 1;
            SCENARIO[1].day1_qa_skip_b.typingSpeed = 1;
            game._loadScene('day1_qa_skip_a');
        });
        await page.waitForFunction(() => !game.dialogue.isTyping && !game._clickLocked);
        await activate(page.locator('#dialogue-box'));
        await expect.poll(() => page.evaluate(() => game.state.currentScene)).toBe('day1_qa_skip_b');
        await page.evaluate(() => {
            game.dialogue.armAdvanceCooldown();
            game._loadScene('day1_qa_skip_b');
        });
        await page.waitForFunction(() => !game.dialogue.isTyping && !game._clickLocked);
        expect(await page.evaluate(() => game.dialogue.isAdvanceCoolingDown())).toBe(false);
        await activate(page.locator('#dialogue-box'));
        await expect.poll(() => page.evaluate(() => game.state.currentScene)).toBe('day1_qa_skip_c');
    });

    test('explicit horror skip locks remain active', async ({ page }) => {
        await boot(page);
        await page.evaluate(() => {
            SCENARIO[1].day1_qa_skip_a.unskippable = true;
            game._loadScene('day1_qa_skip_a');
        });
        await activate(page.locator('#dialogue-box'));
        expect(await page.evaluate(() => game.dialogue.isTyping)).toBe(true);
        expect(await page.evaluate(() => game.dialogue.isAdvanceCoolingDown())).toBe(false);
        expect(await page.evaluate(() => game.state.currentScene)).toBe('day1_qa_skip_a');
    });
});
