import React from 'react';
import { ChefHat, Users, Heart, Star } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-12">
          <ChefHat className="h-16 w-16 text-primary-500 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">About Spoonify</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Your culinary journey starts here</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <Users className="h-8 w-8 text-primary-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Our Community</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Join thousands of food enthusiasts sharing their favorite recipes and discovering new flavors from around the world.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <Heart className="h-8 w-8 text-primary-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-300">
              To make cooking accessible, enjoyable, and social by connecting people through the love of food and shared recipes.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What Makes Us Special</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <Star className="h-12 w-12 text-primary-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Quality Recipes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Curated collection of tested and loved recipes</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-primary-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Active Community</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Connect with fellow cooking enthusiasts</p>
            </div>
            <div className="text-center">
              <ChefHat className="h-12 w-12 text-primary-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Easy to Use</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Simple interface for sharing and discovering recipes</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Start Cooking?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Join our community and start sharing your favorite recipes today!</p>
        </div>
      </div>
    </div>
  );
};

export default About;