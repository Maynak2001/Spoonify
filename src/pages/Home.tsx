import React, { useState, useCallback, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import SearchFilters from '../components/SearchFilters';
import StatsSection from '../components/StatsSection';
import { useRecipes } from '../hooks/useRecipes';
import { supabase } from '../utils/supabase';

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    maxCookingTime: 120
  });

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categoryFromUrl !== filters.category) {
      console.log('Setting category from URL:', categoryFromUrl);
      setFilters(prev => ({ ...prev, category: categoryFromUrl }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
  };

  const { recipes, loading, error } = useRecipes(filters);

  const handleFiltersChange = useCallback((newFilters: Omit<typeof filters, 'category'>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <div className="mb-6">
              <ChefHat className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 text-white/90" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing
              <span className="block text-yellow-200">Recipes</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Cook, share, and explore delicious recipes from around the world. Join our community of food lovers!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/add-recipe" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                🍳 Share Your Recipe
              </Link>
              <a href="#categories" className="border-2 border-white/80 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 backdrop-blur-sm">
                🔍 Browse Categories
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </div>

      {/* Real-time Stats Section */}
      <StatsSection />

      {/* Categories Section */}
      <div id="categories" className="bg-white dark:bg-gray-800 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Browse by Category</h2>
            <p className="text-gray-600 dark:text-gray-300">Find recipes by your favorite cuisine type</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {(showAllCategories ? categories : categories.slice(0, 4)).map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  console.log('Category clicked:', category.id);
                  setFilters(prev => ({ ...prev, category: category.id }));
                }}
                className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                  filters.category === category.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 text-primary-500" />
                <h3 className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">{category.name}</h3>
              </button>
            ))}
            {categories.length > 4 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="p-2 sm:p-3 rounded-lg border-2 border-gray-300 hover:border-primary-300 hover:bg-primary-50 text-center transition-all duration-200"
              >
                <span className="text-primary-500 font-medium text-xs sm:text-sm">
                  {showAllCategories ? 'Show Less' : `+${categories.length - 4} More`}
                </span>
              </button>
            )}
            {filters.category && (
              <button
                onClick={() => {
                  console.log('Clear filter clicked');
                  setFilters(prev => ({ ...prev, category: '' }));
                }}
                className="p-2 sm:p-3 rounded-lg border-2 border-red-300 hover:border-red-400 bg-red-50 hover:bg-red-100 text-center transition-all duration-200"
              >
                <span className="text-red-600 font-medium text-xs sm:text-sm">Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <SearchFilters onFiltersChange={handleFiltersChange} />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-40 sm:h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-3 sm:p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No recipes found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your search filters or add a new recipe!</p>
            <Link to="/add-recipe" className="btn-primary">
              Add Your First Recipe
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {filters.search ? `Search Results (${recipes.length})` : `All Recipes (${recipes.length})`}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;