import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/spoonify.png" alt="Spoonify" className="h-8 w-8 sm:h-10 sm:w-10" />
              <span className="text-xl sm:text-2xl font-bold">Spoonify</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md text-sm sm:text-base">
              Your ultimate destination for discovering, sharing, and saving delicious recipes. 
              Join our community of passionate home cooks today.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400 hover:text-primary-500 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400 hover:text-primary-500 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400 hover:text-primary-500 cursor-pointer transition-colors" />
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400 hover:text-primary-500 cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/recipes" onClick={scrollToTop} className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors text-sm sm:text-base">Browse Recipes</Link></li>
              <li><Link to="/about" onClick={scrollToTop} className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors text-sm sm:text-base">About Us</Link></li>
              <li><Link to="/auth" onClick={scrollToTop} className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors text-sm sm:text-base">Sign Up</Link></li>
              <li><Link to="/add-recipe" onClick={scrollToTop} className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors text-sm sm:text-base">Add Recipe</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" onClick={scrollToTop} className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors text-sm sm:text-base">Help Center</Link></li>
              <li><Link to="/contact" onClick={scrollToTop} className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors text-sm sm:text-base">Contact Us</Link></li>
              <li><Link to="/about-me" onClick={scrollToTop} className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors text-sm sm:text-base">About Developer</Link></li>
              <li><Link to="/privacy" onClick={scrollToTop} className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors text-sm sm:text-base">Privacy Policy</Link></li>
              <li><Link to="/terms" onClick={scrollToTop} className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors text-sm sm:text-base">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            © 2024 Spoonify. All rights reserved. Made with ❤️ for food lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;