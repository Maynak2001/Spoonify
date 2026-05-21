import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, Users, LayoutGrid, Clock } from 'lucide-react';
import { getRecipes, getCategories } from '../utils/api';

interface Stats {
  totalRecipes: number;
  totalUsers: number;
  totalCategories: number;
  avgCookingTime: number;
}

const useCountUp = (target: number, duration = 1000) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return value;
};

const statItems = [
  { key: 'totalRecipes'    as keyof Stats, label: 'Recipes',       icon: ChefHat,    suffix: '+',   color: 'text-[#d4a843]',  bg: 'bg-[#d4a843]/10',  border: 'border-[#d4a843]/15' },
  { key: 'totalUsers'      as keyof Stats, label: 'Chefs',         icon: Users,      suffix: '+',   color: 'text-sky-400',    bg: 'bg-sky-400/10',    border: 'border-sky-400/15'   },
  { key: 'totalCategories' as keyof Stats, label: 'Categories',    icon: LayoutGrid, suffix: '',    color: 'text-emerald-400',bg: 'bg-emerald-400/10',border: 'border-emerald-400/15'},
  { key: 'avgCookingTime'  as keyof Stats, label: 'Avg Cook Time', icon: Clock,      suffix: 'min', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/15' },
];

const StatCard: React.FC<{ item: typeof statItems[0]; value: number; loaded: boolean }> = ({ item, value, loaded }) => {
  const animated = useCountUp(loaded ? value : 0);
  const Icon = item.icon;
  return (
    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-colors">
      <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center`}>
        <Icon className={`h-5 w-5 ${item.color}`} />
      </div>
      <div>
        <div className={`text-2xl font-extrabold leading-none ${item.color}`}>
          {animated}{item.suffix}
        </div>
        <div className="text-xs text-gray-500 mt-1">{item.label}</div>
      </div>
    </div>
  );
};

const StatsSection: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ totalRecipes: 0, totalUsers: 0, totalCategories: 0, avgCookingTime: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [recipesRes, categoriesRes] = await Promise.all([getRecipes(), getCategories()]);
        const recipes = recipesRes.data || [];
        const categories = categoriesRes.data || [];
        const avgTime = recipes.length > 0
          ? Math.round(recipes.reduce((s: number, r: any) => s + (r.cookTime || r.cookingTime || 0), 0) / recipes.length)
          : 0;
        setStats({ totalRecipes: recipes.length, totalUsers: 0, totalCategories: categories.length, avgCookingTime: avgTime });
      } catch { /* decorative */ } finally { setLoaded(true); }
    })();
  }, []);

  if (!loaded) {
    return (
      <div className="border-y border-white/[0.05] py-5 bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse">
                <div className="w-11 h-11 rounded-xl bg-white/[0.05] flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-white/[0.05] rounded w-14" />
                  <div className="h-3 bg-white/[0.05] rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-y border-white/[0.05] py-5 bg-[#0c0c0c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statItems.map(item => (
            <StatCard key={item.key} item={item} value={stats[item.key]} loaded={loaded} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
