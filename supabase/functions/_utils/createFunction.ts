import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getEnvironmentVariable } from "./environment.ts";
import { fetchWithRetry } from "./fetchWithRetry.ts";

export type RequestParams = {
  prompt: string;
  history: string[];
  systemPrompt: string;
  toolCalls: any[];
  multimodalData: any[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
  [key: string]: any;
};

export const createFunction = (
  apiUrl: string, 
  apiKeyEnvVar: string, 
  translateRequestBody: (params: RequestParams) => any, 
  translateResponse: (response: any) => any
) => {
  const apiKey = getEnvironmentVariable(apiKeyEnvVar);

  return serve(async (req) => {
    const requestParams: RequestParams = await req.json();

    const response = await fetchWithRetry(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(translateRequestBody(requestParams)),
    });

    const data = await response.json();
    const translatedResponse = translateResponse(data);

    return new Response(JSON.stringify(translatedResponse), {
      headers: { "Content-Type": "application/json" },
    });
  });
};
