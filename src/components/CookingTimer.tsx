import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, X } from 'lucide-react';

interface CookingTimerProps {
  defaultMinutes?: number;
}

const CookingTimer: React.FC<CookingTimerProps> = ({ defaultMinutes = 5 }) => {
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(defaultMinutes * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const displayMinutes = Math.floor(totalSeconds / 60);
  const displaySeconds = totalSeconds % 60;
  const initialTotal = (minutes * 60) + seconds;
  const progress = initialTotal > 0 ? ((initialTotal - totalSeconds) / initialTotal) * 100 : 0;

  const start = () => {
    if (totalSeconds === 0) reset();
    setFinished(false);
    setRunning(true);
  };

  const pause = () => setRunning(false);

  const reset = () => {
    setRunning(false);
    setFinished(false);
    const total = minutes * 60 + seconds;
    setTotalSeconds(total);
  };

  const setPreset = (mins: number) => {
    setRunning(false);
    setFinished(false);
    setMinutes(mins);
    setSeconds(0);
    setTotalSeconds(mins * 60);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors font-medium text-sm"
      >
        <Timer className="h-4 w-4" />
        <span>Timer</span>
        {running && (
          <span className="ml-1 text-xs font-bold animate-pulse">
            {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Timer className="h-4 w-4 text-orange-500" />
              <span>Cooking Timer</span>
            </h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Circular progress */}
          <div className="flex justify-center mb-4">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="44"
                  fill="none"
                  stroke={finished ? '#ef4444' : '#f2750a'}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${finished ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
                  {finished ? 'Done!' : `${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`}
                </span>
              </div>
            </div>
          </div>

          {/* Set time inputs */}
          {!running && (
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="text-center">
                <label className="text-xs text-gray-500 dark:text-gray-400">Min</label>
                <input
                  type="number"
                  value={minutes}
                  min={0}
                  max={99}
                  onChange={e => {
                    const m = Math.max(0, parseInt(e.target.value) || 0);
                    setMinutes(m);
                    setTotalSeconds(m * 60 + seconds);
                    setFinished(false);
                  }}
                  className="w-16 text-center border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <span className="text-gray-400 mt-4">:</span>
              <div className="text-center">
                <label className="text-xs text-gray-500 dark:text-gray-400">Sec</label>
                <input
                  type="number"
                  value={seconds}
                  min={0}
                  max={59}
                  onChange={e => {
                    const s = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                    setSeconds(s);
                    setTotalSeconds(minutes * 60 + s);
                    setFinished(false);
                  }}
                  className="w-16 text-center border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Presets */}
          <div className="flex space-x-1 mb-4">
            {[1, 5, 10, 15, 30].map(m => (
              <button
                key={m}
                onClick={() => setPreset(m)}
                className="flex-1 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-gray-700 dark:text-gray-300 hover:text-orange-600 transition-colors"
              >
                {m}m
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex space-x-2">
            {!running ? (
              <button
                onClick={start}
                className="flex-1 flex items-center justify-center space-x-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Start</span>
              </button>
            ) : (
              <button
                onClick={pause}
                className="flex-1 flex items-center justify-center space-x-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </button>
            )}
            <button
              onClick={reset}
              className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookingTimer;
