const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function extractEnsureHelper() {
    const app = read('assets/js/app.js');
    const start = app.indexOf('function ensureLifecycleManager()');
    const end = app.indexOf("document.addEventListener('DOMContentLoaded'", start);
    assert.ok(start >= 0 && end > start);
    return app.slice(start, end);
}

test('ensureLifecycleManager returns immediately when global already exists', async () => {
    let created = 0;
    const sandbox = {
        Date,
        Promise,
        globalThis: { LifecycleManager: function LifecycleManager() {} },
        document: {
            createElement() {
                created += 1;
                return { setAttribute() {}, onload: null, onerror: null };
            },
            head: { appendChild() {} },
            documentElement: { appendChild() {} }
        },
        getNevergradAssetPath: p => p
    };
    vm.runInNewContext(`${extractEnsureHelper()}\nthis.ensureLifecycleManager = ensureLifecycleManager;`, sandbox);
    await sandbox.ensureLifecycleManager();
    assert.equal(created, 0);
});

test('ensureLifecycleManager injects script and resolves after onload sets global', async () => {
    let lastScript = null;
    const sandbox = {
        Date: { now: () => 42 },
        Promise,
        globalThis: {},
        document: {
            createElement(tag) {
                assert.equal(tag, 'script');
                lastScript = {
                    attrs: new Map(),
                    setAttribute(name, value) { this.attrs.set(name, value); },
                    getAttribute(name) { return this.attrs.get(name) || null; },
                    onload: null,
                    onerror: null,
                    _src: ''
                };
                Object.defineProperty(lastScript, 'src', {
                    get() { return this._src; },
                    set(v) { this._src = v; }
                });
                return lastScript;
            },
            head: {
                appendChild(node) {
                    sandbox.globalThis.LifecycleManager = function LifecycleManager() {};
                    setImmediate(() => node.onload && node.onload());
                }
            },
            documentElement: { appendChild() {} }
        },
        getNevergradAssetPath: p => p,
        setImmediate
    };
    vm.runInNewContext(`${extractEnsureHelper()}\nthis.ensureLifecycleManager = ensureLifecycleManager;`, sandbox);
    await sandbox.ensureLifecycleManager();
    assert.equal(typeof sandbox.globalThis.LifecycleManager, 'function');
    assert.match(lastScript.src, /LifecycleManager\.js\?v=20261105-lifecycle-ensure&_ts=42/);
    assert.equal(lastScript.getAttribute('data-nevergrad-recoverable-dependency'), 'LifecycleManager');
});

test('ensureLifecycleManager retries once then throws if still missing', async () => {
    let loads = 0;
    const sandbox = {
        Date: { now: () => 99 },
        Promise,
        globalThis: {},
        document: {
            createElement() {
                return {
                    setAttribute() {},
                    onload: null,
                    onerror: null,
                    src: ''
                };
            },
            head: {
                appendChild(node) {
                    loads += 1;
                    setImmediate(() => node.onerror && node.onerror());
                }
            },
            documentElement: { appendChild() {} }
        },
        getNevergradAssetPath: p => p,
        setImmediate
    };
    vm.runInNewContext(`${extractEnsureHelper()}\nthis.ensureLifecycleManager = ensureLifecycleManager;`, sandbox);
    await assert.rejects(
        () => sandbox.ensureLifecycleManager(),
        /Failed to load LifecycleManager\.js|not available after ensureLifecycleManager retries/
    );
    assert.equal(loads, 2);
});

test('GameEngine constructor uses globalThis.LifecycleManager and throws clearly when missing', () => {
    const source = read('assets/js/modules/GameEngine.js');
    assert.match(source, /const LifecycleCtor = globalThis\.LifecycleManager/);
    assert.match(source, /new LifecycleCtor\('game'\)/);
    assert.doesNotMatch(source, /new LifecycleManager\('game'\)/);

    const ctorBody = `
      const LifecycleCtor = globalThis.LifecycleManager;
      if (!lifecycle && typeof LifecycleCtor !== 'function') {
        throw new ReferenceError('LifecycleManager is not defined on globalThis; ensure LifecycleManager.js loaded before GameEngine boot');
      }
      this.lifecycle = lifecycle || new LifecycleCtor('game');
    `;
    const missing = vm.runInNewContext(`(function (lifecycle = null) { ${ctorBody} })`, {
        globalThis: {},
        ReferenceError
    });
    assert.throws(() => new missing(), /LifecycleManager is not defined on globalThis/);

    const present = vm.runInNewContext(`(function (lifecycle = null) { ${ctorBody} })`, {
        globalThis: { LifecycleManager: function LifecycleManager(name) { this.name = name; } },
        ReferenceError
    });
    assert.equal(new present().lifecycle.name, 'game');
});
