import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Users, Star, Search, Heart, Clock } from 'lucide-react';
import { useStats } from '../hooks/useStats';

const Landing: React.FC = () => {
  const { recipesCount, usersCount, ratingsCount } = useStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                <img src="/spoonify.png" alt="Spoonify" className="h-20 w-20 sm:h-24 sm:w-24 animate-bounce" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2">
              Welcome to <span className="text-primary-500">Spoonify</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Discover, share, and save your favorite recipes. Join thousands of food lovers 
              creating delicious memories together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link to="/auth" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 hover:scale-105 transition-transform">
                Get Started
              </Link>
              <Link to="/recipes" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 hover:scale-105 transition-transform">
                Browse Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-20 bg-white dark:bg-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">Why Choose Spoonify?</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 px-4">Everything you need for your culinary journey</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mx-2 sm:mx-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Search className="h-7 w-7 sm:h-8 sm:w-8 text-primary-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Search</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Find recipes by ingredients, cuisine, difficulty, or cooking time</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mx-2 sm:mx-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="h-7 w-7 sm:h-8 sm:w-8 text-primary-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Community</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Connect with fellow food enthusiasts and share your creations</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mx-2 sm:mx-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Star className="h-7 w-7 sm:h-8 sm:w-8 text-primary-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Rate & Review</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Rate recipes and read reviews from other home cooks</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mx-2 sm:mx-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Heart className="h-7 w-7 sm:h-8 sm:w-8 text-primary-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Save Favorites</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Keep your favorite recipes organized in one place</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mx-2 sm:mx-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-primary-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Quick & Easy</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Filter by cooking time to find recipes that fit your schedule</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mx-2 sm:mx-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <ChefHat className="h-7 w-7 sm:h-8 sm:w-8 text-primary-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Share Recipes</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Upload your own recipes with photos and detailed instructions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 sm:py-20 bg-primary-500 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="hover:scale-105 transition-transform duration-300 py-4">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{recipesCount.toLocaleString()}+</div>
              <div className="text-primary-100 text-sm sm:text-base">Delicious Recipes</div>
            </div>
            <div className="hover:scale-105 transition-transform duration-300 py-4">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{usersCount.toLocaleString()}+</div>
              <div className="text-primary-100 text-sm sm:text-base">Happy Chefs</div>
            </div>
            <div className="hover:scale-105 transition-transform duration-300 py-4">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{ratingsCount.toLocaleString()}+</div>
              <div className="text-primary-100 text-sm sm:text-base">Five-Star Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2">
            Ready to Start Your Culinary Journey?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-4">
            Join thousands of food lovers and discover your next favorite recipe today!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link to="/auth" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 hover:scale-105 transition-transform">
              Join Spoonify Now
            </Link>
            <Link to="/recipes" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 hover:scale-105 transition-transform">
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;