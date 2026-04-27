/**
 * Nevergrad 런타임 버그 헌터 v2
 * - 페이지 로드 시 콘솔/JS 예외 수집
 * - 새 게임 → 길게 자동 진행 (각 선택지에서 모든 분기 무작위 선택)
 * - 각 일차/엔딩 진입점을 직접 _loadScene 으로 호출해서 즉시 깨지는 씬 색출
 * - 다국어 HTML은 production URL로 fetch만 검증 (로컬 serve는 SPA fallback 한계)
 */
import { chromium } from 'playwright';
import http from 'node:http';
import https from 'node:https';

const BASE = 'http://localhost:3099';
const issues = [];

function record(kind, msg, ctx = {}) {
    issues.push({ kind, msg, ...ctx });
    if (process.env.QUIET !== '1') console.log(`[${kind}] ${msg.slice(0, 200)}`);
}

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function attachListeners(page, label) {
    page.on('console', m => {
        const t = m.type();
        if (t === 'error') record('CONSOLE.ERROR', m.text(), { ctx: label });
        else if (t === 'warning') {
            const txt = m.text();
            // GA 등 외부 스크립트가 헤드리스에서 토하는 경고는 무시
            if (/google|analytics|gtag/i.test(txt)) return;
            record('CONSOLE.WARN', txt, { ctx: label });
        }
    });
    page.on('pageerror', e => record('PAGE_ERROR', e.message, { ctx: label }));
    page.on('requestfailed', req => {
        const url = req.url();
        if (/google|analytics|doubleclick|gtag/i.test(url)) return;  // 광고/분석 요청 무시
        const f = req.failure();
        record('REQ_FAIL', `${req.method()} ${url} — ${f?.errorText || 'unknown'}`, { ctx: label });
    });
    page.on('response', resp => {
        const s = resp.status();
        const url = resp.url();
        if (s >= 400 && !/google|analytics|doubleclick|gtag/i.test(url)) {
            record('HTTP_' + s, `${resp.request().method()} ${url}`, { ctx: label });
        }
    });
}

async function loadKo(browser) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    attachListeners(page, 'ko');
    try {
        await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForFunction(() => typeof window.game !== 'undefined' && !!window.game?._loadScene, { timeout: 15000 });
        await page.click('#btn-new-game');
        await page.waitForSelector('#player-name-input', { state: 'visible', timeout: 5000 });
        await page.fill('#player-name-input', '테스터');
        await page.click('#btn-start');
        await wait(1500);
        return page;
    } catch (e) {
        record('SETUP_ERR', `ko: ${e.message}`, { ctx: 'ko' });
        return page;
    }
}

async function probeScenes(page, sceneIds, label) {
    for (const id of sceneIds) {
        const result = await page.evaluate((sceneId) => {
            try {
                const m = /^day(\d)_/.exec(sceneId);
                const day = m ? Number(m[1]) : 1;
                if (!window.game.state.playerName) window.game.state.playerName = '테스터';
                window.game.state.currentDay = day;
                window.game._loadScene(sceneId);
                return { ok: true, current: window.game.state.currentScene };
            } catch (e) {
                return { ok: false, error: e.message, stack: e.stack };
            }
        }, id);
        await wait(300);
        if (!result.ok) record('SCENE_LOAD_ERR', `${id}: ${result.error}`, { ctx: label });
        else if (result.current !== id) {
            // condition fallback으로 다른 씬으로 갔다 — 정상일 수도
            console.log(`  scene ${id} → ${result.current}`);
        } else {
            console.log(`  scene ${id} ✓`);
        }
    }
}

async function autoPlay(page, maxSteps, label) {
    const visited = new Set();
    let prev = null, stuck = 0;
    for (let i = 0; i < maxSteps; i++) {
        const cur = await page.evaluate(() => window.game?.state?.currentScene);
        if (!cur) break;
        visited.add(cur);
        if (cur === prev) {
            stuck++;
            if (stuck > 30) {
                const dump = await page.evaluate(() => {
                    const p = document.getElementById('choice-panel');
                    return {
                        isTyping: window.game.dialogue?.isTyping,
                        sceneKeys: Object.keys(window.game.currentSceneData || {}),
                        panelHidden: p?.classList?.contains('hidden'),
                        choiceCount: p?.querySelectorAll('button').length,
                        endingReached: window.game._endingReached,
                    };
                });
                record('STUCK', `${cur}: ${JSON.stringify(dump)}`, { ctx: label });
                break;
            }
        } else stuck = 0;
        prev = cur;

        // 선택지가 화면에 보이면(hidden 아님) 클릭, typing 중이면 skip, 아니면 advance
        await page.evaluate(() => {
            const panelEl = document.getElementById('choice-panel');
            const panelVisible = panelEl && !panelEl.classList.contains('hidden');
            if (panelVisible) {
                const btns = panelEl.querySelectorAll('button');
                if (btns.length > 0) {
                    const idx = Math.floor(Math.random() * btns.length);
                    btns[idx].click();
                    return;
                }
            }
            if (window.game.dialogue?.isTyping) {
                window.game.dialogue.skipTyping?.();
                return;
            }
            window.game._advanceScene?.();
        });
        await wait(120);
    }
    return visited;
}

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        lib.get(url, (res) => {
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
        }).on('error', reject);
    });
}

