import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChefHat, Star, ArrowLeft } from 'lucide-react';
import { getRecipes, normalizeRecipe } from '../utils/api';
import RecipeCard from '../components/RecipeCard';

const ChefProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [chefName, setChefName] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalRecipes: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchChefData();
  }, [id]);

  const fetchChefData = async () => {
    try {
      const { data } = await getRecipes({ userId: id });
      const rawRecipes = data.recipes || [];
      const normalized = rawRecipes.map(normalizeRecipe);

      if (rawRecipes.length > 0) {
        setChefName(rawRecipes[0].userId?.username || 'Unknown Chef');
      }

      setRecipes(normalized);

      const avgRating = normalized.length > 0
        ? normalized.reduce((sum: number, r: any) => sum + (r.average_rating || 0), 0) / normalized.length
        : 0;

      setStats({ totalRecipes: normalized.length, avgRating });
    } catch (error) {
      console.error('Error fetching chef data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!chefName && recipes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Chef not found</h2>
          <Link to="/chefs" className="btn-primary">Back to Chefs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/chefs" className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Chefs</span>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center">
                <ChefHat className="h-12 w-12 text-primary-500" />
              </div>
              <div className="text-center sm:text-left text-white">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{chefName}</h1>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
            <div className="px-6 py-4 text-center">
              <ChefHat className="h-6 w-6 text-primary-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRecipes}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Recipes</div>
            </div>
            <div className="px-6 py-4 text-center">
              <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '0.0'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recipes by {chefName} ({recipes.length})
          </h2>

          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No recipes yet</h3>
              <p className="text-gray-600 dark:text-gray-300">This chef hasn't shared any recipes yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefProfile;
