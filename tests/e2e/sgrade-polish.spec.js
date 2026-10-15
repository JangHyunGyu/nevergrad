const { test, expect } = require('playwright/test');

async function boot(page, lang = 'ko') {
    await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    await page.goto(lang === 'ko' ? '/' : `/${lang}/`);
    await page.waitForFunction(() => window.game?.i18n?.loaded?.day5);
    await page.evaluate(() => { game._showScreen('game-screen'); game.state.playerName = 'QA'; });
}

for (const width of [1280, 1024, 768, 375, 667]) test(`photo comparison is usable at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: width === 667 ? 375 : 812 });
    await boot(page);
    await page.evaluate(() => game.glitchAdvanced.showPhotoDeck({ onComplete: () => { window.qaPhotoDone = true; } }));
    await page.locator('.photo-deck-dot').nth(6).click();
    await expect(page.locator('.photo-deck-face')).toHaveClass(/photo-deck-focus/);
    await page.locator('.photo-deck-compare').click();
    await expect(page.locator('.photo-deck-comparison')).toBeVisible();
    await expect(page.locator('.photo-deck-counter')).toHaveText('7 / 13');
    await expect(page.locator('.photo-deck-comparison img')).toHaveCount(2);
    await expect(page.locator('.photo-deck-comparison-label').last()).toHaveText('#13 QA');
    const box = await page.locator('.photo-deck-compare').boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x).toBeGreaterThanOrEqual(0); expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize().height);
    await page.screenshot({ path: info.outputPath('photo-comparison.png'), animations: 'disabled' });
    await page.locator('.photo-deck-dot').nth(12).click();
    await expect(page.locator('.photo-deck-comparison')).toBeHidden();
    await page.locator('.photo-deck-compare').click();
    await expect(page.locator('.photo-deck-counter')).toHaveText('13 / 13');
    for (let i = 0; i < 13; i++) await page.locator('.photo-deck-dot').nth(i).click();
    await page.locator('.photo-deck-complete').click();
    await expect(page.locator('#photo-deck-overlay')).toHaveCount(0);
    expect(await page.evaluate(() => window.qaPhotoDone)).toBe(true);
});

test('all four deduction answers rejoin the story and only correct clues award synchronization', async ({ page }) => {
    await boot(page);
    for (const first of [0, 1]) for (const second of [0, 1]) {
        await page.evaluate(() => {
            game._prepareNewRun(); game.state.startNewRun(); game.state.playerName = 'QA';
            game.state.currentDay = 4; game.state.setFlag('genre_shift');
            game._showScreen('game-screen'); game._loadScene('day4_night_deduction_hand');
            game.dialogue.skipTyping(); window.qaInitialSync = game.state.stats.seolhwa.affinity;
        });
        await page.locator('#choice-panel .choice-btn').nth(first).click();
        await expect.poll(() => page.evaluate(() => game.state.currentScene)).toBe(first === 0 ? 'day4_night_deduction_hand_match' : 'day4_night_deduction_hand_hint');
        await page.evaluate(() => { game.dialogue.skipTyping(); game._advanceScene(); game.dialogue.skipTyping(); });
        await page.locator('#choice-panel .choice-btn').nth(second).click();
        await expect.poll(() => page.evaluate(() => game.state.currentScene)).toBe(second === 0 ? 'day4_night_deduction_record_match' : 'day4_night_deduction_record_hint');
        const result = await page.evaluate(() => {
            const delta = game.state.stats.seolhwa.affinity - window.qaInitialSync;
            game.dialogue.skipTyping(); game._advanceScene();
            return { delta, scene: game.state.currentScene };
        });
        expect(result).toEqual({ delta: (first === 0 ? 2 : 0) + (second === 0 ? 2 : 0), scene: 'day4_night_mirror_hit1_8' });
    }
});

for (const lang of ['ko', 'en', 'ja', 'es', 'fr', 'de', 'pt', 'zh']) test(`${lang} resolves audit placeholders and speaker context`, async ({ page }) => {
    await boot(page, lang);
    const result = await page.evaluate(() => {
        game.state.currentDay = 1; game._loadScene('day1_lunch_sea_share_1');
        const voice = game.dialogue._voiceTexture;
        game.state.currentDay = 5; game._loadScene('day5_observer_6');
        const text = game.dialogue._fullText;
        const copy = game.glitchAdvanced._getPhotoComparisonCopy();
        game._loadScene('day5_observer_8');
        return { frequency: voice.frequency, text, finalText: game.dialogue._fullText, compare: copy.compare };
    });
    expect(result.frequency).toBe(1060);
    expect(result.text).toContain('QA'); expect(result.text).not.toMatch(/\{[^}]+\}/);
    expect(result.finalText).toContain('QA'); expect(result.finalText).not.toMatch(/\{[^}]+\}/);
    expect(result.compare).toContain('#07');
});

test('authored Day 5 pacing reaches the runtime, including immediate Riin and shutter hold', async ({ page }) => {
    await boot(page);
    const result = await page.evaluate(async () => {
        game.state.currentDay = 5; game.state.setFlag('genre_shift');
        game._loadScene('day5_morning_true_9');
        const document = { speed: game.dialogue._typeSpeed, pace: game.dialogue._typeOptions.textPace, charId: game.dialogue._typeOptions.charId };
        game._loadScene('day5_lunch_right_34');
        await new Promise(resolve => setTimeout(resolve, 20));
        const riin = { typing: game.dialogue.isTyping, text: game.dialogue._fullText, rendered: window.document.getElementById('dialogue-text').textContent };
        game._loadScene('day5_lunch_right_37');
        const held = game.dialogue._pauseRemaining;
        await new Promise(resolve => setTimeout(resolve, 450));
        const shutter = { typing: game.dialogue.isTyping, rendered: window.document.getElementById('dialogue-text').textContent };
        game._loadScene('day5_lunch_left_4');
        const sea = { pace: game.dialogue._typeOptions.textPace, auto: game.currentSceneData.autoAdvance };
        game._prepareNewRun();
        return { document, riin, held, shutter, sea };
    });
    expect(result.document).toEqual({ speed: 40, pace: 'document', charId: 'system' });
    expect(result.riin.typing).toBe(false); expect(result.riin.rendered).toBe(result.riin.text);
    expect(result.held).toBe(400); expect(result.shutter.typing).toBe(false); expect(result.shutter.rendered).not.toBe('');
    expect(result.sea).toEqual({ pace: 'fractured', auto: true });
});

test('typing synth respects SFX mute and rate limit, then releases active sources', async ({ page }) => {
    await boot(page);
    await page.locator('#dialogue-box').click();
    const result = await page.evaluate(async () => {
        const audio = game.audio;
        await audio.ctx.resume();
        const texture = audio.getVoiceTexture('seolhwa');
        const first = audio.playTypingTick(texture);
        const rateLimited = audio.playTypingTick(texture);
        const active = audio._typingVoices.size;
        await new Promise(resolve => setTimeout(resolve, 150));
        const afterEnd = audio._typingVoices.size;
        audio.setVolume('sfx', 0);
        const muted = audio.playTypingTick(texture);
        audio.setVolume('sfx', 0.8);
        audio.playTypingTick(texture);
        audio.stopSFX(null, 0);
        return { first, rateLimited, active, afterEnd, muted, afterStop: audio._typingVoices.size };
    });
    expect(result).toEqual({ first: true, rateLimited: false, active: 1, afterEnd: 0, muted: false, afterStop: 0 });
});
