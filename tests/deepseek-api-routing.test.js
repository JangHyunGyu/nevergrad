'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  callDeepSeek,
  parseTextModelRoutes,
  OPENROUTER_ENDPOINT,
  OFFICIAL_DEEPSEEK_ENDPOINT,
  OPENROUTER_MODEL,
  OPENROUTER_DEEPSEEK_MODEL,
  JSON_TOOL_NAME,
} = require('../deepseek_api.cjs');

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  };
}

test('Nevergrad tools use Nemotron first with strict JSON tooling', async () => {
  const calls = [];
  const text = await callDeepSeek('translate', {
    openRouterApiKey: 'or-test',
    json: true,
    fetchImpl: async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) });
      return jsonResponse(200, {
        choices: [{
          message: {
            tool_calls: [{
              function: {
                name: JSON_TOOL_NAME,
                arguments: JSON.stringify({ json: JSON.stringify({ ok: true }) }),
              },
            }],
          },
        }],
      });
    },
  });

  assert.equal(text, '{"ok":true}');
  assert.equal(calls[0].url, OPENROUTER_ENDPOINT);
  assert.equal(calls[0].body.model, OPENROUTER_MODEL);
  assert.equal('response_format' in calls[0].body, false);
  assert.equal(calls[0].body.tools[0].function.strict, true);
  assert.deepEqual(calls[0].body.reasoning, { effort: 'none', exclude: true });
});

test('Nevergrad tools fall back to OpenRouter DeepSeek V4 0731', async () => {
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
  assert.deepEqual(calls.map(call => call.body.model), [OPENROUTER_MODEL, OPENROUTER_DEEPSEEK_MODEL]);
  assert.deepEqual(calls[1].body.provider, {
    order: ['deepinfra'],
    only: ['deepinfra'],
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
