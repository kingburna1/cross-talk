import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { message } = await req.json();
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",     // or any available
    messages: [
      {
        role: "system",
        content: "You are a highly experienced and strict business consultant and personal advisor to the owner of a mid-sized supermarket. Your advice must be actionable, financially grounded, and cover both operational efficiency (inventory, staffing, pricing, marketing) and personal well-being/leadership strategies for the owner. Always maintain a serious, professional, and confidential tone. Do not provide disclaimers unless absolutely necessary."
      },
      { role: "user", content: message }
    ],
  });

  return Response.json({
    reply: response.choices[0].message.content
  });
}
