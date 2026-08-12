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
    if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        return false;
    }
    if (navigator.userActivation && !navigator.userActivation.isActive) {
        return false;
    }

    // Fullscreen API (Chrome, Firefox, Edge, Samsung Internet 등)
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
        return true;
    } else if (elem.webkitRequestFullscreen) {
        // Safari desktop / older WebKit
        try {
            elem.webkitRequestFullscreen();
            return true;
        } catch (_) {
            return false;
        }
    } else if (elem.msRequestFullscreen) {
        // IE11 / Edge Legacy
        try {
            elem.msRequestFullscreen();
            return true;
        } catch (_) {
            return false;
        }
    }
    // iOS Safari: Fullscreen API 미지원 — PWA standalone + viewport meta로 대응
    return false;
}

/**
 * 이미지 프리로더 — CONFIG.EXPRESSIONS + CONFIG.BACKGROUNDS에서 고유 경로 수집 후 프리로드
 * @param {function(number, number)} onProgress - (loaded, total) 콜백
 * @returns {Promise<void>}
 */
/* Title screen asset helpers. */
function getNevergradAssetPath(path) {
    if (!path) return '';
    const normalized = String(path).replace(/^\.\//, '');
    if (/^(?:https?:|data:|blob:|\/)/.test(normalized) || normalized.startsWith('../')) {
        return normalized;
    }
    return (window.__NEVERGRAD_LANG__ ? '../' : '') + normalized;
}

function resolveNevergradAssetUrl(path) {
    return new URL(getNevergradAssetPath(path), document.baseURI).href;
}

function getPreferredImageCandidates(path) {
    if (!path) return [];

    const raw = String(path);
    const match = raw.match(/^([^?#]+)([?#].*)?$/);
    const pathPart = match ? match[1] : raw;
    const suffix = match?.[2] || '';

    if (!/^(?:\.\.\/)?assets\/images\/(?:background|characters)\/.+\.(?:png|webp)$/i.test(pathPart)) {
        return [raw];
    }

    if (/\.webp$/i.test(pathPart)) {
        return [
            `${pathPart}${suffix}`,
            `${pathPart.replace(/\.webp$/i, '.png')}${suffix}`
        ];
    }

    return [
        `${pathPart.replace(/\.png$/i, '.webp')}${suffix}`,
        raw
    ];
}

function loadNevergradImage(path) {
    const candidates = getPreferredImageCandidates(path).filter(Boolean);

    return new Promise((resolve, reject) => {
        const loadAt = (index) => {
            const candidate = candidates[index];
            if (!candidate) {
                reject();
                return;
            }
            const img = new Image();
            img.onload = () => resolve(candidate);
            img.onerror = () => loadAt(index + 1);
            img.src = resolveNevergradAssetUrl(candidate);
        };

        loadAt(0);
    });
}

function clampNumber(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function playTitleIntro() {
    const stage = document.getElementById('title-stage');
    const titleScreen = document.getElementById('title-screen');
    if (!stage) return;
    if (window.NevergradMotion?.titleIntro?.(stage, titleScreen)) return;

    window.clearTimeout(window.__nevergradTitleMenuTimer);
    titleScreen?.classList.remove('title-intro-complete');

    stage.classList.add('title-intro-reset');
    stage.classList.remove('title-intro-active');
    void stage.offsetWidth;

    requestAnimationFrame(() => {
        stage.classList.remove('title-intro-reset');
        stage.classList.add('title-intro-active');
    });

    window.__nevergradTitleMenuTimer = window.setTimeout(() => {
        titleScreen?.classList.add('title-intro-complete');
    }, 2500);
}

window.playNevergradTitleIntro = playTitleIntro;

function initializeTitleLineup() {
    const stage = document.getElementById('title-stage');
    if (!stage) return;

    const characters = [
        { id: 'title-char-seolhwa', name: 'seolhwa', src: 'assets/images/characters/seolhwa_quiet.webp' },
        { id: 'title-char-yuna', name: 'yuna', src: 'assets/images/characters/yuna_normal.webp' },
        { id: 'title-char-eunsu', name: 'eunsu', src: 'assets/images/characters/eunsu_normal.webp' },
        { id: 'title-char-sea', name: 'sea', src: 'assets/images/characters/sea_normal.webp', ngp: 'assets/images/characters/sea_stare.webp' },
        { id: 'title-char-riin', name: 'riin', src: 'assets/images/characters/riin_smile.webp' }
    ];
    const introOrder = { eunsu: 0, yuna: 1, sea: 2, seolhwa: 3, riin: 4 };
    const introBaseDelay = 520;
    const introStepDelay = 220;

    let lineup = stage.querySelector('.title-character-lineup');
    if (!lineup) {
        lineup = document.createElement('div');
        lineup.className = 'title-character-lineup';
        stage.appendChild(lineup);
    }

    characters.forEach((char, index) => {
        const img = document.getElementById(char.id) || document.createElement('img');
        img.id = char.id;
        img.className = `title-char title-char-lineup title-char-${char.name}`;
        img.alt = '';
        img.decoding = 'async';
        img.fetchPriority = char.name === 'eunsu' ? 'high' : 'auto';
        img.dataset.titleCharacter = char.name;
        img.dataset.src = getNevergradAssetPath(char.src);
        img.dataset.default = getNevergradAssetPath(char.src);
        if (char.ngp) img.dataset.ngp = getNevergradAssetPath(char.ngp);
        const order = introOrder[char.name] ?? index;
        img.dataset.titleIntroOrder = String(order + 1);
        img.style.setProperty('--title-intro-delay', `${introBaseDelay + order * introStepDelay}ms`);
        lineup.appendChild(img);
    });

    layoutTitleLineup();
    playTitleIntro();

    if (!window.__nevergradTitleLineupResizeBound) {
        window.__nevergradTitleLineupResizeBound = true;
        let frame = 0;
        window.addEventListener('resize', () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(layoutTitleLineup);
        });
        window.addEventListener('orientationchange', () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(layoutTitleLineup);
        });
    }
}

function layoutTitleLineup() {
    const stage = document.getElementById('title-stage');
    if (!stage) return;

    const sprites = Array.from(stage.querySelectorAll('.title-char-lineup'));
    if (!sprites.length) return;

    const viewportW = Math.max(window.innerWidth || document.documentElement.clientWidth || 1280, 320);
    const viewportH = Math.max(window.innerHeight || document.documentElement.clientHeight || 720, 320);
    const aspect = viewportW / viewportH;
    let xs;
    let scales;
    let bottoms;
    let height;

    if (aspect >= 1.55) {
        xs = [13, 31, 50, 69, 87];
        scales = [0.82, 0.93, 1.04, 0.94, 0.84];
        bottoms = [-18, -10, -24, -10, -18];
        height = clampNumber(viewportH * 0.86, 300, 760);
    } else if (aspect >= 1) {
        xs = [10, 30, 50, 70, 90];
        scales = [0.72, 0.83, 0.96, 0.84, 0.73];
        bottoms = [-10, -4, -18, -4, -10];
        height = clampNumber(viewportH * 0.78, 300, 640);
    } else if (viewportW <= 430) {
        xs = [9, 29, 50, 71, 91];
        scales = [0.54, 0.63, 0.74, 0.64, 0.55];
        bottoms = [viewportH * 0.11, viewportH * 0.05, -viewportH * 0.01, viewportH * 0.05, viewportH * 0.11];
        height = clampNumber(viewportH * 0.62, 320, 540);
    } else {
        xs = [8, 29, 50, 71, 92];
        scales = [0.6, 0.7, 0.82, 0.71, 0.61];
        bottoms = [viewportH * 0.08, viewportH * 0.03, -viewportH * 0.02, viewportH * 0.03, viewportH * 0.08];
        height = clampNumber(viewportH * 0.66, 390, 610);
    }

    sprites.forEach((sprite, index) => {
        const character = sprite.dataset.titleCharacter;
        const depth = { seolhwa: 11, riin: 12, yuna: 14, sea: 15, eunsu: 16 };
        sprite.style.setProperty('--title-x', `${xs[index] ?? 50}%`);
        sprite.style.setProperty('--title-scale', String(scales[index] ?? 0.75));
        sprite.style.setProperty('--title-bottom', `${bottoms[index] ?? 0}px`);
        sprite.style.setProperty('--title-height', `${height}px`);
        sprite.style.setProperty('--title-z', String(depth[character] ?? 10 + index));
    });
}

/**
 * @param {function(number, number)} onProgress
 * @param {string} sceneId - scene to preload from
 * @param {Set<string>} alreadyLoaded - cache of attempted asset paths
 * @returns {Promise<void>}
 */
function preloadGameImages(onProgress, sceneId, alreadyLoaded = new Set()) {
    // 고유 이미지 경로 수집
    const pathSet = new Set();

    const addCharacter = (key) => {
        if (!key || typeof key !== 'string') return;
        if (key.includes('/')) {
            pathSet.add(key);
            return;
        }
        const splitAt = key.indexOf('_');
        if (splitAt < 0) return;
        const charId = key.slice(0, splitAt);
        const expression = key.slice(splitAt + 1);
        const path = CONFIG.EXPRESSIONS?.[charId]?.[expression];
        if (path) pathSet.add(path);
    };

    const queue = sceneId ? [sceneId] : [];
    const visited = new Set();
    while (queue.length && visited.size < 18) {
        const id = queue.shift();
        if (!id || visited.has(id)) continue;
        visited.add(id);
        const day = Number((String(id).match(/^day(\d)/) || [])[1]);
        const scene = SCENARIO?.[day]?.[id];
        if (!scene) continue;

        if (scene.background) pathSet.add(CONFIG.BACKGROUNDS?.[scene.background] || scene.background);
        addCharacter(scene.character);
        Object.values(scene.characters || {}).forEach(addCharacter);

        [scene.next, scene.timeoutNext, scene.fallback].forEach(next => {
            if (next && !visited.has(next)) queue.push(next);
        });
        for (const group of [scene.choices, scene.branches, scene.affinityBranches]) {
            for (const item of group || []) {
                if (item?.next && !visited.has(item.next)) queue.push(item.next);
            }
        }
    }

    // Keep a deterministic fallback for silent scenes without image directives.
    if (pathSet.size === 0 && CONFIG.BACKGROUNDS?.classroom) {
        pathSet.add(CONFIG.BACKGROUNDS.classroom);
    }

    // Avoid replaying the loading screen for paths already attempted this session.
    const paths = [...pathSet].filter(path => !alreadyLoaded.has(path));
    const total = paths.length;
    let loaded = 0;

    if (total === 0) {
        onProgress?.(0, 0);
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        let cursor = 0;
        const worker = async () => {
            while (cursor < paths.length) {
                const src = paths[cursor++];
                try { await loadNevergradImage(src); } catch (_) { /* renderer retries on demand */ }
                alreadyLoaded.add(src);
                loaded++;
                onProgress?.(loaded, total);
            }
        };
        Promise.all(Array.from({ length: Math.min(6, total) }, worker)).then(resolve);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // 타이틀 배경 이미지 로드 체크 — 이미지 없으면 CSS 그라디언트 폴백
    const titleBgLayer = document.querySelector('.title-bg-layer');
    if (titleBgLayer) {
        loadNevergradImage('assets/images/background/title_bg.webp')
            .then((src) => {
                titleBgLayer.style.backgroundImage = `url('${resolveNevergradAssetUrl(src)}')`;
                titleBgLayer.classList.remove('no-image');
            })
            .catch(() => titleBgLayer.classList.add('no-image'));
    }

    initializeTitleLineup();

    // 타이틀 스테이지 (배경 + 3 캐릭터) — data-src를 파일 존재 확인 후 주입
    // 미생성 에셋(sea_stare.png)은 skip
    document.querySelectorAll('#title-stage img[data-src]:not(.title-stage-bg)').forEach(el => {
        const src = el.dataset.src;
        if (!src) return;
        loadNevergradImage(src)
            .then((resolvedSrc) => { el.src = resolveNevergradAssetUrl(resolvedSrc); })
            .catch(() => { el.style.display = 'none'; });
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
        game.lifecycle.listen(navigator.mediaDevices, 'devicechange', syncBinaural);
    }
    // 최초 동기화는 game.init() 이후(아래)에서 수행

    // 갤러리 시스템 초기화
    game.gallery = new GallerySystem(game);

    // 엔진 초기화 (i18n 로드, UI 바인딩)
    await game.init();

    // 전역 노출 — 개발자 도구/테스트 접근용
    window.game = game;
    game.lifecycle.listen(window, 'pagehide', (event) => {
        if (!event.persisted) game.dispose();
    }, { once: true });

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
    game._preloadImages = async function(afterScreen, sceneId) {
        game._preloadedImagePaths ||= new Set();
        // Reuse per-session asset attempts across new game and continue flows.
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
            if (bar) bar.style.width = `${total ? Math.round((loaded / total) * 100) : 100}%`;
            if (text) text.textContent = `${loaded} / ${total}`;
        }, sceneId, game._preloadedImagePaths);

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
    if (window.__nevergradErrorReporterInstalled) return;
    var ERROR_ENDPOINT = 'https://chatbot-api.yama5993.workers.dev/error-logs';
    var p = window.location.pathname;
    var lang = p.includes('/en/') ? 'en' : p.includes('/ja/') ? 'ja'
             : p.includes('/es/') ? 'es' : p.includes('/fr/') ? 'fr'
             : p.includes('/de/') ? 'de' : p.includes('/pt/') ? 'pt' : 'ko';
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
                var state = g.state || g.stateManager;
                var dialogue = g.dialogue || g.dialogueSystem;
                if (state?.currentDay) parts.push('day:' + state.currentDay);
                if (state?.currentScene) parts.push('scene:' + state.currentScene);
                if (dialogue?.isActive) parts.push('dialogue:active');
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
        // 인앱 브라우저(카톡/인스타/페북 등) 또는 보안 키패드가 inject한 코드
        if (/unSelectAll is not defined/.test(msg)) return 'noise';
        if (/<anonymous>:1:1/.test(stack || '')) return 'noise';
        // External scripts
        if (src && /googletagmanager|google-analytics|gtag\/js|cloudflare|chrome-extension|moz-extension|safari-extension/.test(src)) return 'external';
        if (src && /^undefined:/.test(src) && !(stack || '').match(/\/(assets|js|modules)\//)) return 'external';
        if (/Loading chunk|dynamically imported module/.test(msg)) return 'network';
        return 'app';
    }

    function _sendError(type, msg, stack, src) {
        var errClass = _classifyError(msg, stack, src);
        if (!msg) return;
        if (errClass === 'noise') return;
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

    // 외부 모듈에서 silently 실패한 케이스(예: 오디오 파일 로드 실패)를 D1으로 보고
    window.__nevergradReportError = function(type, msg, stack, src) {
        try { _sendError(type || 'ManualReport', String(msg || ''), String(stack || ''), src || window.location.href); }
        catch (_) {}
    };
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
