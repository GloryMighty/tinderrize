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

export interface UserProfile {
  id: string;
  full_name: string | null;
  age: number | null;
  country: string | null;
  city: string | null;
  created_at: string;
  updated_at: string;
}