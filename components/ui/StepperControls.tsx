'use client';

import React from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';

interface StepperControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onGoToStep: (step: number) => void;
  stepLabels?: string[];
  className?: string;
}

export const StepperControls: React.FC<StepperControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  onGoToStep,
  stepLabels,
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onStepForward();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onStepBackward();
    } else if (e.key === ' ') {
      e.preventDefault();
      onTogglePlay();
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Stepper Animation Controls. Use Left/Right arrow keys to step, Space to play/pause."
      className={`bg-tokyo-surface border border-tokyo-border rounded-xl p-4 flex flex-col gap-3 focus:outline-none focus:ring-2 focus:ring-tokyo-purple ${className}`}
    >
      {/* Control Buttons Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            aria-label="Reset animation to step 1"
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-tokyo-bg text-tokyo-subtext hover:text-tokyo-text hover:bg-tokyo-surface-hover transition-colors"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onStepBackward}
            aria-label="Step backward to previous step"
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-tokyo-bg text-tokyo-subtext hover:text-tokyo-text hover:bg-tokyo-surface-hover transition-colors"
            title="Previous Step (Left Arrow)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg font-mono text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-tokyo-orange text-tokyo-bg hover:bg-tokyo-orange/90'
                : 'bg-tokyo-purple text-tokyo-bg hover:bg-tokyo-purple/90'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Play
              </>
            )}
          </button>

          <button
            onClick={onStepForward}
            aria-label="Step forward to next step"
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-tokyo-bg text-tokyo-subtext hover:text-tokyo-text hover:bg-tokyo-surface-hover transition-colors"
            title="Next Step (Right Arrow)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Step counter badge */}
        <div
          aria-live="polite"
          className="font-mono text-xs text-tokyo-cyan bg-tokyo-bg px-3 py-2 rounded-lg border border-tokyo-border font-bold"
        >
          Step {currentStep + 1} / {totalSteps}
        </div>
      </div>

      {/* Step Indicator Progress Dots */}
      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onGoToStep(idx)}
            aria-label={`Jump to Step ${idx + 1}: ${stepLabels && stepLabels[idx] ? stepLabels[idx] : ''}`}
            aria-current={currentStep === idx ? 'step' : undefined}
            className={`h-3 rounded-full transition-all flex-1 min-w-[20px] ${
              currentStep === idx
                ? 'bg-tokyo-cyan ring-2 ring-tokyo-cyan/50 shadow'
                : idx < currentStep
                ? 'bg-tokyo-purple/70'
                : 'bg-tokyo-border hover:bg-tokyo-muted'
            }`}
            title={stepLabels && stepLabels[idx] ? `Step ${idx + 1}: ${stepLabels[idx]}` : `Step ${idx + 1}`}
          />
        ))}
      </div>

      {/* Active Step Label Text */}
      {stepLabels && stepLabels[currentStep] && (
        <div className="text-xs font-mono text-tokyo-subtext pt-1 flex items-center gap-2">
          <span className="text-tokyo-purple font-bold">Current:</span>
          <span>{stepLabels[currentStep]}</span>
        </div>
      )}
    </div>
  );
};

export default StepperControls;
