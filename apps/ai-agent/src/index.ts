import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = process.env.PORT || process.env.AI_PORT || 3002;

app.use(cors());
app.use(express.json());

// Initialize Gemini SDK
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_INSTRUCTION = `You are SocketFlow AI, an expert developer assistant built into the SocketFlow Developer Dashboard.
Your job is to help users integrate the SocketFlow infrastructure into their applications.

Key context about SocketFlow:
- It is a managed WebSockets-as-a-Service platform.
- The client SDK is installed via \`npm install @socketflow/client\`.
- To initialize the client: \`const client = new SocketFlowClient({ url: 'YOUR_URL', token: 'YOUR_API_KEY' });\`
- To subscribe to a channel: \`client.subscribe('channel_name', (message) => { ... });\`
- The REST API endpoint to broadcast a message is \`POST /api/event/:channel\`.

Be concise, provide code snippets when helpful, and always be polite and professional.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get the model
    const model = ai.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });

    // We expect history to be an array of { role: 'user' | 'assistant', content: string }
    let formattedHistory = history ? history.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })) : [];

    // Gemini API requires the history to start with a 'user' role.
    // If the first message is from the model (e.g. the initial greeting), we should remove it.
    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    // Initialize chat
    const chat = model.startChat({
      history: formattedHistory
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ reply: responseText });
  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`🧠 AI Agent Service running on port ${port}`);
});
