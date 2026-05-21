import React, { useState, useEffect, KeyboardEvent } from 'react';
import { Search, SlidersHorizontal, X, Refrigerator, ChevronDown, ChevronUp } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    category: string;
    difficulty: string;
    maxCookingTime: number;
    ingredients: string[];
  }) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange }) => {
  const [mode, setMode] = useState<'search' | 'fridge'>('search');
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [maxCookingTime, setMaxCookingTime] = useState(120);
  const [showFilters, setShowFilters] = useState(false);
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);

  useEffect(() => {
    onFiltersChange({ search, category: '', difficulty, maxCookingTime, ingredients });
  }, [search, difficulty, maxCookingTime, ingredients, onFiltersChange]);

  const addIngredient = () => {
    const trimmed = ingredientInput.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) setIngredients(prev => [...prev, trimmed]);
    setIngredientInput('');
  };

  const removeIngredient = (ing: string) => setIngredients(prev => prev.filter(i => i !== ing));

  const handleIngredientKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addIngredient(); }
    else if (e.key === 'Backspace' && !ingredientInput && ingredients.length > 0) {
      setIngredients(prev => prev.slice(0, -1));
    }
  };

  const resetFilters = () => {
    setSearch(''); setDifficulty(''); setMaxCookingTime(120);
    setIngredients([]); setIngredientInput('');
  };

  const switchMode = (newMode: 'search' | 'fridge') => {
    setMode(newMode);
    if (newMode === 'search') { setIngredients([]); setIngredientInput(''); }
    else setSearch('');
  };

  const hasActiveFilters = difficulty || maxCookingTime < 120 || ingredients.length > 0;

  const inputBase = 'w-full bg-[#141414] border border-white/[0.08] rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none transition-all duration-200 focus:border-[#d4a843]/50 focus:ring-2 focus:ring-[#d4a843]/10';

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Mode toggle */}
        <div className="flex items-center gap-0.5 p-1 rounded-xl w-fit flex-shrink-0 bg-white/[0.04] border border-white/[0.06]">
          {(['search', 'fridge'] as const).map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === m
                  ? 'bg-[#d4a843] text-black shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {m === 'search' ? <Search className="h-3.5 w-3.5" /> : <Refrigerator className="h-3.5 w-3.5" />}
              {m === 'search' ? 'Search' : 'Fridge'}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex-1 relative">
          {mode === 'search' ? (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`${inputBase} pl-11 pr-10 py-3`}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 px-4 py-2.5 bg-[#141414] border border-white/[0.08] rounded-xl focus-within:border-[#d4a843]/50 focus-within:ring-2 focus-within:ring-[#d4a843]/10 min-h-[46px] transition-all">
              {ingredients.map(ing => (
                <span key={ing} className="flex items-center gap-1 bg-[#d4a843]/15 text-[#d4a843] border border-[#d4a843]/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                  {ing}
                  <button onClick={() => removeIngredient(ing)} className="hover:text-white transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={ingredients.length === 0 ? '🥦 Type ingredient + Enter...' : 'Add more...'}
                value={ingredientInput}
                onChange={e => setIngredientInput(e.target.value)}
                onKeyDown={handleIngredientKey}
                onBlur={addIngredient}
                className="flex-1 min-w-[140px] bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
              />
            </div>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex-shrink-0 ${
            showFilters || hasActiveFilters
              ? 'bg-[#d4a843] text-black'
              : 'bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.15]'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && !showFilters && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
          {showFilters ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="bg-[#111] rounded-2xl border border-white/[0.08] p-5 animate-fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Difficulty */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Difficulty</label>
              <div className="flex gap-2">
                {(['', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                  <button
                    key={d || 'all'}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                      difficulty === d
                        ? d === 'Easy'   ? 'bg-emerald-500 text-white'
                        : d === 'Medium' ? 'bg-[#d4a843] text-black'
                        : d === 'Hard'   ? 'bg-rose-500 text-white'
                        : 'bg-white/10 text-white'
                        : 'bg-white/[0.04] border border-white/[0.06] text-gray-500 hover:text-gray-300 hover:border-white/[0.12]'
                    }`}
                  >
                    {d || 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Cooking time */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                Max Cook Time — <span className="text-[#d4a843]">{maxCookingTime} min</span>
              </label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-6">15</span>
                <input
                  type="range"
                  min="15" max="180" step="15"
                  value={maxCookingTime}
                  onChange={e => setMaxCookingTime(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs text-gray-600 w-8">180</span>
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex justify-end">
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-gray-600 hover:text-red-400 transition-colors"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      )}

      {mode === 'fridge' && ingredients.length > 0 && (
        <p className="text-xs text-gray-600 px-1">
          Showing recipes with any of your {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default SearchFilters;
