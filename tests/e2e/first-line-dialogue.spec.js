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
    expect(Math.min(...alphas)).toBeGreaterThanOrEqual(0.85);
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

// 데스크톱과 가로 모바일에서 첫 줄 글씨 크기·기울임·대비를 실제 화면 값으로 확인한다.
function parseRgba(value) {
    const m = /rgba?\(([^)]+)\)/.exec(value); if (!m) return null;
    const [r, g, b, a = 1] = m[1].split(',').map(Number); return { r, g, b, a };
}
function luminance({ r, g, b }) {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
for (const viewport of [
    { name: 'desktop 1280x800', width: 1280, height: 800, minFont: 18, mobile: false },
    { name: 'mobile 844x390', width: 844, height: 390, minFont: 16, mobile: true },
]) {
    test(`first line is large, upright and high-contrast on ${viewport.name}`, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.mobile, hasTouch: viewport.mobile });
        const page = await context.newPage();
        await startNewGame(page);
        const m = await page.evaluate(() => {
            const text = document.querySelector('#dialogue-box .dialogue-text');
            const cs = getComputedStyle(text);
            return { fontSize: parseFloat(cs.fontSize), fontStyle: cs.fontStyle, color: cs.color, bg: getComputedStyle(document.getElementById('dialogue-box')).backgroundImage };
        });
        expect(m.fontSize).toBeGreaterThanOrEqual(viewport.minFont);
        expect(m.fontStyle).toBe('normal');
        const stops = [...m.bg.matchAll(/rgba?\([^)]*\)/g)].map(x => parseRgba(x[0]));
        expect(stops.length).toBeGreaterThan(0);
        // 가장 밝은 배경(흰색) 위에 패널이 깔렸을 때도 글자 대비가 4.5:1 이상이어야 한다.
        const fg = luminance(parseRgba(m.color));
        for (const stop of stops) {
            expect(stop.a).toBeGreaterThanOrEqual(0.85);
            const mixed = { r: stop.r * stop.a + 255 * (1 - stop.a), g: stop.g * stop.a + 255 * (1 - stop.a), b: stop.b * stop.a + 255 * (1 - stop.a) };
            const bgL = luminance(mixed);
            expect((Math.max(fg, bgL) + 0.05) / (Math.min(fg, bgL) + 0.05)).toBeGreaterThanOrEqual(4.5);
        }
        await context.close();
    });
}
