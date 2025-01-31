import { createFunction, RequestParams } from "../_utils/createFunction";

const azureApiUrl = "https://{resource}.openai.azure.com/openai/deployments/{deployment}/chat/completions?api-version=2023-05-15";
const azureApiKeyEnvVar = "AZURE_OPENAI_API_KEY";

const DEFAULT_MODEL = "gpt-35-turbo";  // This is the deployment name
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

// Note: The actual URL needs to be configured with the correct resource and deployment names
const configuredUrl = azureApiUrl
  .replace("{resource}", process.env.AZURE_RESOURCE_NAME || "")
  .replace("{deployment}", process.env.AZURE_DEPLOYMENT_NAME || DEFAULT_MODEL);

createFunction(configuredUrl, azureApiKeyEnvVar, translateRequestBody, translateResponse);
