import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChefHat, Search, Users, Star, Heart, Clock,
  ArrowRight, Zap, X, TrendingUp, Trophy, BookOpen,
} from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { getRecipes, getCategories, normalizeRecipe } from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types';

const features = [
  { icon: Search, title: 'Intelligent Search', desc: 'Find recipes instantly with our AI-powered filter.' },
  { icon: Users, title: 'Culinary Community', desc: 'Connect with chefs and foodies globally.' },
  { icon: Star, title: 'Expert Ratings', desc: 'Community-verified ratings for every dish.' },
  { icon: Heart, title: 'Personal Collection', desc: 'Curate your own private recipe vault.' },
  { icon: Clock, title: 'Efficient Cooking', desc: 'Optimized recipes for every schedule.' },
  { icon: ChefHat, title: 'Share Your Art', desc: 'Inspire the world with your unique recipes.' },
];

const howItWorks = [
  { icon: BookOpen, title: 'Create Your Account', desc: 'Sign up in seconds and set up your chef profile.' },
  { icon: Search, title: 'Discover Recipes', desc: 'Browse thousands of curated recipes or search by ingredient.' },
  { icon: Trophy, title: 'Cook & Share', desc: 'Rate dishes, collect favorites, and share your own creations.' },
];

const marqueeItems = [
  'Pasta Carbonara', 'Butter Chicken', 'Tacos al Pastor', 'Sushi Rolls',
  'Greek Salad', 'Mushroom Risotto', 'Pad Thai', 'Crème Brûlée',
  'Biryani', 'Fish & Chips', 'Ramen', 'Tiramisu', 'Shakshuka', 'Pho',
];

const categoryEmoji: Record<string, string> = {
  Italian: '🍝', Indian: '🍛', Mexican: '🌮', Chinese: '🍜',
  American: '🍔', Japanese: '🍱', Mediterranean: '🥗', Desserts: '🍰',
  Breakfast: '🥞', Seafood: '🦞', Vegan: '🥦', Soups: '🍲',
};

const categoryGradients: Record<string, string> = {
  Italian:       'from-red-900/40 to-orange-900/20',
  Indian:        'from-orange-900/40 to-yellow-900/20',
  Mexican:       'from-green-900/40 to-lime-900/20',
  Chinese:       'from-red-900/40 to-rose-900/20',
  American:      'from-blue-900/40 to-slate-900/20',
  Japanese:      'from-pink-900/40 to-rose-900/20',
  Mediterranean: 'from-cyan-900/40 to-blue-900/20',
  Desserts:      'from-pink-900/40 to-purple-900/20',
  Breakfast:     'from-amber-900/40 to-yellow-900/20',
  Seafood:       'from-teal-900/40 to-cyan-900/20',
  Vegan:         'from-green-900/40 to-emerald-900/20',
  Soups:         'from-amber-900/40 to-orange-900/20',
};

interface Chef {
  id: string;
  username: string;
  avatarUrl: string | null;
  recipe_count: number;
  avg_rating: number;
}

