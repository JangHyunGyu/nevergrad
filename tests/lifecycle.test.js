const test = require('node:test');
const assert = require('node:assert/strict');
const LifecycleManager = require('../assets/js/modules/LifecycleManager.js');

function createHost() {
    let nextId = 1;
    const timeouts = new Map();
    const intervals = new Map();
    return {
        timeouts,
        intervals,
        setTimeout(fn) { const id = nextId++; timeouts.set(id, fn); return id; },
        clearTimeout(id) { timeouts.delete(id); },
        setInterval(fn) { const id = nextId++; intervals.set(id, fn); return id; },
        clearInterval(id) { intervals.delete(id); },
        flushTimeout(id) { const fn = timeouts.get(id); timeouts.delete(id); fn?.(); }
    };
}

function createTarget() {
    const listeners = new Map();
    return {
        listeners,
        addEventListener(type, handler) { listeners.set(`${type}:${listeners.size}`, { type, handler }); },
        removeEventListener(type, handler) {
            for (const [key, entry] of listeners) if (entry.type === type && entry.handler === handler) listeners.delete(key);
        }
    };
}

test('clear cancels timers, intervals, listeners and guarded callbacks', () => {
    const host = createHost();
    const target = createTarget();
    const lifecycle = new LifecycleManager('test', host);
    let calls = 0;
    const timeout = lifecycle.timeout(() => { calls += 1; }, 5);
    lifecycle.interval(() => { calls += 1; }, 5);
    lifecycle.listen(target, 'change', () => { calls += 1; });
    const guarded = lifecycle.guard(() => { calls += 1; });

    assert.deepEqual(lifecycle.snapshot(), {
        name: 'test', timeouts: 1, intervals: 1, listeners: 1, cleanups: 0, generation: 0, disposed: false
    });
    lifecycle.clear();
    host.flushTimeout(timeout);
    guarded();
    assert.equal(calls, 0);
    assert.equal(host.timeouts.size, 0);
    assert.equal(host.intervals.size, 0);
    assert.equal(target.listeners.size, 0);
});

test('thousands of scene scopes detach from their parent after disposal', () => {
    const host = createHost();
    const root = new LifecycleManager('game', host);
    const run = root.createScope('run');
    for (let index = 0; index < 5000; index += 1) {
        const scene = run.createScope(`scene:${index}`);
        scene.timeout(() => {}, 1000);
        scene.dispose();
    }
    assert.equal(run.snapshot().cleanups, 0);
    assert.equal(host.timeouts.size, 0);
    run.dispose();
    assert.equal(root.snapshot().cleanups, 0);
    root.dispose();
});

test('child cleanup is recursive and idempotent', () => {
    const host = createHost();
    const root = new LifecycleManager('root', host);
    const child = root.createScope('child');
    const grandchild = child.createScope('grandchild');
    grandchild.timeout(() => {}, 100);
    root.dispose();
    root.dispose();
    assert.equal(child.disposed, true);
    assert.equal(grandchild.disposed, true);
    assert.equal(host.timeouts.size, 0);
});
