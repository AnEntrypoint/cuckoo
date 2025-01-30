import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const data = await req.json();
  const url = "https://api.openai.com/v1/chat/completions";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + Deno.env.get("OPENAI_API_KEY"),
    },
    body: JSON.stringify(data), // Pass over the payload directly
  };

  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const res = await response.json();
  return new Response(
    JSON.stringify(res),
    { headers: { "Content-Type": "application/json" } },
  );
});
