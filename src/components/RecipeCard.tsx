import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Heart, ChefHat } from 'lucide-react';
import { Recipe } from '../types';
import { useAuth } from '../hooks/useAuth';
import { addFavorite, removeFavorite } from '../utils/api';
import toast from 'react-hot-toast';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

const FALLBACK = 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=300&fit=crop&crop=center';

const difficultyStyle: Record<string, string> = {
  Easy:   'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-[#d4a843]/20 text-[#d4a843] border-[#d4a843]/20',
  Hard:   'bg-rose-500/20 text-rose-400 border-rose-500/20',
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorite, onFavoriteToggle }) => {
  const { user } = useAuth();

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please sign in to save favorites'); return; }
    try {
      if (isFavorite) {
        await removeFavorite(recipe.id);
        toast.success('Removed from favorites');
      } else {
        await addFavorite(recipe.id);
        toast.success('Added to favorites ❤️');
      }
      onFavoriteToggle?.();
    } catch (error: any) {
      const msg = error.response?.data?.message;
      toast.error(msg === 'Already in favorites' ? 'Already saved!' : 'Error updating favorites');
    }
  };

  return (
    <div className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-[#d4a843]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
      <Link to={`/recipe/${recipe.id}`} onClick={() => window.scrollTo(0, 0)}>

        {/* Image */}
        <div className="relative overflow-hidden h-48">
          <img
            src={recipe.image_url || FALLBACK}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {/* Difficulty */}
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-sm ${difficultyStyle[recipe.difficulty] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/20'}`}>
              {recipe.difficulty}
            </span>
          </div>

          {/* Favorite */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
              isFavorite
                ? 'bg-red-500 border-red-500 text-white'
                : 'bg-black/40 border-white/10 text-gray-300 hover:bg-red-500 hover:border-red-500 hover:text-white'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Bottom meta */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs font-medium text-white/80">
              <Clock className="h-3 w-3" />
              {recipe.cooking_time}m
            </span>
            {recipe.average_rating && recipe.average_rating > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-white/80">
                <Star className="h-3 w-3 fill-current text-[#d4a843]" />
                {recipe.average_rating.toFixed(1)}
                <span className="text-white/40">({recipe.total_ratings})</span>
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-white text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-[#d4a843] transition-colors">
            {recipe.title}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">
            {recipe.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
            {recipe.user_name && (
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-5 h-5 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/15 flex items-center justify-center flex-shrink-0">
                  <ChefHat className="h-2.5 w-2.5 text-[#d4a843]" />
                </div>
                <span className="text-[11px] text-gray-500 truncate">{recipe.user_name}</span>
              </div>
            )}
            {recipe.category_name && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] text-gray-500 flex-shrink-0 ml-auto">
                {recipe.category_name}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;
