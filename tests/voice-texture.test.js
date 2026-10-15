const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function harness() {
    let now = 0, nextId = 0;
    const scheduled = new Map();
    const elements = {};
    const element = id => elements[id] ||= { style: {}, innerHTML: '', textContent: '', classList: { add() {}, remove() {} } };
    const context = vm.createContext({
        CONFIG: { TYPING_SPEED: 30 }, performance: { now: () => now },
        document: { getElementById: element },
        setTimeout: (fn, ms) => { const id = ++nextId; scheduled.set(id, { fn, at: now + ms }); return id; },
        clearTimeout: id => scheduled.delete(id), clearInterval: id => scheduled.delete(id)
    });
    for (const module of ['DialogueSystem', 'AudioManager']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/js/modules', module + '.js'), 'utf8') + `\nglobalThis.${module} = ${module};`, context);
    const dialogue = new context.DialogueSystem();
    const audio = Object.create(context.AudioManager.prototype);
    let ticks = 0, stops = 0;
    dialogue.audio = { getVoiceTexture: audio.getVoiceTexture, playTypingTick: () => ticks++, stopTypingTicks: () => stops++ };
    function advance(ms) {
        const end = now + ms;
        while (true) {
            const entry = [...scheduled.entries()].sort((a, b) => a[1].at - b[1].at)[0];
            if (!entry || entry[1].at > end) break;
            now = entry[1].at; scheduled.delete(entry[0]); entry[1].fn();
        }
        now = end;
    }
    return { dialogue, audio, advance, scheduled, text: () => element('dialogue-text').innerHTML, ticks: () => ticks, stops: () => stops };
}

test('voice texture comes from the speaker and later genre state', () => {
    const { audio } = harness();
    assert.equal(audio.getVoiceTexture('me'), null);
    assert.equal(audio.getVoiceTexture('sea', true, 3).rhythm, 'light');
    assert.equal(audio.getVoiceTexture('sea', true, 4).rhythm, 'fractured');
    assert.equal(audio.getVoiceTexture('eunsu', true, 5).wave, 'triangle');
    assert.equal(audio.getVoiceTexture('eunsu', false, 5).wave, 'sine');
    assert.equal(audio.getVoiceTexture('seolhwa').pan, -0.45);
    assert.ok(audio.getVoiceTexture('seolhwa').cutoff < audio.getVoiceTexture('sea').cutoff);
});

test('farewell voice override clears Seolhwa filtering for one line only', () => {
    const h = harness();
    h.dialogue.type('Seolhwa', 'Remember me', null, { charId: 'seolhwa', voicePreset: 'seolhwa_clear' });
    assert.equal(h.dialogue._voiceTexture.cutoff, 20000);
    assert.equal(h.dialogue._voiceTexture.pan, 0);
    assert.equal(h.dialogue._voiceTexture.rhythm, 'steady');
    h.dialogue.type('Seolhwa', 'Another line', null, { charId: 'seolhwa' });
    assert.equal(h.dialogue._voiceTexture.cutoff, 680);
    assert.equal(h.dialogue._voiceTexture.pan, -0.45);
});

test('shutter hold reveals nothing for 399ms and then reveals the complete line once', () => {
    const h = harness(); let completions = 0;
    h.dialogue.type('', 'Shutter impact', () => completions++, { typingPause: 400, typingSpeed: 0 });
    h.dialogue.skipTyping();
    h.advance(399);
    assert.equal(h.text(), ''); assert.equal(completions, 0);
    h.advance(1);
    assert.equal(h.text(), 'Shutter impact'); assert.equal(completions, 1);
    h.advance(1000); assert.equal(completions, 1); assert.equal(h.scheduled.size, 0);
});

test('document cadence varies within 20–120ms and pause/resume emits no extra text or sound', () => {
    const h = harness(); let paused = true;
    h.dialogue.isPaused = () => paused;
    h.dialogue.type('', 'Document', null, { textPace: 'document', charId: 'system', typingSpeed: 40 });
    const delays = Array.from({ length: 8 }, (_, i) => h.dialogue._typingDelay(i, 'x'));
    assert.equal(Math.min(...delays), 20); assert.equal(Math.max(...delays), 120);
    h.advance(500); assert.equal(h.text(), ''); assert.equal(h.ticks(), 0);
    paused = false; h.advance(1000);
    assert.equal(h.text(), 'Document'); assert.ok(h.ticks() > 0); assert.equal(h.scheduled.size, 0);
});

test('cancelling rhythmic reveal releases all timers and typing audio', () => {
    const h = harness();
    h.dialogue.type('Sea', 'A long enough line', null, { charId: 'sea', genreShift: true, day: 5 });
    h.advance(80); assert.ok(h.ticks() > 0);
    h.dialogue.cancel(); const text = h.text(), ticks = h.ticks();
    h.advance(2000);
    assert.equal(h.text(), text); assert.equal(h.ticks(), ticks); assert.equal(h.scheduled.size, 0); assert.ok(h.stops() >= 2);
});

test('manual completion stops ticks and retains the 250ms advance guard', () => {
    const h = harness();
    h.dialogue.type('Sea', 'A long enough line', null, { charId: 'sea' });
    h.advance(30); h.dialogue.skipTyping(); const ticks = h.ticks();
    assert.equal(h.text(), 'A long enough line'); assert.equal(h.dialogue.isAdvanceCoolingDown(), true);
    h.advance(249); assert.equal(h.dialogue.isAdvanceCoolingDown(), true);
    h.advance(1); assert.equal(h.dialogue.isAdvanceCoolingDown(), false); assert.equal(h.ticks(), ticks);
});

test('completion may start another line without losing its callback', () => {
    const h = harness(); let second = 0;
    h.dialogue.type('', 'A', () => h.dialogue.type('', 'B', () => second++, { charId: 'sea' }), { charId: 'sea' });
    h.advance(150); assert.equal(h.text(), 'B'); assert.equal(second, 1);
});

test('narration stays silent while terminal narration gets the document sound', () => {
    const h = harness();
    h.dialogue.type('Sea', '*Narration*', null, { charId: 'sea' }); h.advance(1000); assert.equal(h.ticks(), 0);
    h.dialogue.type('', '*Document*', null, { charId: 'system', textPace: 'document' }); h.advance(1000); assert.ok(h.ticks() > 0);
});
