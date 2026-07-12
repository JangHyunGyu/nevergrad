const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');

function loadRuntime(extra = {}) {
    const context = vm.createContext({
        console,
        Date,
        JSON,
        Math,
        ...extra
    });
    const run = (relativePath, exports) => {
        const source = fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
        vm.runInContext(`${source}\n${exports}`, context, { filename: relativePath });
    };
    run('assets/js/config.js', 'globalThis.CONFIG = CONFIG; globalThis.INITIAL_STATS = INITIAL_STATS;');
    run('assets/js/modules/StateManager.js', 'globalThis.StateManager = StateManager;');
    return { context, run };
}

function createStorage() {
    const values = new Map();
    return {
        getItem(key) { return values.has(key) ? values.get(key) : null; },
        setItem(key, value) { values.set(key, String(value)); },
        removeItem(key) { values.delete(key); }
    };
}

test('startNewRun clears all playthrough state', () => {
    const { context } = loadRuntime();
    const state = new context.StateManager();

    state.playerName = 'Old player';
    state.currentDay = 5;
    state.currentScene = 'day5_old_scene';
    state.currentBGM = 'old.mp3';
    state.setFlag('old_route');
    state.changeStat('sea', 'affinity', 40);
    state.addEvidence({ id: 'old-evidence' });
    state.chatMemories.sea = ['old-memory'];
    state.triggerGenreShift();

    state.startNewRun();

    assert.equal(state.playerName, '');
    assert.equal(state.currentDay, 1);
    assert.equal(state.currentScene, '');
    assert.equal(state.currentBGM, null);
    assert.deepEqual(Object.keys(state.flags), []);
    assert.equal(state.stats.sea.affinity, 15);
    assert.equal(state.evidence.length, 0);
    assert.deepEqual(Object.keys(state.chatMemories), []);
    assert.equal(state.mode, context.CONFIG.STAT_MODES.ROMANCE);
    assert.equal(state.glitchLevel, context.CONFIG.GLITCH_LEVELS.NONE);
    assert.equal(state.currentTheme, 'romance');
});

test('deserialize merges old saves over current stat defaults', () => {
    const { context } = loadRuntime();
    const state = new context.StateManager();

    state.deserialize({
        playerName: 'Legacy',
        currentDay: 2,
        currentScene: 'day2_legacy',
        stats: { sea: { affinity: 42 } }
    });

    assert.equal(state.stats.sea.affinity, 42);
    assert.equal(state.stats.riin.affinity, 5);
    state.changeStat('riin', 'affinity', 10);
    assert.equal(state.stats.riin.affinity, 15);
});

test('SaveManager rejects malformed slots and accepts valid legacy saves', () => {
    const localStorage = createStorage();
    const { context, run } = loadRuntime({ localStorage });
    run('assets/js/modules/SaveManager.js', 'globalThis.SaveManager = SaveManager;');

    let loaded = null;
    const manager = new context.SaveManager({ deserialize(data) { loaded = data; } });

    localStorage.setItem(manager.SAVE_KEY, '{broken json');
    assert.equal(manager.hasSaveData(), false);
    assert.equal(manager.load(), false);
    assert.equal(loaded, null);

    localStorage.setItem(manager.SAVE_KEY, JSON.stringify({
        playerName: 'Legacy',
        currentDay: 3,
        currentSlot: 'night',
        currentScene: 'day3_legacy_scene'
    }));
    assert.equal(manager.hasSaveData(), true);
    assert.equal(manager.load(), true);
    assert.equal(loaded.currentScene, 'day3_legacy_scene');
});
