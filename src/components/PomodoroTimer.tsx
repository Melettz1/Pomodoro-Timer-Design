import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Zap, Waves, Cat } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

interface PomodoroState {
  minutes: number;
  seconds: number;
  isActive: boolean;
  mode: 'work' | 'shortBreak' | 'longBreak';
  completedSessions: number;
}

interface ModeDurations {
  work: number;
  shortBreak: number;
  longBreak: number;
}

const DEFAULT_DURATIONS: ModeDurations = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
};

// Função para carregar configurações do localStorage
const loadStoredDurations = (): ModeDurations => {
  if (typeof window === 'undefined') return DEFAULT_DURATIONS;
  
  try {
    const stored = localStorage.getItem('pomodoro-durations');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        work: parsed.work || DEFAULT_DURATIONS.work,
        shortBreak: parsed.shortBreak || DEFAULT_DURATIONS.shortBreak,
        longBreak: parsed.longBreak || DEFAULT_DURATIONS.longBreak,
      };
    }
  } catch (error) {
    console.warn('Erro ao carregar configurações:', error);
  }
  
  return DEFAULT_DURATIONS;
};

const MODE_COLORS = {
  work: 'from-purple-500 to-violet-600',
  shortBreak: 'from-cyan-500 to-teal-600',
  longBreak: 'from-orange-500 to-amber-600',
};

const MODE_SHADOW_COLORS = {
  work: 'shadow-purple-500/30',
  shortBreak: 'shadow-cyan-500/30',
  longBreak: 'shadow-orange-500/30',
};

const MODE_RING_COLORS = {
  work: 'ring-purple-500/20',
  shortBreak: 'ring-cyan-500/20',
  longBreak: 'ring-orange-500/20',
};

const MODE_LABELS = {
  work: 'Foco',
  shortBreak: 'Pausa Curta',
  longBreak: 'Pausa Longa',
};

const INITIAL_STATE: PomodoroState = {
  minutes: DEFAULT_DURATIONS.work,
  seconds: 0,
  isActive: false,
  mode: 'work',
  completedSessions: 0,
};