const Landing: React.FC = () => {
  const { recipesCount, usersCount, ratingsCount } = useStats();
  const navigate = useNavigate();

  const [showBanner, setShowBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [topChef, setTopChef] = useState<Chef | null>(null);
  const [animatedStats, setAnimatedStats] = useState({ recipes: 0, users: 0, ratings: 0 });
  const [hasIntersected, setHasIntersected] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsAnimated = useRef(false);

  // Scroll: progress bar + parallax
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setParallaxOffset(scrollTop * 0.25);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Stats section IntersectionObserver
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHasIntersected(true); },
      { threshold: 0.4 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate counters when in view + data loaded
  useEffect(() => {
    if (!hasIntersected || statsAnimated.current) return;
    if (recipesCount === 0 && usersCount === 0 && ratingsCount === 0) return;
    statsAnimated.current = true;
    const animate = (key: 'recipes' | 'users' | 'ratings', target: number) => {
      const duration = 1400;
      const steps = 60;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const eased = 1 - Math.pow(1 - step / steps, 3);
        setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(eased * target) }));
        if (step >= steps) clearInterval(timer);
      }, duration / steps);
    };
    animate('recipes', recipesCount);
    animate('users', usersCount);
    animate('ratings', ratingsCount);
  }, [hasIntersected, recipesCount, usersCount, ratingsCount]);

  // Fetch data
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getRecipes({ limit: 100 });
        const raw = data.recipes || [];
        const recipes = raw.map(normalizeRecipe);

        setTrendingRecipes(
          [...recipes].sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0)).slice(0, 3)
        );

        const map = new Map<string, any>();
        raw.forEach((r: any) => {
          const uid = r.userId?._id || r.userId;
          if (!uid) return;
          if (!map.has(uid)) map.set(uid, { id: uid, username: r.userId?.username || 'Chef', avatarUrl: r.userId?.avatarUrl || null, recipe_count: 0, total_rating: 0 });
          const c = map.get(uid)!;
          c.recipe_count++;
          c.total_rating += r.averageRating || 0;
        });
        const chefs: Chef[] = Array.from(map.values()).map(c => ({
          ...c,
          avg_rating: c.recipe_count > 0 ? c.total_rating / c.recipe_count : 0,
        }));
        setTopChef(chefs.sort((a, b) => b.avg_rating - a.avg_rating)[0] || null);
      } catch {}

      try {
        const catRes = await getCategories();
        const cats = catRes.data.categories || catRes.data || [];
        setCategories(Array.isArray(cats) ? cats.slice(0, 8) : []);
      } catch {}
    })();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#d4a843] selection:text-black">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
      `}</style>

      {/* ── Scroll Progress Bar ── */}
      <div
        className="fixed top-0 left-0 z-[100] h-[2px] bg-gradient-to-r from-[#d4a843] to-[#f5d78e] pointer-events-none"
        style={{ width: `${scrollProgress}%`, transition: 'width 80ms linear' }}
      />

      {/* ── Announcement Banner ── */}
      {showBanner && (
        <div className="fixed z-[60] flex justify-center pointer-events-none" style={{ top: '76px', left: '16px', right: '16px' }}>
          <div className="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-full bg-[#d4a843] text-black text-xs font-semibold shadow-[0_4px_24px_rgba(212,168,83,0.4)] max-w-sm">
            <Zap className="w-3 h-3 flex-shrink-0" />
            <span>Meal Planner is live! <Link to="/meal-planner" className="underline font-bold">Try it →</Link></span>
            <button onClick={() => setShowBanner(false)} className="ml-2 hover:opacity-60 transition-opacity flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1405] via-[#030303] to-[#030303]"
          style={{ transform: `translateY(${parallaxOffset}px)`, willChange: 'transform' }}
        />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Zap className="w-3 h-3 text-[#d4a843]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4a843]">Next-Gen Cooking Experience</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            CRAFTING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#f5d78e] to-[#8a6520]">TASTE</span>
          </h1>

          <p className="text-gray-400 max-w-lg mx-auto text-lg mb-10 font-light">
            Spoonify isn't just a recipe app; it's a curated ecosystem for those who treat cooking as an art form.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search a recipe..."
                className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#d4a843]/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-4 bg-[#d4a843] text-black font-bold rounded-full hover:bg-white transition-all text-sm flex-shrink-0"
            >
              Search
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth" className="px-8 py-4 bg-[#d4a843] text-black font-bold rounded-full hover:bg-white transition-all flex items-center justify-center gap-2">
              Start Cooking <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/recipes" className="px-8 py-4 bg-white/5 border border-white/10 font-semibold rounded-full hover:bg-white/10 transition-all">
              Explore Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* ── Marquee Ticker ── */}
      <div className="border-y border-white/5 bg-white/[0.015] py-4 overflow-hidden">
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 30s linear infinite' }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-8 text-xs font-medium text-gray-600 tracking-wide">
              <span className="w-1 h-1 rounded-full bg-[#d4a843] flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bento Box Features ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-[#d4a843]/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#d4a843] group-hover:text-black transition-colors">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4a843] mb-3">Simple Process</p>
          <h2 className="text-4xl font-black tracking-tight">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {howItWorks.map((step, i) => (
            <div key={i} className="text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full border border-[#d4a843]/20 bg-[#d4a843]/5 mb-6">
                <step.icon className="w-8 h-8 text-[#d4a843]" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#d4a843] text-black text-[10px] font-black flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trending Recipes ── */}
      {trendingRecipes.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4a843] mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" /> Trending Now
              </p>
              <h2 className="text-4xl font-black tracking-tight">Top Rated Recipes</h2>
            </div>
            <Link to="/recipes" className="text-sm text-[#d4a843] hover:text-white transition-colors flex items-center gap-1 mb-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {trendingRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {/* ── Categories Grid ── */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="text-center mb-14">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4a843] mb-3">Browse</p>
            <h2 className="text-4xl font-black tracking-tight">Explore by Category</h2>
            <p className="text-gray-600 text-sm mt-3">Dive into the cuisine that calls to you</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat: any, i) => {
              const name = cat.name || 'Other';
              const emoji = categoryEmoji[name] ?? '🍽️';
              const gradient = categoryGradients[name] ?? 'from-gray-800/40 to-gray-900/20';
              const isWide = i === 0 || (categories.length > 5 && i === 5);
              return (
                <Link
                  key={i}
                  to="/categories"
                  className={`group relative overflow-hidden rounded-3xl border border-white/[0.06]
                    hover:border-[#d4a843]/40 transition-all duration-300
                    hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                    flex flex-col items-center justify-center gap-3 text-center
                    ${isWide ? 'col-span-2 py-12 px-8' : 'py-10 px-6'}`}
                >
                  {/* Category gradient bg */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Decorative circles */}
                  <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/[0.02] group-hover:bg-[#d4a843]/[0.06] transition-colors duration-300" />
                  <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white/[0.02] group-hover:bg-[#d4a843]/[0.04] transition-colors duration-300" />

                  {/* Emoji */}
                  <span className={`relative z-10 block group-hover:scale-110 transition-transform duration-300 select-none ${isWide ? 'text-6xl' : 'text-4xl'}`}>
                    {emoji}
                  </span>

                  {/* Animated divider */}
                  <div className="relative z-10 h-px bg-white/10 group-hover:bg-[#d4a843]/50 transition-all duration-300 w-8 group-hover:w-12" />

                  {/* Name */}
                  <span className="relative z-10 text-sm font-bold text-gray-500 group-hover:text-white transition-colors duration-300 tracking-wide">
                    {name}
                  </span>

                  {/* Arrow — appears on hover */}
                  <ArrowRight className="relative z-10 w-3.5 h-3.5 text-[#d4a843] opacity-0 -mt-1 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Chef of the Week ── */}
      {topChef && (
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="rounded-3xl bg-gradient-to-br from-[#1a1405] via-[#0e0e0e] to-[#0c0c0c] border border-[#d4a843]/10 p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-shrink-0">
              <div className="relative w-28 h-28">
                <div className="absolute inset-0 rounded-full bg-[#d4a843]/20 blur-2xl scale-150" />
                <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-[#d4a843]/30">
                  {topChef.avatarUrl ? (
                    <img src={topChef.avatarUrl} alt={topChef.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#d4a843]/10">
                      <ChefHat className="w-12 h-12 text-[#d4a843]" />
                    </div>
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#d4a843] rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4a843] mb-2">Chef of the Week</p>
              <h3 className="text-3xl font-black mb-2">{topChef.username}</h3>
              <p className="text-gray-400 text-sm mb-6">
                {topChef.recipe_count} recipes shared · {topChef.avg_rating.toFixed(1)} average rating
              </p>
              <Link
                to={`/chef/${topChef.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4a843] text-black font-bold rounded-full hover:bg-white transition-all text-sm"
              >
                View Profile <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Live Stats Bar (Animated) ── */}
      <section ref={statsRef} className="bg-[#0c0c0c] py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { n: animatedStats.recipes, l: 'Recipes Shared' },
            { n: animatedStats.users, l: 'Active Chefs' },
            { n: animatedStats.ratings, l: 'Five-Star Ratings' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-5xl font-black text-[#d4a843] mb-2">{stat.n}+</div>
              <div className="text-gray-500 uppercase tracking-widest text-[10px]">{stat.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="py-32 text-center">
        <h2 className="text-4xl font-bold mb-8">Ready to serve?</h2>
        <Link to="/auth" className="inline-block px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-[#d4a843] transition-all">
          Join the Movement
        </Link>
      </section>
    </div>
  );
};

export default Landing;
