/**
 * Playwright UI 검증 — 구현된 6종 인터랙티브 글리치를 실제 브라우저에서 렌더링 테스트
 *
 * 앞선 버전(31/31 통과)에서 지적된 구멍을 닫는다:
 *  - peelStatLabel: 실제 opacity 측정으로 "화면에 보이는지" 검증
 *  - mirrorReflection: 캐릭터 스프라이트가 존재하는 상태에서 설화만 제외되는지 검증
 *  - mirrorWipe: 마우스 + 실제 touch 이벤트 경로 둘 다 검증
 *  - silenceAll: 실제 HTMLAudioElement에 대해 pause 호출되는지 검증
 *  - scene.vibrate: navigator.vibrate()에 실제 패턴이 전달되는지 검증
 *  - panSFX(바이노럴): audio.playSFXPanned()가 올바른 pan 값으로 호출되는지 검증
 *
 * Run: node test-glitch-ui.mjs
 */
import { chromium, devices } from 'playwright';

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
    await page.waitForFunction(() => typeof window.game !== 'undefined' && !!window.game._loadScene, { timeout: 15000 });
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
    const m = /^day(\d)_/.exec(sceneId);
    const day = m ? Number(m[1]) : 1;
    await page.evaluate(([id, d]) => {
        window.game.state.playerName = '테스터';
        window.game.state.currentDay = d;
        window.game._loadScene(id);
    }, [sceneId, day]);
    await wait(500);
}

