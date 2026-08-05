'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  callDeepSeek,
  parseTextModelRoutes,
  OPENROUTER_ENDPOINT,
  OFFICIAL_DEEPSEEK_ENDPOINT,
  OPENROUTER_MODEL,
  OPENROUTER_DEEPSEEK_MODEL,
  OPENROUTER_NEMOTRON_MODEL,
  OPENROUTER_QWEN_MODEL,
} = require('../deepseek_api.cjs');
const { resolveTextModelAdapter } = require('../model_adapters/index.cjs');

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  };
}

test('Nevergrad tools use OpenRouter DeepSeek V4 Flash 0731 first with JSON mode', async () => {
  const calls = [];
  const text = await callDeepSeek('translate', {
    openRouterApiKey: 'or-test',
    json: true,
    fetchImpl: async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) });
      return jsonResponse(200, { choices: [{ message: { content: '{"ok":true}' } }] });
    },
  });

  assert.equal(text, '{"ok":true}');
  assert.equal(calls[0].url, OPENROUTER_ENDPOINT);
  assert.equal(calls[0].body.model, OPENROUTER_MODEL);
  assert.equal(calls[0].body.model, OPENROUTER_DEEPSEEK_MODEL);
  assert.deepEqual(calls[0].body.response_format, { type: 'json_object' });
  assert.equal('tools' in calls[0].body, false);
  assert.deepEqual(calls[0].body.reasoning, { effort: 'none', exclude: true });
  assert.deepEqual(calls[0].body.thinking, { type: 'disabled' });
  assert.deepEqual(calls[0].body.provider, {
    order: ['deepinfra'],
    only: ['deepinfra'],
    allow_fallbacks: false,
  });
});

test('Nevergrad tools fall back to OpenRouter Qwen 3.7 Flash', async () => {
  const calls = [];
  const text = await callDeepSeek('review', {
    openRouterApiKey: 'or-test',
    fetchImpl: async (url, init) => {
      const body = JSON.parse(init.body);
      calls.push({ url, body });
      if (body.model === OPENROUTER_MODEL) return jsonResponse(429, { error: { message: 'busy' } });
      return jsonResponse(200, { choices: [{ message: { content: 'fallback-ok' } }] });
    },
  });

  assert.equal(text, 'fallback-ok');
  assert.deepEqual(calls.map(call => call.body.model), [OPENROUTER_MODEL, OPENROUTER_QWEN_MODEL]);
  assert.deepEqual(calls[1].body.provider, {
    order: ['alibaba'],
    only: ['alibaba'],
    allow_fallbacks: false,
  });
});

test('Nevergrad route configuration supports official DeepSeek and other OpenRouter models', async () => {
  assert.deepEqual(parseTextModelRoutes('official:deepseek-v4-flash,openrouter:mistralai/mistral-small'), [
    { provider: 'official', model: 'deepseek-v4-flash' },
    { provider: 'openrouter', model: 'mistralai/mistral-small' },
  ]);

  const calls = [];
  const text = await callDeepSeek('review', {
    textModelRoutes: 'official:deepseek-v4-flash',
    deepSeekApiKey: 'ds-test',
    fetchImpl: async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) });
      return jsonResponse(200, { choices: [{ message: { content: 'official-ok' } }] });
    },
  });
  assert.equal(text, 'official-ok');
  assert.equal(calls[0].url, OFFICIAL_DEEPSEEK_ENDPOINT);
  assert.equal('provider' in calls[0].body, false);
});

test('Nevergrad direct tools keep model-native protocols behind isolated adapters', () => {
  const qwen = resolveTextModelAdapter({ provider: 'openrouter', model: OPENROUTER_QWEN_MODEL });
  const nemotron = resolveTextModelAdapter({ provider: 'openrouter', model: OPENROUTER_NEMOTRON_MODEL });
  const openRouterDeepSeek = resolveTextModelAdapter({ provider: 'openrouter', model: OPENROUTER_DEEPSEEK_MODEL });
  const officialDeepSeek = resolveTextModelAdapter({ provider: 'official', model: 'deepseek-v4-flash' });
  assert.equal(qwen.id, 'openrouter-qwen');
  assert.equal(nemotron.id, 'openrouter-nemotron');
  assert.equal(openRouterDeepSeek.id, 'openrouter-deepseek');
  assert.equal(officialDeepSeek.id, 'official-deepseek');

  const qwenPayload = {};
  qwen.applyPayload(qwenPayload, { wantsJson: true });
  assert.deepEqual(qwenPayload.response_format, { type: 'json_object' });
  assert.deepEqual(qwenPayload.reasoning, { effort: 'none', exclude: true });
  assert.deepEqual(qwenPayload.provider.only, ['alibaba']);
  assert(!('tools' in qwenPayload));

  const nemotronPayload = {};
  nemotron.applyPayload(nemotronPayload, { wantsJson: true });
  assert('tools' in nemotronPayload);
  assert(!('response_format' in nemotronPayload));
  assert(!('thinking' in nemotronPayload));

  const deepSeekPayload = {};
  openRouterDeepSeek.applyPayload(deepSeekPayload, { wantsJson: true });
  assert('response_format' in deepSeekPayload);
  assert('thinking' in deepSeekPayload);
  assert(!('tools' in deepSeekPayload));

  const transportSource = fs.readFileSync(path.join(__dirname, '..', 'deepseek_api.cjs'), 'utf8');
  assert.doesNotMatch(transportSource, /response_format|tool_calls|tool_choice/);
  assert.match(transportSource, /adapter\.applyPayload/);
  assert.match(transportSource, /adapter\.extractText/);
});
