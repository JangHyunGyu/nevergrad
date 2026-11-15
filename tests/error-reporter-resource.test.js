const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const reporter = fs.readFileSync(path.join(__dirname, '../assets/js/error-reporter.js'), 'utf8');

test('same-origin stylesheets ignore teardown noise and retry visible failures twice', () => {
    const start = reporter.indexOf('function isSameOriginGameStylesheet(');
    const end = reporter.indexOf('function enqueue(', start);
    assert.ok(start >= 0 && end > start);

    const timers = [];
    const sandbox = {
        URL,
        Date: { now: () => 1234567890 },
        navigator: { onLine: true },
        document: { visibilityState: 'visible' },
        window: {
            location: {
                href: 'https://nevergrad.archerlab.dev/en/',
                origin: 'https://nevergrad.archerlab.dev'
            },
            setTimeout(callback, delay) { timers.push({ callback, delay }); }
        }
    };
    vm.runInNewContext(`
        ${reporter.slice(start, end)}
        this.isIgnorableResourceFailure = isIgnorableResourceFailure;
        this.tryRecoverStylesheetResource = tryRecoverStylesheetResource;
    `, sandbox);

    const attributes = new Map([['rel', 'stylesheet']]);
    const target = {
        rel: 'stylesheet',
        href: 'https://nevergrad.archerlab.dev/assets/css/dialogue.css',
        isConnected: true,
        getAttribute(name) { return attributes.get(name) || null; },
        setAttribute(name, value) { attributes.set(name, value); }
    };

    sandbox.document.visibilityState = 'hidden';
    assert.equal(sandbox.isIgnorableResourceFailure('LINK', target.href, target), true);
    sandbox.document.visibilityState = 'visible';
    sandbox.navigator.onLine = false;
    assert.equal(sandbox.isIgnorableResourceFailure('LINK', target.href, target), true);

    sandbox.navigator.onLine = true;
    assert.equal(sandbox.tryRecoverStylesheetResource(target.href, target), true);
    assert.equal(attributes.get('data-nevergrad-stylesheet-retry'), '1');
    assert.equal(timers[0].delay, 500);
    timers.shift().callback();
    assert.match(target.href, /_resource_retry=1234567890/);

    assert.equal(sandbox.tryRecoverStylesheetResource(target.href, target), true);
    assert.equal(attributes.get('data-nevergrad-stylesheet-retry'), '2');
    assert.equal(timers[0].delay, 1000);
    timers.shift().callback();
    assert.equal(sandbox.tryRecoverStylesheetResource(target.href, target), false);
    assert.equal(sandbox.tryRecoverStylesheetResource('https://cdn.example.com/dialogue.css', target), false);
});

test('LifecycleManager SCRIPT ResourceErrors retry-inject twice then stay ignorable', () => {
    const start = reporter.indexOf('function isSameOriginGameStylesheet(');
    const end = reporter.indexOf('function enqueue(', start);
    assert.ok(start >= 0 && end > start);

    const timers = [];
    const appended = [];
    const sandbox = {
        URL,
        Date: { now: () => 1234567890 },
        navigator: { onLine: true },
        document: {
            visibilityState: 'visible',
            createElement(tag) {
                const el = {
                    tagName: String(tag).toUpperCase(),
                    attrs: new Map(),
                    setAttribute(name, value) { this.attrs.set(name, value); },
                    getAttribute(name) { return this.attrs.get(name) || null; }
                };
                Object.defineProperty(el, 'src', {
                    get() { return this._src || ''; },
                    set(v) { this._src = v; }
                });
                return el;
            },
            head: {
                appendChild(node) { appended.push(node); }
            },
            documentElement: {
                appendChild(node) { appended.push(node); }
            }
        },
        window: {
            location: {
                href: 'https://nevergrad.archerlab.dev/',
                origin: 'https://nevergrad.archerlab.dev'
            },
            setTimeout(callback, delay) { timers.push({ callback, delay }); }
        },
        globalThis: {}
    };
    sandbox.globalThis = sandbox;
    vm.runInNewContext(`
        ${reporter.slice(start, end)}
        this.isIgnorableResourceFailure = isIgnorableResourceFailure;
        this.tryRecoverLifecycleManagerScript = tryRecoverLifecycleManagerScript;
    `, sandbox);

    const attributes = new Map([['data-nevergrad-recoverable-dependency', 'LifecycleManager']]);
    const target = {
        tagName: 'SCRIPT',
        src: 'https://nevergrad.archerlab.dev/assets/js/modules/LifecycleManager.js?v=20261105-lifecycle-ensure',
        isConnected: true,
        getAttribute(name) { return attributes.get(name) || null; },
        setAttribute(name, value) { attributes.set(name, value); }
    };

    assert.equal(
        sandbox.isIgnorableResourceFailure('SCRIPT', target.src, target),
        true
    );

    assert.equal(sandbox.tryRecoverLifecycleManagerScript(target.src, target), true);
    assert.equal(attributes.get('data-nevergrad-lifecycle-retry'), '1');
    assert.equal(timers[0].delay, 500);
    timers.shift().callback();
    assert.equal(appended.length, 1);
    assert.match(appended[0].src, /_resource_retry=1234567890/);
    assert.equal(appended[0].getAttribute('data-nevergrad-recoverable-dependency'), 'LifecycleManager');

    assert.equal(sandbox.tryRecoverLifecycleManagerScript(target.src, target), true);
    assert.equal(attributes.get('data-nevergrad-lifecycle-retry'), '2');
    assert.equal(timers[0].delay, 1000);
    timers.shift().callback();
    assert.equal(appended.length, 2);

    assert.equal(sandbox.tryRecoverLifecycleManagerScript(target.src, target), false);
    assert.equal(
        sandbox.isIgnorableResourceFailure('SCRIPT', target.src, target),
        true
    );
});

