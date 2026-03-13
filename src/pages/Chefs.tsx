import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Star } from 'lucide-react';
import { getRecipes } from '../utils/api';

interface Chef {
  id: string;
  username: string;
  avatarUrl: string | null;
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
      const { data } = await getRecipes({ limit: 200 });
      const recipes = data.recipes || [];

      const chefsMap = new Map<string, Chef>();
      recipes.forEach((r: any) => {
        const userId = r.userId?._id || r.userId;
        if (!userId) return;
        if (!chefsMap.has(userId)) {
          chefsMap.set(userId, {
            id: userId,
            username: r.userId?.username || 'Unknown Chef',
            avatarUrl: r.userId?.avatarUrl || null,
            recipe_count: 0,
            avg_rating: 0
          });
        }
        const chef = chefsMap.get(userId)!;
        const prev = chef.recipe_count;
        chef.recipe_count += 1;
        chef.avg_rating = ((chef.avg_rating * prev) + (r.averageRating || 0)) / chef.recipe_count;
      });

      setChefs(Array.from(chefsMap.values()));
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
                  {chef.avatarUrl ? (
                    <img src={chef.avatarUrl} alt={chef.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ChefHat className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{chef.username}</h3>

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

                <Link to={`/chef/${chef.id}`} className="block w-full bg-primary-500 hover:bg-primary-600 py-2 px-4 rounded-lg transition-colors text-sm font-medium text-white">
                  View Profile
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
