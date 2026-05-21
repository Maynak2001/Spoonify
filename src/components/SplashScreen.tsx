import React, { useEffect, useState, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [exit, setExit] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // phase 0 → ring draws
  // phase 1 → logo icon fades in
  // phase 2 → wordmark slides up
  // phase 3 → tagline + bar appear
  // phase 4 → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => setPhase(3), 1900);

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const speed = prev < 60 ? 2.2 : prev < 85 ? 1.1 : 0.5;
        const next = Math.min(prev + speed, 100);
        if (next >= 100) {
          clearInterval(intervalRef.current!);
          setTimeout(() => {
            setExit(true);
            setTimeout(onComplete, 800);
          }, 500);
        }
        return next;
      });
    }, 55);

    return () => {
      [t1, t2, t3].forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const msg =
    progress < 30 ? 'Preparing ingredients' :
    progress < 60 ? 'Mixing flavors' :
    progress < 88 ? 'Adding final touches' :
    'Almost ready';

  // SVG ring circumference
  const R = 72;
  const CIRC = 2 * Math.PI * R;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: '#080808',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        opacity: exit ? 0 : 1,
        transition: exit ? 'opacity 0.8s cubic-bezier(0.4,0,0.2,1)' : undefined,
      }}
    >

      {/* ── Noise texture overlay ── */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
          <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f5d78e" />
            <stop offset="45%"  stopColor="#d4a843" />
            <stop offset="100%" stopColor="#8a6520" />
          </radialGradient>
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#d4a843" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#d4a843" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#f5d78e" />
            <stop offset="50%"  stopColor="#d4a843" />
            <stop offset="100%" stopColor="#a37d26" />
          </linearGradient>
          <linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#a37d26" />
            <stop offset="50%"  stopColor="#d4a843" />
            <stop offset="100%" stopColor="#f5d78e" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── Background deep glow ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,168,83,0.06) 0%, transparent 70%)',
      }} />

      {/* ── Subtle grid ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      {/* ── Floating corner particles ── */}
      {[...Array(18)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${10 + (i * 37.3) % 80}%`,
          top: `${5 + (i * 53.7) % 90}%`,
          width: `${1.5 + (i % 3) * 1}px`,
          height: `${1.5 + (i % 3) * 1}px`,
          borderRadius: '50%',
          background: '#d4a843',
          opacity: 0.06 + (i % 5) * 0.03,
          animation: `pFloat ${6 + (i % 4)}s ease-in-out ${(i % 5) * 0.7}s infinite alternate`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* ── Main content ── */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 420, padding: '0 24px' }}>

        {/* ── SVG Logo Assembly ── */}
        <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 32 }}>

          {/* Outer glow blob */}
          <svg width="200" height="200" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="100" cy="100" r="90" fill="url(#glowGrad)" />
          </svg>

          {/* Outer decorative ring — draw animation */}
          <svg width="200" height="200" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
            <circle
              cx="100" cy="100" r={R}
              fill="none"
              stroke="rgba(212,168,83,0.12)"
              strokeWidth="1"
            />
            <circle
              cx="100" cy="100" r={R}
              fill="none"
              stroke="url(#goldGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={`${CIRC * 0.72} ${CIRC * 0.28}`}
              strokeDashoffset={CIRC}
              style={{
                transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)',
                strokeDashoffset: phase >= 0 ? 0 : CIRC,
              }}
            />
          </svg>

          {/* Tick marks around ring */}
          <svg width="200" height="200" style={{ position: 'absolute', inset: 0 }}>
            {[...Array(24)].map((_, i) => {
              const angle = (i / 24) * 360;
              const rad = (angle * Math.PI) / 180;
              const r1 = 68, r2 = i % 6 === 0 ? 62 : 65;
              return (
                <line
                  key={i}
                  x1={100 + r1 * Math.cos(rad)} y1={100 + r1 * Math.sin(rad)}
                  x2={100 + r2 * Math.cos(rad)} y2={100 + r2 * Math.sin(rad)}
                  stroke="rgba(212,168,83,0.2)"
                  strokeWidth={i % 6 === 0 ? 1.5 : 0.8}
                  style={{
                    opacity: phase >= 0 ? 1 : 0,
                    transition: `opacity 0.4s ease ${0.05 * i}s`,
                  }}
                />
              );
            })}
          </svg>

          {/* Inner ring — counter-rotate draw */}
          <svg width="200" height="200" style={{ position: 'absolute', inset: 0, transform: 'rotate(90deg)' }}>
            <circle
              cx="100" cy="100" r="52"
              fill="none"
              stroke="rgba(212,168,83,0.08)"
              strokeWidth="1"
            />
            <circle
              cx="100" cy="100" r="52"
              fill="none"
              stroke="rgba(212,168,83,0.25)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52 * 0.4} ${2 * Math.PI * 52 * 0.6}`}
              style={{
                strokeDashoffset: phase >= 1 ? 0 : 2 * Math.PI * 52,
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s',
              }}
            />
          </svg>

          {/* Orbiting dot */}
          <svg width="200" height="200" style={{
            position: 'absolute', inset: 0,
            animation: phase >= 1 ? 'orbitRing 4s linear infinite' : undefined,
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}>
            <circle cx="100" cy="28" r="3.5" fill="#d4a843"
              style={{ filter: 'drop-shadow(0 0 6px rgba(212,168,83,0.9))' }} />
          </svg>

          {/* Second orbiting dot — opposite, slower */}
          <svg width="200" height="200" style={{
            position: 'absolute', inset: 0,
            animation: phase >= 1 ? 'orbitRingRev 7s linear infinite' : undefined,
            opacity: phase >= 1 ? 0.5 : 0,
            transition: 'opacity 0.5s ease 0.3s',
          }}>
            <circle cx="100" cy="28" r="2" fill="#f5d78e"
              style={{ filter: 'drop-shadow(0 0 4px rgba(245,215,142,0.8))' }} />
          </svg>

          {/* Center icon plate */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: `translate(-50%, -50%) scale(${phase >= 1 ? 1 : 0.5})`,
            opacity: phase >= 1 ? 1 : 0,
            transition: 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease',
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(212,168,83,0.15), rgba(212,168,83,0.04))',
            border: '1px solid rgba(212,168,83,0.3)',
            boxShadow: '0 0 32px rgba(212,168,83,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* SVG Chef Hat — drawn inline */}
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              {/* Hat dome */}
              <path
                d="M10 28 C10 28 8 22 8 18 C8 12 13 8 18 8 C20 8 22 9 22 9 C22 9 24 8 26 8 C31 8 36 12 36 18 C36 22 34 28 34 28 Z"
                stroke="#d4a843"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(212,168,83,0.08)"
                style={{
                  strokeDasharray: 120,
                  strokeDashoffset: phase >= 1 ? 0 : 120,
                  transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1) 0.1s',
                }}
              />
              {/* Brim */}
              <rect
                x="8" y="28" width="28" height="6" rx="2"
                stroke="#d4a843"
                strokeWidth="1.8"
                fill="rgba(212,168,83,0.1)"
                style={{
                  strokeDasharray: 80,
                  strokeDashoffset: phase >= 1 ? 0 : 80,
                  transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1) 0.4s',
                }}
              />
              {/* Brim bottom line */}
              <line
                x1="12" y1="34" x2="32" y2="34"
                stroke="rgba(212,168,83,0.4)"
                strokeWidth="1.2"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 24,
                  strokeDashoffset: phase >= 1 ? 0 : 24,
                  transition: 'stroke-dashoffset 0.5s ease 0.7s',
                }}
              />
              {/* Center crease */}
              <line
                x1="22" y1="10" x2="22" y2="28"
                stroke="rgba(212,168,83,0.2)"
                strokeWidth="1"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 18,
                  strokeDashoffset: phase >= 1 ? 0 : 18,
                  transition: 'stroke-dashoffset 0.4s ease 0.8s',
                }}
              />
            </svg>
          </div>
        </div>

        {/* ── Brand wordmark ── */}
        <div style={{
          overflow: 'hidden',
          marginBottom: 10,
        }}>
          <div style={{
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(100%)',
            opacity: phase >= 2 ? 1 : 0,
            transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease',
          }}>
            <svg width="260" height="72" viewBox="0 0 260 72">
              <defs>
                <linearGradient id="wGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#f5d78e" />
                  <stop offset="50%"  stopColor="#d4a843" />
                  <stop offset="100%" stopColor="#a37d26" />
                </linearGradient>
              </defs>
              <text
                x="130" y="56"
                textAnchor="middle"
                fontFamily="'Inter', system-ui, sans-serif"
                fontWeight="900"
                fontSize="58"
                letterSpacing="-2"
                fill="url(#wGrad)"
              >
                Spoonify
              </text>
            </svg>
          </div>
        </div>

        {/* ── Tagline ── */}
        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          marginBottom: 36,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          {/* Left line */}
          <svg width="40" height="1" style={{ overflow: 'visible' }}>
            <line x1="0" y1="0.5" x2="40" y2="0.5"
              stroke="rgba(212,168,83,0.3)" strokeWidth="1"
              style={{
                strokeDasharray: 40,
                strokeDashoffset: phase >= 3 ? 0 : 40,
                transition: 'stroke-dashoffset 0.6s ease 0.1s',
              }}
            />
          </svg>

          <p style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(212,168,83,0.45)',
            whiteSpace: 'nowrap',
          }}>
            Your Culinary Journey
          </p>

          {/* Right line */}
          <svg width="40" height="1" style={{ overflow: 'visible' }}>
            <line x1="0" y1="0.5" x2="40" y2="0.5"
              stroke="rgba(212,168,83,0.3)" strokeWidth="1"
              style={{
                strokeDasharray: 40,
                strokeDashoffset: phase >= 3 ? 0 : 40,
                transition: 'stroke-dashoffset 0.6s ease 0.1s',
              }}
            />
          </svg>
        </div>

        {/* ── Progress ── */}
        <div style={{
          width: '100%',
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s',
        }}>
          {/* Track */}
          <div style={{
            width: '100%', height: 2, borderRadius: 999,
            background: 'rgba(255,255,255,0.05)',
            marginBottom: 12, overflow: 'hidden', position: 'relative',
          }}>
            {/* Fill */}
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(to right, #a37d26, #d4a843, #f5d78e)',
              borderRadius: 999,
              boxShadow: '0 0 12px rgba(212,168,83,0.7)',
              transition: 'width 0.08s linear',
            }} />
            {/* Shimmer */}
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%', width: '100%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimBar 1.8s linear infinite',
            }} />
          </div>

          {/* Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Pulsing dot */}
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#d4a843',
                boxShadow: '0 0 6px rgba(212,168,83,0.8)',
                animation: 'pulse 1.2s ease-in-out infinite',
              }} />
              <p style={{
                fontSize: 11, fontWeight: 500,
                color: 'rgba(212,168,83,0.4)',
                letterSpacing: '0.04em',
              }}>
                {msg}
              </p>
            </div>
            <p style={{
              fontSize: 11, fontFamily: 'monospace',
              color: 'rgba(212,168,83,0.3)',
              letterSpacing: '0.05em',
            }}>
              {Math.floor(progress).toString().padStart(3, '0')}
            </p>
          </div>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes orbitRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbitRingRev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes pFloat {
          0%   { transform: translateY(0) translateX(0); }
          100% { transform: translateY(-24px) translateX(8px); }
        }
        @keyframes shimBar {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