export function PomodoroTimer() {
  const [durations, setDurations] = useState<ModeDurations>(() => loadStoredDurations());
  const [state, setState] = useState<PomodoroState>(() => ({
    ...INITIAL_STATE,
    minutes: loadStoredDurations().work,
  }));

  const resetTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      minutes: durations[prev.mode],
      seconds: 0,
      isActive: false,
    }));
  }, [durations]);

  const toggleTimer = useCallback(() => {
    setState(prev => ({ ...prev, isActive: !prev.isActive }));
  }, []);

  const switchMode = useCallback((newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setState(prev => ({
      ...prev,
      mode: newMode,
      minutes: durations[newMode],
      seconds: 0,
      isActive: false,
    }));
  }, [durations]);

  const handleComplete = useCallback(() => {
    setState(prev => {
      const newCompletedSessions = prev.mode === 'work' ? prev.completedSessions + 1 : prev.completedSessions;
      let nextMode: 'work' | 'shortBreak' | 'longBreak' = 'work';
      
      if (prev.mode === 'work') {
        nextMode = newCompletedSessions % 4 === 0 ? 'longBreak' : 'shortBreak';
      } else {
        nextMode = 'work';
      }

      return {
        minutes: durations[nextMode],
        seconds: 0,
        isActive: false,
        mode: nextMode,
        completedSessions: newCompletedSessions,
      };
    });
  }, [durations]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isActive) {
      interval = setInterval(() => {
        setState(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            handleComplete();
            return prev;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state.isActive, handleComplete]);

  const handleDurationChange = useCallback((mode: 'work' | 'shortBreak' | 'longBreak', value: number) => {
    const newDurations = { ...durations, [mode]: value };
    setDurations(newDurations);
    
    // Salvar no localStorage
    try {
      localStorage.setItem('pomodoro-durations', JSON.stringify(newDurations));
    } catch (error) {
      console.warn('Erro ao salvar configurações:', error);
    }
    
    // Se o timer está parado e é do mesmo modo que está sendo alterado, atualizar imediatamente
    if (!state.isActive && state.mode === mode) {
      setState(prevState => ({
        ...prevState,
        minutes: value,
        seconds: 0
      }));
    }
  }, [durations, state.isActive, state.mode]);

  const totalSeconds = durations[state.mode] * 60;
  const currentSeconds = state.minutes * 60 + state.seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  const formatTime = (minutes: number, seconds: number): string => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-3/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative w-full max-w-lg">
        {/* Cat Icon */}
        <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-slate-800/30 backdrop-blur-sm border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-500 hover:scale-110 transition-all duration-300 z-50">
          <Cat size={20} />
        </div>
        
        <SettingsModal durations={durations} onDurationChange={handleDurationChange} />
        
        <Card className="w-full p-10 bg-slate-800/95 backdrop-blur-md shadow-2xl border border-slate-700/50 relative">
        
        <div className="text-center space-y-10">
          {/* Header */}
          <div className="space-y-6">
            <div className="relative">
              <h1 className="text-5xl font-extralight text-white tracking-wider mb-2">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
                  Pomo
                </span>
                <span className="text-slate-200">doro</span>
              </h1>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-orange-500/20 blur-2xl rounded-full opacity-40 animate-pulse"></div>
              <p className="text-slate-400 mt-2 tracking-wide">Produtividade. Foco. Sucesso.</p>
            </div>
            
            <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r ${MODE_COLORS[state.mode]} text-white shadow-xl ring-2 ${MODE_RING_COLORS[state.mode]} backdrop-blur-sm`}>
              {state.mode === 'work' ? (
                <Zap size={20} className="animate-pulse" />
              ) : state.mode === 'shortBreak' ? (
                <Coffee size={20} />
              ) : (
                <Waves size={20} />
              )}
              <span className="font-medium tracking-wide text-lg">{MODE_LABELS[state.mode]}</span>
            </div>
          </div>

          {/* Timer Circle */}
          <div className="relative inline-block">
            <svg className="w-96 h-96 transform -rotate-90 drop-shadow-2xl" viewBox="0 0 240 240">
              {/* Background glow */}
              <circle
                cx="120"
                cy="120"
                r="110"
                stroke="url(#glowGradient)"
                strokeWidth="20"
                fill="none"
                opacity="0.1"
                className="animate-pulse"
              />
              {/* Background circle */}
              <circle
                cx="120"
                cy="120"
                r="110"
                stroke="rgb(51 65 85)"
                strokeWidth="4"
                fill="none"
                opacity="0.3"
              />
              {/* Progress circle */}
              <circle
                cx="120"
                cy="120"
                r="110"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-in-out filter drop-shadow-2xl"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={
                    state.mode === 'work' ? '#a855f7' : 
                    state.mode === 'shortBreak' ? '#06b6d4' : '#f59e0b'
                  } />
                  <stop offset="100%" stopColor={
                    state.mode === 'work' ? '#7c3aed' : 
                    state.mode === 'shortBreak' ? '#0891b2' : '#d97706'
                  } />
                </linearGradient>
                <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={
                    state.mode === 'work' ? '#a855f7' : 
                    state.mode === 'shortBreak' ? '#06b6d4' : '#f59e0b'
                  } />
                  <stop offset="100%" stopColor={
                    state.mode === 'work' ? '#7c3aed' : 
                    state.mode === 'shortBreak' ? '#0891b2' : '#d97706'
                  } />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl font-light text-white mb-3 tracking-wider tabular-nums">
                  {formatTime(state.minutes, state.seconds)}
                </div>
                <div className="text-base text-slate-400 font-medium tracking-wide">
                  Sessão {state.completedSessions + 1}
                </div>
                <div className="mt-2">
                  <div className="inline-block w-2 h-2 bg-current rounded-full opacity-50 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-8">
            <Button
              onClick={toggleTimer}
              size="lg"
              className={`w-24 h-24 rounded-full bg-gradient-to-r ${MODE_COLORS[state.mode]} text-white hover:scale-110 hover:shadow-2xl ${MODE_SHADOW_COLORS[state.mode]} active:scale-95 transition-all duration-300 border-0 ring-4 ring-white/10 hover:ring-white/30 relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {state.isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </Button>
            
            <Button
              onClick={resetTimer}
              size="lg"
              variant="outline"
              className="w-24 h-24 rounded-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 hover:scale-110 hover:shadow-2xl hover:shadow-slate-500/20 active:scale-95 transition-all duration-300 bg-slate-800/50 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <RotateCcw size={32} />
            </Button>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => switchMode('work')}
              variant={state.mode === 'work' ? 'default' : 'outline'}
              size="sm"
              className={`px-8 py-4 rounded-2xl transition-all duration-300 font-medium text-base relative overflow-hidden group ${
                state.mode === 'work' 
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0 shadow-xl shadow-purple-500/40 scale-105 ring-2 ring-purple-400/30' 
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 hover:scale-105 bg-slate-800/40 backdrop-blur-sm'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Zap size={16} className="inline mr-2" />
              Foco
            </Button>
            
            <Button
              onClick={() => switchMode('shortBreak')}
              variant={state.mode === 'shortBreak' ? 'default' : 'outline'}
              size="sm"
              className={`px-8 py-4 rounded-2xl transition-all duration-300 font-medium text-base relative overflow-hidden group ${
                state.mode === 'shortBreak' 
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white border-0 shadow-xl shadow-cyan-500/40 scale-105 ring-2 ring-cyan-400/30' 
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 hover:scale-105 bg-slate-800/40 backdrop-blur-sm'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Coffee size={16} className="inline mr-2" />
              Pausa
            </Button>
            
            <Button
              onClick={() => switchMode('longBreak')}
              variant={state.mode === 'longBreak' ? 'default' : 'outline'}
              size="sm"
              className={`px-8 py-4 rounded-2xl transition-all duration-300 font-medium text-base relative overflow-hidden group ${
                state.mode === 'longBreak' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0 shadow-xl shadow-orange-500/40 scale-105 ring-2 ring-orange-400/30' 
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 hover:scale-105 bg-slate-800/40 backdrop-blur-sm'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Waves size={16} className="inline mr-2" />
              Pausa Longa
            </Button>
          </div>

          {/* Stats */}
          <div className="pt-8 border-t border-slate-700/50">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-light bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                  {state.completedSessions}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Sessões</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-light bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  {Math.floor((state.completedSessions * durations.work) / 60)}h
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Foco Total</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-light bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  {Math.floor(state.completedSessions / 4)}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Ciclos</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6">
            <div className="text-center">
              <p className="text-sm text-slate-500 tracking-wide">@Melettz1</p>
            </div>
          </div>
        </div>
        </Card>
      </div>
    </div>
  );
}