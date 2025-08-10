import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface Category {
  id: string;
  name: string;
  description: string;
  recipe_count?: number;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // First get categories
      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      // Then get recipe counts for each category
      const categoriesWithCount = await Promise.all(
        (categoriesData || []).map(async (cat) => {
          const { count } = await supabase
            .from('recipes')
            .select('*', { count: 'exact', head: true })
            .eq('category', cat.id);
          
          return {
            ...cat,
            recipe_count: count || 0
          };
        })
      );

      setCategories(categoriesWithCount);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Recipe Categories</h1>
          <p className="text-xl text-gray-600">Explore recipes by category</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/?category=${category.id}`}
              className="card group hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <ChefHat className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                <span className="text-primary-500 font-medium">
                  {category.recipe_count} recipes
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;