import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, ChefHat, Heart, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRecipes } from '../hooks/useRecipes';
import { getFavorites } from '../utils/api';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { recipes } = useRecipes(user ? { userId: user.id } : undefined);
  const [favCount, setFavCount] = React.useState(0);

  React.useEffect(() => {
    if (user) {
      getFavorites().then(({ data }) => setFavCount((data || []).length)).catch(() => {});
    }
  }, [user]);

  const handleSignOut = () => {
    signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please Sign In</h2>
          <button onClick={() => navigate('/auth')} className="btn-primary">Sign In</button>
        </div>
      </div>
    );
  }

  const avgRating = recipes.length > 0
    ? (recipes.reduce((sum, r: any) => sum + (r.average_rating || 0), 0) / recipes.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
          <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-12">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-white/30">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-indigo-500" />
                )}
              </div>
              <div className="text-white text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  {user.fullName || user.username || 'Anonymous User'}
                </h1>
                <p className="text-white/90 text-lg mb-2">{user.email}</p>
                {user.username && (
                  <p className="text-white/80 text-base">@{user.username}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Recipes Created</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{recipes.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Favorite Recipes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{favCount}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-pink-400 to-red-400 rounded-xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {avgRating > 0 ? avgRating.toFixed(1) : '0.0'}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Address</p>
                <p className="text-gray-900 dark:text-white font-semibold">{user.email}</p>
              </div>
            </div>

            {user.username && (
              <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="p-3 bg-green-500 rounded-xl">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Username</p>
                  <p className="text-gray-900 dark:text-white font-semibold">@{user.username}</p>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleSignOut}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
