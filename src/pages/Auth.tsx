import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ChefHat, Eye, EyeOff, ArrowRight, Check, UtensilsCrossed, BookOpen, Users, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthPage: React.FC = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', fullName: '', confirmPassword: '' });

  useEffect(() => { if (user) navigate('/recipes'); }, [user, navigate]);

  const passwordStrength = (pwd: string) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };
  const strength = passwordStrength(formData.password);
  const strengthMeta = [
    null,
    { label: 'Weak', color: 'bg-red-500', text: 'text-red-400' },
    { label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-400' },
    { label: 'Good', color: 'bg-blue-500', text: 'text-blue-400' },
    { label: 'Strong', color: 'bg-green-500', text: 'text-green-400' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const wakeUpToast = setTimeout(() => {
      toast.loading('Waking up the kitchen...', { id: 'wakeup' });
    }, 3000);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back, Chef!');
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match!');
          setIsLoading(false);
          return;
        }
        await register(formData.username, formData.email, formData.password, formData.fullName);
        toast.success('Account created successfully!');
      }
      navigate('/recipes');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      clearTimeout(wakeUpToast);
      toast.dismiss('wakeup');
      setIsLoading(false);
    }
  };

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [key]: e.target.value }));

  const inputCls =
    'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 ' +
    'bg-[#111] border border-white/8 text-white placeholder-gray-600 ' +
    'focus:border-[#d4a843]/60 focus:ring-2 focus:ring-[#d4a843]/10 focus:bg-[#0d0d0d]';

  const labelCls = 'block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5';

  const features = [
    { icon: BookOpen, text: 'Save & organize unlimited recipes' },
    { icon: UtensilsCrossed, text: 'Share your creations with the world' },
    { icon: Users, text: 'Connect with 10,000+ food lovers' },
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden bg-black flex-col">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
          <source src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5 text-white">
            <div className="w-9 h-9 rounded-full bg-[#d4a843] flex items-center justify-center text-black">
              <ChefHat size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight">Spoonify</span>
          </div>

          {/* Bottom content */}
          <div className="mb-8">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/20 mb-4">
                <Sparkles size={12} className="text-[#d4a843]" />
                <span className="text-[11px] font-semibold text-[#d4a843] tracking-wide uppercase">
                  {isLogin ? 'Good to see you again' : 'Join the community'}
                </span>
              </div>
              <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.15] mb-4">
                {isLogin ? (
                  <>Discover, Share &<br /><span className="text-[#d4a843]">Master Cooking.</span></>
                ) : (
                  <>Your Culinary<br /><span className="text-[#d4a843]">Journey Starts.</span></>
                )}
              </h2>
              <p className="text-gray-400 text-base max-w-sm leading-relaxed">
                {isLogin
                  ? 'Your recipes and community are waiting for you.'
                  : 'Join thousands of food lovers sharing their best recipes.'}
              </p>
            </div>

            {/* Features — sign up */}
            <div className={`space-y-3 transition-all duration-500 ${isLogin ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#d4a843]/10 border border-[#d4a843]/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-[#d4a843]" />
                  </div>
                  <span className="text-gray-300 text-sm">{text}</span>
                </div>
              ))}
            </div>

            {/* Stats — sign in */}
            <div className={`flex gap-8 transition-all duration-500 ${isLogin ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none absolute'}`}>
              {[['10K+', 'Recipes'], ['5K+', 'Chefs'], ['50K+', 'Meals Made']].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl font-black text-white">{num}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-full lg:w-[42%] flex items-center justify-center relative overflow-y-auto bg-[#0a0a0a]">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#d4a843]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[400px] px-6 py-12 sm:px-10 relative z-10 animate-fade-up">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-full bg-[#d4a843] flex items-center justify-center text-black">
              <ChefHat size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black text-white tracking-tight">Spoonify</span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {isLogin ? 'Welcome back 👋' : 'Create your account'}
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              {isLogin ? 'Sign in to access your recipes.' : 'Start your culinary journey today.'}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex p-1 rounded-xl mb-7 bg-white/[0.04] border border-white/8">
            {['Sign In', 'Sign Up'].map((tab, i) => {
              const active = i === 0 ? isLogin : !isLogin;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setIsLogin(i === 0);
                    setFormData({ username: '', email: '', password: '', fullName: '', confirmPassword: '' });
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-[#1a1a1a] text-[#d4a843] shadow-sm border border-white/8'
                      : 'text-gray-600 hover:text-gray-400'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Sign Up only fields */}
            <div className={`grid transition-all duration-300 ease-in-out ${isLogin ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
              <div className="overflow-hidden">
                <div className="grid grid-cols-2 gap-3 pb-4">
                  <div>
                    <label className={labelCls}>Username</label>
                    <input
                      type="text"
                      required={!isLogin}
                      placeholder="chef_awesome"
                      value={formData.username}
                      onChange={update('username')}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input
                      type="text"
                      required={!isLogin}
                      placeholder="Gordon Ramsay"
                      value={formData.fullName}
                      onChange={update('fullName')}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelCls}>Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={update('email')}
                className={inputCls}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelCls + ' mb-0'}>Password</label>
                {isLogin && (
                  <a href="#" className="text-[11px] font-semibold text-[#d4a843] hover:text-[#e0b855] transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={update('password')}
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#d4a843] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength bar */}
              {!isLogin && formData.password.length > 0 && strengthMeta[strength] && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthMeta[strength]!.color : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-[11px] font-semibold ${strengthMeta[strength]!.text}`}>
                    {strengthMeta[strength]!.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password — sign up only */}
            <div className={`grid transition-all duration-300 ease-in-out ${isLogin ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
              <div className="overflow-hidden">
                <div className="pb-1">
                  <label className={labelCls}>Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required={!isLogin}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={update('confirmPassword')}
                      className={`${inputCls} pr-11 ${
                        !isLogin && formData.confirmPassword
                          ? formData.password === formData.confirmPassword
                            ? '!border-green-500/50 focus:!border-green-500/60'
                            : '!border-red-500/50 focus:!border-red-500/60'
                          : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(p => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#d4a843] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {!isLogin && formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <Check size={14} className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                  {!isLogin && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-[11px] text-red-400 mt-1.5">Passwords do not match</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 bg-[#d4a843] hover:bg-[#e0b855] active:scale-[0.98] text-[#0a0a0a] shadow-[0_4px_24px_rgba(212,168,83,0.25)] hover:shadow-[0_4px_32px_rgba(212,168,83,0.45)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black/70 rounded-full animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider-gold my-6" />

          <p className="text-center text-[11px] text-gray-600">
            By continuing, you agree to our{' '}
            <a href="#" className="text-gray-500 hover:text-[#d4a843] transition-colors">Terms</a>
            {' '}&amp;{' '}
            <a href="#" className="text-gray-500 hover:text-[#d4a843] transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
