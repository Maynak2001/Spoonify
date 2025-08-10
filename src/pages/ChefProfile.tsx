import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChefHat, Star, Calendar, ArrowLeft } from 'lucide-react';
import { supabase } from '../utils/supabase';
import RecipeCard from '../components/RecipeCard';

interface ChefData {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  created_at: string;
}

const ChefProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [chef, setChef] = useState<ChefData | null>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalRecipes: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchChefData();
    }
  }, [id]);

  const fetchChefData = async () => {
    try {
      // Fetch chef profile
      const { data: chefData, error: chefError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (chefError) throw chefError;
      setChef(chefData);

      // Fetch chef's recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          *,
          categories(name),
          ratings(rating)
        `)
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (recipesError) throw recipesError;

      const recipesWithRatings = recipesData?.map(recipe => {
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

      // Calculate stats
      const totalRecipes = recipesWithRatings.length;
      const allRatings = recipesWithRatings.flatMap(recipe => recipe.ratings || []);
      const avgRating = allRatings.length > 0 
        ? allRatings.reduce((sum, rating) => sum + rating.rating, 0) / allRatings.length 
        : 0;

      setStats({ totalRecipes, avgRating });
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

  if (!chef) {
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
        {/* Back Button */}
        <Link to="/chefs" className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Chefs</span>
        </Link>

        {/* Chef Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-lg">
                {chef.avatar_url ? (
                  <img 
                    src={chef.avatar_url} 
                    alt={chef.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ChefHat className="h-12 w-12 text-primary-500" />
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left text-white">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{chef.full_name}</h1>
                {chef.username && (
                  <p className="text-primary-100 mb-2">@{chef.username}</p>
                )}
                <div className="flex items-center justify-center sm:justify-start space-x-1 text-primary-200">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(chef.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
            <div className="px-6 py-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <ChefHat className="h-6 w-6 text-primary-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRecipes}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Recipes</div>
            </div>
            <div className="px-6 py-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '0.0'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Recipes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recipes by {chef.full_name} ({recipes.length})
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