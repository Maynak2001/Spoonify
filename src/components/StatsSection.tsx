import React, { useState, useEffect } from 'react';
import { ChefHat, Users, TrendingUp, Clock } from 'lucide-react';
import { getRecipes, getCategories } from '../utils/api';

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
  }, []);

  const fetchStats = async () => {
    try {
      const [recipesRes, categoriesRes] = await Promise.all([
        getRecipes(),
        getCategories()
      ]);

      const recipes = recipesRes.data || [];
      const categories = categoriesRes.data || [];

      const avgTime = recipes.length > 0
        ? Math.round(recipes.reduce((sum: number, r: any) => sum + (r.cookingTime || 0), 0) / recipes.length)
        : 0;

      setStats({
        totalRecipes: recipes.length,
        totalUsers: 0,
        totalCategories: categories.length,
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
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <ChefHat className="h-8 w-8 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.totalRecipes)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Recipes</div>
          </div>
          <div className="text-center">
            <Users className="h-8 w-8 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.totalUsers)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Chefs</div>
          </div>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.totalCategories)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Categories</div>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.avgCookingTime}min
            </div>
            <div className="text-gray-600 dark:text-gray-300">Avg Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
