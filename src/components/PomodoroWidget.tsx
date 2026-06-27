import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, Award } from 'lucide-react';
import { triggerHaptic, triggerSound } from '../lib/storage';

interface PomodoroWidgetProps {
  initialFocusMinutes: number;
  initialBreakMinutes: number;
  cyclesCompletedToday: number;
  onCycleComplete: () => void;
}

export const PomodoroWidget: React.FC<PomodoroWidgetProps> = ({
  initialFocusMinutes,
  initialBreakMinutes,
  cyclesCompletedToday,
  onCycleComplete,
}) => {
  const [isFocus, setIsFocus] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(initialFocusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  const totalSeconds = isFocus ? initialFocusMinutes * 60 : initialBreakMinutes * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            // Finished cycle
            triggerSound('celebrate', true);
            triggerHaptic(true);
            if (isFocus) {
              onCycleComplete();
              setIsFocus(false);
              return initialBreakMinutes * 60;
            } else {
              setIsFocus(true);
              return initialFocusMinutes * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isFocus, initialFocusMinutes, initialBreakMinutes, onCycleComplete]);

  const togglePlay = () => {
    triggerHaptic(true);
    triggerSound('check', true);
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    triggerHaptic(true);
    setIsRunning(false);
    setIsFocus(true);
    setSecondsLeft(initialFocusMinutes * 60);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex items-center justify-between gap-4 shadow-lg">
      <div className="flex items-center gap-4 min-w-0">
        {/* Circular Progress Simulator / Icon */}
        <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-[#222222] border-2 border-[#2A2A2A] shrink-0">
          <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 36 36">
            <path
              className="text-[#2A2A2A]"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={isFocus ? 'text-[#C8FF00]' : 'text-[#4DA6FF]'}
              strokeDasharray={`${progressPercent}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <Timer className={`w-6 h-6 ${isFocus ? 'text-[#C8FF00]' : 'text-[#4DA6FF]'} animate-pulse`} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-mono uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${isFocus ? 'bg-[#C8FF00]/20 text-[#C8FF00]' : 'bg-[#4DA6FF]/20 text-[#4DA6FF]'}`}>
              {isFocus ? 'Foco Blindado' : 'Pausa Merecida'}
            </span>
            <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
              <Award className="w-3 h-3 text-[#FFB84D]" /> {cyclesCompletedToday} ciclos
            </span>
          </div>
          <p className="text-2xl font-mono font-black tracking-tight text-white mt-0.5">
            {timeFormatted}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={togglePlay}
          className={`p-3 rounded-xl font-bold active:scale-95 transition-all ${isRunning ? 'bg-[#FF4D4D] text-white' : 'bg-[#C8FF00] text-[#0D0D0D]'}`}
          aria-label={isRunning ? 'Pausar' : 'Iniciar'}
        >
          {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>
        <button
          onClick={handleReset}
          className="p-3 bg-[#222222] hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl active:scale-95 transition-all"
          title="Reiniciar timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
