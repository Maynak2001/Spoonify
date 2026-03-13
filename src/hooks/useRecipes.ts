import { useState, useEffect } from 'react';
import { getRecipes, normalizeRecipe } from '../utils/api';
import { Recipe } from '../types';

export const useRecipes = (filters?: {
  category?: string;
  difficulty?: string;
  maxCookingTime?: number;
  search?: string;
  userId?: string;
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, [JSON.stringify(filters)]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters?.category) params.category = filters.category;
      if (filters?.difficulty) params.difficulty = filters.difficulty;
      if (filters?.search) params.search = filters.search;
      if (filters?.userId) params.userId = filters.userId;

      const { data } = await getRecipes(params);
      let allRecipes = (data.recipes || []).map(normalizeRecipe);

      if (filters?.maxCookingTime && filters.maxCookingTime < 120) {
        allRecipes = allRecipes.filter((r: any) => r.cooking_time <= filters.maxCookingTime!);
      }

      setRecipes(allRecipes as Recipe[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { recipes, loading, error, refetch: fetchRecipes };
};
