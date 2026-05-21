import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChefHat, Clock, Star, Sparkles, UtensilsCrossed } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import SearchFilters from '../components/SearchFilters';
import StatsSection from '../components/StatsSection';
import { useRecipes } from '../hooks/useRecipes';
import { useAuth } from '../hooks/useAuth';
import { getCategories, getFavorites } from '../utils/api';

const CATEGORY_EMOJIS: Record<string, string> = {
  breakfast: '🍳', lunch: '🥗', dinner: '🍽️', dessert: '🍰', desserts: '🍰',
  snack: '🍿', snacks: '🍿', appetizer: '🥨', appetizers: '🥨',
  soup: '🍲', soups: '🍲', salad: '🥙', salads: '🥙',
  pasta: '🍝', pizza: '🍕', burger: '🍔', burgers: '🍔',
  seafood: '🦞', chicken: '🍗', beef: '🥩', meat: '🥩',
  vegetarian: '🥦', vegan: '🌱', healthy: '🥑',
  baking: '🧁', bread: '🍞', cake: '🎂', cakes: '🎂',
  drinks: '🥤', beverage: '🥤', beverages: '🥤', smoothie: '🥤',
  italian: '🍝', mexican: '🌮', indian: '🍛', chinese: '🥡',
  japanese: '🍱', thai: '🍜', mediterranean: '🫒',
  bbq: '🔥', grill: '🔥', street: '🌯',
  kids: '🧒', quick: '⚡', easy: '✅',
};

