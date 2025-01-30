import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const apiKey = process.env.GEMINI_API_KEY;

interface Message {
  role: string;
  content: string; // Changed to string for direct input from OpenAI
}

interface RequestData {
  messages: Message[];
}

function transformJson(data: RequestData) {
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const contents = data.messages.map(message => ({
    role: message.role,
    parts: [{ text: message.content }] // Adjusted to match the new structure
  }));

  // Extract system instruction if it exists
  const systemInstruction = data.messages.find(message => message.role === "system") || {
    role: "user",
    content: "System instruction here" // Placeholder for system instruction
  };

  return {
    contents,
    generationConfig,
    systemInstruction: {
      role: systemInstruction.role,
      parts: [{ text: systemInstruction.content }] // Ensure system instruction is included
    }
  };
}

Deno.serve(async (req) => {
  const data = await req.json();

  // Transform OpenAI input to Gemini style
  const payload = transformJson({
    messages: [
      { role: "system", content: data.messages.find(msg => msg.role === "system")?.content || "System instruction here" },
      ...data.messages.filter(msg => msg.role === "user")
    ]
  });

  const chatSession = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await chatSession.json();
  return new Response(
    JSON.stringify({ response: result.candidates[0].content.parts[0].text }),
    { headers: { "Content-Type": "application/json" } },
  );
});
