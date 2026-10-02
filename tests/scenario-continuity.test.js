'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const scenario = {1:{}};
for (const file of ['day1_1_morning.js','day1_3_afterschool.js','day1_4_night.js']) {
    vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/js/scenario',file),'utf8'), {SCENARIO:scenario});
}
function nightInventory(flags) {
    const shown = [];
    let id = 'day1_night_sleep_2';
    for (let step=0;step<10 && id!=='day1_night_sleep_3';step++) {
        const node = scenario[1][id];
        assert.ok(node,id);
        if (['day1_night_sleep_milk','day1_night_sleep_photo','day1_night_sleep_tea'].includes(id)) shown.push(id);
        const branch = (node.branches||[]).find(branch => flags.has(branch.condition));
        id = branch ? branch.next : node.next;
    }
    assert.equal(id,'day1_night_sleep_3');
    return shown;
}

test('first-night inventory only shows gifts received on the chosen route', () => {
    assert.deepEqual(nightInventory(new Set()),[]);
    assert.deepEqual(nightInventory(new Set(['received_sea_milk'])),['day1_night_sleep_milk']);
    assert.deepEqual(nightInventory(new Set(['received_sea_milk','received_yuna_photo'])),['day1_night_sleep_milk','day1_night_sleep_photo']);
    assert.deepEqual(nightInventory(new Set(['received_sea_milk','received_riin_tea'])),['day1_night_sleep_milk','day1_night_sleep_tea']);
    assert.deepEqual(nightInventory(new Set(['received_yuna_photo'])),['day1_night_sleep_photo']);
    assert.deepEqual(nightInventory(new Set(['received_riin_tea'])),['day1_night_sleep_tea']);
    assert.ok(scenario[1].day1_after_yuna_14.setFlags.includes('received_yuna_photo'));
    assert.ok(scenario[1].day1_after_riin_7.setFlags.includes('received_riin_tea'));
    assert.ok(scenario[1].day1_choco_4.setFlags.includes('received_sea_milk'));
    assert.ok(scenario[1].day1_choco_ngp_2.setFlags.includes('received_sea_milk'));
});

test('NG+ strawberry preference comes from the strawberry answer', () => {
    const choices=scenario[1].day1_choco_choice.choices;
    assert.equal(choices[1].setFlags.includes('chose_strawberry'),false);
    assert.equal(choices[2].setFlags.includes('chose_strawberry'),true);
});
