import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold">Spoonify</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your ultimate destination for discovering, sharing, and saving delicious recipes. 
              Join our community of passionate home cooks today.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-primary-500 cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-gray-400 hover:text-primary-500 cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-gray-400 hover:text-primary-500 cursor-pointer transition-colors" />
              <Mail className="h-6 w-6 text-gray-400 hover:text-primary-500 cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/recipes" onClick={scrollToTop} className="text-gray-300 hover:text-primary-500 transition-colors">Browse Recipes</Link></li>
              <li><Link to="/categories" onClick={scrollToTop} className="text-gray-300 hover:text-primary-500 transition-colors">Categories</Link></li>
              <li><Link to="/auth" onClick={scrollToTop} className="text-gray-300 hover:text-primary-500 transition-colors">Sign Up</Link></li>
              <li><Link to="/add-recipe" onClick={scrollToTop} className="text-gray-300 hover:text-primary-500 transition-colors">Add Recipe</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Spoonify. All rights reserved. Made with ❤️ for food lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;