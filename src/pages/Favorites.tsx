import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ChefHat } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types';

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          recipes(
            *,
            categories(name),
            ratings(rating),
            user_profiles(full_name)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const favoriteRecipes = data?.map(fav => {
        const recipe = fav.recipes as any;
        const ratings = recipe?.ratings || [];
        const avgRating = ratings.length > 0 
          ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length 
          : 0;
        
        return {
          ...recipe,
          average_rating: avgRating,
          total_ratings: ratings.length
        } as Recipe;
      }) || [];

      setFavorites(favoriteRecipes);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your favorites.</p>
          <button
            onClick={() => navigate('/auth')}
            className="btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-4">Start exploring recipes and save your favorites!</p>
            <Link to="/" className="btn-primary">
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                isFavorite={true}
                onFavoriteToggle={fetchFavorites}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;