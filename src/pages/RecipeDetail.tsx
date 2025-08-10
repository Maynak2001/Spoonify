import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Heart, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import { Recipe, Rating } from '../types';
import CommentSection from '../components/CommentSection';
import toast from 'react-hot-toast';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRecipe();
      if (user) {
        checkFavoriteStatus();
        fetchUserRating();
      }
    }
  }, [id, user]);

  const fetchRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          categories(name),
          user_profiles(full_name),
          ratings(rating)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Calculate average rating
      const ratings = data.ratings || [];
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length 
        : 0;

      setRecipe({
        ...data,
        average_rating: avgRating,
        total_ratings: ratings.length
      });
    } catch (error) {
      toast.error('Error loading recipe');
    } finally {
      setLoading(false);
    }
  };



  const checkFavoriteStatus = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('recipe_id', id)
      .eq('user_id', user?.id)
      .single();

    setIsFavorite(!!data);
  };

  const fetchUserRating = async () => {
    const { data } = await supabase
      .from('ratings')
      .select('rating')
      .eq('recipe_id', id)
      .eq('user_id', user?.id)
      .single();

    setUserRating(data?.rating || 0);
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('recipe_id', id)
          .eq('user_id', user.id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await supabase
          .from('favorites')
          .insert({ recipe_id: id, user_id: user.id });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Error updating favorites');
    }
  };

  const submitRating = async (rating: number) => {
    if (!user) {
      toast.error('Please sign in to rate recipes');
      return;
    }

    try {
      await supabase
        .from('ratings')
        .upsert({ 
          recipe_id: id, 
          user_id: user.id, 
          rating 
        });
      
      setUserRating(rating);
      fetchRecipe(); // Refresh to get updated average
      toast.success('Rating submitted');
    } catch (error) {
      toast.error('Error submitting rating');
    }
  };



  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe not found</h2>
          <Link to="/" className="btn-primary">
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-500 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Recipes</span>
        </Link>

        {/* Recipe Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <img
            src={recipe.image_url || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&h=400&fit=crop&crop=center'}
            alt={recipe.title}
            className="w-full h-64 md:h-80 object-cover"
          />
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
                <p className="text-gray-600 text-lg mb-4">{recipe.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.cooking_time} minutes</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>4 servings</span>
                  </div>
                  {recipe.average_rating && recipe.average_rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span>{recipe.average_rating.toFixed(1)}</span>
                      <span className="text-gray-400">({recipe.total_ratings} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {user && user.id === recipe.user_id && (
                  <>
                    <button
                      onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                      className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-500 hover:text-white transition-colors"
                      title="Edit Recipe"
                    >
                      <Edit className="h-6 w-6" />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this recipe?')) {
                          try {
                            const { error } = await supabase
                              .from('recipes')
                              .delete()
                              .eq('id', recipe.id);
                            if (error) throw error;
                            toast.success('Recipe deleted successfully');
                            navigate('/my-recipes');
                          } catch (error) {
                            toast.error('Error deleting recipe');
                          }
                        }
                      }}
                      className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete Recipe"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </>
                )}
                <button
                  onClick={toggleFavorite}
                  className={`p-3 rounded-full transition-colors ${
                    isFavorite 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Rating */}
            {user && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Rate this recipe:</p>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => submitRating(star)}
                      className={`p-1 ${
                        star <= userRating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nutritional Info */}
            {recipe.nutritional_info && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Nutrition Facts</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calories</span>
                    <span className="font-medium">{recipe.nutritional_info.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protein</span>
                    <span className="font-medium">{recipe.nutritional_info.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carbs</span>
                    <span className="font-medium">{recipe.nutritional_info.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fat</span>
                    <span className="font-medium">{recipe.nutritional_info.fat}g</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex space-x-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Comments */}
            <CommentSection recipeId={id!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;