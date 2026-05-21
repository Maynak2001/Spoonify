import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Users, Star, Search, Heart, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { useStats } from '../hooks/useStats';

const features = [
  { icon: Search,  title: 'Smart Search',   desc: 'Find recipes by ingredients, cuisine, difficulty, or cooking time' },
  { icon: Users,   title: 'Community',      desc: 'Connect with fellow food enthusiasts and share your creations' },
  { icon: Star,    title: 'Rate & Review',  desc: 'Rate recipes and read reviews from other home cooks' },
  { icon: Heart,   title: 'Save Favorites', desc: 'Keep your favorite recipes organized in one place' },
  { icon: Clock,   title: 'Quick & Easy',   desc: 'Filter by cooking time to find recipes that fit your schedule' },
  { icon: ChefHat, title: 'Share Recipes',  desc: 'Upload your own recipes with photos and detailed instructions' },
];

const Landing: React.FC = () => {
  const { recipesCount, usersCount, ratingsCount } = useStats();

  return (
    <div className="min-h-screen bg-[#080808] overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-60"
            style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.08), transparent 65%)', filter: 'blur(80px)' }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-60"
            style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.05), transparent 65%)', filter: 'blur(80px)' }} />
        </div>

        {/* Floating emojis */}
        {[
          { emoji: '🍜', cls: 'top-28 left-[7%] text-5xl', delay: '0s' },
          { emoji: '🥗', cls: 'top-36 right-[8%] text-4xl', delay: '1s' },
          { emoji: '🍕', cls: 'bottom-28 left-[14%] text-4xl', delay: '0.5s' },
          { emoji: '🍰', cls: 'bottom-24 right-[12%] text-5xl', delay: '1.5s' },
          { emoji: '🥑', cls: 'top-1/2 left-[4%] text-3xl', delay: '0.8s' },
          { emoji: '🍣', cls: 'top-1/3 right-[4%] text-3xl', delay: '0.3s' },
        ].map(({ emoji, cls, delay }) => (
          <span key={emoji} className={`hidden lg:block absolute ${cls} opacity-[0.07] animate-float select-none`} style={{ animationDelay: delay }}>
            {emoji}
          </span>
        ))}

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.2), transparent 70%)', filter: 'blur(20px)', transform: 'scale(2.5)' }} />
              <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#d4a843] flex items-center justify-center text-black shadow-[0_0_40px_rgba(212,168,83,0.4)]">
                <ChefHat size={40} strokeWidth={2} />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-[#d4a843] animate-ping" style={{ animationDuration: '2s' }} />
            </div>
          </div>

          <div className="badge-gold mb-6">
            <ChefHat className="h-3.5 w-3.5" />
            Community Recipe Platform
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-[1.08] tracking-tight text-white">
            Welcome to{' '}
            <span className="text-gold">Spoonify</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Discover, share, and save your favorite recipes. Join thousands of food lovers creating delicious memories together.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5 active:scale-95
                bg-[#d4a843] hover:bg-[#e0b855] text-black shadow-[0_4px_24px_rgba(212,168,83,0.35)] hover:shadow-[0_8px_40px_rgba(212,168,83,0.5)]">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/recipes"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5 active:scale-95
                border border-white/[0.08] text-gray-400 hover:border-[#d4a843]/30 hover:text-[#d4a843] hover:bg-[#d4a843]/5">
              Browse Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 sm:py-28 bg-[#0c0c0c] border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="badge-gold mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Everything you need
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Why Choose Spoonify?
            </h2>
            <p className="text-gray-600 text-sm">Your complete culinary companion</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="group p-6 rounded-2xl bg-[#111] border border-white/[0.06] hover:border-[#d4a843]/20 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[#d4a843]/10 border border-[#d4a843]/15 group-hover:bg-[#d4a843]/15 transition-colors">
                  <Icon className="h-5 w-5 text-[#d4a843]" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 sm:py-20 bg-[#080808] border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { value: recipesCount, label: 'Delicious Recipes', suffix: '+' },
              { value: usersCount,   label: 'Happy Chefs',       suffix: '+' },
              { value: ratingsCount, label: 'Five-Star Reviews', suffix: '+' },
            ].map(({ value, label, suffix }) => (
              <div key={label} className="py-6 px-4 rounded-2xl bg-[#111] border border-white/[0.06]">
                <div className="text-4xl sm:text-5xl font-extrabold mb-2 text-gold">
                  {value.toLocaleString()}{suffix}
                </div>
                <div className="text-gray-600 text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 sm:py-28 bg-[#0c0c0c] border-t border-white/[0.04] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-50"
            style={{ background: 'radial-gradient(ellipse, rgba(212,168,83,0.07), transparent 65%)', filter: 'blur(60px)' }} />
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="badge-gold mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Start for free
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to Start Your<br />
            <span className="text-gold">Culinary Journey?</span>
          </h2>
          <p className="text-gray-500 mb-10 max-w-md mx-auto text-sm leading-relaxed">
            Join thousands of food lovers and discover your next favorite recipe today!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5 active:scale-95
                bg-[#d4a843] hover:bg-[#e0b855] text-black shadow-[0_4px_24px_rgba(212,168,83,0.35)] hover:shadow-[0_8px_40px_rgba(212,168,83,0.5)]">
              Join Spoonify Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/recipes"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5 active:scale-95
                border border-white/[0.08] text-gray-400 hover:border-[#d4a843]/30 hover:text-[#d4a843] hover:bg-[#d4a843]/5">
              Browse Recipes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
