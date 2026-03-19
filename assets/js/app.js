/**
 * ============================================================================
 * app.js - Nevergrad: 졸업하지 못한 교실 - 앱 진입점
 * ============================================================================
 *
 * [로드 순서]
 * 1. config.js          — 전역 설정 (CONFIG, INITIAL_STATS)
 * 2. modules/*.js       — 엔진 모듈 (StateManager, SaveManager, I18nManager 등)
 * 3. scenario/day*_*.js — 시나리오 데이터 (SCENARIO[1]~[5])
 * 4. app.js (이 파일)    — 초기화
 *
 * HTML에서 <script> 순서로 로드되거나, 빌드 도구로 번들링
 */

/**
 * 모바일 풀스크린 유틸리티
 * - Fullscreen API 지원 시 풀스크린 진입
 * - iOS Safari는 Fullscreen API 미지원이므로 standalone 모드(PWA)로 대체
 */
function requestMobileFullscreen() {
    const elem = document.documentElement;

    // Fullscreen API (Chrome, Firefox, Edge, Samsung Internet 등)
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
        // Safari desktop / older WebKit
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        // IE11 / Edge Legacy
        elem.msRequestFullscreen();
    }
    // iOS Safari: Fullscreen API 미지원 — PWA standalone + viewport meta로 대응
}

// 화면 회전 시 풀스크린 복구
window.addEventListener('orientationchange', () => {
    // 이미 게임 화면에 진입한 상태에서만 복구
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen && gameScreen.style.display !== 'none' && !document.fullscreenElement) {
        setTimeout(() => requestMobileFullscreen(), 300);
    }
});

/**
 * 이미지 프리로더 — CONFIG.EXPRESSIONS + CONFIG.BACKGROUNDS에서 고유 경로 수집 후 프리로드
 * @param {function(number, number)} onProgress - (loaded, total) 콜백
 * @returns {Promise<void>}
 */
