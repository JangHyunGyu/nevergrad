'use strict';
const { test, expect } = require('playwright/test');

const cases = [
    ...['ko', 'en', 'ja', 'es', 'fr', 'de', 'pt', 'zh'].map(lang => ({ lang, width: 375, height: 667 })),
    { lang: 'ko', width: 667, height: 375 },
    { lang: 'ko', width: 1280, height: 800 }
];

for (const { lang, width, height } of cases) {
    test(`cold ${lang} first paint waits for styles at ${width}x${height}`, async ({ browser }, testInfo) => {
        const context = await browser.newContext({
            viewport: { width, height }, serviceWorkers: 'block', reducedMotion: 'reduce'
        });
        const page = await context.newPage();
        let releaseStyles;
        const stylesHeld = new Promise(resolve => { releaseStyles = resolve; });
        let requestedStyles = false;
        await page.route(/^https:\/\//, route => route.abort());
        await page.route('**/assets/css/style.css*', async route => {
            requestedStyles = true;
            await stylesHeld;
            await route.continue();
        });
        try {
            await page.goto(`http://127.0.0.1:4178/${lang === 'ko' ? '' : `${lang}/`}`, { waitUntil: 'commit' });
            await expect.poll(() => requestedStyles).toBe(true);
            // A contentful paint while this response is held would expose the
            // unstyled controls. The old asynchronous document rewrite did so.
            await page.waitForTimeout(700);
            const prematurePaints = await page.evaluate(() =>
                performance.getEntriesByName('first-contentful-paint').map(entry => entry.startTime));
            expect(prematurePaints, 'Content must wait for the game stylesheet').toEqual([]);
            releaseStyles();
            await expect(page.locator('#btn-new-game')).toBeEnabled();
            await expect(page.locator('#title-screen')).toHaveClass(/title-intro-complete/);
            await expect(page.locator('.archerlab-link')).toHaveCSS('position', /^(absolute|fixed)$/);
            await expect(page.locator('.lang-switcher')).toBeVisible();
            await expect(page.locator('.archerlab-link')).toHaveCSS('border-image-source', /glass-frame\.webp/);
            await page.screenshot({ path: testInfo.outputPath('styled-title.png') });
        } finally {
            releaseStyles();
            await context.close();
        }
    });
}
