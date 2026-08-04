'use strict';

module.exports = Object.freeze({
  id: 'openrouter-generic',
  applyPayload(payload, { wantsJson }) {
    payload.provider = { allow_fallbacks: true };
    if (wantsJson) payload.response_format = { type: 'json_object' };
  },
  extractText(message) {
    return typeof message?.content === 'string' ? message.content : '';
  },
});
