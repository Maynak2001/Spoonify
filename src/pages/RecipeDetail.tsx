import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Heart, ArrowLeft, Edit, Trash2, Printer, Share2, ShoppingCart, Minus, Plus, Link2, Check, ChefHat, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getRecipe, deleteRecipe, addRating, normalizeRecipe, addFavorite, removeFavorite, getFavorites } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useShoppingList } from '../contexts/ShoppingListContext';
import { useNotifications } from '../contexts/NotificationContext';
import CommentSection from '../components/CommentSection';
import CookingTimer from '../components/CookingTimer';
import toast from 'react-hot-toast';

const scaleIngredient = (ingredient: string, ratio: number): string => {
  if (ratio === 1) return ingredient;
  return ingredient.replace(/\b(\d+(?:\.\d+)?)\b/g, (_, num) => {
    const scaled = parseFloat(num) * ratio;
    const rounded = Math.round(scaled * 4) / 4;
    if (rounded % 1 === 0) return rounded.toString();
    return rounded.toFixed(2).replace(/\.?0+$/, '');
  });
};

const difficultyStyle: Record<string, string> = {
  Easy:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-[#d4a843]/15 text-[#d4a843] border-[#d4a843]/20',
  Hard:   'bg-rose-500/15 text-rose-400 border-rose-500/20',
};

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addIngredients } = useShoppingList();
  const { addNotification } = useNotifications();

  const [recipe, setRecipe] = useState<any>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(4);
  const [baseServings, setBaseServings] = useState(4);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [cookingMode, setCookingMode] = useState(false);
  const [cookingStep, setCookingStep] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (id) fetchRecipe(); }, [id]);

  useEffect(() => {
    if (user && id) {
      getFavorites().then(({ data }) => {
        const favIds = (data || []).map((r: any) => r._id || r.id);
        setIsFavorite(favIds.includes(id));
      }).catch(() => {});
    }
  }, [user, id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) setShowShare(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchRecipe = async () => {
    try {
      const { data } = await getRecipe(id!);
      const normalized = normalizeRecipe(data);
      setRecipe(normalized);
      const base = normalized.servings || 4;
      setBaseServings(base);
      setServings(base);
    } catch {
      toast.error('Error loading recipe');
    } finally {
      setLoading(false);
    }
  };

  const scale = baseServings > 0 ? servings / baseServings : 1;

  const submitRating = async (rating: number) => {
    if (!user) { toast.error('Please sign in to rate recipes'); return; }
    try {
      await addRating({ recipeId: id!, rating });
      setUserRating(rating);
      fetchRecipe();
      toast.success('Rating submitted!');
    } catch { toast.error('Error submitting rating'); }
  };

  const handleDelete = async () => {
    try {
      await deleteRecipe(id!);
      toast.success('Recipe deleted');
      navigate('/my-recipes');
    } catch { toast.error('Error deleting recipe'); }
  };

  const handleAddToShoppingList = () => {
    const scaled = recipe.ingredients.map((ing: string) => scaleIngredient(ing, scale));
    addIngredients(scaled, recipe.id, recipe.title);
    addNotification({ type: 'shopping', title: 'Added to Shopping List', message: `${scaled.length} ingredients from "${recipe.title}"`, link: '/shopping-list' });
    toast.success(`${scaled.length} ingredients added!`);
  };

  const handleToggleFavorite = async () => {
    if (!user) { toast.error('Please sign in to save favorites'); return; }
    setFavoriteLoading(true);
    try {
      if (isFavorite) { await removeFavorite(id!); setIsFavorite(false); toast.success('Removed from favorites'); }
      else { await addFavorite(id!); setIsFavorite(true); toast.success('Added to favorites ❤️'); }
    } catch { toast.error('Error updating favorites'); }
    finally { setFavoriteLoading(false); }
  };

  const handleShare = (platform: 'copy' | 'whatsapp' | 'twitter') => {
    const url = window.location.href;
    const text = `Check out this recipe: ${recipe.title}`;
    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); toast.success('Link copied!'); });
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    }
    setShowShare(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-[#d4a843] rounded-full animate-spin" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Recipe not found</h2>
          <Link to="/recipes" className="btn-primary">Back to Recipes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808]">

      {/* ── Delete Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] rounded-2xl border border-white/[0.08] shadow-2xl max-w-sm w-full p-6 animate-fade-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Recipe?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently delete <span className="font-semibold text-gray-300">"{recipe.title}"</span>. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] text-gray-400 font-semibold hover:bg-white/[0.04] transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowDeleteModal(false); handleDelete(); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cooking Mode ── */}
      {cookingMode && recipe.steps?.length > 0 && (
        <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <ChefHat className="h-5 w-5 text-[#d4a843]" />
              <span className="font-bold text-white">{recipe.title}</span>
            </div>
            <button onClick={() => setCookingMode(false)} className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-0.5 bg-white/[0.05]">
            <div className="h-full bg-[#d4a843] transition-all duration-500" style={{ width: `${((cookingStep + 1) / recipe.steps.length) * 100}%` }} />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center max-w-2xl mx-auto w-full">
            <span className="badge-gold mb-6">Step {cookingStep + 1} of {recipe.steps.length}</span>
            <p className="text-white text-2xl sm:text-3xl font-medium leading-relaxed">{recipe.steps[cookingStep]}</p>
          </div>

          <div className="flex items-center justify-between px-6 py-6 border-t border-white/[0.06]">
            <button
              onClick={() => setCookingStep(s => Math.max(0, s - 1))}
              disabled={cookingStep === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] text-white disabled:opacity-30 hover:bg-white/[0.1] transition-colors font-semibold text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <div className="flex gap-1.5">
              {recipe.steps.map((_: any, i: number) => (
                <button key={i} onClick={() => setCookingStep(i)}
                  className={`h-1.5 rounded-full transition-all ${i === cookingStep ? 'bg-[#d4a843] w-5' : 'bg-white/20 w-1.5 hover:bg-white/40'}`}
                />
              ))}
            </div>
            {cookingStep < recipe.steps.length - 1 ? (
              <button onClick={() => setCookingStep(s => s + 1)} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#d4a843] text-black hover:bg-[#e0b855] transition-colors font-semibold text-sm">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={() => setCookingMode(false)} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-semibold text-sm">
                Done! <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#d4a843] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Hero card */}
        <div className="bg-[#111] rounded-2xl border border-white/[0.06] overflow-hidden mb-6">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={recipe.image_url || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&h=400&fit=crop&crop=center'}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${difficultyStyle[recipe.difficulty] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/20'}`}>
                  {recipe.difficulty}
                </span>
                {recipe.category_name && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/10 backdrop-blur-sm">
                    {recipe.category_name}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{recipe.title}</h1>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{recipe.description}</p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock className="h-4 w-4 text-[#d4a843]" />
                {recipe.cooking_time} min
              </div>

              {/* Servings scaler */}
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5">
                <Users className="h-3.5 w-3.5 text-gray-500" />
                <button onClick={() => setServings(s => Math.max(1, s - 1))} className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-white/[0.08] text-gray-400 transition-colors">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-sm font-semibold text-white w-20 text-center">{servings} servings</span>
                <button onClick={() => setServings(s => s + 1)} className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-white/[0.08] text-gray-400 transition-colors">
                  <Plus className="h-3 w-3" />
                </button>
                {scale !== 1 && <span className="text-xs text-[#d4a843] font-bold">×{scale.toFixed(1)}</span>}
              </div>

              {recipe.average_rating > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Star className="h-4 w-4 fill-current text-[#d4a843]" />
                  {recipe.average_rating.toFixed(1)}
                  <span className="text-gray-600">({recipe.total_ratings})</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {user && user.id === recipe.user_id && (
                <>
                  <button onClick={() => navigate(`/edit-recipe/${recipe.id}`)} title="Edit"
                    className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-[#d4a843] hover:border-[#d4a843]/30 transition-all">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => setShowDeleteModal(true)} title="Delete"
                    className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}

              <CookingTimer defaultMinutes={recipe.cooking_time || 30} />

              <button onClick={() => { setCookingStep(0); setCookingMode(true); }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#d4a843] text-black hover:bg-[#e0b855] transition-all text-sm font-bold">
                <ChefHat className="h-4 w-4" />
                <span className="hidden sm:inline">Cook Mode</span>
              </button>

              <button onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.15] transition-all text-sm font-semibold">
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </button>

              {/* Share */}
              <div className="relative" ref={shareRef}>
                <button onClick={() => setShowShare(!showShare)}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.15] transition-all text-sm font-semibold">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                {showShare && (
                  <div className="absolute right-0 top-12 w-44 bg-[#111] rounded-2xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.7)] z-50 overflow-hidden animate-fade-up">
                    {[
                      { action: 'copy' as const, icon: copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Link2 className="h-4 w-4" />, label: copied ? 'Copied!' : 'Copy Link' },
                      { action: 'whatsapp' as const, icon: <span className="text-base">📱</span>, label: 'WhatsApp' },
                      { action: 'twitter' as const, icon: <span className="text-sm font-black text-white">𝕏</span>, label: 'Twitter / X' },
                    ].map(({ action, icon, label }) => (
                      <button key={action} onClick={() => handleShare(action)}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors">
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={handleToggleFavorite} disabled={favoriteLoading}
                className={`p-2.5 rounded-xl border transition-all ${
                  isFavorite
                    ? 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25'
                    : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-red-400 hover:border-red-500/30'
                }`}>
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Rating */}
            {user && (
              <div className="mt-5 pt-5 border-t border-white/[0.06]">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Rate this recipe</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => submitRating(star)}
                      className={`p-1 transition-all hover:scale-110 ${star <= userRating ? 'text-[#d4a843]' : 'text-gray-700 hover:text-[#d4a843]'}`}>
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shopping list */}
            {user && recipe.ingredients?.length > 0 && (
              <button onClick={handleAddToShoppingList}
                className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15 transition-colors text-sm font-semibold">
                <ShoppingCart className="h-4 w-4" />
                Add {recipe.ingredients.length} ingredients to Shopping List
                {scale !== 1 && <span className="text-xs opacity-60">(×{scale.toFixed(1)})</span>}
              </button>
            )}
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Ingredients + Nutrition */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#111] rounded-2xl border border-white/[0.06] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white">Ingredients</h2>
                {scale !== 1 && (
                  <span className="text-xs bg-[#d4a843]/10 text-[#d4a843] border border-[#d4a843]/20 px-2 py-0.5 rounded-full font-semibold">
                    ×{scale.toFixed(1)} scaled
                  </span>
                )}
              </div>
              <ul className="space-y-2.5">
                {recipe.ingredients.map((ingredient: string, index: number) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843]/60 mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-400 leading-relaxed">{scaleIngredient(ingredient, scale)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {recipe.nutritional_info && (recipe.nutritional_info.calories > 0 || recipe.nutritional_info.protein > 0) && (
              <div className="bg-[#111] rounded-2xl border border-white/[0.06] p-5">
                <h2 className="text-base font-bold text-white mb-4">
                  Nutrition <span className="text-xs font-normal text-gray-600">(per serving)</span>
                </h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Calories', value: recipe.nutritional_info.calories, unit: 'kcal', color: 'text-[#d4a843]',  bg: 'bg-[#d4a843]/10',  border: 'border-[#d4a843]/15'  },
                    { label: 'Protein',  value: recipe.nutritional_info.protein,  unit: 'g',    color: 'text-sky-400',    bg: 'bg-sky-400/10',    border: 'border-sky-400/15'    },
                    { label: 'Carbs',    value: recipe.nutritional_info.carbs,    unit: 'g',    color: 'text-emerald-400',bg: 'bg-emerald-400/10',border: 'border-emerald-400/15' },
                    { label: 'Fat',      value: recipe.nutritional_info.fat,      unit: 'g',    color: 'text-rose-400',   bg: 'bg-rose-400/10',   border: 'border-rose-400/15'   },
                  ].map(({ label, value, unit, color, bg, border }) => (
                    <div key={label} className={`p-3 rounded-xl ${bg} border ${border} text-center`}>
                      <p className={`text-lg font-extrabold ${color} leading-none`}>{value}<span className="text-[10px] font-normal ml-0.5">{unit}</span></p>
                      <p className="text-[11px] text-gray-600 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Steps + Comments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111] rounded-2xl border border-white/[0.06] p-5">
              <h2 className="text-base font-bold text-white mb-5">Instructions</h2>
              <ol className="space-y-5">
                {recipe.steps.map((step: string, index: number) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#d4a843]/15 border border-[#d4a843]/25 text-[#d4a843] text-xs font-extrabold flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-sm text-gray-400 leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <CommentSection recipeId={id!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