function preloadGameImages(onProgress) {
    // 고유 이미지 경로 수집
    const pathSet = new Set();

    // 캐릭터 표정 이미지
    for (const charExps of Object.values(CONFIG.EXPRESSIONS)) {
        for (const path of Object.values(charExps)) {
            if (path) pathSet.add(path);
        }
    }

    // 배경 이미지
    for (const path of Object.values(CONFIG.BACKGROUNDS)) {
        if (path) pathSet.add(path);
    }

    const paths = [...pathSet];
    const total = paths.length;
    let loaded = 0;

    if (total === 0) {
        onProgress?.(0, 0);
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        let settled = 0;
        const settle = () => {
            settled++;
            loaded++;
            onProgress?.(loaded, total);
            if (settled >= total) resolve();
        };

        paths.forEach((src) => {
            const img = new Image();
            img.onload = settle;
            img.onerror = settle; // 실패해도 진행
            img.src = src;
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // 타이틀 배경 이미지 로드 체크 — 이미지 없으면 CSS 그라디언트 폴백
    const titleBgLayer = document.querySelector('.title-bg-layer');
    if (titleBgLayer) {
        const img = new Image();
        img.src = new URL('assets/images/background/title_bg.png', document.baseURI).href;
        img.onerror = () => titleBgLayer.classList.add('no-image');
    }

    const game = new GameEngine();

    // 크로스오버 감지 시스템 초기화 (Cupid 플레이 기록 감지)
    game.crossover = new CrossoverSystem(game);
    game.crossover.detect();

    // 디바이스 기믹 시스템 초기화
    game.deviceGimmick = new DeviceGimmickSystem(game);
    await game.deviceGimmick.init();

    // 메타 공포 시스템 초기화
    game.metaHorror = new MetaHorrorSystem(game);

    // 확장 글리치 시스템 초기화
    game.glitchAdvanced = new GlitchSystemAdvanced(game);

    // 스크린샷 감지 초기화 (SCENARIO.md 5189-5202)
    game.metaHorror.initScreenshotDetection();

    // BGM 합성 엔진 초기화 (프로시저럴 BGM 생성)
    const bgmSynth = new BGMSynth();
    bgmSynth.init(game.audio);

    // 바이노럴 오디오 감지 (SCENARIO.md 5174-5185)
    game.audio.detectStereoOutput().then(isStereo => {
        if (isStereo) {
            game.audio.enableBinauralMode();
        }
    });

    // AI 프리토킹 시스템 초기화
    game.freeTalk = new FreeTalkSystem(game);

    // 갤러리 시스템 초기화
    game.gallery = new GallerySystem(game);

    // 엔진 초기화 (i18n 로드, UI 바인딩)
    await game.init();

    // 갤러리 이벤트 바인딩 (init 후 — UI locale이 적용된 후)
    game.gallery.bind();

    // 이미지 프리로드 기능을 엔진에 등록
    game._preloadImages = async function(afterScreen) {
        // 이미 프리로드 완료된 경우 스킵
        if (game._imagesPreloaded) {
            game._showScreen(afterScreen);
            return;
        }

        const loadingScreen = document.getElementById('loading-screen');
        const bar = document.getElementById('loading-bar-inner');
        const text = document.getElementById('loading-text');

        // 로딩 화면 표시
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
            loadingScreen.classList.add('active');
        }

        await preloadGameImages((loaded, total) => {
            if (bar) bar.style.width = `${Math.round((loaded / total) * 100)}%`;
            if (text) text.textContent = `${loaded} / ${total}`;
        });

        game._imagesPreloaded = true;

        // 잠시 대기 (100% 표시 유지)
        await new Promise(r => setTimeout(r, 300));

        // 로딩 화면 숨기고 목표 화면 표시
        game._showScreen(afterScreen);
    };

    // 전역 접근 (디버그용)
    window.__game = game;
});

// ============================================================================
// 【글로벌 에러 핸들러】 프론트엔드 에러를 D1에 기록
// ============================================================================

(function() {
    var ERROR_ENDPOINT = 'https://chatbot-api.yama5993.workers.dev/error-logs';
    var p = window.location.pathname;
    var lang = p.includes('/en/') ? 'en' : p.includes('/ja/') ? 'ja'
             : p.includes('/es/') ? 'es' : p.includes('/fr/') ? 'fr'
             : p.includes('/de/') ? 'de' : 'ko';
    var APP_ID = lang === 'ko' ? 'nevergrad' : 'nevergrad-' + lang;
    var _lastError = '';
    var _errorCount = 0;

    function _getContext() {
        try {
            var parts = [];
            var g = window.__game;
            if (g) {
                if (g.stateManager?.currentDay) parts.push('day:' + g.stateManager.currentDay);
                if (g.stateManager?.currentScene) parts.push('scene:' + g.stateManager.currentScene);
                if (g.dialogueSystem?.isActive) parts.push('dialogue:active');
            }
            parts.push('vw:' + window.innerWidth + 'x' + window.innerHeight);
            return parts.join(' | ');
        } catch (_) { return ''; }
    }

    function _sendError(message, stack, url) {
        var key = message + (url || '');
        if (key === _lastError) { _errorCount++; if (_errorCount > 3) return; }
        else { _lastError = key; _errorCount = 1; }

        var context = _getContext();
        try {
            navigator.sendBeacon(ERROR_ENDPOINT, JSON.stringify({
                appId: APP_ID, userId: '',
                message: (message || '').substring(0, 500),
                stack: (context ? '[ctx] ' + context + '\n' : '') + (stack || '').substring(0, 1900),
                url: (url || '').substring(0, 500)
            }));
        } catch (_) {}
    }

    window.addEventListener('error', function(e) {
        _sendError(e.message, e.error?.stack || '', e.filename + ':' + e.lineno + ':' + e.colno);
    });

    window.addEventListener('unhandledrejection', function(e) {
        var reason = e.reason;
        var message = reason?.message || String(reason || 'Unhandled rejection');
        _sendError(message, reason?.stack || '', location.href);
    });
})();
