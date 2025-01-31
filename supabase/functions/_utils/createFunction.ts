import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getEnvironmentVariable } from "./environment.ts";
import { fetchWithRetry } from "./fetchWithRetry.ts";

export const createFunction = (apiUrl: string, apiKeyEnvVar: string, requestBody: (prompt: string, history: string[], systemPrompt: string, toolCalls: any[], multimodalData: any[]) => any, translateResponse: (response: any) => any) => {
  const apiKey = getEnvironmentVariable(apiKeyEnvVar);

  return serve(async (req) => {
    const { prompt, history, systemPrompt, toolCalls, multimodalData } = await req.json();

    const response = await fetchWithRetry(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody(prompt, history, systemPrompt, toolCalls, multimodalData)),
    });

    const data = await response.json();
    const translatedResponse = translateResponse(data);

    return new Response(JSON.stringify(translatedResponse), {
      headers: { "Content-Type": "application/json" },
    });
  });
};
