'use strict';

const { test, expect } = require('playwright/test');
const fs = require('node:fs');
const path = require('node:path');

for (const lang of ['ko', 'en', 'ja', 'es', 'fr', 'de', 'pt', 'zh']) {
    test(`search metadata survives game initialization and title return: ${lang}`, async ({ page }) => {
        await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/, route => route.abort());
        const relative = lang === 'ko' ? '/' : `/${lang}/`;
        const html = fs.readFileSync(path.join(__dirname, '../..', lang === 'ko' ? 'index.html' : `${lang}/index.html`), 'utf8');
        const title = html.match(/<title>(.*?)<\/title>/s)[1];
        const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
        await page.goto(relative, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.game?.i18n?.loaded?.day5);
        await expect(page).toHaveTitle(title);
        await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://nevergrad.archerlab.dev${relative}`);
        await page.evaluate(() => {
            game._prepareNewRun();
            game.state.startNewRun();
            game._showScreen('game-screen');
            game._showScreen('title-screen');
            game._applyUILocale();
        });
        await expect(page).toHaveTitle(title);
        await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index, follow/);
    });
}