async function checkProductionLangs() {
    console.log('\n========== Production 다국어 페이지 검증 ==========');
    for (const lang of ['en', 'ja', 'es', 'fr', 'de', 'pt-BR']) {
        try {
            const r = await fetchUrl(`https://nevergrad.archerlab.dev/${lang}/`);
            if (r.status !== 200) {
                record('PROD_HTTP', `${lang}: HTTP ${r.status}`, { ctx: 'prod' });
            } else if (!new RegExp(`<html lang="${lang.toLowerCase()}|<html lang="${lang.split('-')[0]}`, 'i').test(r.body)) {
                record('PROD_LANG_MISMATCH', `${lang}: 응답 HTML이 해당 lang 아님`, { ctx: 'prod' });
            } else {
                console.log(`  ${lang}/ ✓ (HTTP ${r.status})`);
            }
        } catch (e) {
            record('PROD_FETCH_ERR', `${lang}: ${e.message}`, { ctx: 'prod' });
        }
    }
}

(async () => {
    const browser = await chromium.launch();

    // 1. ko 페이지 로드 + 새게임
    console.log('========== ko 페이지 로드 + 새 게임 ==========');
    const page = await loadKo(browser);

    // 2. 자동 진행 1800 스텝 (day1~5 도달 시도)
    console.log('\n========== 자동 진행 1800 스텝 ==========');
    const visited = await autoPlay(page, 1800, 'ko-autoplay');
    console.log(`  방문 씬 수: ${visited.size}`);
    const days = new Set();
    for (const s of visited) {
        const m = /^day(\d)_/.exec(s);
        if (m) days.add(m[1]);
    }
    console.log(`  도달 일차: ${[...days].sort().join(', ')}`);

    // 3. 각 일차/엔딩 진입점 직접 호출 (실제 ID 사용)
    console.log('\n========== 진입점 직접 호출 ==========');
    await probeScenes(page, [
        'day1_opening_1',
        'day2_morning_start',
        'day3_morning_start',
        'day4_morning_start',
        'day5_morning_start',
        'day5_ending_true_1',
        'day5_ending_escape_1',
        'day5_ending_complicit_1',
        'day5_ending_forget_1',
        'day5_ending_ghost_1',
        'day5_ending_resist_1',
    ], 'entrypoints');

    await page.close();

    // 4. 모바일 뷰포트에서 한 번 더 — 반응형 깨짐/이벤트 차이 점검
    console.log('\n========== 모바일 뷰포트 (375x667) 새 게임 + 600 스텝 ==========');
    const mPage = await browser.newPage({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });
    attachListeners(mPage, 'mobile');
    try {
        await mPage.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 20000 });
        await mPage.waitForFunction(() => typeof window.game !== 'undefined' && !!window.game?._loadScene, { timeout: 15000 });
        await mPage.click('#btn-new-game');
        await mPage.waitForSelector('#player-name-input', { state: 'visible', timeout: 5000 });
        await mPage.fill('#player-name-input', '테스터');
        await mPage.click('#btn-start');
        await wait(1500);
        const mVisited = await autoPlay(mPage, 600, 'mobile-autoplay');
        console.log(`  모바일 방문 씬: ${mVisited.size}`);
    } catch (e) {
        record('MOBILE_SETUP_ERR', e.message, { ctx: 'mobile' });
    }
    await mPage.close();

    await browser.close();

    // 4. 프로덕션 다국어 검증
    await checkProductionLangs();

    // 결과 출력
    console.log('\n========== SUMMARY ==========');
    const byKind = {};
    for (const i of issues) byKind[i.kind] = (byKind[i.kind] || 0) + 1;
    for (const [k, v] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${k}: ${v}`);
    }
    console.log(`\nTotal issues: ${issues.length}`);
    process.exit(issues.length > 0 ? 1 : 0);
})();
