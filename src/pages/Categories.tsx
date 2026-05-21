import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, ArrowRight, ChefHat } from 'lucide-react';
import { getCategories, getRecipes } from '../utils/api';

interface Category { id: string; name: string; description: string; recipe_count?: number; }

const CATEGORY_EMOJIS: Record<string, string> = {
  breakfast: '🍳', lunch: '🥗', dinner: '🍽️', dessert: '🍰', desserts: '🍰',
  snack: '🍿', snacks: '🍿', appetizer: '🥨', soup: '🍲', soups: '🍲',
  salad: '🥙', pasta: '🍝', pizza: '🍕', burger: '🍔', seafood: '🦞',
  chicken: '🍗', vegetarian: '🥦', vegan: '🌱', healthy: '🥑',
  baking: '🧁', bread: '🍞', cake: '🎂', drinks: '🥤', italian: '🍝',
  mexican: '🌮', indian: '🍛', chinese: '🥡', japanese: '🍱', thai: '🍜',
  mediterranean: '🫒', bbq: '🔥', grill: '🔥', quick: '⚡', easy: '✅',
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  breakfast:     'from-amber-900/50 to-yellow-900/30',
  lunch:         'from-green-900/50 to-emerald-900/30',
  dinner:        'from-indigo-900/50 to-blue-900/30',
  dessert:       'from-pink-900/50 to-purple-900/30',
  desserts:      'from-pink-900/50 to-purple-900/30',
  snack:         'from-orange-900/50 to-red-900/30',
  snacks:        'from-orange-900/50 to-red-900/30',
  soup:          'from-amber-900/50 to-orange-900/30',
  soups:         'from-amber-900/50 to-orange-900/30',
  seafood:       'from-teal-900/50 to-cyan-900/30',
  chicken:       'from-yellow-900/50 to-amber-900/30',
  vegetarian:    'from-green-900/50 to-lime-900/30',
  vegan:         'from-emerald-900/50 to-green-900/30',
  italian:       'from-red-900/50 to-orange-900/30',
  mexican:       'from-green-900/50 to-lime-900/30',
  indian:        'from-orange-900/50 to-yellow-900/30',
  chinese:       'from-red-900/50 to-rose-900/30',
  japanese:      'from-pink-900/50 to-rose-900/30',
  thai:          'from-orange-900/50 to-red-900/30',
  mediterranean: 'from-cyan-900/50 to-blue-900/30',
  bbq:           'from-red-900/50 to-orange-900/30',
  baking:        'from-amber-900/50 to-yellow-900/30',
};

const getEmoji = (name: string) => {
  const key = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(CATEGORY_EMOJIS)) if (key.includes(k)) return v;
  return '🍴';
};

const getGradient = (name: string) => {
  const key = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(CATEGORY_GRADIENTS)) if (key.includes(k)) return v;
  return 'from-gray-800/40 to-gray-900/20';
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
    <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-[#d4a843]/20 border-t-[#d4a843] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#d4a843] selection:text-black">

      {/* ── Header ── */}
      <div className="pt-32 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1405] via-[#030303] to-[#030303]" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <LayoutGrid className="w-3 h-3 text-[#d4a843]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4a843]">All Categories</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
            Curated{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#f5d78e] to-[#8a6520]">
              Categories
            </span>
          </h1>
          <p className="text-gray-500 text-base">Dive into the cuisine that calls to you</p>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {categories.length === 0 ? (
          <div className="text-center py-24">
            <ChefHat className="h-16 w-16 mx-auto mb-4 text-[#d4a843]/20" />
            <h3 className="text-xl font-semibold text-white mb-2">No categories found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => {
              const emoji = getEmoji(cat.name);
              const gradient = getGradient(cat.name);
              const isWide = i === 0 || (categories.length > 5 && i === 5);
              return (
                <Link
                  key={cat.id}
                  to={`/recipes?category=${cat.id}`}
                  className={`group relative overflow-hidden rounded-3xl border border-white/[0.06]
                    hover:border-[#d4a843]/40 transition-all duration-300
                    hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                    flex flex-col items-center justify-center gap-3 text-center
                    ${isWide ? 'col-span-2 py-14 px-10' : 'py-10 px-6'}`}
                >
                  {/* Gradient bg */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Decorative circles */}
                  <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/[0.02] group-hover:bg-[#d4a843]/[0.06] transition-colors duration-300" />
                  <div className="absolute -left-5 -bottom-5 w-20 h-20 rounded-full bg-white/[0.02] group-hover:bg-[#d4a843]/[0.04] transition-colors duration-300" />

                  {/* Emoji */}
                  <span className={`relative z-10 block group-hover:scale-110 transition-transform duration-300 select-none ${isWide ? 'text-6xl' : 'text-4xl'}`}>
                    {emoji}
                  </span>

                  {/* Animated divider */}
                  <div className="relative z-10 h-px bg-white/10 group-hover:bg-[#d4a843]/50 transition-all duration-300 w-8 group-hover:w-14" />

                  {/* Name */}
                  <span className={`relative z-10 font-bold text-gray-400 group-hover:text-white transition-colors duration-300 tracking-wide ${isWide ? 'text-base' : 'text-sm'}`}>
                    {cat.name}
                  </span>

                  {/* Recipe count badge */}
                  {cat.recipe_count !== undefined && (
                    <span className="relative z-10 text-[10px] font-semibold px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.07] text-gray-500 group-hover:border-[#d4a843]/20 group-hover:text-[#d4a843] transition-all duration-300">
                      {cat.recipe_count} recipes
                    </span>
                  )}

                  {/* Arrow — appears on hover */}
                  <ArrowRight className="relative z-10 w-3.5 h-3.5 text-[#d4a843] opacity-0 -mt-1 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
