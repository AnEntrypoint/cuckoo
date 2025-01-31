import { createFunction, RequestParams } from "../_utils/createFunction";

const googleApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const googleApiKeyEnvVar = "GOOGLE_API_KEY";

const DEFAULT_MODEL = "gemini-pro";
const DEFAULT_MAX_TOKENS = 1000;
const DEFAULT_TEMPERATURE = 0.7;

const translateRequestBody = (params: RequestParams) => {
  const { prompt, history, systemPrompt, toolCalls, multimodalData, model, max_tokens, temperature, ...rest } = params;
  
  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    ...history.map((msg, i) => ({
      role: i % 2 === 0 ? "user" : "model",
      parts: [{ text: msg }]
    })),
    { role: "user", parts: [{ text: prompt }] }
  ];

  return {
    contents,
    generationConfig: {
      maxOutputTokens: max_tokens ?? DEFAULT_MAX_TOKENS,
      temperature: temperature ?? DEFAULT_TEMPERATURE,
    },
    ...rest
  };
};

const translateResponse = (response: any) => ({
  choices: response.candidates.map((candidate: any) => ({
    message: {
      role: "assistant",
      content: candidate.content.parts[0].text,
    },
    finish_reason: candidate.finishReason,
  })),
});

createFunction(googleApiUrl, googleApiKeyEnvVar, translateRequestBody, translateResponse);
