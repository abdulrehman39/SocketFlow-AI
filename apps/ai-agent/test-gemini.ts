import 'dotenv/config';

import { GoogleGenerativeAI } from '@google/generative-ai';

// @ts-ignore
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function test() {
  try {
    const SYSTEM_INSTRUCTION = `You are SocketFlow AI...`;

    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const formattedHistory: any[] = []; // empty history

    const chat = model.startChat({
      history: formattedHistory
    });

    const result = await chat.sendMessage("test message");
    console.log("Success:", result.response.text());
  } catch (err: any) {
    console.error("Error:", err);
  }
}

test();
