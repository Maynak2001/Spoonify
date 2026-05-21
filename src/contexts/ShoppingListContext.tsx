import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ShoppingItem {
  id: string;
  ingredient: string;
  recipeTitle: string;
  recipeId: string;
  checked: boolean;
}

interface ShoppingListContextType {
  items: ShoppingItem[];
  addIngredients: (ingredients: string[], recipeId: string, recipeTitle: string) => void;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearChecked: () => void;
  clearAll: () => void;
  totalItems: number;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const ShoppingListProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem('spoonify_shopping_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('spoonify_shopping_list', JSON.stringify(items));
  }, [items]);

  const addIngredients = (ingredients: string[], recipeId: string, recipeTitle: string) => {
    const newItems: ShoppingItem[] = ingredients
      .filter(ing => ing.trim())
      .map(ing => ({
        id: `${recipeId}-${ing}-${Date.now()}-${Math.random()}`,
        ingredient: ing.trim(),
        recipeTitle,
        recipeId,
        checked: false,
      }));
    setItems(prev => {
      const existingKeys = new Set(prev.map(i => `${i.recipeId}-${i.ingredient}`));
      const fresh = newItems.filter(i => !existingKeys.has(`${i.recipeId}-${i.ingredient}`));
      return [...prev, ...fresh];
    });
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearChecked = () => {
    setItems(prev => prev.filter(item => !item.checked));
  };

  const clearAll = () => setItems([]);

  return (
    <ShoppingListContext.Provider value={{
      items,
      addIngredients,
      toggleItem,
      removeItem,
      clearChecked,
      clearAll,
      totalItems: items.length,
    }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) throw new Error('useShoppingList must be used within ShoppingListProvider');
  return ctx;
};
