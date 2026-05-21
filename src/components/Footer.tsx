import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, ChefHat } from 'lucide-react';

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const Footer: React.FC = () => (
  <footer className="bg-[#0a0a0a] border-t border-white/[0.05]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="col-span-1 sm:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#d4a843] flex items-center justify-center text-black">
              <ChefHat size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black text-gold">Spoonify</span>
          </div>
          <p className="text-sm text-gray-600 mb-6 max-w-xs leading-relaxed">
            Your ultimate destination for discovering, sharing, and saving delicious recipes. Join our community of passionate home cooks.
          </p>
          <div className="flex gap-2">
            {[Facebook, Twitter, Instagram, Mail].map((Icon, i) => (
              <button
                key={i}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5
                  bg-white/[0.04] border border-white/[0.06] text-gray-600
                  hover:bg-[#d4a843]/10 hover:text-[#d4a843] hover:border-[#d4a843]/20"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Quick Links</h3>
          <ul className="space-y-3">
            {[
              { to: '/recipes',    label: 'Browse Recipes' },
              { to: '/categories', label: 'Categories' },
              { to: '/chefs',      label: 'Chefs' },
              { to: '/add-recipe', label: 'Add Recipe' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={scrollToTop}
                  className="text-sm text-gray-600 hover:text-[#d4a843] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-5">Support</h3>
          <ul className="space-y-3">
            {[
              { to: '/help',     label: 'Help Center' },
              { to: '/contact',  label: 'Contact Us' },
              { to: '/about',    label: 'About Us' },
              { to: '/privacy',  label: 'Privacy Policy' },
              { to: '/terms',    label: 'Terms of Service' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={scrollToTop}
                  className="text-sm text-gray-600 hover:text-[#d4a843] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-700">© 2025 Spoonify. All rights reserved.</p>
        <p className="text-xs text-gray-700">
          Made with <span className="text-[#d4a843]">♥</span> for food lovers
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
