import { createFunction } from "../_utils/createFunction";

const deepseekApiUrl = "https://api.deepseek.com/v1/chat/completions";
const deepseekApiKeyEnvVar = "DEEPSEEK_API_KEY";

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
    model: "deepseek-chat",
    messages,
    max_tokens: 2000,
    temperature: 0.7,
    stream: false,
    tools: toolCalls.length > 0 ? toolCalls : undefined
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

createFunction(deepseekApiUrl, deepseekApiKeyEnvVar, translateRequestBody, translateResponse); 