/**
 * Nevergrad 깊은 런타임 헌터
 * - N회 다중 자동 플레이 (다른 시드, day1→엔딩까지) → 도달 일차/엔딩 집계
 * - 6개 엔딩 진입점에서 직접 시작 → 엔딩 후속 씬 자동 진행 → 후반부 버그 추출
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3099';
const PLAYS = parseInt(process.env.PLAYS || '20', 10);
const MAX_STEPS = parseInt(process.env.STEPS || '1500', 10);

const issues = [];
const errorBuckets = new Map();  // 같은 에러 메시지는 한 번만 카운트해서 시끄러움 줄임

function record(kind, msg, ctx = {}) {
    const key = `${kind}::${msg.slice(0, 120)}`;
    const seen = errorBuckets.get(key) || 0;
    errorBuckets.set(key, seen + 1);
    if (seen === 0) {
        issues.push({ kind, msg, ...ctx });
        console.log(`[${kind}] ${msg.slice(0, 200)}${ctx.where ? ' @ ' + ctx.where : ''}`);
    }
}

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function attachListeners(page, label) {
    page.on('console', m => {
        const t = m.type();
        if (t === 'error') record('CONSOLE.ERROR', m.text(), { where: label });
    });
    page.on('pageerror', e => record('PAGE_ERROR', e.message, { where: label }));
    page.on('response', resp => {
        const s = resp.status();
        const url = resp.url();
        if (s >= 400 && !/google|analytics|doubleclick|gtag/i.test(url)) {
            record('HTTP_' + s, `${resp.request().method()} ${url}`, { where: label });
        }
    });
}

async function startNewGame(page) {
    // localStorage 클리어 → 매번 깨끗한 상태에서 새 게임
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => typeof window.game !== 'undefined' && !!window.game?._loadScene, { timeout: 15000 });
    await page.click('#btn-new-game');
    await page.waitForSelector('#player-name-input', { state: 'visible', timeout: 5000 });
    await page.fill('#player-name-input', '테스터');
    await page.click('#btn-start');
    await wait(1200);
}

async function autoPlay(page, maxSteps, label) {
    const visited = new Set();
    let prev = null, stuck = 0;
    let endingScene = null;
    const stuckSet = new Set();
    for (let i = 0; i < maxSteps; i++) {
        const cur = await page.evaluate(() => window.game?.state?.currentScene);
        if (!cur) break;
        visited.add(cur);
        // 엔딩 도달 감지
        if (/^day5_ending_/.test(cur) || (await page.evaluate(() => window.game?._endingReached))) {
            endingScene = cur;
            // 엔딩 후속 씬도 몇 번 더 진행해서 버그 노출
            for (let j = 0; j < 8; j++) {
                await page.evaluate(() => {
                    if (window.game.dialogue?._unskippable) return;
                    if (window.game.dialogue?.isTyping) { window.game.dialogue.skipTyping?.(); return; }
                    window.game._advanceScene?.();
                });
                await wait(150);
            }
            break;
        }
        if (cur === prev) {
            stuck++;
            if (stuck > 80) {
                // 80번 시도해도 안 변함 → unskippable 시간이 매우 길거나 진짜 stuck
                const dump = await page.evaluate(() => ({
                    isTyping: window.game.dialogue?.isTyping,
                    unskippable: window.game.dialogue?._unskippable,
                    keys: Object.keys(window.game.currentSceneData || {}),
                }));
                const sig = `${cur}|unsk=${dump.unskippable}|keys=${dump.keys.join(',')}`;
                if (!stuckSet.has(sig)) {
                    stuckSet.add(sig);
                    record('STUCK_DEEP', `${cur}: ${JSON.stringify(dump)}`, { where: label });
                }
                break;
            }
        } else stuck = 0;
        prev = cur;

        await page.evaluate(() => {
            const panelEl = document.getElementById('choice-panel');
            const panelVisible = panelEl && !panelEl.classList.contains('hidden');
            if (panelVisible) {
                const btns = panelEl.querySelectorAll('button.choice-ready, button');
                if (btns.length > 0) {
                    const idx = Math.floor(Math.random() * btns.length);
                    btns[idx].click();
                    return;
                }
            }
            // free_talk 씬: 사용자 입력 필요 → freeTalkNext로 강제 점프
            const sd = window.game.currentSceneData;
            if (sd?.type === 'free_talk') {
                const nxt = sd.freeTalkNext || sd.next;
                if (nxt) {
                    if (window.game.freeTalk?.cleanup) window.game.freeTalk.cleanup();
                    window.game._loadScene(nxt);
                    return;
                }
            }
            // unskippable이면 그냥 기다리기
            if (window.game.dialogue?._unskippable) return;
            if (window.game.dialogue?.isTyping) {
                window.game.dialogue.skipTyping?.();
                return;
            }
            window.game._advanceScene?.();
        });
        await wait(80);
    }
    return { visited, endingScene };
}

async function probeEndingFlow(page, entryScene, label) {
    // 엔딩 진입 씬에서 시작 → 엔딩 후속 씬 자동 진행
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => typeof window.game !== 'undefined' && !!window.game?._loadScene);
    // 새 게임 안 거치고 직접 점프 (이름 세팅)
    await page.evaluate((id) => {
        // 게임 스크린만 활성화
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('game-screen')?.classList.add('active');
        window.game.state.playerName = '테스터';
        window.game.state.currentDay = 5;
        window.game._loadScene(id);
    }, entryScene);
    await wait(800);
    const visited = new Set();
    for (let i = 0; i < 200; i++) {
        const cur = await page.evaluate(() => window.game?.state?.currentScene);
        if (!cur) break;
        visited.add(cur);
        await page.evaluate(() => {
            const panelEl = document.getElementById('choice-panel');
            if (panelEl && !panelEl.classList.contains('hidden')) {
                const btns = panelEl.querySelectorAll('button');
                if (btns.length > 0) { btns[Math.floor(Math.random() * btns.length)].click(); return; }
            }
            const sd = window.game.currentSceneData;
            if (sd?.type === 'free_talk') {
                const nxt = sd.freeTalkNext || sd.next;
                if (nxt) {
                    if (window.game.freeTalk?.cleanup) window.game.freeTalk.cleanup();
                    window.game._loadScene(nxt);
                    return;
                }
            }
            if (window.game.dialogue?._unskippable) return;
            if (window.game.dialogue?.isTyping) { window.game.dialogue.skipTyping?.(); return; }
            window.game._advanceScene?.();
        });
        await wait(100);
    }
    return visited.size;
}

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    attachListeners(page, 'main');

    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => typeof window.game !== 'undefined');

    // 1) 다중 자동 플레이
    console.log(`\n========== 다중 자동 플레이 ${PLAYS}회 (max ${MAX_STEPS} 스텝) ==========`);
    const dayHits = new Map();  // day → count
    const endingHits = new Map();  // ending → count
    const allVisited = new Set();
    for (let p = 1; p <= PLAYS; p++) {
        try {
            await startNewGame(page);
            const { visited, endingScene } = await autoPlay(page, MAX_STEPS, `play${p}`);
            for (const s of visited) allVisited.add(s);
            const days = new Set();
            for (const s of visited) {
                const m = /^day(\d)_/.exec(s);
                if (m) days.add(m[1]);
            }
            const maxDay = days.size ? Math.max(...[...days].map(Number)) : 0;
            dayHits.set(maxDay, (dayHits.get(maxDay) || 0) + 1);
            const endingType = endingScene ? endingScene.replace(/^day5_ending_/, '').replace(/_\d+$/, '') : 'NONE';
            endingHits.set(endingType, (endingHits.get(endingType) || 0) + 1);
            console.log(`  play ${p}/${PLAYS}: 방문 ${visited.size}, 최대 day${maxDay}, ending=${endingType}`);
        } catch (e) {
            record('PLAY_ERR', `play ${p}: ${e.message}`, { where: `play${p}` });
        }
    }

    // 2) 엔딩 진입점에서 직접 시작
    console.log('\n========== 6개 엔딩 후속 흐름 ==========');
    for (const ending of ['true', 'escape', 'complicit', 'forget', 'ghost', 'resist']) {
        try {
            const entry = `day5_ending_${ending}_1`;
            const visitedCnt = await probeEndingFlow(page, entry, `ending-${ending}`);
            console.log(`  ${ending}: ${visitedCnt} 씬 진행`);
        } catch (e) {
            record('ENDING_PROBE_ERR', `${ending}: ${e.message}`, { where: `ending-${ending}` });
        }
    }

    await page.close();
    await browser.close();

    console.log('\n========== 도달 일차 분포 ==========');
    for (const [day, n] of [...dayHits.entries()].sort()) {
        console.log(`  day${day}: ${n}회`);
    }
    console.log('\n========== 엔딩 도달 분포 ==========');
    for (const [e, n] of [...endingHits.entries()].sort((a, b) => b[1] - a[1])) {
        console.log(`  ${e}: ${n}회`);
    }
    console.log(`\n총 방문 unique 씬: ${allVisited.size}`);

    console.log('\n========== ISSUE SUMMARY ==========');
    const byKind = {};
    for (const [key, cnt] of errorBuckets.entries()) {
        const kind = key.split('::')[0];
        byKind[kind] = (byKind[kind] || 0) + cnt;
    }
    for (const [k, v] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${k}: ${v}회 (unique ${[...errorBuckets.keys()].filter(k0 => k0.startsWith(k + '::')).length})`);
    }
    console.log(`\nUnique issues: ${issues.length}`);
    process.exit(issues.length > 0 ? 1 : 0);
})();
