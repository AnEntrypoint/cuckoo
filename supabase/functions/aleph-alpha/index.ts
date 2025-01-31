import { createFunction } from "../_utils/createFunction";

const alephAlphaApiUrl = "https://api.aleph-alpha.com/complete";
const alephAlphaApiKeyEnvVar = "ALEPH_ALPHA_API_KEY";

const translateRequestBody = (prompt: string, history: string[], systemPrompt: string, toolCalls: any[], multimodalData: any[]) => {
  let fullPrompt = "";
  
  if (systemPrompt) {
    fullPrompt += `${systemPrompt}\n\n`;
  }

  if (history && history.length > 0) {
    for (const msg of history) {
      fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    }
  }

  fullPrompt += `User: ${prompt}\nAssistant:`;

  return {
    model: "luminous-supreme",
    prompt: fullPrompt,
    maximum_tokens: 2000,
    temperature: 0.7,
    stop_sequences: ["User:", "Assistant:"],
    completion_bias_inclusion: [], // For tool calls if needed
    completion_bias_exclusion: [],
  };
};

const translateResponse = (response: any) => ({
  choices: [{
    message: {
      role: "assistant",
      content: response.completions[0].completion,
    },
    finish_reason: response.completions[0].finish_reason || "stop",
  }],
  usage: {
    prompt_tokens: response.metrics?.prompt_tokens || 0,
    completion_tokens: response.metrics?.completion_tokens || 0,
    total_tokens: (response.metrics?.prompt_tokens || 0) + (response.metrics?.completion_tokens || 0),
  },
});

createFunction(alephAlphaApiUrl, alephAlphaApiKeyEnvVar, translateRequestBody, translateResponse); 