import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

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
      const [recipesResult, usersResult, ratingsResult] = await Promise.all([
        supabase.from('recipes').select('id', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('ratings').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        recipesCount: recipesResult.count || 0,
        usersCount: usersResult.count || 0,
        ratingsCount: ratingsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return stats;
};