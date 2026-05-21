import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Plus, Heart, Menu, X, Bell, ShoppingCart, Calendar, Activity, ChefHat } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../contexts/NotificationContext';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';

const FloatingNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount, notifications, markAllRead } = useNotifications();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    try {
      signOut();
      toast.success('See you next time! 👋');
      navigate('/');
    } catch {
      toast.error('Error signing out');
    }
  };

  const isActive = (to: string) => location.pathname === to;
  const userInitial = (user?.fullName || user?.username || user?.email || 'U')[0].toUpperCase();

  const MAIN_LINKS = [
    { to: '/recipes', label: 'Recipes' },
    { to: '/categories', label: 'Explore' },
    { to: '/chefs', label: 'Chefs' },
  ];

  return (
    <>
    <div className="fixed top-0 inset-x-0 z-[55] flex justify-center px-4 pt-3 pointer-events-none">
      <nav className={`pointer-events-auto w-full max-w-5xl transition-all duration-300 ${
        scrolled
          ? 'bg-[#080808]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-2 rounded-2xl'
          : 'bg-[#0e0e0e] border border-white/[0.06] py-3 rounded-2xl'
      }`}>
        <div className="flex items-center justify-between px-4 sm:px-5">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#d4a843] flex items-center justify-center text-black group-hover:scale-110 transition-transform duration-200">
              <ChefHat size={17} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black tracking-tight text-white hidden sm:block">
              Spoon<span className="text-[#d4a843]">ify</span>
            </span>
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-0.5 p-1 bg-white/[0.04] rounded-xl border border-white/[0.06]">
            {MAIN_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(to)
                    ? 'bg-[#d4a843] text-black shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {user ? (
              <div className="flex items-center gap-1.5">
                {/* Icon links */}
                {[
                  { to: '/favorites', icon: Heart, title: 'Favorites' },
                  { to: '/shopping-list', icon: ShoppingCart, title: 'Shopping List' },
                  { to: '/meal-planner', icon: Calendar, title: 'Meal Planner' },
                  { to: '/activity-feed', icon: Activity, title: 'Activity' },
                ].map(({ to, icon: Icon, title }) => (
                  <Link
                    key={to}
                    to={to}
                    title={title}
                    className="hidden lg:flex p-2 rounded-lg text-gray-500 hover:text-[#d4a843] hover:bg-white/[0.05] transition-all"
                  >
                    <Icon size={18} />
                  </Link>
                ))}

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className={`relative p-2 rounded-lg transition-all ${
                      notifOpen ? 'bg-[#d4a843]/10 text-[#d4a843]' : 'text-gray-500 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-[#111] rounded-2xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.7)] p-2 z-50 animate-fade-up">
                      <div className="flex items-center justify-between px-3 py-2 mb-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Notifications</span>
                        <button onClick={markAllRead} className="text-xs text-[#d4a843] hover:underline">Clear all</button>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-center text-sm text-gray-600 py-6">All caught up!</p>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className="p-3 hover:bg-white/[0.04] rounded-xl cursor-pointer transition-colors">
                              <p className="text-sm font-semibold text-gray-200">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Create */}
                <Link
                  to="/add-recipe"
                  className="hidden sm:flex items-center gap-1.5 bg-[#d4a843] hover:bg-[#e0b855] text-black px-3.5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_16px_rgba(212,168,83,0.25)]"
                >
                  <Plus size={16} strokeWidth={3} />
                  <span>Create</span>
                </Link>

                {/* Avatar */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm transition-all ${
                      userMenuOpen
                        ? 'ring-2 ring-[#d4a843] bg-[#d4a843]/10 text-[#d4a843]'
                        : 'bg-white/[0.07] text-gray-300 hover:bg-white/[0.12] hover:text-white'
                    }`}
                  >
                    {userInitial}
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-[#111] rounded-2xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.7)] p-2 z-50 animate-fade-up">
                      <div className="px-3 py-2.5 mb-1 border-b border-white/[0.06]">
                        <p className="text-sm font-bold text-white truncate">{user?.fullName || user?.username}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                      </div>
                      {[
                        { to: '/profile', label: 'Profile' },
                        { to: '/my-recipes', label: 'My Recipes' },
                        { to: '/favorites', label: 'Favorites' },
                      ].map(({ to, label }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
                        >
                          {label}
                        </Link>
                      ))}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left mt-1 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-[#d4a843] text-black px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_16px_rgba(212,168,83,0.25)] hover:bg-[#e0b855] hover:scale-105 active:scale-95 transition-all"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>
    </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#080808]/98 backdrop-blur-2xl md:hidden flex flex-col pt-20 px-6 animate-fade-in">
          <nav className="flex flex-col gap-1 mt-6">
            {MAIN_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3.5 rounded-xl text-lg font-bold transition-colors ${
                  isActive(to) ? 'text-[#d4a843] bg-[#d4a843]/10' : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {label}
              </Link>
            ))}
            {user && (
              <>
                {[
                  { to: '/favorites', icon: Heart, label: 'Favorites' },
                  { to: '/shopping-list', icon: ShoppingCart, label: 'Shopping List' },
                  { to: '/meal-planner', icon: Calendar, label: 'Meal Planner' },
                  { to: '/activity-feed', icon: Activity, label: 'Activity Feed' },
                  { to: '/about', label: 'About' },
                ].map(({ to, icon: Icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-colors ${
                      isActive(to) ? 'text-[#d4a843] bg-[#d4a843]/10' : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {Icon && <Icon size={18} />}
                    {label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          <div className="mt-auto pb-10 space-y-3">
            {user ? (
              <>
                <Link
                  to="/add-recipe"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#d4a843] text-black py-4 rounded-2xl text-base font-bold"
                >
                  <Plus size={20} /> New Recipe
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/20 text-red-400 font-semibold text-sm"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full bg-[#d4a843] text-black py-4 rounded-2xl text-base font-bold"
              >
                Sign In / Register
              </Link>
            )}
            <div className="flex justify-center pt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingNavbar;
