const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = { SCENARIO: {} };
for (const file of ['day5_2_lunch.js', 'day5_3_afterschool.js', 'day5_4_night.js']) {
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/js/scenario', file), 'utf8'), context);
}
const scenes = context.SCENARIO[5];
function walk(start, stop, initial = [], affinity = 0) {
    const flags = new Set(initial), visited = [];
    let id = start;
    for (let i = 0; i < 180 && id !== stop; i++) {
        const node = scenes[id];
        assert.ok(node, id);
        visited.push(id);
        (node.clearFlags || []).forEach(f => flags.delete(f));
        (node.setFlags || []).forEach(f => flags.add(f));
        const branch = (node.branches || []).find(b => [].concat(b.condition || []).every(f => flags.has(f)));
        const aff = (node.affinityBranches || []).find(b => affinity >= b.minAffinity);
        id = branch?.next || aff?.next || node.next;
    }
    assert.equal(id, stop, visited.join(' -> '));
    return { visited, flags };
}
test('both endings pay off every companion combination once and keep companion flags', () => {
    for (const flags of [[], ['sea_companion'], ['riin_companion'], ['sea_companion', 'riin_companion']]) {
        for (const ending of ['true', 'escape']) {
            const { visited, flags: after } = walk('day5_night_start', `day5_ending_${ending}_title`, [...flags, `route_${ending}`, 'has_evidence']);
            for (const char of ['sea', 'riin']) {
                const id = ending === 'true' ? `day5_ending_true_27_${char}` : `day5_ending_escape_${char}`;
                assert.equal(visited.filter(v => v === id).length, flags.includes(`${char}_companion`) ? 1 : 0);
                assert.equal(after.has(`${char}_companion`), flags.includes(`${char}_companion`));
            }
        }
    }
});
test('both TRUE entry points show the goodbye once and unlock both rewards at 25', () => {
    for (const affinity of [24, 25, 50]) {
        for (const start of ['day5_after_true_11a', 'day5_night_start']) {
            const { visited } = walk(start, 'day5_ending_true_title', ['route_true', 'has_evidence'], affinity);
            assert.equal(visited.filter(id => /^day5_ending_true_16(_clear)?$/.test(id)).length, 1);
            assert.equal(visited.includes('day5_ending_true_16_clear'), affinity >= 25);
            assert.equal(visited.includes('day5_ending_true_30_memory'), affinity >= 25);
            assert.equal(visited.filter(id => id === 'day5_ending_true_17').length, 1);
        }
    }
});
test('night entry recomputes stale synchronization flags and pink reaches the existing capture route', () => {
    const low = walk('day5_night_start', 'day5_ending_true_title', ['route_true', 'has_evidence', 'high_seolhwa_affinity'], 24);
    assert.equal(low.flags.has('high_seolhwa_affinity'), false);
    const captured = walk('day5_lunch_pills_pink_1', 'day5_after_caught_1');
    assert.ok(captured.flags.has('caught_by_riin'));
    assert.equal(scenes.day5_lunch_end.changeSlot, 'afterschool');
    assert.equal(scenes.day5_after_end.changeSlot, 'night');
});
