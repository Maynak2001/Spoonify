import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, X, ArrowLeft, ChefHat } from 'lucide-react';
import { getRecipes, normalizeRecipe } from '../utils/api';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner'];

interface PlannedMeal {
  recipeId: string;
  recipeTitle: string;
  recipeImage?: string;
}

type MealPlan = Record<string, Record<string, PlannedMeal | null>>;

const STORAGE_KEY = 'spoonify_meal_plan';

const MealPlanner: React.FC = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [recipes, setRecipes] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState<{ day: string; meal: string } | null>(null);
  const [search, setSearch] = useState('');
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mealPlan));
  }, [mealPlan]);

  useEffect(() => {
    if (showPicker) fetchRecipes();
  }, [showPicker]);

  const fetchRecipes = async () => {
    setLoadingRecipes(true);
    try {
      const { data } = await getRecipes({ limit: 50 });
      setRecipes((data?.recipes || []).map(normalizeRecipe));
    } catch {
      toast.error('Could not load recipes');
    } finally {
      setLoadingRecipes(false);
    }
  };

  const assignMeal = (day: string, meal: string, recipe: any) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [meal]: { recipeId: recipe.id, recipeTitle: recipe.title, recipeImage: recipe.image_url },
      },
    }));
    setShowPicker(null);
    setSearch('');
    toast.success(`${recipe.title} added to ${day} ${meal}`);
  };

  const removeMeal = (day: string, meal: string) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: { ...(prev[day] || {}), [meal]: null },
    }));
  };

  const clearPlan = () => {
    setMealPlan({});
    toast.success('Meal plan cleared');
  };

  const filteredRecipes = recipes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalMeals = DAYS.reduce((acc, day) => {
    return acc + MEALS.filter(meal => mealPlan[day]?.[meal]).length;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/recipes"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Recipes</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-7 w-7 text-primary-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Meal Planner</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{totalMeals} of {DAYS.length * MEALS.length} meals planned</p>
            </div>
          </div>
          {totalMeals > 0 && (
            <button
              onClick={clearPlan}
              className="text-sm px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Meal Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header row */}
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-2"></div>
              {DAYS.map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Meal rows */}
            {MEALS.map(meal => (
              <div key={meal} className="grid grid-cols-8 gap-2 mb-2">
                <div className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-400 px-2 py-2 whitespace-nowrap">
                  {meal}
                </div>
                {DAYS.map(day => {
                  const planned = mealPlan[day]?.[meal];
                  return (
                    <div key={`${day}-${meal}`} className="relative">
                      {planned ? (
                        <div className="h-24 bg-white dark:bg-gray-800 rounded-lg border border-primary-200 dark:border-primary-800 overflow-hidden group">
                          {planned.recipeImage ? (
                            <img
                              src={planned.recipeImage}
                              alt={planned.recipeTitle}
                              className="w-full h-14 object-cover"
                            />
                          ) : (
                            <div className="w-full h-14 bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                              <ChefHat className="h-6 w-6 text-primary-400" />
                            </div>
                          )}
                          <div className="px-1 py-1">
                            <Link
                              to={`/recipe/${planned.recipeId}`}
                              className="text-xs text-gray-700 dark:text-gray-300 line-clamp-1 hover:text-primary-500 transition-colors"
                            >
                              {planned.recipeTitle}
                            </Link>
                          </div>
                          <button
                            onClick={() => removeMeal(day, meal)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowPicker({ day, meal })}
                          className="w-full h-24 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 flex items-center justify-center transition-colors group"
                        >
                          <Plus className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-primary-400 transition-colors" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Recipe Picker Modal */}
        {showPicker && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {showPicker.day} - {showPicker.meal}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Choose a recipe</p>
                </div>
                <button
                  onClick={() => { setShowPicker(null); setSearch(''); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="overflow-y-auto flex-1 p-2">
                {loadingRecipes ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                ) : filteredRecipes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">No recipes found</div>
                ) : (
                  filteredRecipes.map(recipe => (
                    <button
                      key={recipe.id}
                      onClick={() => assignMeal(showPicker.day, showPicker.meal, recipe)}
                      className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
                    >
                      <img
                        src={recipe.image_url || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=60&h=60&fit=crop'}
                        alt={recipe.title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{recipe.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{recipe.cooking_time} min · {recipe.difficulty}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
