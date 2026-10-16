const { test, expect } = require('playwright/test');

const scenes = [
    ['day1_after_yuna_back_12', 'yuna', 1086, 1448, 'day1_after_yuna_1'],
    ['day2_lunch_yuna_map_11', 'yuna', 1086, 1448, 'day2_lunch_yuna_1'],
    ['day2_after_detour_lib_12', 'yuna', 1086, 1448, 'day2_after_detour_lib_1'],
    ['day2_after_detour_lib_13', 'yuna', 1086, 1448, 'day2_after_detour_lib_1'],
    ['day2_lunch_riin_pls_9', 'riin', 1024, 1536, 'day2_lunch_riin_1'],
    ['day2_lunch_riin_pls_10', 'riin', 1024, 1536, 'day2_lunch_riin_1']
];

for (const lang of ['ko','en','ja','es','fr','de','pt','zh']) {
    for (const [width, height] of [[1280,800],[375,812]]) {
        test(`dedicated serious expressions render and unlock in ${lang} at ${width}px`, async ({ page }, info) => {
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.setViewportSize({ width, height });
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/, route => route.abort());
            await page.goto(lang === 'ko' ? '/' : `/${lang}/`);
            await page.waitForFunction(() => window.game?.i18n?.loaded?.day5);
            const initial = await page.evaluate(() => {
                game.settings.set('textSpeed', 0);
                game.state.playerName = 'QA';
                game.state.setFlag('headphone_hint_shown');
                game.gallery.unlockCharacterExpression('yuna_determined');
                game.gallery.unlockCharacterExpression('riin_neutral');
                game._showScreen('game-screen');
                return ['yuna','riin'].map(id => game.gallery.isExpressionUnlocked(id,'serious'));
            });
            expect(initial).toEqual([false,false]);
            for (const [scene, character, nativeWidth, nativeHeight, context] of scenes) {
                await page.evaluate(context => {
                    game.state.currentDay = Number(context[3]);
                    game._loadScene(context);
                    game.dialogue.skipTyping();
                }, context);
                await page.waitForFunction(() => {
                    const image=document.getElementById('char-center');
                    if(game.currentSceneData.character===null)return !image.getAttribute('src');
                    return image.complete && getComputedStyle(image).opacity==='1'
                        && !image.classList.contains('char-fade-in') && !image.classList.contains('char-fade-out');
                });
                await page.evaluate(scene => {
                    game._loadScene(scene);
                    game.dialogue.skipTyping();
                }, scene);
                const sprite = page.locator('#char-center');
                await expect(sprite).toHaveAttribute('src', new RegExp(`${character}_serious\\.webp`));
                await expect.poll(() => sprite.evaluate(image => [image.complete,image.naturalWidth,image.naturalHeight]))
                    .toEqual([true,nativeWidth,nativeHeight]);
                await expect(sprite).toHaveCSS('opacity','1');
                await expect(sprite).toBeVisible();
                expect(await page.evaluate(id => game.gallery.isExpressionUnlocked(id,'serious'), character)).toBe(true);
                const text = await page.locator('#dialogue-text').innerText();
                expect(text.trim().length).toBeGreaterThan(0);
                if (lang !== 'ko') expect(text).not.toMatch(/[가-힣]/);
            }
            await page.screenshot({ path: info.outputPath('riin-story.png'), animations: 'disabled' });
            await page.evaluate(() => { game.state.currentDay=1;game._loadScene('day1_after_yuna_1');game.dialogue.skipTyping(); });
            await page.waitForFunction(() => {
                const image=document.getElementById('char-center');
                return getComputedStyle(image).opacity==='1' && !image.classList.contains('char-fade-in') && !image.classList.contains('char-fade-out');
            });
            await page.evaluate(() => { game._loadScene('day1_after_yuna_back_12');game.dialogue.skipTyping(); });
            await expect(page.locator('#char-center')).toHaveAttribute('src', /yuna_serious\.webp/);
            await expect(page.locator('#char-center')).toHaveCSS('opacity','1');
            await page.screenshot({ path: info.outputPath('yuna-story.png'), animations: 'disabled' });
            for (const character of ['yuna','riin']) {
                const expected = await page.evaluate(character => {
                    game.gallery.activeTab='characters';
                    game.gallery.open();
                    const item=game.gallery._getCharacterItems().find(item=>item.id===character);
                    const serious=item.expressions.filter(expression=>expression.id==='serious');
                    if(serious.length!==1)throw Error('Serious expression missing or duplicated');
                    game.gallery._showCharacterModal(item);
                    return serious[0].name;
                }, character);
                const card = page.locator('.gallery-expression-card').filter({ has: page.locator(`img[src*="${character}_serious.webp"]`) });
                await expect(card).toHaveClass(/gallery-unlocked/);
                await expect(card.locator('.gallery-expression-name')).toHaveText(expected);
                await expect.poll(() => card.locator('img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
                await card.scrollIntoViewIfNeeded();
                await page.screenshot({ path: info.outputPath(`${character}-gallery.png`), animations: 'disabled' });
                await page.locator('.gallery-modal-close').click();
            }
            expect(errors).toEqual([]);
        });
    }
}
