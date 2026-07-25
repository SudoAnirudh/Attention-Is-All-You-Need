'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UseStepperOptions {
  totalSteps: number;
  initialStep?: number;
  autoplayIntervalMs?: number;
  loop?: boolean;
}

export function useStepper({
  totalSteps,
  initialStep = 0,
  autoplayIntervalMs = 2000,
  loop = true,
}: UseStepperOptions) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(autoplayIntervalMs);

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < totalSteps - 1) return prev + 1;
      return loop ? 0 : prev;
    });
  }, [totalSteps, loop]);

  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev > 0) return prev - 1;
      return loop ? totalSteps - 1 : 0;
    });
  }, [totalSteps, loop]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      stepForward();
    }, speedMs);
    return () => clearInterval(interval);
  }, [isPlaying, speedMs, stepForward]);

  return {
    currentStep,
    totalSteps,
    isPlaying,
    speedMs,
    setSpeedMs,
    stepForward,
    stepBackward,
    goToStep,
    togglePlay,
    reset,
  };
}
