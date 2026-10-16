const { test, expect } = require('playwright/test');
const fixed = require('../../docs/qa/phase2-fixed-copy-20261016.json');

test.beforeEach(async ({ page }) => {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/, route => route.abort());
    await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const lang of ['ko','en','ja','es','fr','de','pt','zh']) {
    test(`phase 2 fixed scenes and gallery labels render in ${lang}`, async ({ page }) => {
        await page.goto(lang === 'ko' ? '/' : `/${lang}/`);
        await page.waitForFunction(() => window.game?.i18n?.loaded?.day5);
        const result = await page.evaluate(({ fixed, lang }) => {
            const failures = [];
            game.settings.set('textSpeed', 0);
            game._showScreen('game-screen');
            game.state.playerName = 'QA';
            game.save.readOnly = true;
            for (const chapter of fixed.chapters) for (const [id, entry] of Object.entries(chapter.entries)) {
                game.state.currentDay = chapter.day;
                game._loadScene(id);
                game.dialogue.skipTyping();
                const copy = game.i18n.get(id);
                if (!copy.text || copy.text === id || lang !== 'ko' && /[가-힣]/.test(copy.text)) failures.push(id + ': text');
                if (lang === 'ko' && JSON.stringify(copy) !== JSON.stringify(entry)) failures.push(id + ': fixed copy');
                if (copy.choices?.length !== entry.choices?.length) failures.push(id + ': choices');
            }
            game.save.readOnly = false;
            const gallery = game.gallery;
            const cg = gallery._getCGItems(), music = gallery._getMusicItems(), chars = gallery._getCharacterItems();
            const missing = cg.filter(i => !GallerySystem.EXPANSION_CG_LABELS[lang]?.[i.backgroundKey]);
            const actualExpressions = chars.flatMap(c => c.expressions.map(e => e.name));
            gallery.activeTab = 'cg';
            gallery.open();
            return { failures, missing: missing.map(i => i.id), cg: cg.length, music: music.length,
                names: [...cg.map(i => i.name), ...music.map(i => i.name), ...actualExpressions],
                replay: gallery._labels().replay };
        }, { fixed, lang });
        expect(result.failures).toEqual([]);
        expect(result.missing).toEqual([]);
        expect(result.cg).toBe(14);
        expect(result.music).toBe(30);
        expect(result.replay.length).toBeGreaterThan(0);
        for (const name of result.names) expect(name.length).toBeGreaterThan(0);
        if (lang !== 'ko') expect(result.names.join('')).not.toMatch(/[가-힣]/);
        await expect(page.locator('.gallery-card[data-kind="cg"]')).toHaveCount(14);
    });
}

test('locked memories stay locked and both archive and all ending replays preserve saves', async ({ page }) => {
    test.setTimeout(180000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.waitForFunction(() => window.game?.i18n?.loaded?.day5);
    await page.evaluate(() => {
        game.settings.set('textSpeed', 0);
        game.gallery.open();
    });
    await page.locator('[data-ending="TRUE END"]').click();
    await expect(page.locator('[data-replay]')).toHaveCount(0);
    await page.locator('.gallery-modal-close').click();
    await page.evaluate(() => {
        game.state.playerName = 'Saved QA';
        game.state.currentDay = 2;
        game.state.currentScene = 'day2_lunch_start';
        game.state.setFlag('phase2_save_sentinel');
        game.save.save();
        for (let i = 1; i <= 9; i++) game.save.saveToSlot(i);
        for (const ending of GallerySystem.ENDINGS) game.gallery.unlockEnding(ending);
        for (const key of ['cg_cycle07_seolhwa','cg_cycle12_yuna']) game.gallery.unlockCGByPath(key);
        window.phase2Storage = () => Object.fromEntries(Object.keys(localStorage).filter(k => /^nevergrad_(save|slot_|meta|choices|gallery|endings)/.test(k)).sort().map(k => [k,localStorage.getItem(k)]));
        window.phase2SavedStorage = phase2Storage();
        game.gallery.open();
    });
    const keys = ['cg_cycle07_seolhwa','cg_cycle12_yuna','TRUE END','RESIST END','FORGET END','CAGE END','GHOST END','ESCAPE END','COMPLICIT END'];
    for (const key of keys) {
        await page.evaluate(key => {
            game.gallery.activeTab = key.endsWith('END') ? 'endings' : 'cg';
            game.gallery._render();
        }, key);
        await page.locator(key.endsWith('END') ? `[data-ending="${key}"]` : `[data-kind="cg"][data-id="${key}"]`).click();
        await page.locator(`[data-replay="${key}"]`).click();
        await page.waitForFunction(() => game.isGalleryReplay && game.state.currentDay === 5 && game.state.currentScene.startsWith('day5_'), null, { timeout: 15000 });
        const result = await page.evaluate(async () => {
            const blockedSave = game.save.saveToSlot(3);
            const blockedLoad = game.save.loadFromSlot(1);
            const visited = [];
            for (let count = 0; game.isGalleryReplay && count < 500; count++) {
                if (game.renderer.cgTransition?.active) {
                    await new Promise(resolve => setTimeout(resolve, 60));
                    continue;
                }
                game.dialogue.skipTyping();
                game._clickLocked = false;
                visited.push(game.state.currentScene);
                const endingButton = document.querySelector('.ending-return-btn');
                const choice = document.querySelector('#choice-panel:not(.hidden) .choice-btn');
                if (endingButton) endingButton.click();
                else if (choice) choice.click();
                else game._advanceScene();
                await new Promise(resolve => setTimeout(resolve, 1));
            }
            return { blockedSave, blockedLoad, replay: !!game.isGalleryReplay, visited,
                unchanged: JSON.stringify(phase2Storage()) === JSON.stringify(phase2SavedStorage),
                playerName: game.state.playerName, scene: game.state.currentScene,
                sentinel: game.state.hasFlag('phase2_save_sentinel'), readonly: game.save.readOnly };
        });
        expect(result.blockedSave, key).toBe(false);
        console.log(`Replay ${key}: ${result.visited.length} steps; save unchanged: ${result.unchanged}`);
        expect(result.blockedLoad, key).toBe(false);
        expect(result.replay, key + ': ' + result.visited.slice(-4)).toBe(false);
        expect(result.unchanged, key).toBe(true);
        expect(result.playerName, key).toBe('Saved QA');
        expect(result.scene, key).toBe('day2_lunch_start');
        expect(result.sentinel, key).toBe(true);
        expect(result.readonly, key).toBe(false);
        await expect(page.locator('#gallery-screen')).toHaveClass(/active/);
    }
    expect(errors).toEqual([]);
    const resumed = await page.evaluate(() => game.save.loadFromSlot(1) && game.state.currentScene);
    expect(resumed).toBe('day2_lunch_start');
});
