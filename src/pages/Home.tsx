import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChefHat, Clock, Star, Sparkles, UtensilsCrossed, ChevronRight } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import SearchFilters from '../components/SearchFilters';
import StatsSection from '../components/StatsSection';
import { useRecipes } from '../hooks/useRecipes';
import { useAuth } from '../hooks/useAuth';
import { getCategories, getFavorites } from '../utils/api';

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({ search: '', category: '', difficulty: '', maxCookingTime: 120, ingredients: [] as string[] });

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setFilters(p => ({ ...p, category: cat }));
    fetchCategories();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(Array.isArray(data) ? data : (data?.categories || []));
    } catch {
      // categories are non-critical; silently ignore fetch errors
    }
  };

  const { recipes: allRecipes, loading } = useRecipes(filters);

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#d4a843] selection:text-black">
      
      {/* ── Premium Hero ── */}
      <div className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1405] via-[#030303] to-[#030303]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#d4a843] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4a843]">Culinary Excellence</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            DISCOVER <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#f5d78e] to-[#8a6520]">FLAVORS</span>
          </h1>
          
          <p className="text-gray-400 max-w-lg mx-auto text-lg mb-10 font-light leading-relaxed">
            Elevate your kitchen experience. Access a curated collection of world-class recipes at your fingertips.
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/add-recipe" className="group px-8 py-4 bg-[#d4a843] text-black font-bold rounded-full hover:bg-white transition-all flex items-center gap-2">
              Share Recipe <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      <StatsSection />

      {/* ── Modern Category Grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-10 text-center">Curated Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setFilters(p => ({...p, category: p.category === cat._id ? '' : cat._id}))}
              className={`p-6 rounded-3xl border transition-all duration-500 ${filters.category === cat._id ? 'bg-[#d4a843] border-[#d4a843] text-black' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
            >
              <div className="text-3xl mb-3">🍳</div>
              <p className="font-semibold text-sm">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recipe Feed ── */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <SearchFilters onFiltersChange={(f) => setFilters(p => ({...p, ...f}))} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {loading ? (
            [...Array(6)].map((_, i) => <div key={i} className="h-96 rounded-3xl bg-white/5 animate-pulse" />)
          ) : (
            allRecipes.map(recipe => (
              <div key={recipe.id} className="group relative">
                <RecipeCard recipe={recipe} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;