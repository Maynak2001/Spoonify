import React, { useState, useEffect } from 'react';
import { ChefHat, Users, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface Stats {
  totalRecipes: number;
  totalUsers: number;
  totalCategories: number;
  avgCookingTime: number;
}

const StatsSection: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalRecipes: 0,
    totalUsers: 0,
    totalCategories: 0,
    avgCookingTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Set up real-time subscriptions
    const recipesSubscription = supabase
      .channel('recipes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'recipes' }, () => {
        fetchStats();
      })
      .subscribe();

    const usersSubscription = supabase
      .channel('users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, () => {
        fetchStats();
      })
      .subscribe();

    const categoriesSubscription = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      recipesSubscription.unsubscribe();
      usersSubscription.unsubscribe();
      categoriesSubscription.unsubscribe();
    };
  }, []);

  const fetchStats = async () => {
    try {
      // Get total recipes
      const { count: recipeCount } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true });

      // Get total users
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Get total categories
      const { count: categoryCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      // Get average cooking time
      const { data: cookingTimes } = await supabase
        .from('recipes')
        .select('cooking_time');

      const avgTime = cookingTimes && cookingTimes.length > 0
        ? Math.round(cookingTimes.reduce((sum, recipe) => sum + recipe.cooking_time, 0) / cookingTimes.length)
        : 0;

      setStats({
        totalRecipes: recipeCount || 0,
        totalUsers: userCount || 0,
        totalCategories: categoryCount || 0,
        avgCookingTime: avgTime
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k+`;
    }
    return `${num}+`;
  };

  if (loading) {
    return (
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="h-8 w-8 bg-gray-200 rounded mx-auto mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <ChefHat className="h-8 w-8 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.totalRecipes)}
            </div>
            <div className="text-gray-600">Recipes</div>
          </div>
          <div className="text-center">
            <Users className="h-8 w-8 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.totalUsers)}
            </div>
            <div className="text-gray-600">Chefs</div>
          </div>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.totalCategories)}
            </div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {stats.avgCookingTime}min
            </div>
            <div className="text-gray-600">Avg Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;