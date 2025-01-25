import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserPreferences } from "@/types/preferences";
import { GENERATION_CONFIG, SYSTEM_PROMPT } from "./aiConfig";
import { ChatMessage } from "@/types/chat";

export const generateAIResponse = async (
  message: string,
  preferences: UserPreferences | null,
  messages: ChatMessage[],
  secrets: { value: string }
) => {
  const genAI = new GoogleGenerativeAI(secrets.value);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const matchContext = preferences ? `
MATCH CONTEXT
Style Preference: ${preferences.rizz_style || 'Not specified'}
Height: ${preferences.height ? preferences.height + 'cm' : 'Not specified'}
Age: ${preferences.age ? preferences.age + ' years' : 'Not specified'}
Body Type: ${preferences.body_type || 'Not specified'}
Lifestyle: ${preferences.lifestyle || 'Not specified'}
Relationship Goal: ${preferences.relationship_goal || 'Not specified'}

Consider these match preferences carefully when analyzing and improving the message.` : '';

  // Convert previous messages to Gemini's format
  const history = messages.slice(-4).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Start chat with history
  const chat = model.startChat({
    history: [
      {
        role: "model",
        parts: [{ text: SYSTEM_PROMPT + "\n" + matchContext }]
      },
      ...history
    ],
    generationConfig: GENERATION_CONFIG,
  });

  // Send the new message
  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
};