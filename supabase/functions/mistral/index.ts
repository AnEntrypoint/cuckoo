import { createFunction, RequestParams } from "../_utils/createFunction";

const mistralApiUrl = "https://api.mistral.ai/v1/complete";
const mistralApiKeyEnvVar = "MISTRAL_API_KEY";

const DEFAULT_MODEL = "mistral-7b";
const DEFAULT_MAX_TOKENS = 300;
const DEFAULT_TEMPERATURE = 0.7;

const translateRequestBody = (params: RequestParams) => {
  const { prompt, history, systemPrompt, toolCalls, multimodalData, model, max_tokens, temperature, ...rest } = params;
  return {
    prompt: {
      text: prompt,
      history,
      systemPrompt,
      toolCalls,
      multimodalData,
    },
    model: model ?? DEFAULT_MODEL,
    max_tokens: max_tokens ?? DEFAULT_MAX_TOKENS,
    temperature: temperature ?? DEFAULT_TEMPERATURE,
    ...rest
  };
};

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
