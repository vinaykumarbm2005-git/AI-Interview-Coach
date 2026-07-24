import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface TimerProps {
  initialMinutes: number;
  onTimeUp?: () => void;
}

export const Timer: React.FC<TimerProps> = ({ initialMinutes, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const totalSeconds = initialMinutes * 60;
  const progressPercent = Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));

  const isWarning = secondsLeft < 300; // less than 5 minutes

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border shadow-sm transition-all ${
      isWarning 
        ? 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse' 
        : 'bg-white border-slate-200 text-slate-800'
    }`}>
      <div className={`p-1.5 rounded-lg ${isWarning ? 'bg-amber-200 text-amber-800' : 'bg-emerald-100 text-emerald-700'}`}>
        <Clock className="w-4 h-4" />
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time Remaining</span>
          <span className={`font-mono text-sm font-bold ${isWarning ? 'text-amber-800' : 'text-emerald-700'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 rounded-full ${isWarning ? 'bg-amber-500' : 'bg-emerald-600'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
