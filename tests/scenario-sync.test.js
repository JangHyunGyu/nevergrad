'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  hasContentDifference,
  normalizeLineEndings,
} = require('../scripts/sync-scenario-md-dialogue.js');

test('scenario sync treats Windows and Unix line endings as identical content', () => {
  const windows = 'heading\r\n\r\nbody\r\n';
  const unix = 'heading\n\nbody\n';

  assert.equal(normalizeLineEndings(windows), unix);
  assert.equal(hasContentDifference(windows, unix), false);
});

test('scenario sync still detects actual content changes', () => {
  assert.equal(hasContentDifference('before\r\n', 'after\n'), true);
});
