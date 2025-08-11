import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Star, Users, Calendar } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface Chef {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  recipe_count: number;
  avg_rating: number;
}

const Chefs: React.FC = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          full_name,
          username,
          avatar_url,
          created_at,
          recipes!inner(id, ratings(rating))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user metadata for Google profile images
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const userMetadataMap = new Map();
      authUsers.users?.forEach(user => {
        userMetadataMap.set(user.id, user.user_metadata);
      });

      const chefsWithStats = data?.map(chef => {
        const recipeCount = chef.recipes?.length || 0;
        const allRatings = chef.recipes?.flatMap(recipe => recipe.ratings || []) || [];
        const avgRating = allRatings.length > 0 
          ? allRatings.reduce((sum, rating) => sum + rating.rating, 0) / allRatings.length 
          : 0;

        const userMetadata = userMetadataMap.get(chef.id) || {};
        const profileImage = chef.avatar_url || userMetadata.avatar_url || userMetadata.picture;

        return {
          id: chef.id,
          full_name: chef.full_name || userMetadata.full_name || 'Anonymous Chef',
          username: chef.username,
          avatar_url: profileImage,
          created_at: chef.created_at,
          recipe_count: recipeCount,
          avg_rating: avgRating
        };
      }) || [];

      setChefs(chefsWithStats);
    } catch (error) {
      console.error('Error fetching chefs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Amazing Chefs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover talented home cooks and their delicious recipes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {chefs.map((chef) => (
            <div key={chef.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
              <div className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {chef.avatar_url ? (
                    <img 
                      src={chef.avatar_url} 
                      alt={chef.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ChefHat className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {chef.full_name}
                </h3>
                
                {chef.username && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    @{chef.username}
                  </p>
                )}

                <div className="flex justify-center space-x-4 mb-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <ChefHat className="h-4 w-4 text-primary-500" />
                    <span className="text-gray-600 dark:text-gray-300">{chef.recipe_count} recipes</span>
                  </div>
                  {chef.avg_rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-gray-600 dark:text-gray-300">{chef.avg_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {new Date(chef.created_at).toLocaleDateString()}</span>
                </div>

                <Link
                  to={`/chef/${chef.id}`}
                  className="w-full bg-primary-500 hover:bg-primary-600 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                >
                  <span className="text-white">View Profile</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {chefs.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No chefs found</h3>
            <p className="text-gray-600 dark:text-gray-300">Be the first to join our community!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chefs;