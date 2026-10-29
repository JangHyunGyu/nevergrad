const { test, expect } = require('playwright/test');
const review = require('../../docs/qa/expression-matching-20261029.json');

for (const lang of ['ko', 'en', 'ja', 'es', 'fr', 'de', 'pt', 'zh']) {
    for (const width of [1280, 375]) {
        test(`scene expression matching in ${lang} at ${width}px`, async ({ page }, info) => {
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.setViewportSize({ width, height: width === 1280 ? 800 : 812 });
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/, route => route.abort());
            await page.goto(lang === 'ko' ? '/' : `/${lang}/`);
            await page.waitForFunction(() => window.game?.i18n?.loaded?.day5);

            const contracts = await page.evaluate(changes => changes.map(({ id, after }) => {
                const scene = SCENARIO[Number(id[3])][id];
                return { id, fields: Object.fromEntries(Object.keys(after).map(key => [key, scene[key]])) };
            }), review.groups.flatMap(group => group.changes));
            expect(contracts).toEqual(review.groups.flatMap(group => group.changes.map(change => ({ id: change.id, fields: change.after }))));

            await page.evaluate(() => {
                game.settings.set('textSpeed', 0);
                game.state.playerName = 'QA';
                game.state.setFlag('headphone_hint_shown');
                game._showScreen('game-screen');
                game.isGalleryReplay = true;
            });

            for (const group of review.groups) {
                const change = group.changes.at(-1);
                const expected = await page.evaluate(id => {
                    game.state.currentDay = Number(id[3]);
                    game._loadScene(id);
                    game.dialogue.skipTyping();
                    const scene = game.currentSceneData;
                    const cast = { ...(scene.character ? { center: scene.character } : {}), ...scene.characters };
                    return Object.entries(cast).filter(([, key]) => key).map(([position, key]) => ({
                        position, key, src: game.renderer._withAssetVersion(game._resolveCharImage(key)),
                        opacity: String(scene.charOpacities?.[position] ?? scene.charOpacity ?? 1)
                    }));
                }, change.id);
                expect(await page.evaluate(() => game.state.currentScene)).toBe(change.id);
                for (const { position, key, src, opacity } of expected) {
                    const sprite = page.locator(`#char-${position}`);
                    await expect(sprite).toHaveAttribute('src', src);
                    await expect.poll(() => sprite.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
                    await expect(sprite).toHaveCSS('opacity', opacity);
                    await expect(sprite).toBeVisible();
                    await expect(sprite).not.toHaveClass(/char-fade-in|char-fade-out/);
                    expect(await page.evaluate(key => {
                        const index = key.indexOf('_');
                        const id = key.slice(0, index);
                        const item = game.gallery._getCharacterItems().find(item => item.id === id);
                        const expression = item.expressions.find(expression => expression.file === game._resolveCharImage(key));
                        return expression && game.gallery.isExpressionUnlocked(id, expression.id);
                    }, key)).toBe(true);
                }
                const text = await page.locator('#dialogue-text').innerText();
                expect(text.trim().length).toBeGreaterThan(0);
                if (lang !== 'ko') expect(text).not.toMatch(/[가-힣]/);
            }
            await page.screenshot({ path: info.outputPath('seolhwa-regret.png'), animations: 'disabled' });
            expect(errors).toEqual([]);
        });
    }
}
