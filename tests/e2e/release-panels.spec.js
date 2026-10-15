const { test, expect } = require('playwright/test');

for (const width of [1280, 1024, 768, 375, 667]) {
    test(`admin panel stays inside the viewport at ${width}px`, async ({ page }, info) => {
        await page.setViewportSize({ width, height: width === 667 ? 375 : 844 });
        await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/, route => route.abort());
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.game?.i18n?.loaded?.day5);
        await page.evaluate(() => {
            game.settings.set('textSpeed', 0); game.state.playerName = 'QA';
            game._showScreen('game-screen'); game.state.currentDay = 4;
            game._loadScene('day4_night_save_glitch_7');
        });
        const panel = page.locator('#admin-panel-overlay');
        await expect(panel).toHaveClass(/visible/);
        const box = await panel.boundingBox();
        expect(box.width).toBeGreaterThan(100); expect(box.height).toBeGreaterThan(80);
        expect(box.x).toBeGreaterThanOrEqual(0); expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
        expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize().height);
        const lastRow = await page.locator('.admin-panel-row').last().boundingBox();
        expect(lastRow.y + lastRow.height).toBeLessThanOrEqual(box.y + box.height);
        const dialogue = await page.locator('#dialogue-box').boundingBox();
        expect(box.y + box.height).toBeLessThanOrEqual(dialogue.y);
        await page.screenshot({ path: info.outputPath('admin-panel.png'), animations: 'disabled' });
    });
}
