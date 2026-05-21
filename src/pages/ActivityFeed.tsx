import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowLeft, ChefHat, UserCheck, Users } from 'lucide-react';
import { useFollow } from '../hooks/useFollow';
import { getRecipes, normalizeRecipe } from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import toast from 'react-hot-toast';

const ActivityFeed: React.FC = () => {
  const { following, unfollow } = useFollow();
  const [feedRecipes, setFeedRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (following.length > 0) fetchFeed();
  }, [following]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const allRecipes: any[] = [];
      await Promise.all(
        following.map(async chef => {
          try {
            const { data } = await getRecipes({ userId: chef.userId, limit: 10 });
            const recipes = (data?.recipes || []).map(normalizeRecipe);
            allRecipes.push(...recipes.map((r: any) => ({ ...r, _chefName: chef.username })));
          } catch {}
        })
      );
      allRecipes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setFeedRecipes(allRecipes);
    } catch {
      toast.error('Could not load feed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/recipes"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Recipes</span>
        </Link>

        <div className="flex items-center space-x-3 mb-6">
          <Activity className="h-7 w-7 text-primary-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Feed</h1>
        </div>

        {following.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No chefs followed yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Follow chefs to see their latest recipes in your feed.
            </p>
            <Link to="/chefs" className="btn-primary">Discover Chefs</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar: Following list */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <UserCheck className="h-4 w-4 text-primary-500" />
                  <span>Following ({following.length})</span>
                </h2>
                <div className="space-y-2">
                  {following.map(chef => (
                    <div key={chef.userId} className="flex items-center justify-between">
                      <Link
                        to={`/chef/${chef.userId}`}
                        className="flex items-center space-x-2 hover:text-primary-500 transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <ChefHat className="h-4 w-4 text-primary-500" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{chef.username}</span>
                      </Link>
                      <button
                        onClick={() => {
                          unfollow(chef.userId);
                          toast.success(`Unfollowed ${chef.username}`);
                        }}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Unfollow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feed */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl animate-pulse">
                      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : feedRecipes.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                  <ChefHat className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-300">The chefs you follow haven't posted recipes yet.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {feedRecipes.length} recipes from chefs you follow
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {feedRecipes.map(recipe => (
                      <div key={recipe.id}>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center space-x-1">
                          <ChefHat className="h-3 w-3" />
                          <span>{recipe._chefName}</span>
                        </p>
                        <RecipeCard recipe={recipe} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
