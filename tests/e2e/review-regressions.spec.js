const { test, expect } = require('playwright/test');

async function boot(page, path = '/') {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/, route => route.abort());
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.game?._preloadImages && game.i18n.loaded.day5);
    await page.evaluate(() => { game.settings.set('textSpeed', 0); game.state.playerName = 'Tester'; });
}

test('continue restores inherited backgrounds, including legacy saves', async ({ page }) => {
    await boot(page);
    await page.evaluate(() => { game._showScreen('game-screen'); game._loadScene('day1_gate_1'); game._loadScene('day1_gate_2'); });
    for (const legacy of [false, true]) {
        if (legacy) await page.evaluate(() => {
            const slot = JSON.parse(localStorage.getItem('nevergrad_save'));
            delete slot.gameState.currentBackground;
            localStorage.setItem('nevergrad_save', JSON.stringify(slot));
        });
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.game?._preloadImages && game.i18n.loaded.day5);
        await page.locator('#btn-continue').click();
        await expect(page.locator('#bg-layer')).toHaveCSS('background-image', /school_gate\.webp/);
        expect(await page.evaluate(() => game.state.currentScene)).toBe('day1_gate_2');
    }
});

test('theme resets for new games and restores for thriller saves', async ({ page }) => {
    await boot(page);
    await page.evaluate(() => {
        game._showScreen('game-screen'); game.state.currentDay = 4; game.state.triggerGenreShift();
        game.glitch.shiftTheme('thriller'); game._loadScene('day4_morning_start_2'); game.save.saveToSlot(1);
        game._showScreen('title-screen');
    });
    await page.locator('#btn-new-game').click();
    await page.locator('#player-name-input').fill('New Tester'); await page.locator('#btn-start').click();
    await page.waitForFunction(() => game.currentSceneData && game.state.currentDay === 1);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim())).toBe('#FFB7C5');
    await page.evaluate(() => game._onSlotClick(1, game.save.getSlotInfo(1), 'load', null));
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim())).toBe('#8B0000');
});

test('loading a normal slot from the archive resumes autosaving', async ({ page }) => {
    await boot(page);
    await page.evaluate(async () => {
        game._showScreen('game-screen'); game._loadScene('day1_opening_1'); game.save.saveToSlot(1);
        game.save.recordEnding('TRUE'); await game._startArchive();
    });
    await page.locator('#qm-menu').click(); await page.locator('#btn-load').click();
    await page.locator('#sl-slots .sl-slot').nth(1).click();
    await page.waitForFunction(() => !document.querySelector('#sl-overlay').classList.contains('active'));
    await page.evaluate(() => game._loadScene('day1_opening_2'));
    expect(await page.evaluate(() => ({ archive: game._archiveMode, saved: JSON.parse(localStorage.getItem('nevergrad_save')).currentScene })))
        .toEqual({ archive: false, saved: 'day1_opening_2' });
});

test('timed choices pause in the menu and cannot mutate saves after title exit', async ({ page }) => {
    await boot(page);
    await page.evaluate(() => {
        game._showScreen('game-screen'); game.state.currentDay = 4;
        SCENARIO[4].day4_morning_eunsu_choice.timedChoice = 1500;
        game._loadScene('day4_morning_eunsu_choice');
    });
    await page.waitForSelector('.timer-bar-wrapper', { state: 'visible' });
    await page.locator('#qm-menu').click();
    await page.waitForTimeout(1700);
    expect(await page.evaluate(() => game.state.currentScene)).toBe('day4_morning_eunsu_choice');
    await page.locator('#btn-resume').click();
    await page.waitForFunction(() => game.state.currentScene === 'day4_morning_eunsu_comply');
    await page.evaluate(() => game._loadScene('day4_morning_eunsu_choice'));
    await page.waitForSelector('.timer-bar-wrapper', { state: 'visible' });
    await page.locator('#qm-menu').click(); await page.locator('#btn-title').click();
    await page.waitForTimeout(1700);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('nevergrad_save')).currentScene)).toBe('day4_morning_eunsu_choice');
    expect(await page.evaluate(() => game.choiceAdvanced._intervals.size)).toBe(0);
});

