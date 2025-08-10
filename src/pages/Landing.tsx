import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Users, Star, Search, Heart, Clock } from 'lucide-react';
import { useStats } from '../hooks/useStats';

const Landing: React.FC = () => {
  const { recipesCount, usersCount, ratingsCount } = useStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <ChefHat className="h-16 w-16 text-primary-500" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-primary-500">Spoonify</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover, share, and save your favorite recipes. Join thousands of food lovers 
              creating delicious memories together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <Link to="/recipes" className="btn-secondary text-lg px-8 py-3">
                Browse Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Spoonify?</h2>
            <p className="text-xl text-gray-600">Everything you need for your culinary journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-gray-600">Find recipes by ingredients, cuisine, difficulty, or cooking time</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">Connect with fellow food enthusiasts and share your creations</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rate & Review</h3>
              <p className="text-gray-600">Rate recipes and read reviews from other home cooks</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Favorites</h3>
              <p className="text-gray-600">Keep your favorite recipes organized in one place</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick & Easy</h3>
              <p className="text-gray-600">Filter by cooking time to find recipes that fit your schedule</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Share Recipes</h3>
              <p className="text-gray-600">Upload your own recipes with photos and detailed instructions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">{recipesCount.toLocaleString()}+</div>
              <div className="text-primary-100">Delicious Recipes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">{usersCount.toLocaleString()}+</div>
              <div className="text-primary-100">Happy Cooks</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">{ratingsCount.toLocaleString()}+</div>
              <div className="text-primary-100">Recipe Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Cooking?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community of food lovers and discover your next favorite recipe today.
          </p>
          <Link to="/auth" className="btn-primary text-lg px-8 py-3">
            Join Spoonify Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;