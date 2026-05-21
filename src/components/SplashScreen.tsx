import React, { useEffect, useState, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [exit, setExit] = useState(false);
  const requestRef = useRef<number>();

  useEffect(() => {
    // 2.5 seconds ki smooth loading animation
    const duration = 2500; 
    const startTime = performance.now();

    const animateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      
      // Easing function taaki liquid natural speed se bhare
      const easeOut = 1 - Math.pow(1 - t, 3);
      setProgress(easeOut * 100);

      if (t < 1) {
        requestRef.current = requestAnimationFrame(animateProgress);
      } else {
        // Exit sequence
        setTimeout(() => {
          setExit(true);
          setTimeout(onComplete, 800);
        }, 400);
      }
    };

    requestRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [onComplete]);

  // Liquid ki height calculate karne ke liye (Pot base Y=95 to top Y=40)
  const waveY = 95 - (progress / 100) * 55;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: '#080808',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: exit ? 0 : 1,
      transform: exit ? 'scale(1.05)' : 'scale(1)',
      transition: 'all 0.8s cubic-bezier(0.85, 0, 0.15, 1)',
    }}>
      {/* ── Internal CSS Animations ── */}
      <style>{`
        @keyframes wave-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100px); }
        }
        @keyframes lid-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-1.5deg); }
          75% { transform: translateY(-1.5px) rotate(2deg); }
        }
        @keyframes steam-rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          40% { opacity: 0.5; }
          100% { transform: translateY(-25px) scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* ── Animated Cooking Pot SVG ── */}
      <div style={{ position: 'relative', width: '180px', height: '180px' }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            {/* Mask to keep liquid inside the pot */}
            <clipPath id="potMask">
              <path d="M 15 40 L 15 75 C 15 90, 25 95, 50 95 C 75 95, 85 90, 85 75 L 85 40 Z" />
            </clipPath>
            
            {/* Premium Gold Gradients for Liquid */}
            <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="liquidDarkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* ── Bhaap (Steam) - Shows up as it heats up ── */}
          {progress > 30 && (
            <g stroke="#ffffff" fill="none" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
              <path d="M 35 30 Q 30 20 35 10 T 35 -5" style={{ animation: 'steam-rise 1.5s infinite linear' }} />
              <path d="M 50 28 Q 55 18 50 8 T 50 -8" style={{ animation: 'steam-rise 2s infinite linear 0.4s' }} />
              <path d="M 65 30 Q 60 20 65 10 T 65 -5" style={{ animation: 'steam-rise 1.8s infinite linear 0.8s' }} />
            </g>
          )}

          {/* ── Liquid Fill Animation ── */}
          <g clipPath="url(#potMask)">
            {/* Deep base liquid */}
            <rect x="0" y={waveY + 5} width="100" height="100" fill="url(#liquidGrad)" />
            
            <g style={{ transform: `translateY(${waveY}px)`, transition: 'transform 0.1s linear' }}>
              {/* Back Wave (Darker, slightly offset) */}
              <g style={{ animation: 'wave-slide 3s linear infinite' }}>
                <path 
                  d="M -100 5 Q -75 10 -50 5 T 0 5 T 50 5 T 100 5 T 150 5 T 200 5 L 200 100 L -100 100 Z" 
                  fill="url(#liquidDarkGrad)" opacity="0.8" 
                />
              </g>
              {/* Front Wave (Lighter, moving opposite direction) */}
              <g style={{ animation: 'wave-slide 2s linear infinite reverse' }}>
                <path 
                  d="M -100 5 Q -75 0 -50 5 T 0 5 T 50 5 T 100 5 T 150 5 T 200 5 L 200 100 L -100 100 Z" 
                  fill="url(#liquidGrad)" 
                />
              </g>
            </g>
          </g>

          {/* ── Pot Outline (Grey Metallic) ── */}
          <path d="M 15 40 L 15 75 C 15 90, 25 95, 50 95 C 75 95, 85 90, 85 75 L 85 40 Z" fill="none" stroke="#4a4a4a" strokeWidth="2.5" />
          <path d="M 15 55 C 2 55, 2 70, 15 70" fill="none" stroke="#4a4a4a" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M 85 55 C 98 55, 98 70, 85 70" fill="none" stroke="#4a4a4a" strokeWidth="2.5" strokeLinecap="round"/>
          
          {/* ── Animated Lid (Boiling Effect > 50%) ── */}
          <g style={{ 
            animation: progress > 50 && progress < 99 ? 'lid-bounce 0.3s infinite ease-in-out' : 'none', 
            transformOrigin: '50px 32px' 
          }}>
            {/* Dhakkan / Lid */}
            <path d="M 8 32 C 8 15, 92 15, 92 32 Z" fill="#0a0a0a" stroke="#d4a843" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Lid Handle */}
            <path d="M 42 18 L 42 10 C 42 5, 58 5, 58 10 L 58 18" fill="none" stroke="#d4a843" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* ── Minimalist Typography ── */}
      <h1 style={{
        marginTop: '10px',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 800,
        fontSize: '28px',
        color: '#ffffff',
        letterSpacing: '0.15em',
      }}>
        SPOONIFY
      </h1>
      <p style={{
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#d4a843',
        marginTop: '8px',
        fontWeight: '600',
        letterSpacing: '0.05em'
      }}>
        {Math.floor(progress)}%
      </p>

    </div>
  );
};

export default SplashScreen;