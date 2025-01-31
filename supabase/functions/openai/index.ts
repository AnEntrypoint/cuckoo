import { createFunction } from "../_utils/createFunction";

const openaiApiUrl = "https://api.openai.com/v1/chat/completions";
const openaiApiKeyEnvVar = "OPENAI_API_KEY";

const translateRequestBody = (body: any) => body;

const translateResponse = (response: any) => response;

createFunction(openaiApiUrl, openaiApiKeyEnvVar, translateRequestBody, translateResponse);
