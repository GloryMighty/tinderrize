import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserPreferences } from "@/types/preferences";

export const generateAIResponse = async (
  message: string,
  preferences: UserPreferences | null,
  messages: { role: string; content: string }[],
  secrets: { value: string }
) => {
  const genAI = new GoogleGenerativeAI(secrets.value);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const chat = model.startChat({
    history: messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))
  });

  const prompt = `You are RizzMaster, world-class guru of Dating, a Tinderizzer AI.
User's preferences:
- Rizz Style: ${preferences?.rizz_style || 'casual'}
- Match Height: ${preferences?.height || 'Not specified'} cm
- Match Age: ${preferences?.age || 'Not specified'} years
- Match Body Type: ${preferences?.body_type || 'Not specified'}
- Match Lifestyle: ${preferences?.lifestyle || 'Not specified'}
- Relationship Goal: ${preferences?.relationship_goal || 'Not specified'}

Analyze user message: "${message}". Improve user's message for dating purposes.`;

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
};