import { createFunction, RequestParams } from "../_utils/createFunction";

const anthropicApiUrl = "https://api.anthropic.ai/v1/complete";
const anthropicApiKeyEnvVar = "ANTHROPIC_API_KEY";

const DEFAULT_MODEL = "claude-2";
const DEFAULT_MAX_TOKENS = 300;
const DEFAULT_STOP_SEQUENCES = ["\n\nHuman:"];

const translateRequestBody = (params: RequestParams) => {
  const { prompt, history, systemPrompt, toolCalls, multimodalData, model, max_tokens, ...rest } = params;
  
  return {
    prompt: {
      text: prompt,
      history,
      systemPrompt,
      toolCalls,
      multimodalData,
    },
    model: model ?? DEFAULT_MODEL,
    max_tokens_to_sample: max_tokens ?? DEFAULT_MAX_TOKENS,
    stop_sequences: DEFAULT_STOP_SEQUENCES,
    ...rest
  };
};

const translateResponse = (response: any) => ({
  choices: response.completion.map((choice: any) => ({
    message: {
      role: "assistant",
      content: choice.text,
    },
    finish_reason: choice.stop_reason,
  })),
});

createFunction(anthropicApiUrl, anthropicApiKeyEnvVar, translateRequestBody, translateResponse);
