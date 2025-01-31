import { createFunction } from "../_utils/createFunction";

const azureOpenaiApiUrl = "https://<your-azure-openai-endpoint>.openai.azure.com/openai/deployments/<your-deployment-id>/chat/completions?api-version=2023-07-01-preview";
const azureOpenaiApiKeyEnvVar = "AZURE_OPENAI_API_KEY";

const translateRequestBody = (prompt: string, history: string[], systemPrompt: string, toolCalls: any[], multimodalData: any[]) => ({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: systemPrompt },
    ...history.map((msg, index) => ({ role: index % 2 === 0 ? "user" : "assistant", content: msg })),
    { role: "user", content: prompt },
    ...toolCalls.map(call => ({ role: "tool", content: JSON.stringify(call) })),
    ...multimodalData.map(data => ({ role: "multimodal", content: JSON.stringify(data) }))
  ],
  max_tokens: 300,
  temperature: 0.7,
});

const translateResponse = (response: any) => ({
  choices: response.choices.map((choice: any) => ({
    message: {
      role: choice.message.role,
      content: choice.message.content,
    },
    finish_reason: choice.finish_reason,
  })),
});

createFunction(azureOpenaiApiUrl, azureOpenaiApiKeyEnvVar, translateRequestBody, translateResponse);
