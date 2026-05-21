import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
        isDark ? 'bg-primary-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`absolute flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
          isDark ? 'translate-x-8' : 'translate-x-1'
        }`}
      >
        {isDark
          ? <Moon className="h-3 w-3 text-primary-500" />
          : <Sun className="h-3 w-3 text-gray-500" />
        }
      </span>
    </button>
  );
};

export default ThemeToggle;
