'use strict';

module.exports = Object.freeze({
  id: 'openrouter-generic',
  applyPayload(payload, { wantsJson }) {
    if (payload.model === 'google/gemma-4-31b-it') {
      payload.provider = {
        order: ['venice'],
        only: ['venice'],
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
