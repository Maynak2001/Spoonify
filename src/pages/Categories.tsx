import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, LayoutGrid } from 'lucide-react';
import { getCategories, getRecipes } from '../utils/api';

interface Category { id: string; name: string; description: string; recipe_count?: number; }

const CATEGORY_EMOJIS: Record<string, string> = {
  breakfast: '🍳', lunch: '🥗', dinner: '🍽️', dessert: '🍰', desserts: '🍰',
  snack: '🍿', snacks: '🍿', appetizer: '🥨', soup: '🍲', soups: '🍲',
  salad: '🥙', pasta: '🍝', pizza: '🍕', burger: '🍔', seafood: '🦞',
  chicken: '🍗', beef: '🥩', vegetarian: '🥦', vegan: '🌱', healthy: '🥑',
  baking: '🧁', bread: '🍞', cake: '🎂', drinks: '🥤', italian: '🍝',
  mexican: '🌮', indian: '🍛', chinese: '🥡', japanese: '🍱', thai: '🍜',
  mediterranean: '🫒', bbq: '🔥', grill: '🔥', quick: '⚡', easy: '✅',
};
const getEmoji = (name: string) => {
  const key = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(CATEGORY_EMOJIS)) if (key.includes(k)) return v;
  return '🍴';
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [catsRes, recipesRes] = await Promise.all([getCategories(), getRecipes()]);
        const cats = (catsRes.data || []).filter((cat: any) => cat.name?.toLowerCase() !== 'pakistani');
        const recipes = recipesRes.data?.recipes || [];
        setCategories(cats.map((cat: any) => ({
          id: cat._id, name: cat.name, description: cat.description || '',
          recipe_count: recipes.filter((r: any) => (r.categoryId?._id || r.categoryId) === cat._id).length,
        })));
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
            <LayoutGrid className="h-6 w-6 text-amber-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Recipe Categories</h1>
          <p className="text-gray-500 dark:text-gray-400">Explore recipes by category</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="h-16 w-16 mx-auto mb-4 text-amber-500/20" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No categories found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/recipes?category=${cat.id}`}
                className="group p-6 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover
                  bg-white border-gray-100 shadow-card
                  dark:bg-gray-800/50 dark:border-white/[0.06] dark:hover:border-amber-500/20">
                <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                  {getEmoji(cat.name)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{cat.name}</h3>
                {cat.description && (
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2">{cat.description}</p>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full
                  bg-amber-50 text-amber-600
                  dark:bg-amber-500/10 dark:text-amber-400">
                  {cat.recipe_count} recipes
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
