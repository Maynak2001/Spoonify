import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChefHat, User, LogOut, Plus, Heart, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/spoonify.png" alt="Spoonify" className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Spoonify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              to="/recipes" 
              className={`transition-colors text-sm lg:text-base ${
                location.pathname === '/recipes' 
                  ? 'text-primary-500 font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-500'
              }`}
            >
              Recipes
            </Link>
            <Link 
              to="/chefs" 
              className={`transition-colors text-sm lg:text-base ${
                location.pathname === '/chefs' 
                  ? 'text-primary-500 font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-500'
              }`}
            >
              Chefs
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors text-sm lg:text-base ${
                location.pathname === '/about' 
                  ? 'text-primary-500 font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-500'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors text-sm lg:text-base ${
                location.pathname === '/contact' 
                  ? 'text-primary-500 font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-500'
              }`}
            >
              Contact
            </Link>
            <Link 
              to="/about-me" 
              className={`transition-colors text-sm lg:text-base ${
                location.pathname === '/about-me' 
                  ? 'text-primary-500 font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-500'
              }`}
            >
              About Me
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  to="/add-recipe"
                  className="btn-primary flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Add Recipe</span>
                  <span className="sm:hidden">Add</span>
                </Link>
                <Link
                  to="/favorites"
                  className="text-gray-700 hover:text-primary-500 transition-colors p-1"
                >
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                </Link>
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-primary-500 transition-colors p-1"
                  >
                    <User className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50">
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Profile
                        </Link>
                        <Link
                          to="/my-recipes"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          My Recipes
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="px-4 py-3 space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                <ThemeToggle />
              </div>
              {user ? (
                <>
                  <Link
                    to="/recipes"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 text-base ${
                      location.pathname === '/recipes'
                        ? 'text-primary-500 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Recipes
                  </Link>
                  <Link
                    to="/chefs"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 text-base ${
                      location.pathname === '/chefs'
                        ? 'text-primary-500 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Chefs
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 text-base ${
                      location.pathname === '/about'
                        ? 'text-primary-500 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 text-base ${
                      location.pathname === '/contact'
                        ? 'text-primary-500 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/about-me"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 text-base ${
                      location.pathname === '/about-me'
                        ? 'text-primary-500 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    About Me
                  </Link>
                  <Link
                    to="/add-recipe"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base text-gray-700 dark:text-gray-300"
                  >
                    Add Recipe
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base text-gray-700 dark:text-gray-300"
                  >
                    Favorites
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base text-gray-700 dark:text-gray-300"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-recipes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base text-gray-700 dark:text-gray-300"
                  >
                    My Recipes
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-base text-gray-700 dark:text-gray-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/recipes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base text-gray-700 dark:text-gray-300"
                  >
                    Recipes
                  </Link>
                  <Link
                    to="/chefs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base text-gray-700 dark:text-gray-300"
                  >
                    Chefs
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base text-gray-700 dark:text-gray-300"
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base text-gray-700 dark:text-gray-300"
                  >
                    Contact
                  </Link>
                  <Link
                    to="/about-me"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base text-gray-700 dark:text-gray-300"
                  >
                    About Me
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base text-primary-500 font-medium"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;