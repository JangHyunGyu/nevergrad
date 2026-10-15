const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

(async () => {
    const phase = process.argv[2] || 'before';
    const out = process.argv[3] || path.join('_workspace', 'sgrade-20261015');
    const reference = process.argv[4] || 'f4d64ec';
    fs.mkdirSync(out, { recursive: true });
    const browser = await chromium.launch({ headless: true });
    const results = [];
    for (const [width, height] of [[1280, 800], [1024, 768], [768, 1024], [375, 812], [667, 375]]) {
        const page = await browser.newPage({ viewport: { width, height } });
        await page.route('**/*', route => {
            const url = new URL(route.request().url());
            if (url.hostname !== '127.0.0.1') return route.abort();
            if (phase === 'reference' && url.pathname.startsWith('/assets/') && /\.(js|css)$/.test(url.pathname)) {
                const file = url.pathname.slice(1);
                try {
                    const body = execFileSync('git', ['show', `${reference}:${file}`], { maxBuffer: 10 * 1024 * 1024 });
                    return route.fulfill({ status: 200, contentType: file.endsWith('.js') ? 'text/javascript' : 'text/css', body });
                } catch (_) {}
            }
            return route.continue();
        });
        await page.goto('http://127.0.0.1:4178/');
        await page.waitForFunction(() => window.game?.i18n?.loaded?.day1);
        await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; }' });
        await page.evaluate(() => {
            document.querySelectorAll('.save-toast').forEach(el => el.remove());
            document.getElementById('title-screen').classList.add('title-intro-complete');
            document.querySelectorAll('.title-menu .menu-btn').forEach(el => { el.style.opacity = '1'; el.style.visibility = 'visible'; el.style.transform = 'none'; });
        });
        await page.screenshot({ path: path.join(out, `${phase}-title-${width}.png`), animations: 'disabled' });
        await page.evaluate(() => {
            game._showScreen('game-screen');
            game.state.currentDay = 1;
            game.state.playerName = 'QA';
            game._loadScene('day1_lunch_sea_4');
            game.dialogue.skipTyping();
        });
        await page.waitForTimeout(800);
        await page.screenshot({ path: path.join(out, `${phase}-dialogue-${width}.png`), animations: 'disabled' });
        results.push({ width, height, boxes: await page.evaluate(() => ['dialogue-box', 'quick-menu', 'speaker-name'].map(id => { const el = document.getElementById(id), r = el.getBoundingClientRect(), s = getComputedStyle(el); return { id, x:r.x,y:r.y,width:r.width,height:r.height,font:s.font,color:s.color,background:s.backgroundColor }; })) });
        await page.close();
    }
    fs.writeFileSync(path.join(out, `${phase}-geometry.json`), JSON.stringify(results, null, 2));
    await browser.close();
    console.log(`Captured ${phase} at five viewports`);
})().catch(error => { console.error(error); process.exitCode = 1; });
