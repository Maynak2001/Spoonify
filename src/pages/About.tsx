import React from 'react';
import { ChefHat, Users, Heart, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

    {/* Hero */}
    <div className="relative py-16 sm:py-20 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none hidden dark:block">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)', filter: 'blur(100px)' }} />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium
          bg-amber-50 text-amber-700 border border-amber-200
          dark:bg-amber-500/10 dark:text-amber-300/80 dark:border-amber-500/20">
          <Sparkles className="h-3.5 w-3.5" />
          Our Story
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          About{' '}
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Spoonify
          </span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Your culinary journey starts here
        </p>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Two cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {[
          { icon: Users,  title: 'Our Community', text: 'Join thousands of food enthusiasts sharing their favorite recipes and discovering new flavors from around the world.' },
          { icon: Heart,  title: 'Our Mission',   text: 'To make cooking accessible, enjoyable, and social by connecting people through the love of food and shared recipes.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title}
            className="p-6 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-card-hover
              bg-white border-gray-100 shadow-card
              dark:bg-gray-800/50 dark:border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4
              bg-amber-50 dark:bg-amber-500/10">
              <Icon className="h-5 w-5 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* What makes us special */}
      <div className="p-8 rounded-2xl mb-10
        bg-white border border-gray-100 shadow-card
        dark:bg-gray-800/50 dark:border-white/[0.06]">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center">What Makes Us Special</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: Star,     title: 'Quality Recipes', text: 'Curated collection of tested and loved recipes' },
            { icon: Users,    title: 'Active Community', text: 'Connect with fellow cooking enthusiasts' },
            { icon: ChefHat, title: 'Easy to Use',      text: 'Simple interface for sharing and discovering recipes' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors
                bg-amber-50 group-hover:bg-amber-100
                dark:bg-amber-500/10 dark:group-hover:bg-amber-500/15">
                <Icon className="h-7 w-7 text-amber-500" />
              </div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">{title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ready to Start Cooking?</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Join our community and start sharing your favorite recipes today!</p>
        <Link to="/auth"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5
            bg-gradient-to-r from-amber-400 to-amber-600 text-gray-900 shadow-md hover:shadow-amber-500/20 hover:shadow-lg">
          Join Spoonify
        </Link>
      </div>
    </div>
  </div>
);

export default About;
