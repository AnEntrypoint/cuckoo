import { createFunction } from "../_utils/createFunction";

const huggingfaceApiUrl = "https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf";
const huggingfaceApiKeyEnvVar = "HUGGINGFACE_API_KEY";

const translateRequestBody = (prompt: string, history: string[], systemPrompt: string, toolCalls: any[], multimodalData: any[]) => {
  const messages = [];
  
  if (systemPrompt) {
    messages.push({
      role: "system",
      content: systemPrompt
    });
  }

  if (history && history.length > 0) {
    for (const msg of history) {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }
  }

  messages.push({
    role: "user",
    content: prompt
  });

  return {
    inputs: {
      messages,
      max_new_tokens: 2000,
      temperature: 0.7,
      return_full_text: false,
      tools: toolCalls
    },
    options: {
      wait_for_model: true,
      use_cache: true
    }
  };
};

const translateResponse = (response: any) => {
  const generatedText = response[0]?.generated_text || "";
  return {
    choices: [{
      message: {
        role: "assistant",
        content: generatedText,
      },
      finish_reason: "stop",
    }],
    usage: {
      prompt_tokens: 0, // HF doesn't provide token counts
      completion_tokens: 0,
      total_tokens: 0,
    },
  };
};

createFunction(huggingfaceApiUrl, huggingfaceApiKeyEnvVar, translateRequestBody, translateResponse); 