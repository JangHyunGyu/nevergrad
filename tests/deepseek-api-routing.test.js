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
  OPENROUTER_GEMMA_MAX_TOKENS,
  OPENROUTER_GEMMA_MODEL,
  OPENROUTER_GEMMA_PROVIDER,
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

test('Nevergrad tools use Gemma 4 31B through Venice without fallback', async () => {
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
  assert.equal(calls[0].body.model, OPENROUTER_GEMMA_MODEL);
  assert.deepEqual(calls[0].body.response_format, { type: 'json_object' });
  assert.equal('tools' in calls[0].body, false);
  assert.deepEqual(calls[0].body.reasoning, { effort: 'none', exclude: true });
  assert.equal('thinking' in calls[0].body, false);
  assert.deepEqual(calls[0].body.provider, {
    order: [OPENROUTER_GEMMA_PROVIDER],
    only: [OPENROUTER_GEMMA_PROVIDER],
    allow_fallbacks: false,
    require_parameters: true,
  });
  assert.equal(calls[0].body.max_tokens, OPENROUTER_GEMMA_MAX_TOKENS);
});

test('Nevergrad default route does not fall back to another model or provider', async () => {
  const calls = [];
  await assert.rejects(callDeepSeek('review', {
    openRouterApiKey: 'or-test',
    fetchImpl: async (url, init) => {
      const body = JSON.parse(init.body);
      calls.push({ url, body });
      return jsonResponse(429, { error: { message: 'busy' } });
    },
  }), /Text model routes exhausted/);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.model, OPENROUTER_GEMMA_MODEL);
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
  const gemma = resolveTextModelAdapter({ provider: 'openrouter', model: OPENROUTER_GEMMA_MODEL });
  const nemotron = resolveTextModelAdapter({ provider: 'openrouter', model: OPENROUTER_NEMOTRON_MODEL });
  const openRouterDeepSeek = resolveTextModelAdapter({ provider: 'openrouter', model: OPENROUTER_DEEPSEEK_MODEL });
  const officialDeepSeek = resolveTextModelAdapter({ provider: 'official', model: 'deepseek-v4-flash' });
  assert.equal(qwen.id, 'openrouter-qwen');
  assert.equal(gemma.id, 'openrouter-generic');
  assert.equal(nemotron.id, 'openrouter-nemotron');
  assert.equal(openRouterDeepSeek.id, 'openrouter-deepseek');
  assert.equal(officialDeepSeek.id, 'official-deepseek');

  const qwenPayload = {};
  qwen.applyPayload(qwenPayload, { wantsJson: true });
  assert.deepEqual(qwenPayload.response_format, { type: 'json_object' });
  assert.deepEqual(qwenPayload.reasoning, { effort: 'none', exclude: true });
  assert.deepEqual(qwenPayload.provider.only, ['alibaba']);
  assert(!('tools' in qwenPayload));

  const gemmaPayload = { model: OPENROUTER_GEMMA_MODEL };
  gemma.applyPayload(gemmaPayload, { wantsJson: true });
  assert.deepEqual(gemmaPayload.provider.only, [OPENROUTER_GEMMA_PROVIDER]);
  assert.equal(gemmaPayload.provider.allow_fallbacks, false);
  assert.deepEqual(gemmaPayload.response_format, { type: 'json_object' });
  assert.deepEqual(gemmaPayload.reasoning, { effort: 'none', exclude: true });

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
