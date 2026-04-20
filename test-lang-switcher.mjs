import { chromium, devices } from 'playwright';

const BASE = 'http://localhost:3099';
const VIEWPORTS = [
    { name: 'PC 1280',        viewport: { width: 1280, height: 800 } },
    { name: 'Tablet Land 1024', viewport: { width: 1024, height: 768 } },
    { name: 'Tablet Port 768',  viewport: { width: 768,  height: 1024 } },
    { name: 'Mobile Port 375',  viewport: { width: 375,  height: 667 } },
    { name: 'Mobile Land 667',  viewport: { width: 667,  height: 375 } },
];

const LANG_PATHS = ['/', '/en/', '/ja/', '/es/', '/fr/', '/de/'];

let pass = 0, fail = 0;
function ok(name, cond, detail = '') {
    console.log(`${cond ? '[PASS]' : '[FAIL]'} ${name}${detail ? ' - ' + detail : ''}`);
    if (cond) pass++; else fail++;
}

function rectsOverlap(a, b) {
    return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
}

async function main() {
    const browser = await chromium.launch();

    for (const vp of VIEWPORTS) {
        const ctx = await browser.newContext({ viewport: vp.viewport });
        const page = await ctx.newPage();

        for (const path of LANG_PATHS) {
            const url = BASE + path;
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(300);

            const info = await page.evaluate(() => {
                const s = document.querySelector('.lang-switcher');
                if (!s) return { present: false };
                const r = s.getBoundingClientRect();
                const al = document.querySelector('.archerlab-link');
                const alr = al ? al.getBoundingClientRect() : null;
                const menu = document.querySelector('.title-menu');
                const menuR = menu ? menu.getBoundingClientRect() : null;
                const opts = Array.from(s.options).map(o => ({ value: o.value, selected: o.selected }));
                const vis = getComputedStyle(s);
                return {
                    present: true,
                    rect: { x: r.x, y: r.y, width: r.width, height: r.height },
                    alRect: alr && { x: alr.x, y: alr.y, width: alr.width, height: alr.height },
                    menuRect: menuR && { x: menuR.x, y: menuR.y, width: menuR.width, height: menuR.height },
                    opts,
                    display: vis.display,
                    vw: window.innerWidth,
                    vh: window.innerHeight,
                };
            });

            const tag = `[${vp.name}] ${path}`;
            ok(`${tag} switcher present`, info.present);
            if (!info.present) continue;

            ok(`${tag} visible (display!=none)`, info.display !== 'none');
            ok(`${tag} within viewport`,
                info.rect.x >= 0 && info.rect.y >= 0 &&
                info.rect.x + info.rect.width <= info.vw + 1 &&
                info.rect.y + info.rect.height <= info.vh + 1,
                `rect=${JSON.stringify(info.rect)} vw=${info.vw} vh=${info.vh}`);

            if (info.alRect) {
                ok(`${tag} no overlap with archerlab-link`, !rectsOverlap(info.rect, info.alRect),
                    `switcher=${JSON.stringify(info.rect)} al=${JSON.stringify(info.alRect)}`);
            }
            if (info.menuRect) {
                ok(`${tag} no overlap with title-menu`, !rectsOverlap(info.rect, info.menuRect));
            }

            const expected = path;
            const selectedOpt = info.opts.find(o => o.selected);
            ok(`${tag} selected=${expected}`,
                selectedOpt && selectedOpt.value === expected,
                `got=${selectedOpt && selectedOpt.value}`);
        }

        await ctx.close();
    }

    await browser.close();
    console.log(`\nPASS ${pass} / FAIL ${fail}`);
    process.exit(fail === 0 ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(2); });
