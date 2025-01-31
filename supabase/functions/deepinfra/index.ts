import { createFunction } from "../_utils/createFunction";

const deepinfraApiUrl = "https://api.deepinfra.com/v1/openai/chat/completions";
const deepinfraApiKeyEnvVar = "DEEPINFRA_API_KEY";

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
    model: "meta-llama/Llama-2-70b-chat-hf",
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

createFunction(deepinfraApiUrl, deepinfraApiKeyEnvVar, translateRequestBody, translateResponse); 