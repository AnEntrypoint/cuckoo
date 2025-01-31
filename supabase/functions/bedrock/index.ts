import { createFunction, RequestParams } from "../_utils/createFunction";

const bedrockApiUrl = "https://bedrock-runtime.{region}.amazonaws.com/model/anthropic.claude-v2/invoke";
const bedrockApiKeyEnvVar = "AWS_ACCESS_KEY_ID";  // Note: Also requires AWS_SECRET_ACCESS_KEY and AWS_REGION

const DEFAULT_MODEL = "anthropic.claude-v2";
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
    prompt: messages,
    max_tokens_to_sample: max_tokens ?? DEFAULT_MAX_TOKENS,
    temperature: temperature ?? DEFAULT_TEMPERATURE,
    ...rest
  };
};

const translateResponse = (response: any) => ({
  choices: [{
    message: {
      role: "assistant",
      content: response.completion,
    },
    finish_reason: response.stop_reason,
  }]
});

const configuredUrl = bedrockApiUrl.replace("{region}", process.env.AWS_REGION || "us-east-1");
createFunction(configuredUrl, bedrockApiKeyEnvVar, translateRequestBody, translateResponse); 