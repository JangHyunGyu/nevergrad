const { test, expect } = require('playwright/test');

async function boot(page, lang = 'ko') {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/, route => route.abort());
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(lang === 'ko' ? '/' : `/${lang}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.game?.i18n?.loaded?.day5);
    await page.evaluate(() => { game.settings.set('textSpeed', 0); game.state.playerName = 'QA'; game._showScreen('game-screen'); });
}

for (const lang of ['ko', 'en', 'ja', 'es', 'fr', 'de', 'pt', 'zh']) {
    test(`local midnight cue follows corridor backgrounds and survives save reload: ${lang}`, async ({ page }) => {
        await boot(page, lang);
        await page.clock.setFixedTime(new Date(2026, 0, 1, 2, 59));
        const result = await page.evaluate(() => {
            const shown = [];
            game.glitchAdvanced.showGhostText = text => shown.push(text);
            game.state.currentDay = 4;
            game.renderer.setBackground(CONFIG.BACKGROUNDS.bathroom);
            game._loadScene('day4_night_mirror_swipe_2'); // bathroom, must not consume the cue
            const before = game.state.hasFlag('latenight_shown');
            game._loadScene('day4_lunch_yuna_1'); // actual corridor; story time is lunch
            const after = game.state.hasFlag('latenight_shown');
            game.save.saveToSlot(8);
            game.state.clearFlag('latenight_shown'); game.save.loadFromSlot(8);
            game._loadScene('day4_lunch_yuna_1');
            return { before, after, shown, expected: game.i18n.getUI('latenightAlone') };
        });
        expect(result.before).toBe(false); expect(result.after).toBe(true);
        expect(result.shown).toEqual([result.expected]);
        await page.clock.setFixedTime(new Date(2026, 0, 1, 3, 0));
        expect(await page.evaluate(() => {
            game.state.clearFlag('latenight_shown'); game._loadScene('day4_lunch_yuna_1');
            return game.state.hasFlag('latenight_shown');
        })).toBe(false);
    });
}

test('authored whispers pan left in binaural mode and stay centered otherwise', async ({ page }) => {
    await boot(page);
    const result = await page.evaluate(async () => {
        const buffer = await game.audio.loadBuffer('assets/audio/sfx/sfx_whisper_seolhwa.mp3');
        const calls = [];
        game.audio.playSFXPanned = (file, pan) => calls.push({ file, pan });
        for (const active of [false, true]) {
            game.audio.isBinauralActive = () => active;
            game.state.currentDay = 3; game._loadScene('day3_night_seolhwa_5');
            game.state.currentDay = 4; game._loadScene('day4_night_mirror_hit1_14');
        }
        return { decoded: !!buffer?.length, calls };
    });
    expect(result.decoded).toBe(true);
    expect(result.calls.map(c => c.pan)).toEqual([0, 0, -1, -1]);
    expect(result.calls.every(c => c.file === 'sfx_whisper_seolhwa')).toBe(true);
});

test('peeling remains visible during narration and mirrors exclude only Seolhwa', async ({ page }) => {
    await boot(page);
    await page.evaluate(() => { game.state.currentDay = 3; game._loadScene('day3_night_stat_crack_4'); });
    await expect(page.locator('#stat-display')).toHaveClass(/stat-revealed/);
    await page.evaluate(() => { game._updateHUD(); });
    await expect.poll(() => page.locator('#stat-display').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.5);
    await page.evaluate(() => {
        game.renderer.setCharacter('left', CONFIG.EXPRESSIONS.sea.smile);
        game.renderer.setCharacter('center', CONFIG.EXPRESSIONS.seolhwa.sad);
        game.renderer.clearCharacterSlot('right');
    });
    await expect(page.locator('#char-left')).toBeVisible();
    await page.evaluate(() => game.glitchAdvanced.showMirrorReflection('seolhwa'));
    await expect(page.locator('.mirror-reflection-sprite')).toHaveCount(1);
    await expect(page.locator('.mirror-reflection-sprite')).toHaveAttribute('src', /sea_smile/);
    expect(await page.locator('.mirror-reflection-sprite').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
});

test('mobile scene vibration reaches the device API and mirror touch gestures unlock progression', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
        userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36' });
    const page = await context.newPage();
    await page.addInitScript(() => { window.qaVibrations = []; navigator.vibrate = pattern => { window.qaVibrations.push(pattern); return true; }; });
    await boot(page);
    const vibration = await page.evaluate(() => {
        game.state.currentDay = 4; window.qaVibrations = [];
        game._loadScene('day4_night_mirror_hit1_12');
        return { calls: window.qaVibrations, expected: DeviceGimmickSystem.VIBRATION_PATTERNS.heartbeat };
    });
    expect(vibration.calls).toContainEqual(vibration.expected);
    await page.evaluate(() => game._loadScene('day4_night_mirror_swipe'));
    await expect(page.locator('.mirror-swipe-canvas')).toBeVisible();
    await page.bringToFront();
    // Day 4 intentionally requires landscape; rotate through the real overlay.
    await expect(page.locator('#rotate-prompt')).toBeVisible();
    await page.setViewportSize({ width: 844, height: 390 });
    await expect(page.locator('#rotate-prompt')).toBeHidden();
    expect(await page.evaluate(() => document.elementFromPoint(300, 120)?.className)).toContain('mirror-swipe-canvas');
    expect(await page.evaluate(() => game._clickLocked)).toBe(true);
    const client = await context.newCDPSession(page);
    for (const x of [300, 380, 460, 540]) {
        await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: 60 }] });
        for (let y = 70; y <= 330; y += 10) {
            await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
        }
        await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    }
    await expect(page.locator('.mirror-swipe-container')).toHaveCount(0);
    expect(await page.evaluate(() => game._clickLocked)).toBe(false);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await context.close();
});
