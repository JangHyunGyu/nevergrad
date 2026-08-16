const { test, expect } = require('playwright/test');

const localOrigin = 'http://127.0.0.1:4178';
const localRequest = /^http:\/\/127\.0\.0\.1:4178\//;

async function loadGameShell(page, path = '/') {
    await page.route(/^https?:\/\//, route => {
        if (localRequest.test(route.request().url())) return route.continue();
        return route.abort();
    });
    await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => window.game?.i18n?.currentLang, null, { timeout: 30000 });
}

async function expectNoDocumentOverflow(page) {
    const metrics = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        html: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    expect(metrics.html).toBeLessThanOrEqual(metrics.viewport);
    expect(metrics.body).toBeLessThanOrEqual(metrics.viewport);
}

async function expectInsideViewport(locator, page) {
    const box = await locator.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(-1);
    expect(box.y).toBeGreaterThanOrEqual(-1);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
}

async function expectInsideViewportWidth(locator, page) {
    const box = await locator.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(box.x).toBeGreaterThanOrEqual(-1);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
}

const localizedShells = [
    { path: '/', galleryTitle: '갤러리', endingTab: '엔딩' },
    { path: '/en/', galleryTitle: 'Gallery', endingTab: 'Endings' },
    { path: '/ja/', galleryTitle: 'ギャラリー', endingTab: 'エンディング' },
    { path: '/es/', galleryTitle: 'Galería', endingTab: 'Finales' },
    { path: '/fr/', galleryTitle: 'Galerie', endingTab: 'Fins' },
    { path: '/de/', galleryTitle: 'Galerie', endingTab: 'Enden' },
    { path: '/pt/', galleryTitle: 'Galeria', endingTab: 'Finais' }
];

for (const { path, galleryTitle, endingTab } of localizedShells) {
    test(`${path} localized shell boots without overflow`, async ({ page }) => {
        await loadGameShell(page, path);
        await expect(page.locator('#btn-new-game')).toBeVisible();
        await expect(page.locator('#btn-gallery')).toBeVisible();
        await expectNoDocumentOverflow(page);

        await page.locator('#btn-gallery').click();
        await expect(page.locator('.gallery-title')).toHaveText(galleryTitle);
        await expect(page.locator('.gallery-tab').first()).toHaveText(endingTab);
    });
}

test('runtime backgrounds prefer compressed WebP assets', async ({ page }) => {
    await loadGameShell(page);
    const uncompressedBackgrounds = await page.evaluate(() => (
        Object.entries(CONFIG.BACKGROUNDS)
            .filter(([, src]) => src.includes('/background/') && !src.endsWith('.webp'))
    ));
    expect(uncompressedBackgrounds).toEqual([]);
    await expect(page.locator('.title-bg-layer')).toHaveCSS('background-image', /title_bg\.webp/);

    await page.locator('#btn-new-game').click();
    await page.locator('#player-name-input').fill('Asset Audit');
    await page.locator('#btn-start').click();
    await expect(page.locator('#game-screen')).toHaveClass(/active/, { timeout: 30000 });
    await expect(page.locator('#bg-layer')).toHaveCSS('background-image', /\.webp/);
});

test('title navigation survives an interrupted motion sequence', async ({ page }) => {
    await loadGameShell(page);
    await page.evaluate(() => {
        const title = document.getElementById('title-screen');
        title.classList.add('title-intro-complete');
        title.querySelectorAll('.title-menu .menu-btn').forEach(button => {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
            button.style.transform = 'translateY(12px)';
        });
    });
    await expect(page.locator('#btn-new-game')).toBeVisible();
    await expect(page.locator('#btn-gallery')).toBeVisible();
});

test('dialogue history and keyboard controls remain reachable', async ({ page }) => {
    await loadGameShell(page);
    await page.locator('#btn-new-game').click();
    await page.locator('#player-name-input').fill('Keyboard');
    await page.locator('#btn-start').click();
    await expect(page.locator('#game-screen')).toHaveClass(/active/, { timeout: 30000 });

    const dialogueBox = page.locator('#dialogue-box');
    await expect(dialogueBox).toHaveAttribute('role', 'button');
    await expect(dialogueBox).toHaveAttribute('tabindex', '0');
    await dialogueBox.focus();
    await dialogueBox.press('Enter');
    await expect.poll(() => page.evaluate(() => game.dialogue.isTyping)).toBe(false);

    await page.locator('#qm-menu').click();
    await expect(page.locator('#pause-menu')).toHaveAttribute('role', 'dialog');
    await expect(page.locator('#btn-backlog')).toBeVisible();
    await page.locator('#btn-backlog').click();
    await expect(page.locator('#backlog-panel')).toHaveClass(/active/);
    await expect(page.locator('#backlog-content .backlog-entry')).not.toHaveCount(0);
    await expect(page.locator('#backlog-close')).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(page.locator('#backlog-panel')).toHaveClass(/hidden/);
    await expect(page.locator('#qm-menu')).toBeFocused();
});

