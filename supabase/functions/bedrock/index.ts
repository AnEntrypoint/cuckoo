import { createFunction } from "../_utils/createFunction";

const bedrockApiUrl = "https://bedrock-runtime.{region}.amazonaws.com/model/anthropic.claude-v2/invoke";
const bedrockApiKeyEnvVar = "AWS_BEDROCK_API_KEY";

const translateRequestBody = (prompt: string, history: string[], systemPrompt: string, toolCalls: any[], multimodalData: any[]) => {
  let fullPrompt = "";
  
  if (systemPrompt) {
    fullPrompt += `\n\nHuman: ${systemPrompt}\n\nAssistant: I understand and will follow these instructions.`;
  }

  if (history && history.length > 0) {
    for (const msg of history) {
      fullPrompt += `\n\n${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`;
    }
  }

  fullPrompt += `\n\nHuman: ${prompt}\n\nAssistant:`;

  return {
    prompt: fullPrompt,
    max_tokens: 2000,
    temperature: 0.7,
    anthropic_version: "bedrock-2023-05-31"
  };
};

const translateResponse = (response: any) => ({
  choices: [{
    message: {
      role: "assistant",
      content: response.completion,
    },
    finish_reason: response.stop_reason,
  }],
  usage: {
    prompt_tokens: response.usage?.input_tokens || 0,
    completion_tokens: response.usage?.output_tokens || 0,
    total_tokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
  },
});

createFunction(bedrockApiUrl, bedrockApiKeyEnvVar, translateRequestBody, translateResponse); 