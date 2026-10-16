'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function runtime() {
    const context = {};
    vm.createContext(context);
    vm.runInContext(fs.readFileSync('assets/js/config.js', 'utf8'), context);
    vm.runInContext(fs.readFileSync('assets/js/modules/StateManager.js', 'utf8')
        + '\nglobalThis.State = StateManager;', context);
    vm.runInContext(fs.readFileSync('assets/js/modules/GameEngine.js', 'utf8')
        + '\nglobalThis.Engine = GameEngine;', context);
    for (const file of fs.readdirSync('assets/js/scenario').filter(f => /^day.*\.js$/.test(f))) {
        vm.runInContext(fs.readFileSync('assets/js/scenario/' + file, 'utf8'), context);
    }
    const state = new context.State();
    const engine = Object.create(context.Engine.prototype);
    engine.state = state;
    return { state, engine, scenes: Object.assign({}, ...Object.values(context.SCENARIO)) };
}

test('night pressure follows the actual affinity leader with stable ties', () => {
    const { state, engine, scenes } = runtime();
    const branch = scenes.day3_night_pressure_branch;
    for (const id of ['sea', 'eunsu', 'riin', 'yuna', 'seolhwa']) {
        for (const values of Object.values(state.stats)) values.affinity = -20;
        state.stats[id].affinity = 35;
        assert.equal(state.getAffinityLeader(), id);
        const next = engine._resolveBranch(branch.branches) || branch.next;
        assert.equal(next, `day3_night_pressure_${id}_1`);
    }
    for (const values of Object.values(state.stats)) values.affinity = 10;
    assert.equal(state.getAffinityLeader(), 'sea');
    assert.equal(state.getAffinityLeader([]), null);
    for (const id of ['sea', 'eunsu', 'riin']) {
        const gate = scenes[`day3_after_${id}_closeness`];
        state.stats[id].affinity = 24;
        assert.equal(engine._resolveAffinityBranch(gate), `day3_after_${id}_closeness_low_1`);
        state.stats[id].affinity = 25;
        assert.equal(engine._resolveAffinityBranch(gate), `day3_after_${id}_closeness_high_1`);
    }
});

test('complete deduction rewards exactly five synchronization once, including after restore', () => {
    const { state, scenes } = runtime();
    const reward = scenes.day4_night_truth_complete_1.reward;
    const initial = state.stats.seolhwa.affinity;
    assert.equal(state.applySceneReward(reward), true);
    assert.equal(state.stats.seolhwa.affinity, initial + 5);
    assert.equal(state.applySceneReward(reward), false);
    const restored = runtime().state;
    restored.deserialize(JSON.parse(JSON.stringify(state.serialize())));
    assert.equal(restored.applySceneReward(reward), false);
    assert.equal(restored.stats.seolhwa.affinity, initial + 5);
});

test('both prequels return to the server without changing current-playthrough evidence or affinity', () => {
    const { scenes } = runtime();
    for (const cycle of ['07', '12']) {
        let id = `day5_archive_cycle${cycle}_1`;
        const seen = new Set();
        while (id !== 'day5_xover_server_4') {
            assert.ok(!seen.has(id), `archive loop: ${id}`);
            seen.add(id);
            const scene = scenes[id];
            assert.ok(scene, id);
            assert.equal(scene.endingTitle, undefined);
            assert.equal(scene.evidence, undefined);
            assert.equal(scene.stats, undefined);
            assert.equal(scene.reward, undefined);
            assert.equal(scene.setFlags, undefined);
            id = scene.next;
        }
        assert.ok(seen.size >= 75, `cycle ${cycle}: ${seen.size} nodes`);
        const last = scenes[[...seen].at(-1)];
        assert.equal(last.background, 'black');
        assert.equal(last.bgm, null);
        assert.equal(last.character, null);
    }
});

test('expansion targets, explicit fallback thresholds, and localized choice lengths stay aligned', () => {
    const { scenes } = runtime();
    assert.ok(Object.keys(scenes).length >= 2900 && Object.keys(scenes).length <= 3050);
    const choices = Object.values(scenes).reduce((n, s) => n + (s.choices?.length || 0), 0);
    assert.ok(choices >= 240 && choices <= 260, `choices: ${choices}`);
    for (const [id, scene] of Object.entries(scenes)) {
        if (scene.affinityBranches) assert.ok(scene.affinityBranches.some(b => b.minAffinity === -100), id);
    }
    const languages = ['ko', 'en', 'ja', 'es', 'fr', 'de', 'pt', 'zh'];
    for (const lang of languages) {
        const strings = Object.assign({}, ...fs.readdirSync(`assets/js/i18n/${lang}`)
            .filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(`assets/js/i18n/${lang}/${f}`, 'utf8'))));
        for (const [id, scene] of Object.entries(scenes)) {
            if (!scene.choices) continue;
            assert.equal(strings[id]?.choices?.length, scene.choices.length, `${lang}:${id}`);
        }
    }
});