const categoryEmoji = (name: string): string => {
  const key = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(CATEGORY_EMOJIS)) {
    if (key.includes(k)) return v;
  }
  return '🍴';
};

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    maxCookingTime: 120,
    ingredients: [] as string[],
  });

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categoryFromUrl !== filters.category) {
      setFilters(prev => ({ ...prev, category: categoryFromUrl }));
    }
  }, [searchParams]);

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if (user) {
      getFavorites().then(({ data }) => {
        setFavoriteIds(new Set<string>((data || []).map((r: any) => r._id || r.id)));
      }).catch(() => {});
    } else {
      setFavoriteIds(new Set());
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories((data || []).filter((cat: any) => cat.name?.toLowerCase() !== 'pakistani'));
    } catch {}
  };

  const { recipes: allRecipes, loading, error } = useRecipes({
    search: filters.search,
    category: filters.category,
    difficulty: filters.difficulty,
    maxCookingTime: filters.maxCookingTime,
  });

  const recipes = useMemo(() => {
    if (filters.ingredients.length === 0) return allRecipes;
    return allRecipes.filter((recipe: any) => {
      const ingredientText = (recipe.ingredients || []).join(' ').toLowerCase();
      return filters.ingredients.some(ing => ingredientText.includes(ing.toLowerCase()));
    });
  }, [allRecipes, filters.ingredients]);

  const recipeOfTheDay = useMemo(() => {
    if (recipes.length === 0) return null;
    return recipes[new Date().getDate() % recipes.length];
  }, [recipes]);

  const handleFiltersChange = useCallback((newFilters: Omit<typeof filters, 'category'>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const hasFridgeSearch = filters.ingredients.length > 0;

  if (error) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808]">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-[#080808] pt-24 pb-16 sm:pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-50"
            style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.09), transparent 65%)', filter: 'blur(80px)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.06), transparent 65%)', filter: 'blur(60px)' }} />
        </div>

        {[
          { emoji: '🍜', cls: 'top-10 left-[8%] text-4xl', delay: '0s' },
          { emoji: '🥗', cls: 'top-16 right-[10%] text-3xl', delay: '1s' },
          { emoji: '🍕', cls: 'bottom-10 left-[20%] text-3xl', delay: '0.5s' },
          { emoji: '🍰', cls: 'bottom-8 right-[18%] text-4xl', delay: '1.5s' },
        ].map(({ emoji, cls, delay }) => (
          <span key={emoji} className={`hidden sm:block absolute ${cls} opacity-[0.06] animate-float select-none pointer-events-none`} style={{ animationDelay: delay }}>
            {emoji}
          </span>
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge-gold mb-6">
            <ChefHat className="h-3.5 w-3.5" />
            Community Recipe Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 leading-tight tracking-tight text-white">
            Discover Amazing
            <span className="block text-gold">Recipes</span>
          </h1>

          <p className="text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed text-gray-500">
            Cook, share, and explore delicious recipes from around the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/add-recipe"
              className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-95
                bg-[#d4a843] hover:bg-[#e0b855] text-black shadow-[0_4px_24px_rgba(212,168,83,0.3)] hover:shadow-[0_8px_36px_rgba(212,168,83,0.45)]">
              🍳 Share Your Recipe
            </Link>
            <a href="#categories"
              className="px-7 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-95
                border border-white/[0.08] text-gray-400 hover:border-[#d4a843]/30 hover:text-[#d4a843] hover:bg-[#d4a843]/5">
              🔍 Browse Categories
            </a>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <StatsSection />

      {/* ── Categories ── */}
      <div id="categories" className="py-12 sm:py-16 bg-[#0c0c0c] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-1.5">Browse by Category</h2>
            <p className="text-xs text-gray-600">Find recipes by your favorite cuisine type</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {(showAllCategories ? categories : categories.slice(0, 11)).map((category) => {
              const emoji = categoryEmoji(category.name);
              const active = filters.category === category._id;
              return (
                <button
                  key={category._id}
                  onClick={() => setFilters(prev => ({ ...prev, category: active ? '' : category._id }))}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
                    active
                      ? 'border-[#d4a843]/40 bg-[#d4a843]/10 shadow-[0_4px_16px_rgba(212,168,83,0.1)]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-[#d4a843]/20 hover:bg-[#d4a843]/5'
                  }`}
                >
                  <span className="text-2xl leading-none">{emoji}</span>
                  <span className={`font-semibold text-[11px] text-center leading-tight ${active ? 'text-[#d4a843]' : 'text-gray-500'}`}>
                    {category.name}
                  </span>
                </button>
              );
            })}

            {categories.length > 11 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-dashed border-white/[0.06] hover:border-[#d4a843]/20 hover:bg-[#d4a843]/5 transition-all duration-200"
              >
                <span className="text-2xl leading-none">{showAllCategories ? '▲' : '＋'}</span>
                <span className="font-semibold text-[11px] text-[#d4a843]/50">
                  {showAllCategories ? 'Less' : `${categories.length - 11} More`}
                </span>
              </button>
            )}
          </div>

          {filters.category && (
            <div className="text-center mt-4">
              <button
                onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                className="text-xs font-semibold text-gray-600 hover:text-red-400 transition-colors"
              >
                ✕ Clear category filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <SearchFilters onFiltersChange={handleFiltersChange} />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mt-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[#111] rounded-2xl overflow-hidden border border-white/[0.06]">
                <div className="skeleton h-48 rounded-none" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-5/6" />
                  <div className="flex justify-between pt-1">
                    <div className="skeleton h-3 w-16" />
                    <div className="skeleton h-3 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
            <ChefHat className="h-14 w-14 mx-auto mb-4 text-[#d4a843]/20" />
            <h3 className="text-xl font-bold text-white mb-2">No recipes found</h3>
            <p className="mb-6 text-gray-600 text-sm">
              {hasFridgeSearch
                ? 'No recipes match your ingredients. Try removing some!'
                : 'Try adjusting your filters or add a new recipe!'}
            </p>
            <Link to="/add-recipe" className="btn-primary">Add Your First Recipe</Link>
          </div>
        ) : (
          <>
            {/* Recipe of the Day */}
            {!filters.search && !filters.category && !hasFridgeSearch && recipeOfTheDay && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-[#d4a843]" />
                  <h2 className="text-base font-bold text-white">Recipe of the Day</h2>
                </div>
                <Link
                  to={`/recipe/${recipeOfTheDay.id}`}
                  className="group relative block rounded-2xl overflow-hidden border border-white/[0.06] hover:border-[#d4a843]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
                >
                  <div className="relative h-52 sm:h-64 overflow-hidden">
                    <img
                      src={recipeOfTheDay.image_url || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&h=400&fit=crop'}
                      alt={recipeOfTheDay.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span className="badge-gold">
                        <Sparkles className="h-3 w-3" /> Today's Pick
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-tight group-hover:text-[#d4a843] transition-colors">
                        {recipeOfTheDay.title}
                      </h3>
                      <p className="text-white/60 text-sm line-clamp-1 mb-3 hidden sm:block">
                        {recipeOfTheDay.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {recipeOfTheDay.cooking_time} min
                        </span>
                        {recipeOfTheDay.average_rating > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5 fill-current text-[#d4a843]" />
                            {recipeOfTheDay.average_rating.toFixed(1)}
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d4a843]/15 text-[#d4a843] border border-[#d4a843]/20">
                          {recipeOfTheDay.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-[#d4a843]/50" />
                <h2 className="text-lg font-extrabold text-white">
                  {hasFridgeSearch ? 'Fridge Matches'
                    : filters.search ? `Results for "${filters.search}"`
                    : 'All Recipes'}
                </h2>
              </div>
              <span className="badge-gold text-[11px]">
                {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={favoriteIds.has(recipe.id)}
                  onFavoriteToggle={() => setFavoriteIds(prev => {
                    const next = new Set(prev);
                    if (next.has(recipe.id)) next.delete(recipe.id);
                    else next.add(recipe.id);
                    return next;
                  })}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
