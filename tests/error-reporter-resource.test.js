const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const reporter = fs.readFileSync(path.join(__dirname, '../assets/js/error-reporter.js'), 'utf8');

test('same-origin stylesheets ignore teardown noise and retry visible failures twice', () => {
    const start = reporter.indexOf('function isSameOriginGameStylesheet(');
    const end = reporter.indexOf('function enqueue(', start);
    assert.ok(start >= 0 && end > start);

    const timers = [];
    const sandbox = {
        URL,
        Date: { now: () => 1234567890 },
        navigator: { onLine: true },
        document: { visibilityState: 'visible' },
        window: {
            location: {
                href: 'https://nevergrad.archerlab.dev/en/',
                origin: 'https://nevergrad.archerlab.dev'
            },
            setTimeout(callback, delay) { timers.push({ callback, delay }); }
        }
    };
    vm.runInNewContext(`
        ${reporter.slice(start, end)}
        this.isIgnorableResourceFailure = isIgnorableResourceFailure;
        this.tryRecoverStylesheetResource = tryRecoverStylesheetResource;
    `, sandbox);

    const attributes = new Map([['rel', 'stylesheet']]);
    const target = {
        rel: 'stylesheet',
        href: 'https://nevergrad.archerlab.dev/assets/css/dialogue.css',
        isConnected: true,
        getAttribute(name) { return attributes.get(name) || null; },
        setAttribute(name, value) { attributes.set(name, value); }
    };

    sandbox.document.visibilityState = 'hidden';
    assert.equal(sandbox.isIgnorableResourceFailure('LINK', target.href, target), true);
    sandbox.document.visibilityState = 'visible';
    sandbox.navigator.onLine = false;
    assert.equal(sandbox.isIgnorableResourceFailure('LINK', target.href, target), true);

    sandbox.navigator.onLine = true;
    assert.equal(sandbox.tryRecoverStylesheetResource(target.href, target), true);
    assert.equal(attributes.get('data-nevergrad-stylesheet-retry'), '1');
    assert.equal(timers[0].delay, 500);
    timers.shift().callback();
    assert.match(target.href, /_resource_retry=1234567890/);

    assert.equal(sandbox.tryRecoverStylesheetResource(target.href, target), true);
    assert.equal(attributes.get('data-nevergrad-stylesheet-retry'), '2');
    assert.equal(timers[0].delay, 1000);
    timers.shift().callback();
    assert.equal(sandbox.tryRecoverStylesheetResource(target.href, target), false);
    assert.equal(sandbox.tryRecoverStylesheetResource('https://cdn.example.com/dialogue.css', target), false);
});
