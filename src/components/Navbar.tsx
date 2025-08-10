import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, User, LogOut, Plus, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-bold text-gray-900">Spoonify</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/recipes" className="text-gray-700 hover:text-primary-500 transition-colors">
              Recipes
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-primary-500 transition-colors">
              Categories
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/add-recipe"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Recipe</span>
                </Link>
                <Link
                  to="/favorites"
                  className="text-gray-700 hover:text-primary-500 transition-colors"
                >
                  <Heart className="h-6 w-6" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors">
                    <User className="h-6 w-6" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-recipes"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My Recipes
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="btn-primary"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;