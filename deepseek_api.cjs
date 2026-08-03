'use strict';

const fs = require('fs');
const path = require('path');

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const OFFICIAL_DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions';
const OPENROUTER_MODEL = 'deepseek/deepseek-v4-flash-0731';
const DEEPSEEK_MODEL = 'deepseek-v4-flash';
const OPENROUTER_PROVIDER = 'deepinfra';
const ENV_FILES = [
  path.join(__dirname, '.env'),
  path.join(__dirname, '..', '.env.txt'),
];

function readOptionalApiKey(name) {
  if (process.env[name]) return process.env[name].trim();
  for (const file of ENV_FILES) {
    const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    const key = content.match(new RegExp(`^${name}=(.+)$`, 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '');
    if (key) return key;
  }
  return '';
}

function normalizeOpenRouterModel(value) {
  const model = String(value || '').trim();
  if (!model || model === DEEPSEEK_MODEL || model === `deepseek/${DEEPSEEK_MODEL}`) return OPENROUTER_MODEL;
  return model.includes('/') ? model : `deepseek/${model}`;
}

async function requestRoute(route, prompt, options) {
  const payload = {
    model: route.model,
    messages: [{ role: 'user', content: prompt }],
    thinking: { type: 'disabled' },
    temperature: Number.isFinite(options.temperature) ? options.temperature : 0.25,
    top_p: Number.isFinite(options.topP) ? options.topP : 0.9,
    max_tokens: Number.isFinite(options.maxTokens) ? options.maxTokens : 32768,
    ...(options.json === true ? { response_format: { type: 'json_object' } } : {}),
  };
  if (route.provider === 'openrouter') {
    payload.provider = {
      order: [OPENROUTER_PROVIDER],
      only: [OPENROUTER_PROVIDER],
      allow_fallbacks: false,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 180000);
  let response;
  try {
    response = await options.fetchImpl(route.endpoint, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${route.apiKey}`,
        'content-type': 'application/json',
        ...(route.provider === 'openrouter' ? {
          'HTTP-Referer': 'https://nevergrad.archerlab.dev',
          'X-Title': 'Nevergrad DeepSeek Tools',
        } : {}),
      },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });
  } finally {
    clearTimeout(timeout);
  }

  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = {};
  }
  if (!response.ok) {
    const detail = data?.error?.message || responseText.slice(0, 500);
    throw new Error(`${route.provider} API error (${response.status}): ${detail}`);
  }
  const text = data?.choices?.[0]?.message?.content || '';
  if (!text.trim()) throw new Error(`${route.provider} returned an empty response`);
  return text;
}

async function callDeepSeek(prompt, options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== 'function') throw new Error('fetch is unavailable');

  const openRouterApiKey = options.openRouterApiKey ?? readOptionalApiKey('OPENROUTER_API_KEY');
  const deepSeekApiKey = options.deepSeekApiKey ?? readOptionalApiKey('DEEPSEEK_API_KEY');
  const routes = [
    ...(openRouterApiKey ? [{
      provider: 'openrouter',
      endpoint: OPENROUTER_ENDPOINT,
      model: normalizeOpenRouterModel(
        options.openRouterModel || process.env.OPENROUTER_MODEL || process.env.DEEPSEEK_MODEL
      ),
      apiKey: openRouterApiKey,
    }] : []),
    ...(deepSeekApiKey ? [{
      provider: 'official',
      endpoint: OFFICIAL_DEEPSEEK_ENDPOINT,
      model: options.deepSeekModel || process.env.DEEPSEEK_MODEL || DEEPSEEK_MODEL,
      apiKey: deepSeekApiKey,
    }] : []),
  ];
  if (!routes.length) throw new Error('OPENROUTER_API_KEY and DEEPSEEK_API_KEY not found');

  const errors = [];
  for (const route of routes) {
    try {
      return await requestRoute(route, prompt, { ...options, fetchImpl });
    } catch (error) {
      errors.push(`${route.provider}: ${error?.message || String(error)}`);
    }
  }
  throw new Error(`DeepSeek providers exhausted: ${errors.join(' | ')}`);
}

module.exports = {
  callDeepSeek,
  readOptionalApiKey,
  normalizeOpenRouterModel,
  OPENROUTER_ENDPOINT,
  OFFICIAL_DEEPSEEK_ENDPOINT,
  OPENROUTER_MODEL,
  DEEPSEEK_MODEL,
  OPENROUTER_PROVIDER,
};
