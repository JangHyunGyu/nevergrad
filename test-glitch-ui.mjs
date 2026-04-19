/**
 * Playwright UI 검증 — 구현된 6종 인터랙티브 글리치를 실제 브라우저에서 렌더링 테스트
 * Run: node test-glitch-ui.mjs
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3099';
const results = [];
let pass = 0, fail = 0;

function log(ok, name, detail = '') {
    const mark = ok ? '✅' : '❌';
    console.log(`${mark} ${name}${detail ? ' — ' + detail : ''}`);
    results.push({ ok, name, detail });
    if (ok) pass++; else fail++;
}

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function setupGame(page) {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    // window.game 초기화 대기 — app.js에서 await game.init() 이후 노출
    await page.waitForFunction(() => typeof window.game !== 'undefined' && !!window.game._loadScene, { timeout: 15000 });
    // 새 게임 → 이름 입력 → 시작
    await page.click('#btn-new-game');
    await page.waitForSelector('#player-name-input', { state: 'visible' });
    await page.fill('#player-name-input', '테스터');
    await page.click('#btn-start');
    await page.waitForSelector('#game-screen.active, #game-screen:not(.hidden)', { state: 'attached' });
    await wait(1200);
    const ready = await page.evaluate(() => typeof window.game !== 'undefined' && !!window.game.state && !!window.game._loadScene);
    if (!ready) throw new Error('game engine not exposed on window');
}

async function loadSceneDirect(page, sceneId) {
    // 씬 ID의 접두사(dayN)로 currentDay 자동 설정
    const m = /^day(\d)_/.exec(sceneId);
    const day = m ? Number(m[1]) : 1;
    await page.evaluate(([id, d]) => {
        window.game.state.playerName = '테스터';
        window.game.state.currentDay = d;
        window.game._loadScene(id);
    }, [sceneId, day]);
    await wait(500);
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    page.on('pageerror', e => log(false, `runtime error: ${e.message}`));
    page.on('console', msg => {
        if (msg.type() === 'error') console.log('  [console error]', msg.text());
    });

    try {
        await setupGame(page);
        log(true, 'setup — game loaded and engine exposed');

        // === Test 1: peelStatLabel (Day 3 밤) ===
        // 라벨 전환은 ~300ms 내 완료되므로 MutationObserver로 전체 life-cycle 관찰
        await page.evaluate(() => {
            window.__peelSeen = { layer: false, base: false, baseText: '' };
            const obs = new MutationObserver(() => {
                const layer = document.querySelector('.stat-peel-layer');
                const base = document.querySelector('.stat-peel-base');
                if (layer) window.__peelSeen.layer = true;
                if (base) {
                    window.__peelSeen.base = true;
                    window.__peelSeen.baseText = base.textContent;
                }
            });
            obs.observe(document.getElementById('stat-display'), { childList: true, subtree: true, attributes: true });
            const statEl = document.getElementById('stat-display');
            statEl.classList.remove('hidden', 'stat-hidden');
            statEl.textContent = '♡ 호감도 12';
        });
        await loadSceneDirect(page, 'day3_night_stat_crack_4');
        await wait(800); // 전체 peel 사이클 완료 대기
        const peelSeen = await page.evaluate(() => window.__peelSeen);
        log(peelSeen.layer, 'peelStatLabel: .stat-peel-layer 엘리먼트 생성됨');
        log(peelSeen.base && /위험도/.test(peelSeen.baseText),
            `peelStatLabel: 뒤 레이어에 '위험도' 노출`,
            peelSeen.base ? `실제='${peelSeen.baseText}'` : 'base 없음');
        const statFinal = await page.$eval('#stat-display', el => ({
            text: el.textContent,
            hasRevealed: el.classList.contains('stat-revealed')
        }));
        log(statFinal.hasRevealed && /위험도/.test(statFinal.text),
            `peelStatLabel: 최종 상태에 stat-revealed 클래스 + '위험도' 텍스트`,
            `text='${statFinal.text}' revealed=${statFinal.hasRevealed}`);

        // === Test 2: temperatureDrop (Day 3 밤) ===
        await page.evaluate(() => window.game.glitchAdvanced.temperatureDrop(3000));
        await wait(200);
        const tempClass = await page.$eval('#game-screen', el => el.classList.contains('temperature-drop'));
        log(tempClass, 'temperatureDrop: #game-screen에 .temperature-drop 추가');
        // ::before 실제 렌더링 검증
        const tempBeforeBg = await page.evaluate(() => {
            const el = document.getElementById('game-screen');
            const before = window.getComputedStyle(el, '::before');
            return { content: before.content, bg: before.background };
        });
        log(tempBeforeBg.content !== 'none' && tempBeforeBg.bg.includes('gradient'),
            'temperatureDrop: ::before 푸른 gradient 렌더링');

        // === Test 3: adminPanel (Day 4 밤) ===
        await loadSceneDirect(page, 'day4_night_save_glitch_7');
        await wait(400);
        const adminExists = await page.$('#admin-panel-overlay');
        log(!!adminExists, 'adminPanel: #admin-panel-overlay 엘리먼트 생성됨');
        const adminTitle = await page.$eval('.admin-panel-title', el => el.textContent).catch(() => null);
        log(adminTitle && /NEVERGRAD/.test(adminTitle) && /피험자/.test(adminTitle),
            'adminPanel: 헤더 "NEVERGRAD — 피험자 관리 시스템"');
        const rowCount = await page.$$eval('.admin-panel-row', els => els.length);
        log(rowCount === 13, `adminPanel: 13개 피험자 행 렌더링`, `실제=${rowCount}`);
        const hasPlayerRow = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.admin-panel-row'))
                .some(r => r.textContent.includes('테스터') && r.textContent.includes('진행 중'));
        });
        log(hasPlayerRow, 'adminPanel: 13번 슬롯이 플레이어 이름 + "진행 중"');
        const activeRow = await page.$('.admin-row-active');
        log(!!activeRow, 'adminPanel: 진행 중 행에 .admin-row-active (깜빡임)');
        const warningRow = await page.$('.admin-row-warning');
        log(!!warningRow, 'adminPanel: #07 "이상 반응" 행에 .admin-row-warning');

        // === Test 4: adminPanel 자동 정리 (mirror 씬 진입 시) ===
        await loadSceneDirect(page, 'day4_night_mirror');
        await wait(300);
        const adminGone = await page.$('#admin-panel-overlay');
        log(!adminGone, 'adminPanel: day4_night_mirror 진입 시 자동 제거됨');

        // === Test 5: mirrorWipe (Day 4 밤, 인터랙티브) ===
        await loadSceneDirect(page, 'day4_night_mirror_swipe');
        await wait(500);
        const swipeContainer = await page.$('.mirror-swipe-container');
        log(!!swipeContainer, 'mirrorWipe: .mirror-swipe-container 생성됨');
        const canvas = await page.$('.mirror-swipe-canvas');
        log(!!canvas, 'mirrorWipe: canvas 엘리먼트 존재');
        const swipeHint = await page.$('.mirror-swipe-hint');
        log(!!swipeHint, 'mirrorWipe: 안내 힌트 렌더링');
        // requireSwipe가 대화 클릭을 잠그는지
        const clickLocked = await page.evaluate(() => window.game._clickLocked);
        log(clickLocked === true, 'mirrorWipe: requireSwipe=true → _clickLocked=true (진행 차단)');

        // 실제 마우스 스와이프 시뮬레이션 — 화면 전체를 드래그
        const viewport = page.viewportSize();
        const cx = viewport.width / 2;
        const cy = viewport.height / 2;

        // 여러 번 큰 원을 그려서 35% 이상 닦기
        for (let round = 0; round < 3; round++) {
            await page.mouse.move(100, 100);
            await page.mouse.down();
            for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                await page.mouse.move(
                    100 + t * (viewport.width - 200),
                    100 + Math.sin(t * Math.PI * 4 + round) * 200 + t * (viewport.height - 300)
                );
            }
            await page.mouse.up();
        }
        await wait(1200);
        const clickUnlocked = await page.evaluate(() => window.game._clickLocked);
        log(clickUnlocked === false, 'mirrorWipe: 스와이프 후 _clickLocked 해제됨');
        const swipeGone = await page.$('.mirror-swipe-container');
        log(!swipeGone, 'mirrorWipe: 완료 후 container 자동 제거');

        // === Test 6: mirrorReflection + characterAbsentInMirror ===
        await loadSceneDirect(page, 'day4_night_mirror_hit1');
        await wait(500);
        const mirrorRef = await page.$('#mirror-reflection');
        log(!!mirrorRef, 'mirrorReflection: #mirror-reflection 엘리먼트 생성됨');
        const refInner = await page.$('.mirror-reflection-inner');
        log(!!refInner, 'mirrorReflection: 반사상 inner 컨테이너 존재');
        // 반사 sprite가 실제로 scaleX(-1) 적용 받는지
        const mirrored = await page.$eval('.mirror-reflection-inner',
            el => window.getComputedStyle(el).transform
        ).catch(() => '');
        log(/matrix\(-1/.test(mirrored), 'mirrorReflection: 거울상 scaleX(-1) 적용됨',
            `transform=${mirrored}`);

        // === Test 7: mirror_hit1 종료 시 자동 정리 ===
        await loadSceneDirect(page, 'day4_night_mirror_hit2');
        await wait(300);
        const refGone = await page.$('#mirror-reflection');
        log(!refGone, 'mirrorReflection: mirror_hit2 진입 시 자동 제거');

        // === Test 8: photoOverlay (13장 + 최종 텍스트) ===
        // 첫 사진을 놓치지 않도록 MutationObserver로 전체 이름 시퀀스를 수집
        await page.evaluate(() => {
            window.__photoNames = [];
            const obs = new MutationObserver(muts => {
                muts.forEach(m => m.addedNodes.forEach(n => {
                    if (n.classList?.contains('mirror-face-name')) {
                        window.__photoNames.push(n.textContent);
                    }
                }));
            });
            obs.observe(document.body, { childList: true, subtree: true });
            window.__photoObserver = obs;
        });
        await loadSceneDirect(page, 'day4_night_mirror_overlay');
        await wait(100);
        const photoOverlay = await page.$('.mirror-face-overlay');
        log(!!photoOverlay, 'photoOverlay: .mirror-face-overlay 생성됨');
        await wait(200); // 첫 사진 캡처 여유
        const names = await page.evaluate(() => window.__photoNames);
        log(names.length > 0 && /#01/.test(names[0]) && /김도진/.test(names[0]),
            'photoOverlay: 첫 사진 "#01 김도진" 렌더링',
            names.length ? `실제[0]='${names[0]}'` : '관찰 실패');

        // 13 * 400ms = 5.2초 + 최종 텍스트 3초 = 8.2초 대기
        await wait(6000);
        const finalText = await page.$('.mirror-final-text');
        log(!!finalText, 'photoOverlay: 최종 "나는 13번째 껍데기다" 텍스트 렌더링');
        const finalTextContent = await page.$eval('.mirror-final-text', el => el.textContent).catch(() => '');
        log(/13번째|껍데기/.test(finalTextContent),
            'photoOverlay: 최종 텍스트 내용 정확',
            `='${finalTextContent}'`);

        // === Test 9: silenceAll — BGM 실제 pause ===
        await page.evaluate(() => {
            // 가짜 BGM audio 객체를 renderer에 붙임
            window.game.renderer.bgmAudio = { paused: false, pause() { this.paused = true; } };
        });
        await page.evaluate(() => window.game._handleGlitch({ silenceAll: true }));
        await wait(100);
        const bgmPaused = await page.evaluate(() => window.game.renderer.bgmAudio?.paused);
        log(bgmPaused === true, 'silenceAll: renderer.bgmAudio.pause() 호출됨');

        // === Test 10: 스크린샷 저장 (시각 확인용) ===
        await loadSceneDirect(page, 'day4_night_save_glitch_7');
        await wait(400);
        await page.screenshot({ path: 'c:/workspace/nevergrad/test-screenshot-admin.png', fullPage: false });
        log(true, 'screenshot: admin panel 저장 → test-screenshot-admin.png');

        await loadSceneDirect(page, 'day4_night_mirror_swipe');
        await wait(400);
        await page.screenshot({ path: 'c:/workspace/nevergrad/test-screenshot-mirror-swipe.png' });
        log(true, 'screenshot: mirror swipe 저장 → test-screenshot-mirror-swipe.png');

        await loadSceneDirect(page, 'day4_night_mirror_hit1');
        await wait(400);
        await page.screenshot({ path: 'c:/workspace/nevergrad/test-screenshot-mirror-reflection.png' });
        log(true, 'screenshot: mirror reflection 저장 → test-screenshot-mirror-reflection.png');

    } catch (err) {
        console.error('\n❌ 테스트 러너 오류:', err.message);
        fail++;
    } finally {
        await browser.close();
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  통과: ${pass}   실패: ${fail}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    process.exit(fail === 0 ? 0 : 1);
})();
