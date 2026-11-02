'use strict';

const { OPENROUTER_GEMMA_PROVIDER } = require('./constants.cjs');

module.exports = Object.freeze({
  id: 'openrouter-generic',
  applyPayload(payload, { wantsJson }) {
    payload.reasoning = /^google\/gemini-3/.test(payload.model || '')
      ? { effort: 'minimal', exclude: true }
      : { effort: 'none', enabled: false };
    delete payload.include_reasoning;
    if (payload.model === 'google/gemma-4-31b-it') {
      payload.provider = {
        order: [OPENROUTER_GEMMA_PROVIDER, 'venice/fp4'],
        only: [OPENROUTER_GEMMA_PROVIDER, 'venice/fp4'],
        quantizations: ['fp4'],
        allow_fallbacks: false,
        require_parameters: true,
      };
    } else {
      payload.provider = { allow_fallbacks: true };
    }
    if (wantsJson) payload.response_format = { type: 'json_object' };
  },
  extractText(message) {
    return typeof message?.content === 'string' ? message.content : '';
  },
});
