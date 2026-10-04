/* ArcherLab environment guard (kept identical across harem / cupid / nevergrad / games).
 * Feature-detection first; the UA is only a hint. Every step is wrapped so the guard can never throw.
 *  1. Web Storage shim: replaces localStorage/sessionStorage with an in-memory Storage only when
 *     the real one is missing, throws on access, or silently drops writes (Samsung/iOS in-app WebViews).
 *  2. Canvas getImageData: returns a blank ImageData instead of throwing InvalidStateError/IndexSizeError.
 *  3. Audio: AudioContext.resume() rejections ("Failed to start the audio device") are swallowed and
 *     retried on the next user gesture; related unhandled rejections are marked handled.
 */
(function (root) {
    'use strict';
    if (!root || root.__archerEnvGuard) return;
    var guard = root.__archerEnvGuard = { version: '1.0.0', memoryStorage: {}, env: {} };

    function attempt(fn, fallback) {
        try { return fn(); } catch (e) { return fallback; }
    }

    /* ---- environment hints (auxiliary only) ---- */
    var ua = attempt(function () { return String(root.navigator.userAgent || ''); }, '');
    var inApp = '';
    var inAppRules = [
        ['kakao', /KAKAOTALK/i], ['naver', /NAVER\(|NaverApp/i], ['instagram', /Instagram/i],
        ['facebook', /FBAN|FBAV|FB_IAB|FB4A|FBIOS/i], ['line', /\bLine\//i], ['band', /\bBAND[\/; ]/i],
        ['twitter', /Twitter/i], ['tiktok', /TikTok|musical_ly|BytedanceWebview|trill_/i], ['daum', /DaumApps/i]
    ];
    for (var r = 0; r < inAppRules.length; r++) {
        if (inAppRules[r][1].test(ua)) { inApp = inAppRules[r][0]; break; }
    }
    var isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && attempt(function () { return root.navigator.maxTouchPoints > 1; }, false));
    var isAndroid = /Android/i.test(ua);
    var isSamsung = /SamsungBrowser/i.test(ua);
    var isWebView = (isAndroid && /;\s*wv\)|\bVersion\/[\d.]+ Chrome\/[\d.]+ Mobile/i.test(ua) && !isSamsung) ||
        (isIOS && !/Safari\//i.test(ua));
    guard.env = { inApp: inApp, ios: isIOS, android: isAndroid, samsung: isSamsung, webview: !!(isWebView || inApp) };
    var strictProbe = !!(inApp || isWebView || isSamsung);

    /* ---- 1. Web Storage shim ---- */
    function createMemoryStorage() {
        var data = Object.create(null);
        var api = {
            getItem: function (key) { key = String(key); return key in data ? data[key] : null; },
            setItem: function (key, value) { data[String(key)] = String(value); },
            removeItem: function (key) { delete data[String(key)]; },
            clear: function () { data = Object.create(null); },
            key: function (index) { var keys = Object.keys(data); return index >= 0 && index < keys.length ? keys[index] : null; }
        };
        var proto = (root.Storage && root.Storage.prototype) ? Object.create(root.Storage.prototype) : {};
        Object.keys(api).forEach(function (name) {
            Object.defineProperty(proto, name, { value: api[name], writable: true, configurable: true, enumerable: false });
        });
        Object.defineProperty(proto, 'length', { get: function () { return Object.keys(data).length; }, configurable: true });
        if (typeof root.Proxy === 'function') {
            return new root.Proxy(proto, {
                get: function (target, prop) {
                    if (typeof prop === 'string' && prop !== 'length' && !(prop in proto) && prop in data) return data[prop];
                    return target[prop];
                },
                set: function (target, prop, value) { if (typeof prop === 'string') data[prop] = String(value); return true; },
                has: function (target, prop) { return (typeof prop === 'string' && prop in data) || prop in target; },
                deleteProperty: function (target, prop) { if (typeof prop === 'string') delete data[prop]; return true; },
                ownKeys: function () { return Object.keys(data); },
                getOwnPropertyDescriptor: function (target, prop) {
                    return typeof prop === 'string' && prop in data
                        ? { value: data[prop], writable: true, enumerable: true, configurable: true } : undefined;
                }
            });
        }
        return proto;
    }

    function storageIsUsable(name) {
        var store;
        try { store = root[name]; } catch (e) { return false; }
        if (!store || typeof store.getItem !== 'function' || typeof store.setItem !== 'function') return false;
        var probeKey = '__archer_env_probe__';
        try {
            store.setItem(probeKey, '1');
            var ok = store.getItem(probeKey) === '1';
            if (typeof store.removeItem === 'function') store.removeItem(probeKey);
            return ok;
        } catch (e) {
            var quota = e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014);
            if (quota && !strictProbe) {
                // Full storage in a normal browser: leave it to the app's own quota handling, but only if reads work.
                try { store.getItem(probeKey); return true; } catch (readError) { return false; }
            }
            return false;
        }
    }

    function installStorage(name) {
        if (storageIsUsable(name)) return;
        var memory = createMemoryStorage();
        var done = false;
        try {
            Object.defineProperty(root, name, { value: memory, configurable: true, writable: true, enumerable: true });
            done = root[name] === memory;
        } catch (e) { /* try the next strategy */ }
        if (!done) {
            try {
                var proto = root.Window && root.Window.prototype;
                if (proto) {
                    Object.defineProperty(proto, name, { get: function () { return memory; }, configurable: true });
                    done = attempt(function () { return root[name] === memory; }, false);
                }
            } catch (e) { /* give up silently */ }
        }
        if (!done) { try { root[name] = memory; done = root[name] === memory; } catch (e) { /* ignore */ } }
        guard.memoryStorage[name] = done;
    }
    attempt(function () { installStorage('localStorage'); });
    attempt(function () { installStorage('sessionStorage'); });

    /* ---- 2. Canvas getImageData ---- */
    function isCanvasStateError(e) {
        var name = e && e.name;
        return name === 'InvalidStateError' || name === 'IndexSizeError' ||
            (e && /getImageData|source width|source height|The source (width|height)/i.test(String(e.message || '')) && name !== 'SecurityError');
    }
    function patchGetImageData(Ctor) {
        var proto = Ctor && Ctor.prototype;
        var original = proto && proto.getImageData;
        if (typeof original !== 'function' || original.__archerGuarded) return;
        var guarded = function getImageData(sx, sy, sw, sh) {
            try {
                return original.apply(this, arguments);
            } catch (e) {
                if (!isCanvasStateError(e)) throw e;
                var w = Math.max(1, Math.abs(Math.floor(Number(sw)) || 1));
                var h = Math.max(1, Math.abs(Math.floor(Number(sh)) || 1));
                try { return new root.ImageData(w, h); } catch (e1) { /* fall through */ }
                try { return this.createImageData(w, h); } catch (e2) { /* fall through */ }
                throw e;
            }
        };
        guarded.__archerGuarded = true;
        try { Object.defineProperty(proto, 'getImageData', { value: guarded, writable: true, configurable: true }); } catch (e) { /* ignore */ }
    }
    attempt(function () { patchGetImageData(root.CanvasRenderingContext2D); });
    attempt(function () { patchGetImageData(root.OffscreenCanvasRenderingContext2D); });

    /* ---- 3. Audio ---- */
    var pendingAudio = [];
    var gestureBound = false;
    var GESTURES = ['pointerdown', 'touchend', 'mousedown', 'keydown', 'click'];
    function retryAudioOnGesture(ctx) {
        if (pendingAudio.indexOf(ctx) < 0) pendingAudio.push(ctx);
        if (gestureBound || !root.document) return;
        gestureBound = true;
        var handler = function () {
            var list = pendingAudio.slice();
            pendingAudio.length = 0;
            list.forEach(function (c) {
                attempt(function () {
                    if (c && c.state !== 'running' && c.state !== 'closed') {
                        var p = c.resume();
                        if (p && typeof p.catch === 'function') p.catch(function () {});
                    }
                });
            });
            if (!pendingAudio.length) {
                GESTURES.forEach(function (type) { attempt(function () { root.document.removeEventListener(type, handler, true); }); });
                gestureBound = false;
            }
        };
        GESTURES.forEach(function (type) {
            attempt(function () { root.document.addEventListener(type, handler, { capture: true, passive: true }); });
        });
    }
    function patchAudioResume(Ctor) {
        var proto = Ctor && Ctor.prototype;
        var original = proto && proto.resume;
        if (typeof original !== 'function' || original.__archerGuarded) return;
        var guarded = function resume() {
            var ctx = this;
            var result;
            try { result = original.apply(ctx, arguments); } catch (e) { retryAudioOnGesture(ctx); return Promise.resolve(); }
            if (result && typeof result.then === 'function') {
                return result.then(function (value) { return value; }, function () { retryAudioOnGesture(ctx); });
            }
            return result;
        };
        guarded.__archerGuarded = true;
        try { Object.defineProperty(proto, 'resume', { value: guarded, writable: true, configurable: true }); } catch (e) { /* ignore */ }
    }
    attempt(function () { patchAudioResume(root.AudioContext); });
    attempt(function () { if (root.webkitAudioContext !== root.AudioContext) patchAudioResume(root.webkitAudioContext); });

    // Safety net: environment-only rejections never surface as uncaught errors.
    function isEnvAudioIssue(reason) {
        var text = String((reason && (reason.message || reason.name)) || reason || '');
        return /Failed to start the audio device|audio device|AudioContext was not allowed to start|The play\(\) request was interrupted|play\(\) failed because the user didn't interact|NotAllowedError/i.test(text);
    }
    attempt(function () {
        root.addEventListener('unhandledrejection', function (event) {
            attempt(function () { if (event && isEnvAudioIssue(event.reason)) event.preventDefault(); });
        });
    });
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : null));

