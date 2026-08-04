'use strict';

const constants = require('./constants.cjs');
const genericOpenRouterAdapter = require('./generic-openrouter.cjs');
const nemotronAdapter = require('./nemotron.cjs');
const officialDeepSeekAdapter = require('./official-deepseek.cjs');
const openRouterDeepSeekAdapter = require('./openrouter-deepseek.cjs');

function resolveTextModelAdapter(route = {}) {
  if (route.provider === 'official') return officialDeepSeekAdapter;
  if (route.model === constants.OPENROUTER_MODEL) return nemotronAdapter;
  if (route.model === constants.OPENROUTER_DEEPSEEK_MODEL) return openRouterDeepSeekAdapter;
  return genericOpenRouterAdapter;
}

module.exports = {
  ...constants,
  genericOpenRouterAdapter,
  nemotronAdapter,
  officialDeepSeekAdapter,
  openRouterDeepSeekAdapter,
  resolveTextModelAdapter,
};
