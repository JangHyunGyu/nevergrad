'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

function createClassList() {
    const classes = new Set();
    return {
        add: (...names) => names.forEach(n => classes.add(n)),
        remove: (...names) => names.forEach(n => classes.delete(n)),
        contains: n => classes.has(n),
        toggle: (n, force) => (force === undefined
            ? (classes.has(n) ? (classes.delete(n), false) : (classes.add(n), true))
            : (force ? (classes.add(n), true) : (classes.delete(n), false))),
        toArray: () => [...classes]
    };
}

function createFakeElement(tag = 'div', id = '') {
    const el = {
        tagName: tag.toUpperCase(),
        id,
        className: '',
        classList: createClassList(),
        dataset: {},
        style: { cssText: '' },
        children: [],
        textContent: '',
        innerHTML: '',
        parentNode: null,
        listeners: {},
        appendChild(child) {
            child.parentNode = el;
            el.children.push(child);
            return child;
        },
        remove() {
            if (el.parentNode) {
                el.parentNode.children = el.parentNode.children.filter(c => c !== el);
                el.parentNode = null;
            }
        },
        querySelector(selector) {
            const cls = selector.startsWith('.') ? selector.slice(1) : null;
            for (const c of el.children) {
                if (cls && (c.className.split(/\s+/).includes(cls) || c.classList.contains(cls))) return c;
                const found = c.querySelector(selector);
                if (found) return found;
            }
            return null;
        },
        querySelectorAll: () => [],
        addEventListener(type, fn) {
            if (!el.listeners[type]) el.listeners[type] = [];
            el.listeners[type].push(fn);
        },
        setAttribute() {},
        removeEventListener(type, fn) {
            if (el.listeners[type]) el.listeners[type] = el.listeners[type].filter(f => f !== fn);
        }
    };
    return el;
}

test('day5_ending_forget preserves chronological wake-up order before epilogue', () => {
    const ctx = { SCENARIO: {} };
    vm.createContext(ctx);
    vm.runInContext(read('assets/js/scenario/day5_4_night.js'), ctx);
    const s5 = ctx.SCENARIO[5];

    assert.equal(s5.day5_ending_forget_14.next, 'day5_ending_forget_15');
    assert.equal(s5.day5_ending_forget_15.next, 'day5_ending_forget_16');
    assert.equal(s5.day5_ending_forget_22.next, 'day5_ending_forget_sea_branch');

    const branches = s5.day5_ending_forget_sea_branch.affinityBranches;
    assert.equal(branches[0].minAffinity, 50);
    assert.equal(branches[0].next, 'day5_ending_forget_sea_1');
    assert.equal(branches[1].minAffinity, -100);
    assert.equal(branches[1].next, 'day5_ending_forget_epilogue_1');
    assert.equal(s5.day5_ending_forget_epilogue_25.next, 'day5_ending_forget_title');
});

test('day2_morning_pen_corridor_branch reaches both Eunsu and Yuna paths cleanly', () => {
    const ctx = { SCENARIO: {} };
    vm.createContext(ctx);
    vm.runInContext(read('assets/js/scenario/day2_1_morning.js'), ctx);
    const s2 = ctx.SCENARIO[2];

    const branch = s2.day2_morning_pen_corridor_branch;
    assert.equal(branch.next, 'day2_morning_pen_eunsu_1');
    assert.equal(branch.branches[0].condition, 'yuna_route_started');
    assert.equal(branch.branches[0].next, 'day2_morning_pen_yuna_1');
    assert.ok(s2.day2_morning_pen_eunsu_8.next);
    assert.equal(s2.day2_morning_class_2.next, 'day2_morning_pen_1');
});

