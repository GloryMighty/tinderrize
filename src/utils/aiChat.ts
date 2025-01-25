import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserPreferences } from "@/types/preferences";
import { GENERATION_CONFIG, SYSTEM_PROMPT } from "./aiConfig";

export const generateAIResponse = async (
  message: string,
  preferences: UserPreferences | null,
  messages: { role: string; content: string }[],
  secrets: { value: string }
) => {
  const genAI = new GoogleGenerativeAI(secrets.value);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const rizzStyle = preferences?.rizz_style || 'casual';
  const rizzContext = `Current Rizz Style: ${rizzStyle}. Please analyze and improve the message keeping in mind that the user prefers a ${rizzStyle} approach to communication.`;

  const matchContext = preferences ? `
MATCH CONTEXT
${rizzContext}
Style Preference: ${preferences.rizz_style || 'Not specified'}
Height: ${preferences.height ? preferences.height + 'cm' : 'Not specified'}
Age: ${preferences.age ? preferences.age + ' years' : 'Not specified'}
Body Type: ${preferences.body_type || 'Not specified'}
Lifestyle: ${preferences.lifestyle || 'Not specified'}
Relationship Goal: ${preferences.relationship_goal || 'Not specified'}

Consider these match preferences carefully when analyzing and improving the message.` : '';

  const historyContext = messages.length > 0 ? 
    "\nPREVIOUS INTERACTIONS:\n" + messages.slice(-2).map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n') : '';

  const prompt = `${SYSTEM_PROMPT}

${matchContext}
${historyContext}

MESSAGE TO ANALYZE: ${message}

Provide your analysis and improvements following the exact format specified above.`;

  const chat = model.startChat({
    history: messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })),
    generationConfig: GENERATION_CONFIG,
  });

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
};
