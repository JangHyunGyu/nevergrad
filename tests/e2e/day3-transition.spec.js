const { test, expect } = require('playwright/test');

const cases = [
    ['ko', 'sea', 320, 568],
    ['en', 'eunsu', 430, 932],
    ['ja', 'riin', 844, 390],
    ['es', 'yuna', 768, 1024],
    ['fr', 'seolhwa', 1440, 900],
    ['de', 'sea', 1024, 768],
    ['pt', 'eunsu', 390, 664],
    ['zh', 'riin', 568, 320]
];

for (const [lang, leader, width, height] of cases) {
    test(`Day 3 saved night reaches Day 4: ${lang}, ${leader}, ${width}x${height}`, async ({ page }, info) => {
        const origin = process.env.NEVERGRAD_VERIFY_URL || 'http://127.0.0.1:4178';
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => {
            if (message.type() === 'error' && message.text().includes('Scene not found')) errors.push(message.text());
        });
        await page.route(/^https?:\/\//, route => {
            if (new URL(route.request().url()).origin === new URL(origin).origin) return route.continue();
            return route.abort();
        });
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(new URL(lang === 'ko' ? '/' : `/${lang}/`, origin).href);
        await page.waitForFunction(() => window.game?.i18n?.loaded?.day5);
        const result = await page.evaluate(async leader => {
            const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
            game._prepareNewRun();
            game.state.startNewRun();
            game.state.playerName = 'QA';
            game.state.currentDay = 3;
            game.state.currentSlot = 'night';
            game.state.currentScene = 'day3_night_end';
            for (const stats of Object.values(game.state.stats)) stats.affinity = -20;
            game.state.stats[leader].affinity = 35;
            const saved = game.save.saveToSlot(9);
            game.state.currentDay = 1;
            const loaded = game.save.loadFromSlot(9);
            game.settings.set('textSpeed', 0);
            game._showScreen('game-screen');
            const visited = [];
            const loadScene = game._loadScene.bind(game);
            game._loadScene = id => {
                visited.push({ id, day: game.state.currentDay, slot: game.state.currentSlot });
                return loadScene(id);
            };
            game._loadScene(game.state.currentScene);
            const deadline = performance.now() + 40000;
            while (game.state.currentScene !== 'day4_morning_start' && performance.now() < deadline) {
                await pause(30);
                if (game.dialogue.isTyping) game.dialogue.skipTyping();
                if (!game._clickLocked) game._advanceScene();
            }
            game.dialogue.skipTyping();
            return { saved, loaded, visited, day: game.state.currentDay, slot: game.state.currentSlot,
                id: game.state.currentScene, dataMatches: game.currentSceneData === SCENARIO[4].day4_morning_start };
        }, leader);
        expect(result).toMatchObject({ saved: true, loaded: true, day: 4, slot: 'morning',
            id: 'day4_morning_start', dataMatches: true });
        expect(result.visited).toContainEqual({ id: `day3_night_pressure_${leader}_1`, day: 3, slot: 'night' });
        for (const entry of result.visited.filter(entry => entry.id.startsWith('day3_'))) {
            expect(entry.day).toBe(3);
            expect(entry.slot).toBe('night');
        }
        await expect(page.locator('#dialogue-text')).not.toBeEmpty();
        await expect(async () => {
            const box = await page.locator('#dialogue-box').boundingBox();
            expect(box).not.toBeNull();
            expect(box.x).toBeGreaterThanOrEqual(-1);
            expect(box.y).toBeGreaterThanOrEqual(-1);
            expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
            expect(box.y + box.height).toBeLessThanOrEqual(height + 1);
        }).toPass();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(errors).toEqual([]);
        await page.screenshot({ path: info.outputPath(`day4-${lang}.png`), animations: 'disabled' });
        await info.attach('transition.json', { body: Buffer.from(JSON.stringify(result)), contentType: 'application/json' });
    });
}
