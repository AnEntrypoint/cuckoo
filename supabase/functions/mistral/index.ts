import { createFunction } from "../_utils/createFunction";

const mistralApiUrl = "https://api.mistral.ai/v1/complete";
const mistralApiKeyEnvVar = "MISTRAL_API_KEY";

const translateRequestBody = (prompt: string, history: string[], systemPrompt: string, toolCalls: any[], multimodalData: any[]) => ({
  prompt: {
    text: prompt,
    history,
    systemPrompt,
    toolCalls,
    multimodalData,
  },
  model: "mistral-7b",
  max_tokens: 300,
  temperature: 0.7,
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

createFunction(mistralApiUrl, mistralApiKeyEnvVar, translateRequestBody, translateResponse);