(function () {
    'use strict';

    if (window.__nevergradErrorReporterInstalled) return;

    var VERSION = '20261005-env-guard';
    var ERROR_ENDPOINT = 'https://chatbot-api.yama5993.workers.dev/error-logs';
    var QUEUE_KEY = 'nevergrad-error-queue-v2';
    var SESSION_KEY = 'nevergrad-error-session-v2';
    var MAX_QUEUE_SIZE = 100;
    var RETRY_DELAY_MS = 15000;
    var pagePath = window.location.pathname || '/';
    var queue = readQueue();
    var flushing = false;
    var retryTimer = null;

    function randomId() {
        try {
            if (window.crypto && typeof window.crypto.randomUUID === 'function') {
                return window.crypto.randomUUID();
            }
        } catch (_) { /* fall through */ }
        return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
    }

    function getSessionId() {
        try {
            var saved = window.sessionStorage.getItem(SESSION_KEY);
            if (saved) return saved;
            var created = randomId().slice(0, 64);
            window.sessionStorage.setItem(SESSION_KEY, created);
            return created;
        } catch (_) {
            return randomId().slice(0, 64);
        }
    }

    function detectLanguage() {
        var htmlLang = '';
        try { htmlLang = String(document.documentElement.lang || '').toLowerCase().split('-')[0]; }
        catch (_) { /* ignore */ }
        if (/^(en|ja|es|fr|de|pt|zh)$/.test(htmlLang)) return htmlLang;
        var pathMatch = pagePath.match(/\/(en|ja|es|fr|de|pt|zh)(?:\/|$)/i);
        return pathMatch ? pathMatch[1].toLowerCase() : 'ko';
    }

    var sessionId = getSessionId();
    var language = detectLanguage();
    var appId = language === 'ko' ? 'nevergrad' : 'nevergrad-' + language;

    function readQueue() {
        try {
            var parsed = JSON.parse(window.localStorage.getItem(QUEUE_KEY) || '[]');
            return Array.isArray(parsed) ? parsed.slice(-MAX_QUEUE_SIZE) : [];
        } catch (_) {
            return [];
        }
    }

    function persistQueue() {
        try { window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue)); }
        catch (_) { /* memory queue remains available for this page */ }
    }

    function safeString(value) {
        if (typeof value === 'string') return value;
        if (value instanceof Error) return value.message || String(value);
        try {
            if (value && typeof value === 'object') return JSON.stringify(value);
        } catch (_) { /* fall through */ }
        try { return String(value); }
        catch (_) { return '[unserializable value]'; }
    }

    function getGameContext() {
        var context = {
            reporterVersion: VERSION,
            path: pagePath,
            language: language,
            online: navigator.onLine,
            visibility: document.visibilityState || '',
            viewport: window.innerWidth + 'x' + window.innerHeight,
            referrer: document.referrer || 'direct',
            occurredAt: new Date().toISOString()
        };
        try {
            var game = window.__game;
            var state = game && (game.state || game.stateManager);
            var dialogue = game && (game.dialogue || game.dialogueSystem);
            if (state && state.currentDay) context.day = state.currentDay;
            if (state && state.currentScene) context.scene = state.currentScene;
            if (dialogue && dialogue.isActive) context.dialogueActive = true;
        } catch (_) { /* context is best-effort */ }
        return context;
    }

    function classifyError(message, stack, source, type) {
        var text = [message, stack, source].filter(Boolean).join('\n');
        if (/chrome-extension:|moz-extension:|safari-web-extension:|webkit-masked-url:\/\/hidden/i.test(text)) {
            return 'external';
        }
        if (/googletagmanager|google-analytics|gtag\/js|cdn\.jsdelivr\.net/i.test(text)) {
            return 'external';
        }
        if (type === 'ResourceError' || /Loading chunk|dynamically imported module|Failed to fetch/i.test(message)) {
            return 'network';
        }
        if (type === 'SecurityPolicyViolation') return 'security';
        return 'app';
    }

    function sourceFromStack(stack) {
        var lines = String(stack || '').split('\n');
        for (var i = 0; i < lines.length; i++) {
            if (/error-reporter\.js/i.test(lines[i])) continue;
            var match = lines[i].match(/https?:\/\/[^\s)]+/);
            if (match) return match[0];
        }
        return window.location.href;
    }

    function isSameOriginGameStylesheet(resource, target) {
        if (!target || typeof target.getAttribute !== 'function'
            || !/\bstylesheet\b/i.test(String(target.rel || target.getAttribute('rel') || ''))) return false;
        try {
            var parsed = new URL(resource, window.location.href);
            return parsed.origin === window.location.origin
                && /^\/assets\/css\/.+\.css$/i.test(parsed.pathname);
        } catch (_) {
            return false;
        }
    }

    function isIgnorableResourceFailure(tagName, resource, target) {
        if (tagName === 'LINK' && isSameOriginGameStylesheet(resource, target)
            && (navigator.onLine === false || document.visibilityState === 'hidden')) {
            return true;
        }
        if (tagName !== 'SCRIPT') return false;
        if (/^https:\/\/www\.googletagmanager\.com\/gtag\/js(?:[?#]|$)/i.test(String(resource || ''))) {
            return true;
        }
        return target && typeof target.getAttribute === 'function'
            && target.getAttribute('data-nevergrad-recoverable-dependency') === 'LifecycleManager';
    }

    function tryRecoverStylesheetResource(resource, target) {
        if (!isSameOriginGameStylesheet(resource, target)
            || navigator.onLine === false || document.visibilityState === 'hidden'
            || typeof target.setAttribute !== 'function') return false;

        var attempt = Number(target.getAttribute('data-nevergrad-stylesheet-retry')) || 0;
        if (attempt >= 2) return false;
        target.setAttribute('data-nevergrad-stylesheet-retry', String(attempt + 1));

        try {
            var retryUrl = new URL(resource, window.location.href);
            retryUrl.searchParams.set('_resource_retry', String(Date.now()));
            window.setTimeout(function () {
                if (target && target.isConnected !== false) target.href = retryUrl.href;
            }, attempt === 0 ? 500 : 1000);
            return true;
        } catch (_) {
            return false;
        }
    }

    function enqueue(payload) {
        var id = randomId();
        payload.extra = payload.extra || {};
        payload.extra.eventId = id;
        queue.push({ id: id, payload: payload });
        if (queue.length > MAX_QUEUE_SIZE) queue.splice(0, queue.length - MAX_QUEUE_SIZE);
        persistQueue();
        flushQueue();
    }

    function report(type, message, stack, source, extra) {
        try {
            var normalizedMessage = safeString(message || 'Unknown script error');
            var normalizedStack = safeString(stack || '');
            var normalizedSource = safeString(source || window.location.href);
            var errorClass = classifyError(normalizedMessage, normalizedStack, normalizedSource, type);
            enqueue({
                appId: appId,
                userId: '',
                message: ('[' + errorClass + ':' + type + '] ' + normalizedMessage).slice(0, 500),
                stack: normalizedStack.slice(0, 4000),
                url: window.location.href.slice(0, 500),
                source: normalizedSource.slice(0, 500),
                errorType: String(type || 'Error').slice(0, 100),
                errorClass: errorClass,
                sessionId: sessionId,
                context: getGameContext(),
                extra: extra || {}
            });
        } catch (_) { /* the reporter must never break the game */ }
    }

    function removeQueuedEvent(id) {
        for (var i = 0; i < queue.length; i++) {
            if (queue[i].id === id) {
                queue.splice(i, 1);
                persistQueue();
                return;
            }
        }
    }

    function scheduleRetry() {
        if (retryTimer) return;
        retryTimer = window.setTimeout(function () {
            retryTimer = null;
            flushQueue();
        }, RETRY_DELAY_MS);
    }

    function flushQueue() {
        if (flushing || !queue.length) return;
        if (navigator.onLine === false) {
            scheduleRetry();
            return;
        }
        if (typeof window.fetch !== 'function') {
            flushWithBeacon();
            return;
        }

        flushing = true;
        var current = queue[0];
        window.fetch(ERROR_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
            body: JSON.stringify(current.payload),
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-store',
            keepalive: true
        }).then(function (response) {
            if (!response.ok) throw new Error('Error log endpoint returned ' + response.status);
            removeQueuedEvent(current.id);
            flushing = false;
            if (queue.length) window.setTimeout(flushQueue, 0);
        }).catch(function () {
            flushing = false;
            scheduleRetry();
        });
    }

    function flushWithBeacon() {
        if (!queue.length || navigator.onLine === false || typeof navigator.sendBeacon !== 'function') return;
        var acceptedIds = [];
        for (var i = 0; i < queue.length; i++) {
            try {
                if (navigator.sendBeacon(ERROR_ENDPOINT, JSON.stringify(queue[i].payload))) {
                    acceptedIds.push(queue[i].id);
                }
            } catch (_) { /* leave the item queued */ }
        }
        if (!acceptedIds.length) return;
        queue = queue.filter(function (item) { return acceptedIds.indexOf(item.id) === -1; });
        persistQueue();
    }

    function handleWindowError(event) {
        var target = event.target || event.srcElement;
        if (target && target !== window && target !== document) {
            var tagName = String(target.tagName || '').toUpperCase();
            if (tagName !== 'SCRIPT' && tagName !== 'LINK') return;
            var resource = target.src || target.href || '';
            if (isIgnorableResourceFailure(tagName, resource, target)) return;
            if (tagName === 'LINK' && tryRecoverStylesheetResource(resource, target)) return;
            report(
                'ResourceError',
                'Failed to load resource: ' + (tagName || 'UNKNOWN'),
                '',
                resource || window.location.href,
                {
                    tagName: tagName,
                    rel: target.rel || '',
                    retryAttempts: Number(target.getAttribute && target.getAttribute('data-nevergrad-stylesheet-retry')) || 0
                }
            );
            return;
        }

        var error = event.error;
        report(
            (error && error.name) || 'Error',
            event.message || (error && error.message) || 'Script error.',
            (error && error.stack) || '',
            event.filename || window.location.href,
            { line: event.lineno || 0, column: event.colno || 0 }
        );
    }

    function handleUnhandledRejection(event) {
        var reason = event.reason;
        report(
            'UnhandledRejection',
            (reason && reason.message) || safeString(reason || 'Unhandled rejection'),
            (reason && reason.stack) || '',
            window.location.href,
            { reasonType: (reason && reason.name) || typeof reason }
        );
    }

    window.addEventListener('error', handleWindowError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    document.addEventListener('securitypolicyviolation', function (event) {
        report(
            'SecurityPolicyViolation',
            'Blocked by CSP: ' + (event.violatedDirective || event.effectiveDirective || 'unknown directive'),
            '',
            event.blockedURI || window.location.href,
            { disposition: event.disposition || '', originalPolicy: event.originalPolicy || '' }
        );
    });

    if (window.console && typeof window.console.error === 'function') {
        var originalConsoleError = window.console.error;
        window.console.error = function () {
            originalConsoleError.apply(window.console, arguments);
            try {
                var args = Array.prototype.slice.call(arguments);
                var errorArg = null;
                for (var i = 0; i < args.length; i++) {
                    if (args[i] instanceof Error) { errorArg = args[i]; break; }
                }
                var stack = errorArg && errorArg.stack ? errorArg.stack : new Error('console.error').stack;
                report(
                    (errorArg && errorArg.name) || 'ConsoleError',
                    args.map(safeString).join(' '),
                    stack || '',
                    sourceFromStack(stack)
                );
            } catch (_) { /* preserve console behavior */ }
        };
    }

    window.__nevergradReportError = function (type, message, stack, source, extra) {
        report(type || 'ManualReport', message, stack, source, extra);
    };
    window.__nevergradFlushErrors = flushQueue;
    window.__nevergradErrorReporterVersion = VERSION;
    window.__nevergradErrorReporterInstalled = true;

    window.addEventListener('online', flushQueue);
    window.addEventListener('pagehide', flushWithBeacon);
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') flushWithBeacon();
        else flushQueue();
    });

    window.setTimeout(flushQueue, 0);
})();
