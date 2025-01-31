import { createFunction } from "../_utils/createFunction";

const googleApiUrl = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText";
const googleApiKeyEnvVar = "GOOGLE_API_KEY";

const translateRequestBody = (prompt: string, history: string[], systemPrompt: string, toolCalls: any[], multimodalData: any[]) => ({
  prompt: {
    text: prompt,
    history,
    systemPrompt,
    toolCalls,
    multimodalData,
  },
});

const translateResponse = (response: any) => ({
  choices: response.candidates.map((choice: any) => ({
    message: {
      role: "assistant",
      content: choice.output,
    },
    finish_reason: choice.safetyAttributes,
  })),
});

createFunction(googleApiUrl, googleApiKeyEnvVar, translateRequestBody, translateResponse);
