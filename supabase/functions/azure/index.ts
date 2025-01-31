import { createFunction } from "../_utils/createFunction";

const azureApiUrl = "https://{instance}.openai.azure.com/openai/deployments/{deployment}/chat/completions?api-version=2024-02-15-preview";
const azureApiKeyEnvVar = "AZURE_OPENAI_API_KEY";

const translateRequestBody = (prompt: string, history: string[], systemPrompt: string, toolCalls: any[], multimodalData: any[]) => {
  const messages = [];
  
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }

  if (history && history.length > 0) {
    for (const msg of history) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  messages.push({ role: "user", content: prompt });

  return {
    messages,
    tools: toolCalls,
    max_tokens: 2000,
    temperature: 0.7,
    stream: false
  };
};

const translateResponse = (response: any) => ({
  choices: [{
    message: {
      role: "assistant",
      content: response.choices[0].message.content,
    },
    finish_reason: response.choices[0].finish_reason,
  }],
  usage: response.usage,
});

createFunction(azureApiUrl, azureApiKeyEnvVar, translateRequestBody, translateResponse); 