test('SceneRenderer and GameEngine apply time-sunset on day1_after_home_1 while exempting dark interiors', () => {
    const bgLayer = createFakeElement('div', 'bg-layer');
    const gameContainer = createFakeElement('div', 'game-container');
    const elementsById = {
        'bg-layer': bgLayer,
        'game-container': gameContainer,
        'ending-title-overlay': createFakeElement('div', 'ending-title-overlay')
    };

    const document = {
        body: createFakeElement('body'),
        getElementById: id => elementsById[id] || null,
        createElement: tag => createFakeElement(tag),
        querySelector: () => null,
        querySelectorAll: () => []
    };

    const ctx = {
        console,
        document,
        window: {},
        globalThis: {},
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
        SCENARIO: {},
        CONFIG: {
            BACKGROUNDS: {
                school_gate_evening: 'assets/images/background/school_gate_evening.webp',
                room_night: 'assets/images/background/room_night.webp',
                black: 'assets/images/background/black.webp'
            },
            DEBUG: false
        },
        I18nManager: { currentLang: 'ko', get: k => k }
    };
    ctx.window = ctx;
    ctx.globalThis = ctx;
    vm.createContext(ctx);

    vm.runInContext(read('assets/js/modules/LifecycleManager.js') + ';\nglobalThis.LifecycleManager = LifecycleManager;', ctx);
    vm.runInContext(read('assets/js/modules/SceneRenderer.js') + ';\nglobalThis.SceneRenderer = SceneRenderer;', ctx);
    vm.runInContext(read('assets/js/modules/GameEngine.js') + ';\nglobalThis.GameEngine = GameEngine;', ctx);
    vm.runInContext(read('assets/js/scenario/day1_3_afterschool.js'), ctx);

    const renderer = new ctx.globalThis.SceneRenderer();
    const charLayer = createFakeElement('div', 'char-layer');
    renderer.bgLayer = bgLayer;
    renderer.charLayer = charLayer;
    renderer.gameContainer = gameContainer;
    bgLayer.style.backgroundImage = "url('assets/images/background/school_gate_evening.webp')";
    renderer.setTimeOfDay('sunset');
    assert.equal(bgLayer.classList.contains('time-sunset'), true);
    assert.equal(charLayer.classList.contains('time-sunset'), true);

    bgLayer.style.backgroundImage = "url('assets/images/background/room_night.webp')";
    renderer.setTimeOfDay('sunset');
    assert.equal(bgLayer.classList.contains('time-sunset'), false);

    bgLayer.style.backgroundImage = "url('assets/images/background/school_gate_evening.webp')";
    renderer.setTimeOfDay('morning');
    assert.equal(bgLayer.classList.contains('time-sunset'), false);
    assert.equal(bgLayer.classList.contains('time-morning'), true);
    assert.equal(charLayer.classList.contains('time-morning'), true);

    const engineSrc = read('assets/js/modules/GameEngine.js');
    assert.doesNotMatch(engineSrc, /_showEndingTitle[\s\S]*?(?:\?\.|\?\?)/);

    const proto = ctx.globalThis.GameEngine.prototype;
    assert.equal(proto._isTimeFilterExemptBackground('assets/images/background/school_gate_evening.webp'), false);
    assert.equal(proto._isTimeFilterExemptBackground('assets/images/background/black.webp'), true);
    assert.equal(proto._isTimeFilterExemptBackground('assets/images/cg/ending_true_dawn_gate.webp'), true);

    const home1 = ctx.SCENARIO[1].day1_after_home_1;
    const resolved = proto._resolveSceneTimeOfDay.call(
        {
            _currentBackgroundKey: home1.background,
            currentScene: 'day1_after_home_1',
            state: { currentBackground: '', currentSlot: 'afterschool' },
            _isTimeFilterExemptBackground: proto._isTimeFilterExemptBackground,
            _timeOfDayFromBackground: proto._timeOfDayFromBackground,
            _slotFromSceneId: proto._slotFromSceneId
        },
        home1,
        'sunset'
    );
    assert.equal(resolved, 'sunset');
});

test('GameEngine _showEndingTitle renders card metadata for all 7 endings and clears active scene timers', () => {
    const body = createFakeElement('body');
    const gameContainer = createFakeElement('div', 'game-container');
    const gameScreen = createFakeElement('div', 'game-screen');
    const document = {
        body,
        getElementById: id => (id === 'game-container' ? gameContainer : id === 'game-screen' ? gameScreen : null),
        createElement: tag => createFakeElement(tag),
        querySelector: () => null,
        querySelectorAll: () => []
    };

    const pendingTimers = new Map();
    let nextTimerId = 1;
    const ctx = {
        console,
        document,
        window: {},
        globalThis: {},
        setTimeout: (fn, ms) => {
            const id = nextTimerId++;
            pendingTimers.set(id, { fn, ms });
            return id;
        },
        clearTimeout: id => pendingTimers.delete(id),
        setInterval: () => nextTimerId++,
        clearInterval: () => {},
        CONFIG: { DEBUG: false },
        I18nManager: { currentLang: 'ko', get: k => ({ text: k }), getUI: k => k }
    };
    ctx.window = ctx;
    ctx.globalThis = ctx;
    vm.createContext(ctx);

    vm.runInContext(read('assets/js/modules/LifecycleManager.js') + ';\nglobalThis.LifecycleManager = LifecycleManager;', ctx);
    vm.runInContext(read('assets/js/modules/GameEngine.js') + ';\nglobalThis.GameEngine = GameEngine;', ctx);

    const lm = new ctx.globalThis.LifecycleManager('test');
    const fakeState = { reset: () => {}, setFlag: () => {}, unlockedEndings: new Set() };
    const engineStub = {
        runLifecycle: lm.createScope('run'),
        sceneLifecycle: null,
        i18n: ctx.I18nManager,
        state: fakeState,
        dialogue: { stop: () => {}, clear: () => {} },
        glitch: { stopTabGimmick: () => {} },
        _endedToTitle: false,
        save: { autoSave: () => {}, clearRun: () => {} },
        _returnToTitle: () => {}
    };
    engineStub.sceneLifecycle = engineStub.runLifecycle.createScope('ending');
    engineStub._getEndingCardMeta = ctx.GameEngine.prototype._getEndingCardMeta;

    for (const expectedKind of ['true', 'escape', 'resist', 'cage', 'forget', 'ghost', 'complicit']) {
        const meta = engineStub._getEndingCardMeta(expectedKind);
        assert.ok(meta && meta.eyebrow && meta.eyebrow.length > 0, expectedKind);
        assert.ok(meta.epigraph && meta.epigraph.length > 0, expectedKind);
    }

    engineStub.sceneLifecycle.timeout(() => {}, 5000);
    assert.equal(pendingTimers.size, 1, 'pre-existing timer registered before ending card');

    ctx.GameEngine.prototype._showEndingTitle.call(engineStub, 'TRUE END', 'day5_ending_true_subtitle');
    assert.equal(pendingTimers.size, 0, 'scene timers cleared when ending title displays');
    assert.equal(gameScreen.children.length, 1);
    const overlay = gameScreen.children[0];
    assert.equal(overlay.className, 'ending-title-overlay');
    assert.equal(overlay.dataset.ending, 'true');
    assert.ok(overlay.querySelector('.ending-card'), 'ending-card exists');
    assert.ok(overlay.querySelector('.ending-eyebrow'), 'ending-eyebrow exists');
    assert.ok(overlay.querySelector('.ending-divider'), 'ending-divider exists');
    assert.ok(overlay.querySelector('.ending-epigraph'), 'ending-epigraph exists');
});
