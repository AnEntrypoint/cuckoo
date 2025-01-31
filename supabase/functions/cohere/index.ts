import { createFunction } from "../_utils/createFunction";

const cohereApiUrl = "https://api.cohere.ai/v1/generate";
const cohereApiKeyEnvVar = "COHERE_API_KEY";

const translateRequestBody = (prompt: string, history: string[], systemPrompt: string, toolCalls: any[], multimodalData: any[]) => ({
  model: "command",
  prompt: {
    text: prompt,
    history,
    systemPrompt,
    toolCalls,
    multimodalData,
  },
  max_tokens: 300,
  temperature: 0.7,
});

const translateResponse = (response: any) => ({
  choices: response.generations.map((choice: any) => ({
    message: {
      role: "assistant",
      content: choice.text,
    },
    finish_reason: choice.finish_reason,
  })),
});

createFunction(cohereApiUrl, cohereApiKeyEnvVar, translateRequestBody, translateResponse);
