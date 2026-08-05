'use strict';

module.exports = Object.freeze({
  id: 'openrouter-qwen',
  applyPayload(payload, { wantsJson }) {
    payload.reasoning = { effort: 'none', exclude: true };
    payload.include_reasoning = false;
    payload.provider = {
      order: ['alibaba'],
      only: ['alibaba'],
      allow_fallbacks: false,
    };
    if (wantsJson) payload.response_format = { type: 'json_object' };
  },
  extractText(message) {
    return typeof message?.content === 'string' ? message.content : '';
  },
});
