import { ChatMessage, ChatHistory, UserPreferences } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GENERATION_CONFIG = {
  temperature: 0.5,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 1000,
};

const generateAIResponse = async (
  message: string,
  preferences: UserPreferences | null,
  messages: ChatMessage[],
  secrets: any
) => {
  const genAI = new GoogleGenerativeAI(secrets.value);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = getPrompt(message, preferences, messages);
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: GENERATION_CONFIG,
  });

  return result.response.text();
};

const getPrompt = (
  message: string, 
  preferences: UserPreferences | null,
  messages: ChatMessage[]
) => {
  const matchContext = preferences ? `
MATCH CONTEXT
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

  return `${matchContext}
${historyContext}

MESSAGE TO ANALYZE: ${message}

Provide your analysis and improvements following the exact format specified above.`;
};

export const handleAIResponse = async (
  message: string,
  preferences: UserPreferences | null,
  messages: ChatMessage[],
  onScoreUpdate: (score: number) => void,
  isDevelopment: boolean = false
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Please sign in to use this feature.");
  }

  if (isDevelopment) {
    const { data: { secrets } } = await supabase.functions.invoke('get-secret', {
      body: { name: 'GEMINI_API_KEY' }
    });
    
    const text = await generateAIResponse(message, preferences, messages, secrets);
    updateRizzScore(text, onScoreUpdate);
    return text;
  }

  // Production flow
  const { data: credits } = await supabase
    .from('user_credits')
    .select('tokens')
    .eq('id', user.id)
    .maybeSingle();

  if (!credits || credits.tokens < 1) {
    throw new Error("Insufficient tokens. Please upgrade to continue.");
  }

  const { data: { secrets } } = await supabase.functions.invoke('get-secret', {
    body: { name: 'GEMINI_API_KEY' }
  });

  const text = await generateAIResponse(message, preferences, messages, secrets);

  // Deduct token after successful API call
  await supabase
    .from('user_credits')
    .update({ tokens: credits.tokens - 1 })
    .eq('id', user.id);

  updateRizzScore(text, onScoreUpdate);
  return text;
};

const updateRizzScore = (text: string, onScoreUpdate: (score: number) => void) => {
  const scoreMatch = text.match(/RIZZ SCORE:\s*(\d{1,3})/);
  if (scoreMatch && scoreMatch[1]) {
    const score = parseInt(scoreMatch[1], 10);
    if (score >= 0 && score <= 100) {
      onScoreUpdate(score);
    }
  }
};