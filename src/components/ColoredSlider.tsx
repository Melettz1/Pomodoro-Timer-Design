import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from './ui/utils';

interface ColoredSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  min: number;
  step: number;
  color: 'purple' | 'cyan' | 'orange';
  className?: string;
}

const colorClasses = {
  purple: {
    range: 'bg-gradient-to-r from-purple-500 to-violet-600',
    thumb: 'border-purple-500 hover:shadow-purple-500/50 focus-visible:ring-purple-500/30',
    track: 'bg-slate-700'
  },
  cyan: {
    range: 'bg-gradient-to-r from-cyan-500 to-teal-600', 
    thumb: 'border-cyan-500 hover:shadow-cyan-500/50 focus-visible:ring-cyan-500/30',
    track: 'bg-slate-700'
  },
  orange: {
    range: 'bg-gradient-to-r from-orange-500 to-amber-600',
    thumb: 'border-orange-500 hover:shadow-orange-500/50 focus-visible:ring-orange-500/30', 
    track: 'bg-slate-700'
  }
};

export function ColoredSlider({ 
  color, 
  className, 
  value,
  onValueChange,
  max,
  min,
  step,
  ...props 
}: ColoredSliderProps) {
  const colors = colorClasses[color];

  const _values = React.useMemo(() => value, [value]);

  return (
    <SliderPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "relative grow overflow-hidden rounded-full h-2 w-full",
          colors.track
        )}
      >
        <SliderPrimitive.Range
          className={cn(
            "absolute h-full rounded-full",
            colors.range
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={cn(
            "border-2 bg-white block size-5 shrink-0 rounded-full shadow-lg transition-all hover:scale-110 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
            colors.thumb
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}