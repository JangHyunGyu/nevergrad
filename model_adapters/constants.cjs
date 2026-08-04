'use strict';

const OPENROUTER_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';
const OPENROUTER_DEEPSEEK_MODEL = 'deepseek/deepseek-v4-flash-0731';
const JSON_TOOL_NAME = 'submit_json';

function buildJsonTool() {
  return {
    type: 'function',
    function: {
      name: JSON_TOOL_NAME,
      description: 'Return the complete requested JSON value encoded as a JSON string.',
      strict: true,
      parameters: {
        type: 'object',
        properties: {
          json: {
            type: 'string',
            description: 'The complete requested JSON value, serialized as valid JSON.',
          },
        },
        required: ['json'],
        additionalProperties: false,
      },
    },
  };
}

module.exports = { JSON_TOOL_NAME, OPENROUTER_DEEPSEEK_MODEL, OPENROUTER_MODEL, buildJsonTool };
