import { createFunction, RequestParams } from "../_utils/createFunction";

const openaiApiUrl = "https://api.openai.com/v1/chat/completions";
const openaiApiKeyEnvVar = "OPENAI_API_KEY";

const DEFAULT_MODEL = "gpt-3.5-turbo";
const DEFAULT_MAX_TOKENS = 1000;
const DEFAULT_TEMPERATURE = 0.7;

const translateRequestBody = (params: RequestParams) => {
  const { prompt, history, systemPrompt, toolCalls, multimodalData, model, max_tokens, temperature, ...rest } = params;
  
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((msg, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: msg
    })),
    { role: "user", content: prompt }
  ];

  return {
    messages,
    model: model ?? DEFAULT_MODEL,
    max_tokens: max_tokens ?? DEFAULT_MAX_TOKENS,
    temperature: temperature ?? DEFAULT_TEMPERATURE,
    ...rest
  };
};

const translateResponse = (response: any) => ({
  choices: response.choices.map((choice: any) => ({
    message: choice.message,
    finish_reason: choice.finish_reason,
  })),
});

createFunction(openaiApiUrl, openaiApiKeyEnvVar, translateRequestBody, translateResponse);
