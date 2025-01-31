import { createFunction, RequestParams } from "../_utils/createFunction";

const groqApiUrl = "https://api.groq.com/v1/chat/completions";
const groqApiKeyEnvVar = "GROQ_API_KEY";

const DEFAULT_MODEL = "mixtral-8x7b-32768";
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
    messages,
    max_tokens: max_tokens ?? DEFAULT_MAX_TOKENS,
    temperature: temperature ?? DEFAULT_TEMPERATURE,
    ...rest
  };
};

const translateResponse = (response: any) => ({
  choices: [{
    message: response.choices[0].message,
    finish_reason: response.choices[0].finish_reason,
  }]
});

createFunction(groqApiUrl, groqApiKeyEnvVar, translateRequestBody, translateResponse); 