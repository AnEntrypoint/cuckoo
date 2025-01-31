import { createFunction, RequestParams } from "../_utils/createFunction";

const deepinfraApiUrl = "https://api.deepinfra.com/v1/inference";
const deepinfraApiKeyEnvVar = "DEEPINFRA_API_KEY";

const DEFAULT_MODEL = "meta-llama/Llama-2-70b-chat-hf";
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
    model: model ?? DEFAULT_MODEL,
    input: {
      messages,
      max_tokens: max_tokens ?? DEFAULT_MAX_TOKENS,
      temperature: temperature ?? DEFAULT_TEMPERATURE,
    },
    ...rest
  };
};

const translateResponse = (response: any) => ({
  choices: [{
    message: {
      role: "assistant",
      content: response.results[0].generated_text,
    },
    finish_reason: "stop"
  }]
});

createFunction(deepinfraApiUrl, deepinfraApiKeyEnvVar, translateRequestBody, translateResponse); 