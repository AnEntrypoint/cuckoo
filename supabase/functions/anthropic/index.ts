import { createFunction } from "../_utils/createFunction";

const anthropicApiUrl = "https://api.anthropic.ai/v1/complete";
const anthropicApiKeyEnvVar = "ANTHROPIC_API_KEY";

const translateRequestBody = (prompt: string, history: string[], systemPrompt: string, toolCalls: any[], multimodalData: any[]) => ({
  prompt: {
    text: prompt,
    history,
    systemPrompt,
    toolCalls,
    multimodalData,
  },
  model: "claude-2",
  max_tokens_to_sample: 300,
  stop_sequences: ["\n\nHuman:"],
});

const translateResponse = (response: any) => ({
  choices: response.completion.map((choice: any) => ({
    message: {
      role: "assistant",
      content: choice.text,
    },
    finish_reason: choice.stop_reason,
  })),
});

createFunction(anthropicApiUrl, anthropicApiKeyEnvVar, translateRequestBody, translateResponse);