async function runDesktopSuite(browser) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    page.on('pageerror', e => log(false, `runtime error: ${e.message}`));
    page.on('console', msg => {
        if (msg.type() === 'error') console.log('  [console error]', msg.text());
    });

    try {
        await setupGame(page);
        log(true, 'setup — game loaded and engine exposed');

        // === Test 1: peelStatLabel — 실제 가시성(opacity) 검증 ===
        // 이전 버그: _handleGlitch 직후 _updateStatDisplay가 character:null 씬에서
        //           stat-hidden(opacity:0)을 추가해 peel 연출이 실제로는 안 보였음.
        //           GameEngine._updateStatDisplay가 stat-peeling/stat-revealed를 보호하도록
        //           수정한 뒤 opacity가 1에 근접한지 실측한다.
        // 트랜지션이 완료된 깨끗한 상태에서 peel을 트리거해야 opacity 측정이 의미 있다.
        // stat-hidden/hidden을 제거하고 opacity 전이가 끝날 때까지 충분히 대기한 뒤
        // 샘플러를 건다. 이후 peel-layer가 DOM에 등장한 순간부터만 가시성을 샘플링한다.
        await page.evaluate(() => {
            const statEl = document.getElementById('stat-display');
            statEl.classList.remove('hidden', 'stat-hidden');
            statEl.textContent = '♡ 호감도 12';
        });
        await wait(500); // opacity 트랜지션(0.4s) 완료 대기
        await page.evaluate(() => {
            window.__peelTrace = {
                minOpacityDuringPeel: 1,
                sawLayer: false,
                sawBase: false,
                baseText: '',
                samplesDuringPeel: 0
            };
            const sampler = () => {
                const el = document.getElementById('stat-display');
                if (!el) return;
                // stat-peeling 클래스가 붙은 동안(=연출 진행 중)만 가시성 샘플링
                if (!el.classList.contains('stat-peeling') &&
                    !el.classList.contains('stat-revealed')) return;
                const op = parseFloat(window.getComputedStyle(el).opacity || '1');
                if (op < window.__peelTrace.minOpacityDuringPeel) {
                    window.__peelTrace.minOpacityDuringPeel = op;
                }
                window.__peelTrace.samplesDuringPeel++;
                if (document.querySelector('.stat-peel-layer')) window.__peelTrace.sawLayer = true;
                const base = document.querySelector('.stat-peel-base');
                if (base) {
                    window.__peelTrace.sawBase = true;
                    window.__peelTrace.baseText = base.textContent;
                }
            };
            window.__peelInterval = setInterval(sampler, 30);
        });
        await loadSceneDirect(page, 'day3_night_stat_crack_4');
        await wait(900);
        const peelTrace = await page.evaluate(() => {
            clearInterval(window.__peelInterval);
            return window.__peelTrace;
        });
        log(peelTrace.sawLayer, 'peelStatLabel: .stat-peel-layer 엘리먼트 생성됨');
        log(peelTrace.sawBase && /위험도/.test(peelTrace.baseText),
            `peelStatLabel: 뒤 레이어에 '위험도' 노출`,
            `text='${peelTrace.baseText}'`);
        log(peelTrace.samplesDuringPeel > 0 && peelTrace.minOpacityDuringPeel >= 0.9,
            `peelStatLabel: 연출 진행 중 #stat-display가 실제로 보임(opacity ≥ 0.9)`,
            `samples=${peelTrace.samplesDuringPeel} min opacity=${peelTrace.minOpacityDuringPeel.toFixed(3)}`);
        const statFinal = await page.$eval('#stat-display', el => ({
            text: el.textContent,
            hasRevealed: el.classList.contains('stat-revealed'),
            opacity: parseFloat(window.getComputedStyle(el).opacity || '1')
        }));
        log(statFinal.hasRevealed && /위험도/.test(statFinal.text) && statFinal.opacity >= 0.9,
            `peelStatLabel: 최종 상태 — stat-revealed + '위험도' + 가시성 유지`,
            `text='${statFinal.text}' revealed=${statFinal.hasRevealed} opacity=${statFinal.opacity.toFixed(3)}`);

        // === Test 1.5: peelStatLabel 이후 character:null 씬으로 이동해도 stat 유지 ===
        // stat-revealed는 '영구 전환' 설계. 다음 나레이션 씬에서 stat-hidden이 다시 붙으면 안 됨.
        await loadSceneDirect(page, 'day3_night_stat_crack_5');
        await wait(300);
        const afterPeel = await page.$eval('#stat-display', el => ({
            hidden: el.classList.contains('stat-hidden'),
            revealed: el.classList.contains('stat-revealed'),
            text: el.textContent,
            opacity: parseFloat(window.getComputedStyle(el).opacity || '1')
        }));
        log(!afterPeel.hidden && afterPeel.revealed && afterPeel.opacity >= 0.9,
            'peelStatLabel: 다음 character:null 씬에서도 위험도 라벨 유지(stat-hidden 재적용 안 됨)',
            `hidden=${afterPeel.hidden} revealed=${afterPeel.revealed} opacity=${afterPeel.opacity.toFixed(3)}`);

        // === Test 2: temperatureDrop ===
        await page.evaluate(() => window.game.glitchAdvanced.temperatureDrop(3000));
        await wait(200);
        const tempClass = await page.$eval('#game-screen', el => el.classList.contains('temperature-drop'));
        log(tempClass, 'temperatureDrop: #game-screen에 .temperature-drop 추가');
        const tempBeforeBg = await page.evaluate(() => {
            const el = document.getElementById('game-screen');
            const before = window.getComputedStyle(el, '::before');
            return { content: before.content, bg: before.background };
        });
        log(tempBeforeBg.content !== 'none' && tempBeforeBg.bg.includes('gradient'),
            'temperatureDrop: ::before 푸른 gradient 렌더링');

        // === Test 3: adminPanel ===
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

        // === Test 4: adminPanel 자동 정리 ===
        await loadSceneDirect(page, 'day4_night_mirror');
        await wait(300);
        const adminGone = await page.$('#admin-panel-overlay');
        log(!adminGone, 'adminPanel: day4_night_mirror 진입 시 자동 제거됨');

        // === Test 5: mirrorWipe (인터랙티브, 마우스 스와이프) ===
        await loadSceneDirect(page, 'day4_night_mirror_swipe');
        await wait(500);
        const swipeContainer = await page.$('.mirror-swipe-container');
        log(!!swipeContainer, 'mirrorWipe: .mirror-swipe-container 생성됨');
        const canvas = await page.$('.mirror-swipe-canvas');
        log(!!canvas, 'mirrorWipe: canvas 엘리먼트 존재');
        const swipeHint = await page.$('.mirror-swipe-hint');
        log(!!swipeHint, 'mirrorWipe: 안내 힌트 렌더링');
        const clickLocked = await page.evaluate(() => window.game._clickLocked);
        log(clickLocked === true, 'mirrorWipe: requireSwipe=true → _clickLocked=true (진행 차단)');

        const viewport = page.viewportSize();
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
        log(clickUnlocked === false, 'mirrorWipe (마우스): 스와이프 후 _clickLocked 해제됨');
        const swipeGone = await page.$('.mirror-swipe-container');
        log(!swipeGone, 'mirrorWipe (마우스): 완료 후 container 자동 제거');

        // === Test 6: mirrorReflection — 캐릭터 sprite가 있는 상태에서 설화만 제외 ===
        // 이전 버그: charId를 URL 폴더(/characters/)에서 뽑아 항상 'characters'가 나왔고,
        //           그래서 absentCharId === 'seolhwa'가 절대 매칭되지 않아 설화가 그대로 반사됐다.
        //           파일명 첫 언더스코어 앞 토큰으로 바꾼 뒤 실제 제외가 되는지 검증한다.
        await loadSceneDirect(page, 'day4_night_mirror_hit1_5');
        await wait(500);
        // char-left에 sea, char-center에 seolhwa 동시 배치
        await page.evaluate(() => {
            const L = document.getElementById('char-left');
            const C = document.getElementById('char-center');
            L.src = 'assets/images/characters/sea_sad.png';
            L.style.opacity = '1';
            L.style.display = '';
            C.src = 'assets/images/characters/seolhwa_sad.png';
            C.style.opacity = '1';
            C.style.display = '';
        });
        // showMirrorReflection을 직접 호출해 현재 스프라이트 상태를 반사
        await page.evaluate(() => {
            window.game.glitchAdvanced.hideMirrorReflection();
            window.game.glitchAdvanced.showMirrorReflection('seolhwa');
        });
        await wait(400);
        const reflection = await page.evaluate(() => {
            const inner = document.querySelector('.mirror-reflection-inner');
            if (!inner) return { ok: false };
            const imgs = Array.from(inner.querySelectorAll('img')).map(i => i.src);
            return { ok: true, count: imgs.length, srcs: imgs };
        });
        log(reflection.ok, 'mirrorReflection: #mirror-reflection + inner 생성됨');
        log(reflection.count === 1,
            `mirrorReflection: char-left(sea)만 반사, char-center(설화)는 제외`,
            `반사 sprite 수=${reflection.count} srcs=${JSON.stringify(reflection.srcs)}`);
        log(reflection.srcs && reflection.srcs.some(s => /sea_/.test(s)) && !reflection.srcs.some(s => /seolhwa_/.test(s)),
            'mirrorReflection: 반사 이미지에 sea만 포함, seolhwa 미포함',
            reflection.srcs ? `srcs=${reflection.srcs.join(', ')}` : '');
        const mirrored = await page.$eval('.mirror-reflection-inner',
            el => window.getComputedStyle(el).transform
        ).catch(() => '');
        log(/matrix\(-1/.test(mirrored), 'mirrorReflection: 거울상 scaleX(-1) 적용됨',
            `transform=${mirrored}`);

        // === Test 6.5: absentCharId 없이 호출하면 모든 캐릭터 반사 ===
        await page.evaluate(() => {
            window.game.glitchAdvanced.hideMirrorReflection();
            window.game.glitchAdvanced.showMirrorReflection(null);
        });
        await wait(400);
        const allReflected = await page.evaluate(() => {
            const inner = document.querySelector('.mirror-reflection-inner');
            return inner ? inner.querySelectorAll('img').length : 0;
        });
        log(allReflected === 2, `mirrorReflection: absentCharId=null이면 2명 모두 반사`,
            `반사 sprite 수=${allReflected}`);

        // === Test 7: mirror_hit2 진입 시 자동 정리 ===
        await loadSceneDirect(page, 'day4_night_mirror_hit2');
        await wait(300);
        const refGone = await page.$('#mirror-reflection');
        log(!refGone, 'mirrorReflection: mirror_hit2 진입 시 자동 제거');

        // === Test 8: photoOverlay ===
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
        await wait(200);
        const names = await page.evaluate(() => window.__photoNames);
        log(names.length > 0 && /#01/.test(names[0]) && /김도진/.test(names[0]),
            'photoOverlay: 첫 사진 "#01 김도진" 렌더링',
            names.length ? `실제[0]='${names[0]}'` : '관찰 실패');
        await wait(6000);
        const finalText = await page.$('.mirror-final-text');
        log(!!finalText, 'photoOverlay: 최종 "나는 13번째 껍데기다" 텍스트 렌더링');
        const finalTextContent = await page.$eval('.mirror-final-text', el => el.textContent).catch(() => '');
        log(/13번째|껍데기/.test(finalTextContent),
            'photoOverlay: 최종 텍스트 내용 정확',
            `='${finalTextContent}'`);

        // === Test 9: silenceAll — 실제 HTMLAudioElement에 pause 도달 ===
        // 이전: { paused: false, pause(){...} } mock에만 돌렸음. 실제 <audio>로 검증.
        await page.evaluate(() => {
            // 빈 wav base64 (0.1s 무음) — autoplay 정책 회피용
            const silent = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
            const audio = new Audio(silent);
            audio.loop = true;
            audio.volume = 0;
            // play()는 정책상 실패할 수 있으나 pause 동작 자체는 검증 가능
            audio.play().catch(() => {});
            window.__realBgm = audio;
            window.game.renderer.bgmAudio = audio;
            window.__bgmPauseCalled = 0;
            const origPause = audio.pause.bind(audio);
            audio.pause = function () {
                window.__bgmPauseCalled++;
                return origPause();
            };
        });
        await wait(200);
        await page.evaluate(() => window.game._handleGlitch({ silenceAll: true }));
        await wait(200);
        const bgmResult = await page.evaluate(() => ({
            pauseCalled: window.__bgmPauseCalled,
            paused: window.__realBgm?.paused
        }));
        log(bgmResult.pauseCalled >= 1 && bgmResult.paused === true,
            'silenceAll: 실제 HTMLAudioElement.pause() 호출됨 + paused=true',
            `pause 호출=${bgmResult.pauseCalled} paused=${bgmResult.paused}`);

        // === Test 10: scene.vibrate — navigator.vibrate()에 실제 패턴 도달 ===
        // 이전: 테스트 전무. DeviceGimmickSystem.isMobile=false면 early return이므로
        //       모바일 UA 컨텍스트를 별도로 띄워 검증한다 (아래 runMobileSuite).
        //       여기선 "패턴이 유효한 배열인지"를 사전 검증만 한다.
        const patternsOk = await page.evaluate(() => {
            const ENG = window.game;
            if (!ENG.deviceGimmick) return { ok: false, reason: 'no deviceGimmick' };
            const P = ENG.deviceGimmick.constructor.VIBRATION_PATTERNS;
            const keys = ['heartbeat', 'mirror_heartbeat', 'mirror_13faces', 'danger', 'chase'];
            for (const k of keys) {
                const p = P[k];
                if (!Array.isArray(p)) return { ok: false, reason: `pattern ${k} not array` };
                if (p.length === 0) return { ok: false, reason: `pattern ${k} empty` };
                if (!p.every(n => typeof n === 'number' && n >= 0)) {
                    return { ok: false, reason: `pattern ${k} has non-number` };
                }
            }
            return { ok: true };
        });
        log(patternsOk.ok, 'vibrate: 주요 패턴(heartbeat/mirror_heartbeat/mirror_13faces/danger/chase) 정의 검증',
            patternsOk.ok ? '' : patternsOk.reason);

        // === Test 11: panSFX — 바이노럴 글리치 키 → audio.playSFXPanned 도달 ===
        const panResult = await page.evaluate(() => {
            // audio.playSFXPanned 호출 로그
            const log = [];
            window.__panLog = log;
            const audio = window.game.audio;
            if (!audio) return { ok: false, reason: 'no audio manager' };
            // 원 메서드 백업 + 스파이
            const orig = audio.playSFXPanned?.bind(audio);
            audio.playSFXPanned = async (file, pan) => {
                log.push({ file, pan });
            };
            // 바이노럴 활성 상태로 고정
            audio._binauralActive = true;
            // 글리치 키로 호출
            window.game._handleGlitch({ panSFX: 'sfx_whisper_seolhwa', pan: -1 });
            // 복원
            audio.playSFXPanned = orig;
            return { ok: true, log };
        });
        log(panResult.ok && panResult.log.length === 1 &&
            panResult.log[0].file === 'sfx_whisper_seolhwa' &&
            panResult.log[0].pan === -1,
            'panSFX: 바이노럴 활성 시 audio.playSFXPanned("sfx_whisper_seolhwa", -1) 호출',
            JSON.stringify(panResult.log));

        // 바이노럴 OFF면 pan=0으로 중앙 재생
        const panResultMono = await page.evaluate(() => {
            const log = [];
            window.__panLogMono = log;
            const audio = window.game.audio;
            const orig = audio.playSFXPanned?.bind(audio);
            audio.playSFXPanned = async (file, pan) => { log.push({ file, pan }); };
            audio._binauralActive = false;
            window.game._handleGlitch({ panSFX: 'sfx_whisper_seolhwa', pan: -1 });
            audio.playSFXPanned = orig;
            return log;
        });
        log(panResultMono.length === 1 && panResultMono[0].pan === 0,
            'panSFX: 바이노럴 비활성 시 pan=0으로 중앙 재생(플레이어 이어폰 없는 경우)',
            JSON.stringify(panResultMono));

        // === Test 11.5: sfx_whisper_seolhwa 합성 SFX 존재 + 실제 panner 경로 ===
        // playSFXPanned 내부에서 sfxGain을 panner 앞단으로 임시 교체하는지 검증
        const synthPannerResult = await page.evaluate(() => {
            const audio = window.game.audio;
            if (!audio || !audio._synthRegistry?.sfx_whisper_seolhwa) {
                return { ok: false, reason: 'sfx_whisper_seolhwa not registered' };
            }
            let capturedSfxGain = null;
            const origSynth = audio._synthRegistry.sfx_whisper_seolhwa;
            audio._synthRegistry.sfx_whisper_seolhwa = (o) => {
                // synth 호출 시점의 sfxGain 참조를 기록
                capturedSfxGain = audio.sfxGain;
            };
            const sfxGainBefore = audio.sfxGain;
            audio._binauralActive = true;
            audio.playSFXPanned('sfx_whisper_seolhwa', -1);
            audio._synthRegistry.sfx_whisper_seolhwa = origSynth;
            const sfxGainAfter = audio.sfxGain;
            return {
                ok: true,
                swappedDuringCall: capturedSfxGain !== sfxGainBefore,
                restoredAfter: sfxGainAfter === sfxGainBefore
            };
        });
        log(synthPannerResult.ok,
            'panSFX: sfx_whisper_seolhwa 합성기 _synthRegistry에 등록됨',
            synthPannerResult.reason || '');
        log(synthPannerResult.swappedDuringCall && synthPannerResult.restoredAfter,
            'panSFX: playSFXPanned가 synth 호출 시점에 sfxGain을 panner 경로로 교체 + 이후 복원',
            `swapped=${synthPannerResult.swappedDuringCall} restored=${synthPannerResult.restoredAfter}`);

        // === Test 11.6: 바이노럴 토스트 DOM 생성 경로 ===
        // showBinauralToast는 app.js에서 devicechange 트리거로만 호출됨.
        // 테스트에선 직접 호출해 DOM 생성 + 3초 자동 제거를 검증.
        const toastResult = await page.evaluate(async () => {
            if (typeof window.showBinauralToast !== 'function') {
                return { ok: false, reason: 'showBinauralToast not exposed on window' };
            }
            window.showBinauralToast('🎧 Test');
            // 생성 즉시 DOM 존재
            await new Promise(r => requestAnimationFrame(() => r()));
            const el = document.getElementById('binaural-toast');
            if (!el) return { ok: false, reason: 'toast element missing after call' };
            const style = window.getComputedStyle(el);
            return {
                ok: true,
                text: el.textContent,
                hasVisibleClass: el.classList.contains('save-toast-visible') ||
                                 parseFloat(style.opacity) > 0,
                bottomPosition: style.bottom !== 'auto' && style.bottom !== '',
            };
        });
        log(toastResult.ok && /Test/.test(toastResult.text),
            '바이노럴 토스트: showBinauralToast("🎧 Test") → #binaural-toast DOM 생성',
            toastResult.reason || `text='${toastResult.text}'`);
        log(toastResult.ok && toastResult.bottomPosition,
            '바이노럴 토스트: .binaural-toast가 하단 배치 (save-toast 상단과 충돌 없음)',
            `bottom 설정됨=${toastResult.bottomPosition}`);

        // === Test 12: 스크린샷 ===
        await loadSceneDirect(page, 'day4_night_save_glitch_7');
        await wait(400);
        await page.screenshot({ path: 'c:/workspace/nevergrad/test-screenshot-admin.png', fullPage: false });
        log(true, 'screenshot: admin panel 저장 → test-screenshot-admin.png');

        await loadSceneDirect(page, 'day4_night_mirror_swipe');
        await wait(400);
        await page.screenshot({ path: 'c:/workspace/nevergrad/test-screenshot-mirror-swipe.png' });
        log(true, 'screenshot: mirror swipe 저장 → test-screenshot-mirror-swipe.png');

        // reflection 스크린샷은 실제 sprite 있는 상태로 재현
        await loadSceneDirect(page, 'day4_night_mirror_hit1_5');
        await wait(300);
        await page.evaluate(() => {
            const L = document.getElementById('char-left');
            const C = document.getElementById('char-center');
            L.src = 'assets/images/characters/sea_sad.png';
            L.style.opacity = '1';
            C.src = 'assets/images/characters/seolhwa_sad.png';
            C.style.opacity = '1';
            window.game.glitchAdvanced.showMirrorReflection('seolhwa');
        });
        await wait(500);
        await page.screenshot({ path: 'c:/workspace/nevergrad/test-screenshot-mirror-reflection.png' });
        log(true, 'screenshot: mirror reflection (sea 반사/설화 제외) 저장');

    } catch (err) {
        console.error('\n❌ 데스크탑 러너 오류:', err.message);
        fail++;
    } finally {
        await context.close();
    }
}

