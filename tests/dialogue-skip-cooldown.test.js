'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function harness() {
    let now = 1000;
    let timerId = 0;
    const intervals = new Map();
    const timeouts = new Map();
    const elements = new Map();
    const element = id => {
        if (!elements.has(id)) elements.set(id, {
            style: {}, classList: { add() {}, remove() {} }, innerHTML: '', textContent: '',
            listeners: {}, addEventListener(name, fn) { this.listeners[name] = fn; }, appendChild() {}
        });
        return elements.get(id);
    };
    const context = vm.createContext({
        window: {}, console, CONFIG: { TYPING_SPEED: 30 }, performance: { now: () => now },
        document: { getElementById: element, createElement: () => element('dots') },
        setInterval: fn => { intervals.set(++timerId, fn); return timerId; },
        clearInterval: id => intervals.delete(id),
        setTimeout: fn => { timeouts.set(++timerId, fn); return timerId; },
        clearTimeout: id => timeouts.delete(id)
    });
    for (const name of ['DialogueSystem', 'GameEngine']) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/js/modules', name + '.js'), 'utf8') + `\nwindow.${name} = ${name};`, context);
    }
    const dialogue = new context.window.DialogueSystem();
    let advances = 0;
    const engine = Object.assign(Object.create(context.window.GameEngine.prototype), {
        dialogue, state: { currentScene: 'current' },
        _advanceScene: () => { advances++; }, audio: { playUIDialogueAdvance() {} }
    });
    engine._bindGameScreen();
    return { dialogue, engine, setTime: value => { now = value; },
        tick: () => { for (const fn of [...intervals.values()]) fn(); },
        fireMessenger: () => { const fn = timeouts.get(dialogue._messengerTimer); assert.ok(fn); fn(); },
        click: () => element('dialogue-box').listeners.click(),
        key: () => element('dialogue-box').listeners.keydown({ key: 'Enter', preventDefault() {} }),
        text: () => element('dialogue-text').innerHTML, advances: () => advances };
}

test('manual reveal blocks click and keyboard advance for exactly 250ms without extending or queuing input', () => {
    const h = harness();
    h.dialogue.type('Actor', 'Full line');
    h.click();
    assert.equal(h.text(), 'Full line');
    h.setTime(1249);
    for (let i = 0; i < 10; i++) { h.click(); h.key(); }
    assert.equal(h.advances(), 0);
    h.setTime(1250);
    assert.equal(h.advances(), 0);
    h.key();
    assert.equal(h.advances(), 1);
});

test('natural completion remains immediately advanceable', () => {
    const h = harness();
    h.dialogue.type('Actor', 'X');
    h.tick();
    h.tick();
    assert.equal(h.dialogue.isTyping, false);
    assert.equal(h.dialogue.isAdvanceCoolingDown(), false);
    h.click();
    assert.equal(h.advances(), 1);
});

test('cancellation and new dialogue clear old cooldowns', () => {
    const h = harness();
    h.dialogue.type('Actor', 'Full line');
    h.click();
    h.dialogue.cancel();
    assert.equal(h.dialogue.isAdvanceCoolingDown(), false);
    h.dialogue.armAdvanceCooldown();
    h.dialogue.type('Actor', 'New line');
    assert.equal(h.dialogue.isAdvanceCoolingDown(), false);
});

test('ending and explicit unskippable text retain their existing protection', () => {
    for (const ending of [false, true]) {
        const h = harness();
        h.engine._isEndingScene = () => ending;
        h.dialogue.type('Actor', 'Protected line', null, { unskippable: !ending });
        h.click();
        assert.equal(h.dialogue.isTyping, true);
        assert.equal(h.dialogue.isAdvanceCoolingDown(), false);
        assert.equal(h.advances(), 0);
    }
});

test('messenger waiting remains protected and manual reveal of the delivered text starts the cooldown', () => {
    const h = harness();
    h.dialogue.typeMessenger('Actor', 'Full message');
    h.click();
    assert.equal(h.dialogue.isTyping, true);
    assert.equal(h.dialogue.isAdvanceCoolingDown(), false);
    h.fireMessenger();
    h.click();
    assert.equal(h.text(), 'Full message');
    assert.equal(h.dialogue.isAdvanceCoolingDown(), true);
});
