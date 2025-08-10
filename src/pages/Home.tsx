import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import SearchFilters from '../components/SearchFilters';
import StatsSection from '../components/StatsSection';
import { useRecipes } from '../hooks/useRecipes';

const Home: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    maxCookingTime: 120
  });

  const { recipes, loading, error } = useRecipes(filters);

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Amazing Recipes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Cook, share, and explore delicious recipes from around the world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/add-recipe" className="bg-white text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Share Your Recipe
              </Link>
              <Link to="/categories" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-500 transition-colors">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Stats Section */}
      <StatsSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchFilters onFiltersChange={handleFiltersChange} />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search filters or add a new recipe!</p>
            <Link to="/add-recipe" className="btn-primary">
              Add Your First Recipe
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filters.search ? `Search Results (${recipes.length})` : `All Recipes (${recipes.length})`}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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