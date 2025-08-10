import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Recipe } from '../types';

export const useRecipes = (filters?: {
  category?: string;
  difficulty?: string;
  maxCookingTime?: number;
  search?: string;
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, [filters]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('recipes')
        .select(`
          *,
          categories(name),
          ratings(rating),
          user_profiles(full_name)
        `);

      if (filters?.category && filters.category.trim() !== '') {
        query = query.eq('category', filters.category);
      }

      if (filters?.difficulty && filters.difficulty.trim() !== '') {
        query = query.eq('difficulty', filters.difficulty);
      }

      if (filters?.maxCookingTime) {
        query = query.lte('cooking_time', filters.maxCookingTime);
      }

      if (filters?.search && filters.search.trim() !== '') {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate average ratings
      const recipesWithRatings = data?.map(recipe => {
        const ratings = recipe.ratings || [];
        const avgRating = ratings.length > 0 
          ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length 
          : 0;
        
        return {
          ...recipe,
          average_rating: avgRating,
          total_ratings: ratings.length
        };
      }) || [];

      setRecipes(recipesWithRatings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { recipes, loading, error, refetch: fetchRecipes };
};