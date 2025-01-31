import { createFunction, RequestParams } from "../_utils/createFunction";

const togetherApiUrl = "https://api.together.xyz/inference";
const togetherApiKeyEnvVar = "TOGETHER_API_KEY";

const DEFAULT_MODEL = "togethercomputer/llama-2-70b-chat";
const DEFAULT_MAX_TOKENS = 1000;
const DEFAULT_TEMPERATURE = 0.7;

const translateRequestBody = (params: RequestParams) => {
  const { prompt, history, systemPrompt, toolCalls, multimodalData, model, max_tokens, temperature, ...rest } = params;
  
  const messages = [
    systemPrompt && `System: ${systemPrompt}`,
    ...history.map((msg, i) => `${i % 2 === 0 ? "Human" : "Assistant"}: ${msg}`),
    `Human: ${prompt}`
  ].filter(Boolean).join("\n\n");

  return {
    model: model ?? DEFAULT_MODEL,
    prompt: messages,
    max_tokens: max_tokens ?? DEFAULT_MAX_TOKENS,
    temperature: temperature ?? DEFAULT_TEMPERATURE,
    ...rest
  };
};

const translateResponse = (response: any) => ({
  choices: [{
    message: {
      role: "assistant",
      content: response.output.choices[0].text,
    },
    finish_reason: response.output.choices[0].finish_reason,
  }]
});

createFunction(togetherApiUrl, togetherApiKeyEnvVar, translateRequestBody, translateResponse); 