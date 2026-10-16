'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const audioManagerSource = fs.readFileSync(
  path.join(__dirname, '..', 'assets', 'js', 'modules', 'AudioManager.js'),
  'utf8'
);

function createAudioManager({ online = true, fetchImpl, reporter = () => {} }) {
  class LifecycleManager {
    createScope() {
      return {
        dispose() {},
        listen() {},
        timeout(callback) { callback(); },
      };
    }
  }

  const sandbox = {
    console: { warn() {} },
    fetch: fetchImpl,
    LifecycleManager,
    Map,
    Promise,
    Set,
    navigator: { onLine: online },
    setTimeout(callback) { callback(); },
    window: { __nevergradReportError: reporter },
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(
    `${audioManagerSource}\nglobalThis.__AudioManager = AudioManager;`,
    sandbox,
    { filename: 'AudioManager.js' }
  );
  const manager = new sandbox.__AudioManager();
  const decodedBuffer = { decoded: true };
  manager.ctx = {
    async decodeAudioData() { return decodedBuffer; },
  };
  return { manager, decodedBuffer };
}

function okAudioResponse() {
  return {
    ok: true,
    status: 200,
    async arrayBuffer() { return new ArrayBuffer(8); },
  };
}

test('synthesis-only archive tracks render once and reuse the buffer without a file request', async () => {
  let calls = 0;
  const { manager } = createAudioManager({
    fetchImpl: async () => { throw new Error('synthesis-only music must not fetch a file'); },
  });
  const buffer = { synthesized: true };
  manager._proceduralBgmKeys = new Set(['cycle07_elegy']);
  manager._bgmSynthRegistry = { cycle07_elegy: async () => { calls += 1; return buffer; } };
  assert.equal(await manager.loadBuffer('assets/audio/bgm/cycle07_elegy.mp3'), buffer);
  assert.equal(await manager.loadBuffer('assets/audio/bgm/cycle07_elegy.mp3'), buffer);
  assert.equal(calls, 1);
});

test('failed synthesis-only music reports the failure once without requesting a missing file', async () => {
  let reports = 0;
  const { manager } = createAudioManager({
    fetchImpl: async () => { throw new Error('no file fallback'); },
    reporter: () => { reports += 1; },
  });
  manager._proceduralBgmKeys = new Set(['complicit_cold_pulse']);
  manager._bgmSynthRegistry = { complicit_cold_pulse: async () => { throw new Error('render failed'); } };
  assert.equal(await manager.loadBuffer('assets/audio/bgm/complicit_cold_pulse.mp3'), null);
  assert.equal(reports, 1);
});

test('audio loading retries one transient fetch failure before reporting', async () => {
  const calls = [];
  let reports = 0;
  const { manager, decodedBuffer } = createAudioManager({
    fetchImpl: async (resource, options) => {
      calls.push({ resource, options });
      if (calls.length === 1) throw new TypeError('Failed to fetch');
      return okAudioResponse();
    },
    reporter() { reports += 1; },
  });

  const result = await manager.loadBuffer('assets/audio/sfx/sfx_door_open.mp3');

  assert.equal(result, decodedBuffer);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].options.cache, 'reload');
  assert.equal(reports, 0);
});

test('offline audio failure skips retry and D1 reporting', async () => {
  let fetchCalls = 0;
  let reports = 0;
  const { manager } = createAudioManager({
    online: false,
    fetchImpl: async () => {
      fetchCalls += 1;
      throw new TypeError('Failed to fetch');
    },
    reporter() { reports += 1; },
  });

  assert.equal(await manager.loadBuffer('assets/audio/sfx/sfx_door_open.mp3'), null);
  assert.equal(fetchCalls, 1);
  assert.equal(reports, 0);
});

test('persistent online audio failure reports once after retry', async () => {
  let fetchCalls = 0;
  const reports = [];
  const { manager } = createAudioManager({
    fetchImpl: async () => {
      fetchCalls += 1;
      throw new TypeError('Failed to fetch');
    },
    reporter(...args) { reports.push(args); },
  });

  assert.equal(await manager.loadBuffer('assets/audio/sfx/sfx_door_open.mp3'), null);
  assert.equal(fetchCalls, 2);
  assert.equal(reports.length, 1);
  assert.equal(reports[0][0], 'AudioLoadFailed');
});
