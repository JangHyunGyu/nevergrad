const { test, expect } = require('playwright/test');

// 새 게임 → 이름 입력 → 1일차 아침 첫 줄('4월.')까지 실제 UI 경로로 진행한다.
async function startNewGame(page) {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4178)/, route => route.abort());
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.game?._preloadImages && game.i18n.loaded.day1);
    await page.locator('#btn-new-game').click();
    await page.locator('#player-name-input').fill('테스트');
    await page.locator('#btn-start').click();
    await page.waitForFunction(() => game.state.currentScene === 'day1_opening_1'
        && document.querySelector('#dialogue-box .dialogue-text')?.textContent.trim() === '4월.');
}

function alphaStops(backgroundImage) {
    return [...backgroundImage.matchAll(/rgba\([^)]*,\s*([\d.]+)\)/g)].map(m => Number(m[1]));
}

test('first line sits on an opaque dialogue panel', async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 512 });
    await startNewGame(page);
    const box = await page.evaluate(() => {
        const el = document.getElementById('dialogue-box');
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundImage, height: el.getBoundingClientRect().height, display: cs.display, opacity: cs.opacity };
    });
    expect(box.display).not.toBe('none');
    expect(Number(box.opacity)).toBeGreaterThan(0.9);
    expect(box.height).toBeGreaterThan(80);
    const alphas = alphaStops(box.bg);
    expect(alphas.length).toBeGreaterThan(0);
    expect(Math.min(...alphas)).toBeGreaterThanOrEqual(0.7);
});

test('tapping the middle of the scene advances the first line', async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 512 });
    await startNewGame(page);
    await page.waitForFunction(() => !game.dialogue.isTyping && !game._clickLocked);
    const hit = await page.evaluate(() => document.elementFromPoint(410, 200)?.closest('#dialogue-box'));
    expect(hit).toBeNull(); // 대사창이 아닌 화면 중앙을 누른다
    await page.mouse.click(410, 200);
    await page.waitForFunction(() => game.state.currentScene !== 'day1_opening_1');
    expect(await page.evaluate(() => game.state.currentScene)).not.toBe('day1_opening_1');
});

test('tapping the quick menu does not advance dialogue', async ({ page }) => {
    await startNewGame(page);
    await page.waitForFunction(() => !game.dialogue.isTyping);
    const menu = page.locator('#qm-menu');
    if (await menu.isVisible()) {
        await menu.click();
        expect(await page.evaluate(() => game.state.currentScene)).toBe('day1_opening_1');
    }
});
