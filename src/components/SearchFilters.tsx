import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    category: string;
    difficulty: string;
    maxCookingTime: number;
  }) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange }) => {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [maxCookingTime, setMaxCookingTime] = useState(120);
  const [categories, setCategories] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Get category from URL if present
    const urlParams = new URLSearchParams(location.search);
    const categoryFromUrl = urlParams.get('category');
    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    } else {
      setCategory('');
    }
  }, [location.search]);

  useEffect(() => {
    onFiltersChange({ search, category, difficulty, maxCookingTime });
  }, [search, category, difficulty, maxCookingTime, onFiltersChange]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setDifficulty('');
    setMaxCookingTime(120);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search recipes or ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden btn-secondary flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters */}
      <div className={`mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Cooking Time: {maxCookingTime} min
          </label>
          <input
            type="range"
            min="15"
            max="180"
            step="15"
            value={maxCookingTime}
            onChange={(e) => setMaxCookingTime(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Reset Filters */}
      <div className={`mt-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <button
          onClick={resetFilters}
          className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;