test('same-origin scripts ignore teardown/offline noise and cap visible script reports at 3 per page load', async () => {
    const start = reporter.indexOf('function isSameOriginGameStylesheet(');
    const end = reporter.indexOf('function enqueue(', start);
    assert.ok(start >= 0 && end > start);

    const sandbox = {
        URL,
        navigator: { onLine: true },
        document: { visibilityState: 'visible' },
        window: {
            location: {
                href: 'https://nevergrad.archerlab.dev/en/',
                origin: 'https://nevergrad.archerlab.dev'
            }
        }
    };
    vm.runInNewContext(`
        ${reporter.slice(start, end)}
        this.isIgnorableResourceFailure = isIgnorableResourceFailure;
    `, sandbox);

    const target = {
        src: 'https://nevergrad.archerlab.dev/assets/js/engine.js',
        getAttribute: () => null
    };
    sandbox.document.visibilityState = 'hidden';
    assert.equal(sandbox.isIgnorableResourceFailure('SCRIPT', target.src, target), true);
    sandbox.document.visibilityState = 'visible';
    sandbox.navigator.onLine = false;
    assert.equal(sandbox.isIgnorableResourceFailure('SCRIPT', target.src, target), true);
    sandbox.navigator.onLine = true;
    assert.equal(sandbox.isIgnorableResourceFailure('SCRIPT', target.src, target), false);
    sandbox.document.visibilityState = 'hidden';
    assert.equal(sandbox.isIgnorableResourceFailure('SCRIPT', 'https://cdn.example.com/engine.js', target), false);

    // Burst cap test via full error-reporter IIFE
    const sent = [];
    const listeners = {};
    const fullContext = {
        URL,
        navigator: { onLine: true, userAgent: 'Mozilla/5.0 Chrome/154.0.0.0', sendBeacon: (_u, body) => { sent.push(JSON.parse(body)); return true; } },
        document: {
            visibilityState: 'visible',
            documentElement: { lang: 'en' },
            addEventListener() {}
        },
        screen: { width: 390, height: 844 },
        addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },
        setTimeout,
        clearTimeout,
        fetch: async (_u, init) => { sent.push(JSON.parse(init.body)); return { ok: true }; },
        console: { error() {}, warn() {}, log() {} },
        localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
        sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} }
    };
    fullContext.window = Object.assign(fullContext, {
        location: { href: 'https://nevergrad.archerlab.dev/en/', origin: 'https://nevergrad.archerlab.dev', pathname: '/en/', search: '' },
        innerWidth: 390,
        innerHeight: 844
    });
    vm.runInNewContext(reporter, fullContext);
    for (let i = 0; i < 6; i += 1) {
        const scriptEl = {
            tagName: 'SCRIPT',
            src: `https://nevergrad.archerlab.dev/assets/js/mod_${i}.js`,
            getAttribute: () => null
        };
        for (const fn of listeners.error || []) fn({ target: scriptEl });
    }
    await new Promise((resolve) => setTimeout(resolve, 30));
    assert.equal(sent.length, 3);
});
