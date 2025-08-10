import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ChefHat, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import { Recipe } from '../types';
import toast from 'react-hot-toast';

const MyRecipes: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyRecipes();
    }
  }, [user]);

  const fetchMyRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          categories(name),
          ratings(rating)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

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
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      toast.success('Recipe deleted successfully');
    } catch (error) {
      toast.error('Error deleting recipe');
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
          <p className="text-gray-600 mb-4">You need to be logged in to view your recipes.</p>
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <ChefHat className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
          </div>
          <Link to="/add-recipe" className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Recipe</span>
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes yet</h3>
            <p className="text-gray-600 mb-4">Share your first recipe with the community!</p>
            <Link to="/add-recipe" className="btn-primary">
              Add Your First Recipe
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="card group hover:shadow-lg transition-all duration-300">
                <Link to={`/recipe/${recipe.id}`}>
                  <div className="relative">
                    <img
                      src={recipe.image_url || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=250&fit=crop&crop=center'}
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        recipe.difficulty === 'Easy' ? 'text-green-600 bg-green-50' :
                        recipe.difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-50' :
                        'text-red-600 bg-red-50'
                      }`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link to={`/recipe/${recipe.id}`}>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                      {recipe.description}
                    </p>
                  </Link>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {recipe.cooking_time} min • {recipe.total_ratings} reviews
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                        className="p-2 text-gray-600 hover:text-primary-500 transition-colors"
                        title="Edit Recipe"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteRecipe(recipe.id)}
                        className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                        title="Delete Recipe"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;