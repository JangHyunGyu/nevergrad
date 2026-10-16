'use strict';

const { OPENROUTER_GEMMA_PROVIDER } = require('./constants.cjs');

module.exports = Object.freeze({
  id: 'openrouter-generic',
  applyPayload(payload, { wantsJson }) {
    if (payload.model === 'google/gemma-4-31b-it') {
      payload.provider = {
        order: [OPENROUTER_GEMMA_PROVIDER, 'venice/fp4'],
        only: [OPENROUTER_GEMMA_PROVIDER, 'venice/fp4'],
        quantizations: ['fp4'],
        allow_fallbacks: false,
        require_parameters: true,
      };
      payload.reasoning = { effort: 'none', exclude: true };
      payload.include_reasoning = false;
    } else {
      payload.provider = { allow_fallbacks: true };
    }
    if (wantsJson) payload.response_format = { type: 'json_object' };
  },
  extractText(message) {
    return typeof message?.content === 'string' ? message.content : '';
  },
});
