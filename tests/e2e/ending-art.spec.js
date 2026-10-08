const { test, expect } = require('playwright/test');

const scenes = [
    ['day5_ending_true_28', 'ending_true', 'ending_true_new_classroom.webp'],
    ['day5_ending_resist_22', 'ending_resist', 'ending_resist_records.webp'],
    ['day5_ending_complicit_9', 'ending_complicit', 'ending_complicit_signature.webp'],
    ['day5_ending_cage_sea_6', 'ending_cage_sea', 'ending_cage_sea_lunch.webp']
];

for (const viewport of [{ width:1280,height:800 },{ width:844,height:390 }]) {
    test(`ending art loads in story and gallery at ${viewport.width}x${viewport.height}`, async ({ page }, info) => {
        await page.setViewportSize(viewport);
        await page.emulateMedia({ reducedMotion:'reduce' });
        await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/, route => route.abort());
        await page.goto('/', { waitUntil:'domcontentloaded' });
        await page.waitForFunction(() => window.game?._preloadImages && game.i18n.loaded.day5);
        await page.evaluate(() => {
            game.settings.set('textSpeed', 0);
            game.state.playerName = 'Tester';
            game.state.currentDay = 5;
            game.state.currentSlot = 'night';
            game._showScreen('game-screen');
        });
        for (const [sceneId, galleryId, file] of scenes) {
            await page.evaluate(id => game._loadScene(id), sceneId);
            await page.waitForFunction(() => !game.dialogue.isTyping && !game._clickLocked);
            await expect(page.locator('#bg-layer')).toHaveCSS('background-image', new RegExp(file.replace('.', '\\.')));
            expect(await page.evaluate(id => game.gallery.isUnlocked('cg', id), galleryId)).toBe(true);
            expect(await page.evaluate(() => game.currentSceneData.character)).toBe(null);
            const visibleCharacters = await page.locator('#char-layer img').evaluateAll(images => images.filter(image => {
                const style = getComputedStyle(image);
                return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && image.getBoundingClientRect().width > 0;
            }).length);
            expect(visibleCharacters).toBe(0);
            await page.screenshot({path:info.outputPath(`${galleryId}-story.png`),animations:'disabled'});
        }
        await page.evaluate(() => { game.gallery.activeTab = 'cg'; game.gallery.open(); });
        await expect(page.locator('.gallery-card[data-kind="cg"]')).toHaveCount(8);
        for (const [,galleryId] of scenes) {
            await page.locator(`.gallery-card[data-id="${galleryId}"]`).click();
            await expect(page.locator('.gallery-image-modal img')).toBeVisible();
            expect(await page.locator('.gallery-image-modal img').evaluate(image => image.complete && image.naturalWidth === 1672 && image.naturalHeight === 941)).toBe(true);
            await page.screenshot({path:info.outputPath(`${galleryId}-gallery.png`),animations:'disabled'});
            await page.locator('.gallery-modal-close').click();
        }
    });
}

test('refreshed expressions preserve unlock ids, transparency and delivery dimensions', async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion:'reduce' });
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/, route => route.abort());
    await page.goto('/', { waitUntil:'domcontentloaded' });
    await page.waitForFunction(() => window.game?._preloadImages && game.i18n.loaded.day5);
    await page.evaluate(() => { game.settings.set('textSpeed', 0); game._showScreen('game-screen'); game.state.currentDay = 5; });
    for (const key of ['eunsu_shaking','eunsu_crying','riin_pain','riin_relief']) {
        await page.evaluate(key => {
            game._loadScene('day5_ending_true_1');
            game.renderer.setCharacter('center', game._resolveCharImage(key));
            game.gallery.unlockCharacterExpression(key);
        }, key);
        await expect(page.locator('#char-center')).toHaveAttribute('src', new RegExp(`${key}_v2\\.webp`));
        await page.waitForFunction(() => document.querySelector('#char-center').complete && document.querySelector('#char-center').naturalWidth > 0);
        expect(await page.locator('#char-center').evaluate(image => [image.naturalWidth,image.naturalHeight])).toEqual([1086,1448]);
        expect(await page.evaluate(key => {
            const index = key.indexOf('_');
            return game.gallery.isExpressionUnlocked(key.slice(0,index),key.slice(index+1));
        },key)).toBe(true);
        await page.waitForTimeout(350);
        await page.screenshot({path:info.outputPath(`${key}.png`),animations:'disabled'});
    }
});
