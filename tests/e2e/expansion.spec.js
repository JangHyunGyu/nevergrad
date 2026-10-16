const { test, expect } = require('playwright/test');

test('archive scores render stereo audio with the requested tempos and safe loop edges', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => typeof BGMSynth === 'function');
    const results = await page.evaluate(async () => {
        const synth = new BGMSynth();
        synth.init({});
        const results = [];
        for (const key of ['cycle07_elegy', 'complicit_cold_pulse']) {
            const buffer = await synth._registry[key]();
            let peak = 0, energy = 0, stereoDifference = 0;
            const left = buffer.getChannelData(0), right = buffer.getChannelData(1);
            for (let i = 0; i < left.length; i++) {
                peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
                energy += left[i] ** 2 + right[i] ** 2;
                stereoDifference += Math.abs(left[i] - right[i]);
            }
            results.push({ key, duration: buffer.duration, sampleRate: buffer.sampleRate,
                channels: buffer.numberOfChannels, peak, rms: Math.sqrt(energy / (left.length * 2)),
                stereoDifference, first: left[0], last: left[left.length - 1] });
        }
        return results;
    });
    for (const result of results) {
        expect(result.sampleRate).toBe(48000);
        expect(result.channels).toBe(2);
        expect(result.peak).toBeGreaterThan(0.02);
        expect(result.peak).toBeLessThan(0.99);
        expect(result.rms).toBeGreaterThan(0.005);
        expect(result.stereoDifference).toBeGreaterThan(1);
        expect(result.first).toBe(0);
        expect(result.last).toBe(0);
        expect(result.duration).toBeCloseTo(32 * 60 / (result.key === 'cycle07_elegy' ? 68 : 90), 3);
    }
});

for (const lang of ['ko', 'en', 'ja', 'es', 'fr', 'de', 'pt', 'zh']) {
    test(`expanded scenes and archive menu render in ${lang} on mobile`, async ({ page }, info) => {
        await page.setViewportSize({ width: 667, height: 375 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/, route => route.abort());
        await page.goto(lang === 'ko' ? '/' : `/${lang}/`, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.game?.i18n?.loaded?.day5);
        await page.evaluate(() => {
            game.settings.set('textSpeed', 0);
            game.state.playerName = 'QA';
            game._showScreen('game-screen');
        });
        const ids = ['day1_night_app_5', 'day2_morning_pen_6', 'day3_morning_class_sea_7',
            'day4_lunch_darkroom_3', 'day4_night_truth_eunsu_4',
            'day5_ending_cage_eunsu_epilogue_18', 'day5_archive_cycle07_52', 'day5_archive_cycle12_62'];
        for (const id of ids) {
            await page.evaluate(id => {
                game.state.currentDay = Number(id[3]);
                game._loadScene(id);
                game.dialogue.skipTyping();
            }, id);
            await page.waitForFunction(() => !game.dialogue.isTyping && !game._clickLocked);
            const text = await page.locator('#dialogue-text').innerText();
            expect(text.trim().length).toBeGreaterThan(3);
            expect(text).not.toContain(id);
            if (lang !== 'ko') expect(text).not.toMatch(/[가-힣]/);
            const layout = await page.locator('#dialogue-box').evaluate(element => {
                const rect = element.getBoundingClientRect();
                return { top: rect.top, bottom: rect.bottom, viewport: innerHeight };
            });
            expect(layout.top).toBeGreaterThanOrEqual(0);
            expect(layout.bottom).toBeLessThanOrEqual(layout.viewport + 1);
        }
        await page.evaluate(() => {
            game.state.currentDay = 5;
            game._loadScene('day5_xover_server_preview_choice');
            game.dialogue.skipTyping();
        });
        await page.waitForFunction(() => !game.dialogue.isTyping && !game._clickLocked);
        await expect(page.locator('#choice-panel .choice-btn')).toHaveCount(4);
        await page.screenshot({ path: info.outputPath(`archive-${lang}.png`), animations: 'disabled' });
    });
}
