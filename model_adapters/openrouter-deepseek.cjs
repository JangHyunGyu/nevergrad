'use strict';

module.exports = Object.freeze({
  id: 'openrouter-deepseek',
  applyPayload(payload, { wantsJson }) {
    payload.reasoning = { effort: 'none', exclude: true };
    payload.include_reasoning = false;
    payload.thinking = { type: 'disabled' };
    payload.provider = {
      order: ['deepinfra'],
      only: ['deepinfra'],
      allow_fallbacks: false,
    };
    if (wantsJson) payload.response_format = { type: 'json_object' };
  },
  extractText(message) {
    return typeof message?.content === 'string' ? message.content : '';
  },
});
