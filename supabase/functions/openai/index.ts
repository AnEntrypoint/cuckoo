import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-exp-1206",
});

function transformJson(data) {
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const history = data.messages.map(message => ({
    role: message.role,
    parts: message.content.map(content => ({ text: content.text }))
  }));

  return { history, generationConfig };
}

Deno.serve(async (req) => {
  const data = await req.json();
  
  const { history, generationConfig } = transformJson(data);

  const chatSession = model.startChat({
    generationConfig,
    history,
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  return new Response(
    JSON.stringify({ response: result.response.text() }),
    { headers: { "Content-Type": "application/json" } },
  );
});
