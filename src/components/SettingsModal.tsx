import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Settings, Clock, Coffee, Pause } from 'lucide-react';

interface SettingsModalProps {
  durations: {
    work: number;
    shortBreak: number;
    longBreak: number;
  };
  onDurationChange: (mode: 'work' | 'shortBreak' | 'longBreak', value: number) => void;
}

export function SettingsModal({ durations, onDurationChange }: SettingsModalProps) {
  const [localDurations, setLocalDurations] = React.useState(durations);

  // Sincronizar com props quando mudarem
  React.useEffect(() => {
    setLocalDurations(durations);
  }, [durations]);

  const handleSliderChange = React.useCallback((mode: 'work' | 'shortBreak' | 'longBreak', value: number[]) => {
    const newValue = value[0];
    setLocalDurations(prev => ({ ...prev, [mode]: newValue }));
    onDurationChange(mode, newValue);
  }, [onDurationChange]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="absolute top-6 right-6 w-12 h-12 rounded-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-300 bg-slate-800/30 backdrop-blur-sm z-50"
        >
          <Settings size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800/95 backdrop-blur-md border border-slate-700/50 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-center mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
              Configurações
            </span>
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-center text-sm">
            Personalize os tempos de cada sessão do seu timer Pomodoro
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Work Duration */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center">
                <Clock size={18} />
              </div>
              <Label className="text-lg font-medium">Sessão de Foco</Label>
            </div>
            <div className="px-2">
              <Slider
                value={[localDurations.work]}
                onValueChange={(value) => handleSliderChange('work', value)}
                max={60}
                min={5}
                step={5}
                className="w-full [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-purple-500 [&_[data-slot=slider-range]]:to-violet-600 [&_[data-slot=slider-thumb]]:border-purple-500 [&_[data-slot=slider-thumb]]:hover:shadow-purple-500/50"
              />
              <div className="flex justify-between text-sm text-slate-400 mt-2">
                <span>5 min</span>
                <span className="font-medium text-purple-400">{localDurations.work} min</span>
                <span>60 min</span>
              </div>
            </div>
          </div>

          {/* Short Break Duration */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 flex items-center justify-center">
                <Coffee size={18} />
              </div>
              <Label className="text-lg font-medium">Pausa Curta</Label>
            </div>
            <div className="px-2">
              <Slider
                value={[localDurations.shortBreak]}
                onValueChange={(value) => handleSliderChange('shortBreak', value)}
                max={15}
                min={3}
                step={1}
                className="w-full [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-cyan-500 [&_[data-slot=slider-range]]:to-teal-600 [&_[data-slot=slider-thumb]]:border-cyan-500 [&_[data-slot=slider-thumb]]:hover:shadow-cyan-500/50"
              />
              <div className="flex justify-between text-sm text-slate-400 mt-2">
                <span>3 min</span>
                <span className="font-medium text-cyan-400">{localDurations.shortBreak} min</span>
                <span>15 min</span>
              </div>
            </div>
          </div>

          {/* Long Break Duration */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center">
                <Pause size={18} />
              </div>
              <Label className="text-lg font-medium">Pausa Longa</Label>
            </div>
            <div className="px-2">
              <Slider
                value={[localDurations.longBreak]}
                onValueChange={(value) => handleSliderChange('longBreak', value)}
                max={30}
                min={10}
                step={5}
                className="w-full [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-orange-500 [&_[data-slot=slider-range]]:to-amber-600 [&_[data-slot=slider-thumb]]:border-orange-500 [&_[data-slot=slider-thumb]]:hover:shadow-orange-500/50"
              />
              <div className="flex justify-between text-sm text-slate-400 mt-2">
                <span>10 min</span>
                <span className="font-medium text-amber-400">{localDurations.longBreak} min</span>
                <span>30 min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p>Configurações aplicadas automaticamente</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}