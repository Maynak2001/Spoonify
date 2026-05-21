import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ChefHat, Edit, Trash2 } from 'lucide-react';
import { getRecipes, deleteRecipe, normalizeRecipe } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const MyRecipes: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMyRecipes();
    else setLoading(false);
  }, [user]);

  const fetchMyRecipes = async () => {
    if (!user) return;
    try {
      const { data } = await getRecipes({ userId: user.id });
      setRecipes((data.recipes || []).map(normalizeRecipe));
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId: string) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      await deleteRecipe(recipeId);
      setRecipes(recipes.filter(r => r.id !== recipeId));
      toast.success('Recipe deleted successfully');
    } catch (error) {
      toast.error('Error deleting recipe');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-[#d4a843] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Sign In</h2>
          <button onClick={() => navigate('/auth')} className="btn-primary">Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <ChefHat className="h-8 w-8 text-[#d4a843]" />
            <h1 className="text-3xl font-bold text-white">My Recipes</h1>
          </div>
          <Link to="/add-recipe" className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Recipe</span>
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No recipes yet</h3>
            <p className="text-gray-500 mb-4">Share your first recipe with the community!</p>
            <Link to="/add-recipe" className="btn-primary">Add Your First Recipe</Link>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                        recipe.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                        recipe.difficulty === 'Medium' ? 'bg-[#d4a843]/20 text-[#d4a843]' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>{recipe.difficulty}</span>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/recipe/${recipe.id}`}>
                    <h3 className="font-semibold text-lg text-white mb-2 line-clamp-2 group-hover:text-[#d4a843] transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {recipe.description}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between border-t border-white/[0.05] pt-3">
                    <div className="text-sm text-gray-600">
                      {recipe.cooking_time} min • {recipe.total_ratings} reviews
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                        className="p-2 rounded-lg text-gray-500 hover:text-[#d4a843] hover:bg-white/[0.05] transition-all"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
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
