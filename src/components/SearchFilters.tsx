import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    category: string;
    difficulty: string;
    maxCookingTime: number;
  }) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange }) => {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [maxCookingTime, setMaxCookingTime] = useState(120);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    onFiltersChange({ search, category: '', difficulty, maxCookingTime });
  }, [search, difficulty, maxCookingTime, onFiltersChange]);

  const resetFilters = () => {
    setSearch('');
    setDifficulty('');
    setMaxCookingTime(120);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
          <input
            type="text"
            placeholder="Search recipes or ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
      <div className={`mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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