const touchDevices = [
    { name: 'phone landscape', viewport: { width: 667, height: 375 } },
    { name: 'tablet landscape', viewport: { width: 1024, height: 768 } }
];

for (const device of touchDevices) {
    test(`${device.name} keeps the playable UI reachable`, async ({ browser }) => {
        const context = await browser.newContext({
            viewport: device.viewport,
            isMobile: true,
            hasTouch: true,
            userAgent: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36'
        });
        const page = await context.newPage();
        await loadGameShell(page);

        await expectNoDocumentOverflow(page);
        await expect(page.locator('#btn-new-game')).toBeVisible();
        await expectInsideViewport(page.locator('.title-menu'), page);
        const titleButtonBox = await page.locator('#btn-new-game').boundingBox();
        expect(titleButtonBox.height).toBeGreaterThanOrEqual(44);

        await page.locator('#btn-gallery').click();
        await expect(page.locator('#gallery-screen')).toHaveClass(/active/);
        await expectInsideViewportWidth(page.locator('.gallery-container'), page);
        await expect(page.locator('#gallery-grid .gallery-card')).toHaveCount(7);
        await page.locator('#gallery-back').click();
        await expect(page.locator('#title-screen')).toHaveClass(/active/);

        await page.locator('#btn-new-game').click();
        await expect(page.locator('#name-screen')).toHaveClass(/active/);
        await expectInsideViewport(page.locator('.name-input-container'), page);
        await page.locator('#player-name-input').fill('Responsive');
        await page.locator('#btn-start').click();
        await expect(page.locator('#game-screen')).toHaveClass(/active/, { timeout: 30000 });

        await expectInsideViewport(page.locator('#dialogue-box'), page);
        await expectInsideViewport(page.locator('#quick-menu'), page);
        const quickMenuBox = await page.locator('#qm-menu').boundingBox();
        expect(quickMenuBox.width).toBeGreaterThanOrEqual(44);
        expect(quickMenuBox.height).toBeGreaterThanOrEqual(44);

        await page.locator('#qm-menu').click();
        await expect(page.locator('#pause-menu')).toHaveClass(/active/);
        await expectInsideViewport(page.locator('.pause-container'), page);

        await page.locator('#btn-settings').click();
        await expect(page.locator('#settings-overlay')).toHaveClass(/active/);
        await expectInsideViewport(page.locator('.settings-container'), page);
        await page.locator('#settings-close').click();
        await expect(page.locator('#settings-overlay')).toHaveClass(/hidden/);

        await page.locator('#qm-menu').click();
        await page.locator('#btn-save').click();
        await expect(page.locator('#sl-overlay')).toHaveClass(/active/);
        await expectInsideViewport(page.locator('.sl-container'), page);
        await expect(page.locator('.sl-slot').first()).toHaveAttribute('role', 'button');
        await expect(page.locator('.sl-slot').first()).toHaveAttribute('tabindex', '0');
        await page.locator('#sl-close').click();
        await expect(page.locator('#sl-overlay')).toHaveClass(/hidden/);

        await page.locator('#qm-menu').click();
        await page.locator('#btn-resume').click();
        await expect(page.locator('#pause-menu')).toHaveClass(/hidden/);

        await page.evaluate(() => {
            game._showChoices(
                [{ next: 'day1_opening_1' }, { next: 'day1_opening_1' }],
                ['복도부터 살펴본다', '교실로 바로 들어간다']
            );
        });
        await expect(page.locator('#choice-panel')).toBeVisible();
        await expectInsideViewport(page.locator('#choice-panel'), page);
        for (const button of await page.locator('#choice-panel .choice-btn').all()) {
            await expectInsideViewport(button, page);
            const choiceBox = await button.boundingBox();
            expect(choiceBox.height).toBeGreaterThanOrEqual(44);
        }

        await page.evaluate(() => {
            game._prepareNewRun();
            game.state.startNewRun();
            game.state.playerName = 'Responsive';
            game.state.currentDay = 5;
            game.state.currentSlot = 'night';
            game.state.currentScene = 'day5_ending_true_title';
            game._showScreen('game-screen');
            game._loadScene('day5_ending_true_title');
        });
        await expect(page.locator('.ending-title-overlay')).toBeVisible();
        await expectInsideViewport(page.locator('.ending-title-overlay'), page);
        const endingButtonBox = await page.locator('.ending-return-btn').boundingBox();
        expect(endingButtonBox.height).toBeGreaterThanOrEqual(44);

        await context.close();
    });
}

test('phone portrait shows a bounded rotate prompt without horizontal scroll', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36'
    });
    const page = await context.newPage();
    await loadGameShell(page);
    await expect(page.locator('#rotate-prompt')).toBeVisible();
    await expectInsideViewport(page.locator('#rotate-prompt'), page);
    await expectNoDocumentOverflow(page);
    await context.close();
});
