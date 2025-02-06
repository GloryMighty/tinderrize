export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatHistory {
  role: 'user' | 'assistant';
  content: string;
}

export interface UserPreferences {
  rizz_style?: string;
  height?: number;
  age?: number;
  body_type?: string;
  lifestyle?: string;
  relationship_goal?: string;
  match_name?: string;
  gender?: string;
}