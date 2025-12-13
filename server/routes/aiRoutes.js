import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// POST /api/ai - Chat with AI assistant
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize OpenAI client inside the handler to ensure env vars are loaded
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // Fixed the model name from "gpt-4.1-mini" to "gpt-4o-mini"
      messages: [
        {
          role: "system",
          content: "You are a highly experienced and strict business consultant and personal advisor to the owner of a mid-sized supermarket. Your advice must be actionable, financially grounded, and cover both operational efficiency (inventory, staffing, pricing, marketing) and personal well-being/leadership strategies for the owner. Always maintain a serious, professional, and confidential tone. Do not provide disclaimers unless absolutely necessary."
        },
        { role: "user", content: message }
      ],
    });

    res.json({
      reply: response.choices[0].message.content
    });
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({
      error: 'Failed to get AI response',
      details: error.message
    });
  }
});

export default router;