'use strict';

const fs = require('fs');
const path = require('path');
const {
  JSON_TOOL_NAME,
  OPENROUTER_DEEPSEEK_MODEL,
  OPENROUTER_MODEL,
  OPENROUTER_NEMOTRON_MODEL,
  OPENROUTER_QWEN_MODEL,
  resolveTextModelAdapter,
} = require('./model_adapters/index.cjs');

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const OFFICIAL_DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions';
const DEFAULT_TEXT_MODEL_ROUTES = `openrouter:${OPENROUTER_MODEL},openrouter:${OPENROUTER_DEEPSEEK_MODEL}`;
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
  if (!model) return OPENROUTER_MODEL;
  if (model === 'deepseek-v4-flash' || model === 'deepseek/deepseek-v4-flash') return OPENROUTER_DEEPSEEK_MODEL;
  return model;
}

function parseTextModelRoutes(value = DEFAULT_TEXT_MODEL_ROUTES) {
  const routes = [];
  const seen = new Set();
  for (const token of String(value || '').split(/[\r\n,]+/)) {
    const match = token.trim().match(/^(openrouter|official)\s*:\s*(.+)$/i);
    if (!match) continue;
    const provider = match[1].toLowerCase();
    const rawModel = match[2].trim();
    const model = provider === 'openrouter'
      ? normalizeOpenRouterModel(rawModel)
      : rawModel.replace(/^deepseek\//i, '') || 'deepseek-v4-flash';
    const key = `${provider}:${model}`;
    if (!model || seen.has(key)) continue;
    seen.add(key);
    routes.push({ provider, model });
  }
  return routes;
}

function resolveTextModelRoutes(options = {}) {
  const legacyModel = options.openRouterModel || process.env.OPENROUTER_MODEL;
  const configured = options.textModelRoutes
    || process.env.TEXT_MODEL_ROUTES
    || (legacyModel ? `openrouter:${legacyModel},openrouter:${OPENROUTER_DEEPSEEK_MODEL}` : DEFAULT_TEXT_MODEL_ROUTES);
  const openRouterApiKey = options.openRouterApiKey ?? readOptionalApiKey('OPENROUTER_API_KEY');
  const deepSeekApiKey = options.deepSeekApiKey ?? readOptionalApiKey('DEEPSEEK_API_KEY');
  return parseTextModelRoutes(configured).map(route => ({
    ...route,
    endpoint: route.provider === 'openrouter' ? OPENROUTER_ENDPOINT : OFFICIAL_DEEPSEEK_ENDPOINT,
    apiKey: route.provider === 'openrouter' ? openRouterApiKey : deepSeekApiKey,
  })).filter(route => route.apiKey);
}

async function requestRoute(route, prompt, options) {
  const wantsJson = options.json === true;
  const adapter = resolveTextModelAdapter(route);
  const payload = {
    model: route.model,
    messages: [{ role: 'user', content: prompt }],
    temperature: Number.isFinite(options.temperature) ? options.temperature : 0.25,
    top_p: Number.isFinite(options.topP) ? options.topP : 0.9,
    max_tokens: Number.isFinite(options.maxTokens) ? options.maxTokens : 32768,
  };
  adapter.applyPayload(payload, { wantsJson });

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
          'X-Title': 'Nevergrad Text Model Tools',
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
  const message = data?.choices?.[0]?.message || {};
  const text = adapter.extractText(message, { wantsJson });
  if (!text.trim()) throw new Error(`${route.provider} returned an empty response`);
  return text;
}

async function callDeepSeek(prompt, options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== 'function') throw new Error('fetch is unavailable');

  const routes = resolveTextModelRoutes(options);
  if (!routes.length) throw new Error('No configured text model route has an API key');
  const errors = [];
  for (const route of routes) {
    try {
      return await requestRoute(route, prompt, { ...options, fetchImpl });
    } catch (error) {
      errors.push(`${route.provider}:${route.model}: ${error?.message || String(error)}`);
    }
  }
  throw new Error(`Text model routes exhausted: ${errors.join(' | ')}`);
}

module.exports = {
  callDeepSeek,
  readOptionalApiKey,
  normalizeOpenRouterModel,
  parseTextModelRoutes,
  resolveTextModelRoutes,
  OPENROUTER_ENDPOINT,
  OFFICIAL_DEEPSEEK_ENDPOINT,
  OPENROUTER_MODEL,
  OPENROUTER_NEMOTRON_MODEL,
  OPENROUTER_QWEN_MODEL,
  OPENROUTER_DEEPSEEK_MODEL,
  DEFAULT_TEXT_MODEL_ROUTES,
  JSON_TOOL_NAME,
};
