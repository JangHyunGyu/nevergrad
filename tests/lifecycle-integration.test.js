const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('audio and base glitch timers are lifecycle owned', () => {
    const audio = read('assets/js/modules/AudioManager.js');
    const glitch = read('assets/js/modules/GlitchSystem.js');
    assert.doesNotMatch(audio, /(?<![\w.])setTimeout\s*\(/);
    assert.doesNotMatch(glitch, /(?<![\w.])setTimeout\s*\(/);
    assert.match(audio, /resetSession\(\)/);
    assert.match(glitch, /resetSession\(\)/);
    assert.match(glitch, /tabLifecycle\.listen\(document, 'visibilitychange'/);
});

test('new, continue, manual load and ending paths isolate session state', () => {
    const engine = read('assets/js/modules/GameEngine.js');
    assert.match(engine, /this\.runLifecycle = this\.lifecycle\.createScope\('run'\)/);
    assert.match(engine, /this\.sceneLifecycle = this\.runLifecycle\.createScope\(`scene:\$\{sceneId\}`\)/);
    assert.ok((engine.match(/this\._prepareNewRun\(\)/g) || []).length >= 3);
    assert.match(engine, /_showEndingTitle\(title, subtitleKey\) \{[\s\S]*?this\.sceneLifecycle\?\.clear/);
    assert.match(engine, /dispose\(\) \{[\s\S]*?this\.lifecycle\?\.dispose/);
});

test('all seven localized shells load LifecycleManager before GameEngine', () => {
    for (const html of ['index.html', 'en/index.html', 'ja/index.html', 'es/index.html', 'fr/index.html', 'de/index.html', 'pt/index.html']) {
        const source = read(html);
        const lifecycleIndex = source.indexOf('LifecycleManager.js');
        const recoveryIndex = source.indexOf("typeof window.LifecycleManager !== 'function'");
        const stateIndex = source.indexOf('StateManager.js');
        const engineIndex = source.indexOf('GameEngine.js');
        assert.match(source, /data-nevergrad-recoverable-dependency="LifecycleManager"/);
        assert.match(source, /LifecycleManager\.js\?v=20260912-lifecycle-retry/);
        assert.ok(lifecycleIndex >= 0 && recoveryIndex > lifecycleIndex, html);
        assert.ok(stateIndex > recoveryIndex && engineIndex > stateIndex, html);
    }
});