test('ending controls reach postcredits and cage loop, with one completion record', async ({ page }) => {
    await boot(page);
    for (const kind of ['true', 'cage']) {
        await page.evaluate(kind => {
            game._prepareNewRun(); game.state.startNewRun(); game.state.currentDay = 5;
            game._showScreen('game-screen'); game._loadScene(`day5_ending_${kind}_title`);
        }, kind);
        const count = await page.evaluate(() => game.save.getMeta().playCount);
        await page.waitForTimeout(4500);
        await page.locator('#save-slot-overlay').click();
        await expect(page.locator('#save-slot-overlay')).toHaveClass(/hidden/);
        await page.locator('.ending-return-btn').click({ timeout: 20000 });
        await page.waitForFunction(kind => game.state.currentScene === (kind === 'true' ? 'day5_postcredit_1' : 'day5_cage_loop'), kind);
        expect(await page.evaluate(() => game.save.getMeta().playCount)).toBe(count);
        if (kind === 'true') {
            await page.evaluate(() => game._loadScene('day5_postcredit_end'));
            await page.waitForFunction(() => !game.dialogue.isTyping);
            await page.locator('#dialogue-box').click();
            await expect(page.locator('.ending-return-btn')).toBeVisible();
            await page.locator('.ending-return-btn').click();
            await expect(page.locator('#title-screen')).toHaveClass(/active/);
        } else {
            expect(await page.evaluate(() => game._cageMode)).toBe(true);
            await page.waitForFunction(() => !game.dialogue.isTyping && !game._clickLocked);
            await page.locator('#dialogue-box').click();
            expect(await page.evaluate(() => game._cageClickCount)).toBeGreaterThan(1);
            await page.evaluate(() => game._exitCageMode());
            await expect(page.locator('#title-screen')).toHaveClass(/active/);
            await expect(page.locator('#quick-menu')).not.toHaveClass(/cage-hidden/);
        }
    }
});

test('quota failures disclose temporary saves and keep gallery progress in memory', async ({ page }) => {
    await boot(page);
    const result = await page.evaluate(() => {
        game._showScreen('game-screen'); game._loadScene('day1_gate_1');
        Storage.prototype.setItem = () => { throw new DOMException('Quota', 'QuotaExceededError'); };
        game._saveToSlotAndClose(1); game.gallery.unlockEnding('RESIST END');
        return { status: game.save.lastSaveStatus, readable: game.save.hasSlotData(1), persisted: localStorage.getItem('nevergrad_slot_1'),
            toast: document.querySelector('#save-toast')?.textContent, gallery: game.gallery.getUnlockedEndings() };
    });
    expect(result.status).toBe('memory'); expect(result.readable).toBe(true); expect(result.persisted).toBe(null);
    expect(result.toast).toContain('이 탭에만'); expect(result.gallery).toContain('RESIST END');
});

test('gallery track changes survive old fade callbacks and stale SFX stays cancelled', async ({ page }) => {
    await boot(page);
    const result = await page.evaluate(async () => {
        await game.audio.preloadBGM(['spring_bright.mp3', 'daily_bright.mp3']);
        const items = game.gallery._getMusicItems();
        game.gallery._toggleBgmPreview(items.find(item => item.file === 'spring_bright.mp3'));
        await new Promise(resolve => setTimeout(resolve, 500));
        game.gallery._toggleBgmPreview(items.find(item => item.file === 'daily_bright.mp3'));
        await new Promise(resolve => setTimeout(resolve, 500));
        const playing = !!(game.audio.bgmSourceA || game.audio.bgmSourceB);
        let release; game.audio.loadBuffer = () => new Promise(resolve => { release = resolve; });
        const pending = game.audio.playSFX('old.mp3', { loop: true });
        game.audio.resetSession(); release(game.audio.ctx.createBuffer(1, 44100, 44100)); await pending;
        return { playing, activeSFX: game.audio._activeSFX.size };
    });
    expect(result).toEqual({ playing: true, activeSFX: 0 });
});

test('retrying missing story text refreshes the current dialogue without skipping it', async ({ page }) => {
    let failing = true;
    await page.route('**/i18n/ko/day1_morning.json*', route => failing ? route.abort() : route.continue());
    await boot(page);
    await page.evaluate(() => { game._showScreen('game-screen'); game._loadScene('day1_gate_2'); });
    await expect(page.locator('#dialogue-text')).toContainText('MISSING', { timeout: 10000 });
    await page.evaluate(() => game._advanceScene());
    expect(await page.evaluate(() => game.state.currentScene)).toBe('day1_gate_2');
    failing = false;
    await page.locator('#i18n-retry-banner button').click();
    await expect(page.locator('#i18n-retry-banner')).toHaveCount(0);
    await expect(page.locator('#dialogue-text')).not.toContainText('MISSING');
    await page.waitForFunction(() => !game.dialogue.isTyping);
    expect(await page.evaluate(() => game._waitingForText)).toBe(false);
    expect(await page.evaluate(() => game.state.currentScene)).toBe('day1_gate_2');
});
