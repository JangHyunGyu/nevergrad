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
 * 바이노럴 모드 토스트 — save-toast 스타일 재사용, 하단 표시
 * 이어폰 연결 시 1회만 노출되어 "왼쪽 귀 속삭임 연출이 있다"는 걸 알림
 */
function showBinauralToast(message) {
    // 기존 토스트 있으면 제거
    const existing = document.getElementById('binaural-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'binaural-toast';
    toast.className = 'save-toast binaural-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('save-toast-visible'));
    setTimeout(() => {
        toast.classList.remove('save-toast-visible');
        toast.classList.add('save-toast-hiding');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

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

    // 타이틀 스테이지 (배경 + 3 캐릭터) — data-src를 파일 존재 확인 후 주입
    // 미생성 에셋(title_cherry_tree.png, sea_stare.png)은 skip
    document.querySelectorAll('#title-stage img[data-src]').forEach(el => {
        const src = el.dataset.src;
        if (!src) return;
        const probe = new Image();
        probe.onload = () => { el.src = src; };
        probe.onerror = () => { el.style.display = 'none'; };
        probe.src = new URL(src, document.baseURI).href;
    });

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
    // - 초기 연결 상태 + devicechange 이벤트로 동적 대응
    // - 최초 활성화 시 "🎧 바이노럴 모드" 토스트 한 번 노출 (i18n 로드 후)
    let __binauralToastShown = false;
    const syncBinaural = async () => {
        const isStereo = await game.audio.detectStereoOutput();
        const wasActive = game.audio.isBinauralActive?.();
        if (isStereo && !wasActive) {
            game.audio.enableBinauralMode();
            if (!__binauralToastShown && game.i18n) {
                __binauralToastShown = true;
                const msg = game.i18n.getUI('binauralActivated') || '\uD83C\uDFA7 바이노럴 모드';
                showBinauralToast(msg);
            }
        } else if (!isStereo && wasActive) {
            game.audio.disableBinauralMode();
        }
    };
    if (navigator.mediaDevices?.addEventListener) {
        navigator.mediaDevices.addEventListener('devicechange', syncBinaural);
    }
    // 최초 동기화는 game.init() 이후(아래)에서 수행

    // AI 프리토킹 시스템 초기화
    game.freeTalk = new FreeTalkSystem(game);

    // 갤러리 시스템 초기화
    game.gallery = new GallerySystem(game);

    // 엔진 초기화 (i18n 로드, UI 바인딩)
    await game.init();

    // 전역 노출 — 개발자 도구/테스트 접근용
    window.game = game;

    // 갤러리 이벤트 바인딩 (init 후 — UI locale이 적용된 후)
    game.gallery.bind();

    // 바이노럴 초기 동기화 (i18n 로드 후여야 토스트 메시지 번역 적용됨)
    syncBinaural();

    // 앱 아이콘(favicon) 동적 변이 (SCENARIO.md 5420-5423)
    // 세이브 메타 + 현재 상태를 읽어 현재 상황에 맞는 favicon 적용
    game.favicon = new FaviconManager();
    game.favicon.sync({
        saveMeta: game.save?.getMeta?.(),
        state: game.state
    });

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
    var _session = Math.random().toString(36).substring(2, 8);

    function _getContext() {
        try {
            var parts = ['sess:' + _session];
            parts.push('path:' + p);
            parts.push('online:' + navigator.onLine);
            var g = window.__game;
            if (g) {
                if (g.stateManager?.currentDay) parts.push('day:' + g.stateManager.currentDay);
                if (g.stateManager?.currentScene) parts.push('scene:' + g.stateManager.currentScene);
                if (g.dialogueSystem?.isActive) parts.push('dialogue:active');
            }
            parts.push('vw:' + window.innerWidth + 'x' + window.innerHeight);
            return parts.join(' | ');
        } catch (_) { return 'ctx-error'; }
    }

    function _classifyError(msg, stack, src) {
        if (!msg) return 'noise';
        if (msg === 'Script error.' && !stack) return 'noise';
        if (/Can't find variable: (gmo|__gCrWeb|ytcfg|__)/.test(msg)) return 'noise';
        if (/ResizeObserver loop/.test(msg)) return 'noise';
        // External scripts
        if (src && /googletagmanager|google-analytics|gtag\/js|cloudflare|chrome-extension|moz-extension|safari-extension/.test(src)) return 'external';
        if (src && /^undefined:/.test(src) && !(stack || '').match(/\/(assets|js|modules)\//)) return 'external';
        if (/Loading chunk|dynamically imported module/.test(msg)) return 'network';
        return 'app';
    }

    function _sendError(type, msg, stack, src) {
        var errClass = _classifyError(msg, stack, src);
        if (!msg) return;
        var key = msg + '|' + src;
        if (key === _lastError) { _errorCount++; if (_errorCount > 5) return; }
        else { _lastError = key; _errorCount = 1; }

        var ctx = _getContext();
        var payload = {
            appId: APP_ID, userId: '',
            message: ('[' + errClass + ':' + type + '] ' + (msg || '')).substring(0, 500),
            stack: (
                '[ctx] ' + ctx +
                '\n[src] ' + (src || 'N/A') +
                '\n[ua] ' + navigator.userAgent.substring(0, 150) +
                '\n[ref] ' + (document.referrer || 'direct') +
                '\n[time] ' + new Date().toISOString() +
                '\n[trace]\n' + (stack || 'no stack')
            ).substring(0, 2000),
            url: (src || window.location.href).substring(0, 500)
        };

        try { navigator.sendBeacon(ERROR_ENDPOINT, JSON.stringify(payload)); } catch (_) {}
    }

    window.addEventListener('error', function(e) {
        var src = (e.filename || '') + ':' + e.lineno + ':' + e.colno;
        _sendError(e.error?.name || 'Error', e.message, e.error?.stack || '', src);
    });

    window.addEventListener('unhandledrejection', function(e) {
        var reason = e.reason;
        var msg = reason?.message || String(reason || 'Unhandled rejection');
        _sendError('UnhandledRejection', msg, reason?.stack || '', window.location.href);
    });
})();

// SPA 참여시간 보정: 60초마다 engagement 이벤트 전송
(function() {
    var startTime = Date.now();
    setInterval(function() {
        if (document.visibilityState === 'visible') {
            gtag('event', 'spa_engagement', {
                engagement_time_msec: 60000,
                elapsed_seconds: Math.round((Date.now() - startTime) / 1000)
            });
        }
    }, 60000);
})();

// SPA 가상 페이지뷰 전송
window.sendGAPageView = function(pageName) {
    if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
            page_title: document.title + ' - ' + pageName,
            page_location: window.location.href + '#' + pageName
        });
    }
};