async function runMobileSuite(browser) {
    console.log('\n── 모바일 컨텍스트 (iPhone 12 landscape) ──');
    // rotate-prompt가 portrait에서 클릭을 가로채므로 landscape 변형을 쓴다
    const device = devices['iPhone 12 landscape'] || {
        ...devices['iPhone 12'],
        viewport: { width: 844, height: 390 },
        isLandscape: true
    };
    const context = await browser.newContext({ ...device, hasTouch: true });
    const page = await context.newPage();

    page.on('pageerror', e => log(false, `[mobile] runtime error: ${e.message}`));

    try {
        // navigator.vibrate를 setup 이전 init script로 훅 — 실제 호출을 기록
        await context.addInitScript(() => {
            window.__vibrateLog = [];
            const orig = navigator.vibrate?.bind(navigator);
            navigator.vibrate = function (pattern) {
                window.__vibrateLog.push(Array.isArray(pattern) ? [...pattern] : pattern);
                return orig ? orig(pattern) : true;
            };
            // 일부 모바일 컨텍스트에서 rotate-prompt CSS가 landscape에도 클릭을 가로채면
            // 테스트 시드 단계에서 강제로 숨긴다 (실 UI 검증은 이 스위트의 목적이 아님)
            const inject = () => {
                const style = document.createElement('style');
                style.textContent = '#rotate-prompt, .rotate-prompt { display: none !important; }';
                (document.head || document.documentElement).appendChild(style);
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', inject);
            } else {
                inject();
            }
        });

        await setupGame(page);
        log(true, '[mobile] setup — game loaded on iPhone 12 UA');

        // 모바일 UA 확인
        const isMobileFlag = await page.evaluate(() => window.game.deviceGimmick?.isMobile === true);
        log(isMobileFlag, '[mobile] DeviceGimmickSystem.isMobile=true');

        // scene.vibrate가 있는 씬 로드 → navigator.vibrate 호출 감지
        // day4_night_mirror_hit1_12: vibrate: "heartbeat"
        await page.evaluate(() => { window.__vibrateLog.length = 0; });
        await loadSceneDirect(page, 'day4_night_mirror_hit1_12');
        await wait(300);
        const vibrateLog = await page.evaluate(() => window.__vibrateLog);
        const heartbeat = [100, 100, 300, 500];
        const matched = vibrateLog.some(v =>
            Array.isArray(v) && v.length === heartbeat.length &&
            v.every((n, i) => n === heartbeat[i])
        );
        log(matched,
            '[mobile] scene.vibrate="heartbeat" → navigator.vibrate([100,100,300,500]) 실제 호출',
            `기록=${JSON.stringify(vibrateLog)}`);

        // === 모바일 터치 이벤트로 mirrorWipe 완료 ===
        await loadSceneDirect(page, 'day4_night_mirror_swipe');
        await wait(700);
        const touchCanvasVisible = await page.$('.mirror-swipe-canvas');
        log(!!touchCanvasVisible, '[mobile] mirrorWipe: canvas 렌더링');

        const viewport = page.viewportSize();
        // touchscreen API 사용 — 실제 touchstart/touchmove/touchend 이벤트 발행
        for (let round = 0; round < 4; round++) {
            const startX = 30;
            const startY = 80 + round * 30;
            await page.touchscreen.tap(startX, startY);
            // 연속 드래그 — dispatchEvent로 touchmove 시뮬레이션
            await page.evaluate(([sx, sy, vw, vh, r]) => {
                const canvas = document.querySelector('.mirror-swipe-canvas');
                if (!canvas) return;
                const dispatch = (type, x, y) => {
                    const t = new Touch({
                        identifier: 0, target: canvas, clientX: x, clientY: y,
                        pageX: x, pageY: y, screenX: x, screenY: y,
                        radiusX: 5, radiusY: 5, rotationAngle: 0, force: 1
                    });
                    const evt = new TouchEvent(type, {
                        cancelable: true, bubbles: true,
                        touches: type === 'touchend' ? [] : [t],
                        targetTouches: type === 'touchend' ? [] : [t],
                        changedTouches: [t]
                    });
                    canvas.dispatchEvent(evt);
                };
                dispatch('touchstart', sx, sy);
                const steps = 30;
                for (let i = 1; i <= steps; i++) {
                    const t = i / steps;
                    const x = sx + t * (vw - 60);
                    const y = sy + Math.sin(t * Math.PI * 3 + r) * 80 + t * (vh - 200);
                    dispatch('touchmove', x, y);
                }
                dispatch('touchend', vw - 30, vh - 200);
            }, [startX, startY, viewport.width, viewport.height, round]);
            await wait(50);
        }
        await wait(1500);
        const touchUnlocked = await page.evaluate(() => window.game._clickLocked);
        log(touchUnlocked === false, '[mobile] mirrorWipe: 터치 스와이프 후 _clickLocked 해제됨');
        const touchSwipeGone = await page.$('.mirror-swipe-container');
        log(!touchSwipeGone, '[mobile] mirrorWipe: 터치 완료 후 container 자동 제거');

    } catch (err) {
        console.error('\n❌ 모바일 러너 오류:', err.message);
        fail++;
    } finally {
        await context.close();
    }
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    try {
        await runDesktopSuite(browser);
        await runMobileSuite(browser);
    } finally {
        await browser.close();
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  통과: ${pass}   실패: ${fail}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    process.exit(fail === 0 ? 0 : 1);
})();
