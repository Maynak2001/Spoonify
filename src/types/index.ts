export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cooking_time: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  image_url?: string;
  nutritional_info?: NutritionalInfo;
  created_at: string;
  user_id: string;
  average_rating?: number;
  total_ratings?: number;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Rating {
  id: string;
  recipe_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  recipe_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  recipe_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  created_at: string;
  user_profile?: UserProfile;
  likes_count?: number;
  user_liked?: boolean;
  replies?: Comment[];
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}