import { useState, useEffect } from 'react';
import { getRecipes } from '../utils/api';

interface Stats {
  recipesCount: number;
  usersCount: number;
  ratingsCount: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    recipesCount: 0,
    usersCount: 0,
    ratingsCount: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await getRecipes();
      const recipes = data.recipes || [];
      const uniqueUsers = new Set(recipes.map((r: any) => r.userId?._id || r.userId)).size;
      const totalRatings = recipes.reduce((sum: number, r: any) => sum + (r.ratingCount || 0), 0);

      setStats({
        recipesCount: recipes.length,
        usersCount: uniqueUsers,
        ratingsCount: totalRatings
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return stats;
};
