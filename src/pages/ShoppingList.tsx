import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, CheckSquare, Square, X, ArrowLeft } from 'lucide-react';
import { useShoppingList } from '../contexts/ShoppingListContext';

const ShoppingList: React.FC = () => {
  const { items, toggleItem, removeItem, clearChecked, clearAll } = useShoppingList();

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.recipeTitle;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/recipes"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Recipes</span>
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="h-7 w-7 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shopping List</h1>
            {items.length > 0 && (
              <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {items.length - checkedCount} left
              </span>
            )}
          </div>

          {items.length > 0 && (
            <div className="flex space-x-2">
              {checkedCount > 0 && (
                <button
                  onClick={clearChecked}
                  className="text-sm px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 transition-colors"
                >
                  Remove checked ({checkedCount})
                </button>
              )}
              <button
                onClick={clearAll}
                className="text-sm px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-12 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your list is empty</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Open any recipe and tap "Add to Shopping List" to get started.
            </p>
            <Link to="/recipes" className="btn-primary">Browse Recipes</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Progress bar */}
            {items.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>{checkedCount} of {items.length} items collected</span>
                  <span>{Math.round((checkedCount / items.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(checkedCount / items.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Grouped by recipe */}
            {Object.entries(grouped).map(([recipeTitle, recipeItems]) => (
              <div key={recipeTitle} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <Link
                    to={`/recipe/${recipeItems[0].recipeId}`}
                    className="font-medium text-primary-600 dark:text-primary-400 hover:underline text-sm"
                  >
                    {recipeTitle}
                  </Link>
                </div>
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recipeItems.map(item => (
                    <li key={item.id} className="flex items-center space-x-3 px-4 py-3">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="text-gray-400 hover:text-primary-500 transition-colors flex-shrink-0"
                      >
                        {item.checked
                          ? <CheckSquare className="h-5 w-5 text-primary-500" />
                          : <Square className="h-5 w-5" />
                        }
                      </button>
                      <span className={`flex-1 text-sm ${item.checked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                        {item.ingredient}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
