'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(read('assets/js/modules/GameEngine.js') + '\nglobalThis.Engine = GameEngine;', context);
const engine = context.Engine.prototype;

test('late-night cue uses local time, corridor location and a saved once-per-run flag', () => {
    for (const hour of [0, 2, 3, 12, 23]) for (const day of [3, 4, 5]) {
        for (const background of ['home.webp', 'corridor.webp', 'old_corridor_dark.webp', 'hallway.webp']) {
            const flags = new Set(), calls = [];
            context.Date = class extends Date { getHours() { return hour; } };
            const game = {
                state: { currentDay: day, currentBackground: `assets/images/background/${background}`,
                    hasFlag: f => flags.has(f), setFlag: f => flags.add(f) },
                i18n: { getUI: () => 'localized cue' },
                glitchAdvanced: { showGhostText: (...args) => calls.push(args) },
                _isEndingScene: engine._isEndingScene
            };
            // Deliberately not a night ID: the clock must use real local time.
            engine._checkLatenightGimmick.call(game, `day${day}_lunch_walk`);
            engine._checkLatenightGimmick.call(game, `day${day}_night_walk`);
            const expected = hour < 3 && day >= 4 && background !== 'home.webp';
            assert.equal(calls.length, expected ? 1 : 0, `${hour}/${day}/${background}`);
            if (expected) assert.equal(calls[0][0], 'localized cue');
            flags.clear(); calls.length = 0;
            engine._checkLatenightGimmick.call(game, 'day5_ending_true_1');
            assert.equal(calls.length, 0);
        }
    }
});

test('every scenario vibration name has a device pattern', () => {
    vm.runInContext(read('assets/js/modules/DeviceGimmickSystem.js') + '\nglobalThis.Device = DeviceGimmickSystem;', context);
    const patterns = context.Device.VIBRATION_PATTERNS;
    const names = new Set();
    for (const file of fs.readdirSync(path.join(root, 'assets/js/scenario')).filter(f => f.endsWith('.js'))) {
        for (const match of read(`assets/js/scenario/${file}`).matchAll(/\bvibrate:\s*["']([^"']+)["']/g)) names.add(match[1]);
    }
    assert.ok(names.size > 0);
    for (const name of names) assert.ok(Array.isArray(patterns[name]), name);
});
