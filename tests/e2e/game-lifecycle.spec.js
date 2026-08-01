const { test, expect } = require('playwright/test');

const endings = [
    ['day5_ending_true_title', 'TRUE END', 'TRUE'],
    ['day5_ending_escape_title', 'ESCAPE END', 'ESCAPE'],
    ['day5_ending_resist_title', 'RESIST END', 'RESIST'],
    ['day5_ending_cage_title', 'CAGE END', 'CAGE'],
    ['day5_ending_forget_title', 'FORGET END', 'FORGET'],
    ['day5_ending_ghost_title', 'GHOST END', 'GHOST'],
    ['day5_ending_complicit_title', 'COMPLICIT END', 'COMPLICIT']
];

test.beforeEach(async ({ page }) => {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/, route => route.abort());
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => window.game?.i18n?.currentLang, null, { timeout: 30000 });
});

test('new game, save recovery and seven endings stay isolated in a real browser', async ({ page }) => {
    await page.getByRole('button', { name: /새 게임|New Game/i }).click();
    await page.locator('#player-name-input').fill('Lifecycle Tester');
    await page.locator('#btn-start').click();
    await expect(page.locator('#game-screen')).toHaveClass(/active/, { timeout: 30000 });

    const restored = await page.evaluate(() => {
        game.state.currentDay = 1;
        game.state.currentSlot = 'morning';
        game.state.currentScene = 'day1_opening_1';
        game.state.playerName = 'Saved Tester';
        const saved = game.save.saveToSlot(1);
        game.state.playerName = 'Mutated';
        const loaded = game.save.loadFromSlot(1);
        return { saved, loaded, name: game.state.playerName, scene: game.state.currentScene };
    });
    expect(restored).toEqual({ saved: true, loaded: true, name: 'Saved Tester', scene: 'day1_opening_1' });

    for (const [sceneId, title, key] of endings) {
        await page.evaluate(({ sceneId }) => {
            game._prepareNewRun();
            game.state.startNewRun();
            game.state.playerName = 'Ending Tester';
            game.state.currentDay = 5;
            game.state.currentSlot = 'night';
            game.state.currentScene = sceneId;
            game._showScreen('game-screen');
            game._loadScene(sceneId);
        }, { sceneId });
        await expect(page.locator('.ending-title-overlay')).toContainText(title);
        const state = await page.evaluate(() => ({
            endingReached: game._endingReached,
            sceneTimers: game.sceneLifecycle.snapshot().timeouts,
            seen: game.save.getMeta().endingsSeen
        }));
        expect(state.endingReached).toBe(true);
        expect(state.sceneTimers).toBe(0);
        expect(state.seen).toContain(key);
        // Some endings intentionally layer a save-slot meta-horror panel above
        // the title button; invoke the button handler directly after validating it.
        await page.locator('.ending-return-btn').evaluate(button => button.click());
        await expect(page.locator('.ending-title-overlay')).toHaveCount(0);
    }
    const seen = await page.evaluate(() => game.save.getMeta().endingsSeen.sort());
    expect(seen).toEqual(endings.map(item => item[2]).sort());
});

test('long play scope churn and device listeners leave no pending run work', async ({ page }) => {
    const result = await page.evaluate(() => {
        const initialRoot = game.lifecycle.snapshot();
        for (let index = 0; index < 1000; index += 1) {
            const scope = game.runLifecycle.createScope(`stress:${index}`);
            scope.timeout(() => { throw new Error('stale stress timer ran'); }, 60000);
            scope.listen(window, 'nevergrad-stress', () => {});
            scope.dispose();
        }
        game._prepareNewRun();
        return {
            initialRoot,
            root: game.lifecycle.snapshot(),
            run: game.runLifecycle.snapshot(),
            scene: game.sceneLifecycle.snapshot(),
            audio: game.audio.effectLifecycle.snapshot(),
            glitch: game.glitch.effectLifecycle.snapshot(),
            deviceReady: !!game.deviceGimmick,
            mediaDeviceTracked: !!navigator.mediaDevices?.addEventListener
        };
    });
    expect(result.deviceReady).toBe(true);
    expect(result.root.cleanups).toBeLessThanOrEqual(result.initialRoot.cleanups + 1);
    expect(result.run.cleanups).toBe(1);
    expect(result.run.timeouts).toBe(0);
    expect(result.scene.timeouts).toBe(0);
    expect(result.audio.timeouts).toBe(0);
    expect(result.glitch.timeouts).toBe(0);
});
