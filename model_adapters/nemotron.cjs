'use strict';

const { JSON_TOOL_NAME, buildJsonTool } = require('./constants.cjs');

module.exports = Object.freeze({
  id: 'openrouter-nemotron',
  applyPayload(payload, { wantsJson }) {
    payload.reasoning = { effort: 'none', exclude: true };
    payload.include_reasoning = false;
    payload.provider = { allow_fallbacks: true };
    if (wantsJson) {
      payload.tools = [buildJsonTool()];
      payload.tool_choice = { type: 'function', function: { name: JSON_TOOL_NAME } };
    }
  },
  extractText(message, { wantsJson }) {
    if (wantsJson) {
      const toolCall = Array.isArray(message?.tool_calls)
        ? message.tool_calls.find(call => call?.function?.name === JSON_TOOL_NAME)
        : null;
      if (toolCall) {
        try {
          const args = typeof toolCall.function.arguments === 'string'
            ? JSON.parse(toolCall.function.arguments)
            : toolCall.function.arguments;
          if (typeof args?.json === 'string' && args.json.trim()) return args.json;
        } catch (_) {
          // Preserve the caller's existing content fallback and JSON repair path.
        }
      }
    }
    return typeof message?.content === 'string' ? message.content : '';
  },
});
