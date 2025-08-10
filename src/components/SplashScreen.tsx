import React, { useEffect, useState } from 'react';
import { ChefHat, Sparkles, Heart, Star } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showText, setShowText] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 500);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => {
      clearTimeout(textTimer);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-500 via-orange-500 to-red-500 flex items-center justify-center z-50 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-white/10 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/5 rounded-full animate-bounce delay-700"></div>
        
        {/* Floating Icons */}
        <Heart className="absolute top-32 left-1/4 h-8 w-8 text-red-300/30 animate-bounce delay-1000" />
        <Star className="absolute top-1/3 right-1/4 h-6 w-6 text-yellow-300/40 animate-ping delay-1500" />
        <ChefHat className="absolute bottom-1/3 left-1/3 h-10 w-10 text-white/20 animate-pulse delay-2000" />
      </div>
      
      <div className="text-center relative z-10">
        <div className="mb-8 relative">
          {/* Main Icon with Glow */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
            <img src="/spoonify.png" alt="Spoonify" className="h-32 w-32 mx-auto relative z-10 animate-bounce" />
            <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-2 -right-2 animate-ping" />
            <Sparkles className="h-4 w-4 text-yellow-200 absolute -bottom-1 -left-1 animate-ping delay-300" />
          </div>
          
          {/* Title with Animation */}
          <h1 className="text-5xl font-bold text-white mb-3 animate-pulse">
            <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Spoonify
            </span>
          </h1>
          
          {showText && (
            <div className="animate-fade-in">
              <p className="text-white/90 text-xl font-medium mb-2">Discover Amazing Recipes</p>
              <p className="text-white/70 text-sm">Your culinary journey starts here</p>
            </div>
          )}
        </div>
        

        
        <div className="mt-6">
          <div className="w-64 bg-white/20 rounded-full h-2 mx-auto mb-3">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white/60 text-sm animate-pulse">
            {progress < 30 ? 'Preparing ingredients...' :
             progress < 60 ? 'Mixing flavors...' :
             progress < 90 ? 'Adding final touches...' :
             'Almost ready!'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;