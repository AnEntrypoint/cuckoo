import { createFunction, RequestParams } from "../_utils/createFunction";

const cohereApiUrl = "https://api.cohere.ai/v1/generate";
const cohereApiKeyEnvVar = "COHERE_API_KEY";

const DEFAULT_MODEL = "command";
const DEFAULT_MAX_TOKENS = 500;
const DEFAULT_TEMPERATURE = 0.7;

const translateRequestBody = (params: RequestParams) => {
  const { prompt, history, systemPrompt, toolCalls, multimodalData, model, max_tokens, temperature, ...rest } = params;
  
  const messages = [
    systemPrompt,
    ...history,
    prompt
  ].filter(Boolean).join("\n\n");

  return {
    prompt: messages,
    model: model ?? DEFAULT_MODEL,
    max_tokens: max_tokens ?? DEFAULT_MAX_TOKENS,
    temperature: temperature ?? DEFAULT_TEMPERATURE,
    ...rest
  };
};

const translateResponse = (response: any) => ({
  choices: response.generations.map((generation: any) => ({
    message: {
      role: "assistant",
      content: generation.text,
    },
    finish_reason: generation.finish_reason,
  })),
});

createFunction(cohereApiUrl, cohereApiKeyEnvVar, translateRequestBody, translateResponse);
