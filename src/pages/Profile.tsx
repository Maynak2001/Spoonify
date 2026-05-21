import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ChefHat, Heart, Star, LogOut, BookOpen, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRecipes } from '../hooks/useRecipes';
import { getFavorites } from '../utils/api';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { recipes } = useRecipes(user ? { userId: user.id } : undefined);
  const [favCount, setFavCount] = React.useState(0);

  React.useEffect(() => {
    if (user) {
      getFavorites().then(({ data }) => setFavCount((data || []).length)).catch(() => {});
    }
  }, [user]);

  const handleSignOut = () => {
    signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Sign In</h2>
          <button onClick={() => navigate('/auth')} className="btn-primary">Sign In</button>
        </div>
      </div>
    );
  }

  const avgRating = recipes.length > 0
    ? (recipes.reduce((sum, r: any) => sum + (r.average_rating || 0), 0) / recipes.length)
    : 0;

  const initials = (user.fullName || user.username || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#080808]">

      {/* Banner */}
      <div className="relative h-44 sm:h-52 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1200] via-[#0e0e0e] to-[#080808]" />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(212,168,83,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 30%, rgba(212,168,83,0.06) 0%, transparent 50%)' }}
        />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#080808] to-transparent" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Avatar + name */}
        <div className="relative -mt-14 sm:-mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-[#080808] bg-[#111] flex items-center justify-center overflow-hidden shadow-2xl flex-shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-[#d4a843]">{initials}</span>
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {user.fullName || user.username || 'Anonymous Chef'}
              </h1>
              {user.username && (
                <p className="text-gray-500 text-sm mt-0.5">@{user.username}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 self-start sm:self-auto sm:mb-1 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Recipes',    value: recipes.length,                          icon: ChefHat, color: 'text-[#d4a843]', bg: 'bg-[#d4a843]/10',  border: 'border-[#d4a843]/15'  },
            { label: 'Favorites',  value: favCount,                                icon: Heart,   color: 'text-rose-400',   bg: 'bg-rose-400/10',   border: 'border-rose-400/15'   },
            { label: 'Avg Rating', value: avgRating > 0 ? avgRating.toFixed(1) : '—', icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/10',  border: 'border-amber-400/15'  },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className="bg-[#111] rounded-2xl border border-white/[0.06] p-4 flex flex-col items-center gap-2.5">
              <div className={`p-2.5 rounded-xl ${bg} border ${border}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className={`text-2xl font-extrabold leading-none ${color}`}>{value}</p>
              <p className="text-[11px] text-gray-600 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Account details */}
        <div className="bg-[#111] rounded-2xl border border-white/[0.06] overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-bold text-white">Account Details</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            <div className="flex items-center gap-3.5 px-5 py-4">
              <div className="p-2 rounded-xl bg-[#d4a843]/10 border border-[#d4a843]/15 flex-shrink-0">
                <Mail className="h-4 w-4 text-[#d4a843]" />
              </div>
              <div>
                <p className="text-[11px] text-gray-600 mb-0.5 uppercase tracking-wider font-semibold">Email</p>
                <p className="text-sm font-semibold text-gray-200">{user.email}</p>
              </div>
            </div>
            {user.username && (
              <div className="flex items-center gap-3.5 px-5 py-4">
                <div className="p-2 rounded-xl bg-sky-400/10 border border-sky-400/15 flex-shrink-0">
                  <User className="h-4 w-4 text-sky-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-600 mb-0.5 uppercase tracking-wider font-semibold">Username</p>
                  <p className="text-sm font-semibold text-gray-200">@{user.username}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <button
            onClick={() => navigate('/my-recipes')}
            className="flex items-center gap-3 p-4 bg-[#111] rounded-2xl border border-white/[0.06] hover:border-[#d4a843]/20 hover:bg-[#d4a843]/5 transition-all text-left group"
          >
            <div className="p-2.5 rounded-xl bg-[#d4a843]/10 border border-[#d4a843]/15 flex-shrink-0 group-hover:bg-[#d4a843]/20 transition-colors">
              <BookOpen className="h-4 w-4 text-[#d4a843]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">My Recipes</p>
              <p className="text-xs text-gray-600 mt-0.5">{recipes.length} created</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/favorites')}
            className="flex items-center gap-3 p-4 bg-[#111] rounded-2xl border border-white/[0.06] hover:border-rose-500/20 hover:bg-rose-500/5 transition-all text-left group"
          >
            <div className="p-2.5 rounded-xl bg-rose-400/10 border border-rose-400/15 flex-shrink-0 group-hover:bg-rose-400/20 transition-colors">
              <Heart className="h-4 w-4 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Favorites</p>
              <p className="text-xs text-gray-600 mt-0.5">{favCount} saved</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
