'use strict';

module.exports = Object.freeze({
  id: 'official-deepseek',
  applyPayload(payload, { wantsJson }) {
    payload.thinking = { type: 'disabled' };
    if (wantsJson) payload.response_format = { type: 'json_object' };
  },
  extractText(message) {
    return typeof message?.content === 'string' ? message.content : '';
  },
});
