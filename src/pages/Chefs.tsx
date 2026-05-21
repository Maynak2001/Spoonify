import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Star, Users } from 'lucide-react';
import { getRecipes } from '../utils/api';

interface Chef { id: string; username: string; avatarUrl: string | null; recipe_count: number; avg_rating: number; }

const Chefs: React.FC = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getRecipes({ limit: 200 });
        const recipes = data.recipes || [];
        const map = new Map<string, Chef>();
        recipes.forEach((r: any) => {
          const uid = r.userId?._id || r.userId;
          if (!uid) return;
          if (!map.has(uid)) map.set(uid, { id: uid, username: r.userId?.username || 'Unknown', avatarUrl: r.userId?.avatarUrl || null, recipe_count: 0, avg_rating: 0 });
          const c = map.get(uid)!;
          const prev = c.recipe_count;
          c.recipe_count++;
          c.avg_rating = ((c.avg_rating * prev) + (r.averageRating || 0)) / c.recipe_count;
        });
        setChefs(Array.from(map.values()));
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Header */}
      <div className="py-14 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4
            bg-amber-50 dark:bg-amber-500/10">
            <Users className="h-6 w-6 text-amber-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Meet Our Amazing Chefs
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Discover talented home cooks and their delicious recipes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {chefs.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="h-16 w-16 mx-auto mb-4 text-amber-500/20" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No chefs found</h3>
            <p className="text-gray-500 dark:text-gray-400">Be the first to join our community!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {chefs.map((chef) => (
              <div key={chef.id}
                className="group p-6 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover
                  bg-white border-gray-100 shadow-card
                  dark:bg-gray-800/50 dark:border-white/[0.06] dark:hover:border-amber-500/20">

                {/* Avatar */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.2), transparent 70%)', filter: 'blur(8px)', transform: 'scale(1.3)' }} />
                  <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-gray-100 dark:ring-white/10 group-hover:ring-amber-400/40 transition-all">
                    {chef.avatarUrl ? (
                      <img src={chef.avatarUrl} alt={chef.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-amber-50 dark:bg-amber-500/10">
                        <ChefHat className="h-9 w-9 text-amber-400" />
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">{chef.username}</h3>

                <div className="flex justify-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-gray-500 dark:text-gray-400">{chef.recipe_count} recipes</span>
                  </div>
                  {chef.avg_rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
                      <span className="text-gray-500 dark:text-gray-400">{chef.avg_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <Link to={`/chef/${chef.id}`}
                  className="block w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5
                    bg-amber-50 text-amber-700 hover:bg-amber-100
                    dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/15">
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chefs;
