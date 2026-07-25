'use client';

import React, { useState, useMemo } from 'react';
import { transformerEncoderLayer, EncoderLayerResult } from '@/lib/math/encoderLayer';
import { useStepper } from '@/lib/hooks/useStepper';
import StepperControls from '@/components/ui/StepperControls';
import MatrixHeatmap from '@/components/ui/MatrixHeatmap';
import KatexBlock from '@/components/ui/KatexBlock';
import { Layers, ArrowDown, Sparkles } from 'lucide-react';

export const EncoderStackViz: React.FC = () => {
  const [numLayers, setNumLayers] = useState<number>(6);
  const [currentLayerIdx, setCurrentLayerIdx] = useState<number>(0);
  const [tokens] = useState<string[]>(['Je', 'suis', 'étudiant']);

  // Initial Input Matrix (3 tokens x d_model=4)
  const initialInput = useMemo(
    () => [
      [0.5, -0.2, 0.8, 0.1],
      [0.1, 0.9, -0.4, 0.6],
      [-0.3, 0.4, 0.7, -0.5],
    ],
    []
  );

  // Compute forward pass through N stacked Encoder layers
  const layerOutputs = useMemo(() => {
    const outputs: { layerIdx: number; input: number[][]; result: EncoderLayerResult }[] = [];
    let currentX = initialInput;

    for (let i = 0; i < numLayers; i++) {
      const res = transformerEncoderLayer(currentX, 2);
      outputs.push({
        layerIdx: i,
        input: currentX,
        result: res,
      });
      currentX = res.finalOutput;
    }
    return outputs;
  }, [initialInput, numLayers]);

  const activeLayer = layerOutputs[currentLayerIdx] || layerOutputs[0];

  const stepLabels = [
    '1. Input Representation (Layer Input)',
    '2. Multi-Head Self-Attention Sub-layer',
    '3. Residual Add & Layer Normalization',
    '4. Position-wise Feed-Forward Network (FFN)',
    '5. Final Residual Add & LayerNorm (Layer Output)',
  ];

  const stepper = useStepper({
    totalSteps: stepLabels.length,
    initialStep: 0,
    autoplayIntervalMs: 2500,
  });

  return (
    <div className="space-y-6 bg-tokyo-surface border border-tokyo-border rounded-xl p-6 shadow-xl">
      {/* Header */}
      <div className="border-b border-tokyo-border pb-4 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-tokyo-purple font-mono text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-tokyo-purple" />
            Feature 5 — Section 3.1 &amp; Figure 1 (Left)
          </div>
          <span className="bg-tokyo-purple/20 border border-tokyo-purple/50 text-tokyo-purple text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
            Architecture Animation
          </span>
        </div>
        <h3 className="text-xl font-bold text-tokyo-text font-sans">Encoder Stack Animation (N Layers)</h3>
        <p className="text-xs text-tokyo-subtext font-mono">
          Data flow through <KatexBlock math="N=6" /> identical stacked encoder layers, each applying Self-Attention, Residual Connections, LayerNorm, and FFN.
        </p>
      </div>

      {/* Stack Controls: Layer Selector & Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Layer Selector */}
        <div className="lg:col-span-4 bg-tokyo-bg-dark border border-tokyo-border rounded-xl p-4 space-y-3">
          <div className="text-xs font-mono font-bold text-tokyo-subtext flex items-center justify-between">
            <span>Stack Depth (<KatexBlock math="N" />):</span>
            <div className="flex gap-1">
              {[2, 4, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setNumLayers(n);
                    if (currentLayerIdx >= n) setCurrentLayerIdx(n - 1);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    numLayers === n ? 'bg-tokyo-purple text-tokyo-bg' : 'bg-tokyo-surface text-tokyo-subtext'
                  }`}
                >
                  N={n}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {Array.from({ length: numLayers }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentLayerIdx(idx)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between ${
                  currentLayerIdx === idx
                    ? 'bg-tokyo-surface border-tokyo-purple text-tokyo-purple font-bold shadow'
                    : 'bg-tokyo-bg border-tokyo-border text-tokyo-subtext hover:text-tokyo-text'
                }`}
              >
                <span>Encoder Layer {idx + 1}</span>
                {currentLayerIdx === idx && <Sparkles className="w-3.5 h-3.5 text-tokyo-yellow" />}
              </button>
            ))}
          </div>
        </div>

        {/* Stepper Controls */}
        <div className="lg:col-span-8">
          <StepperControls
            currentStep={stepper.currentStep}
            totalSteps={stepper.totalSteps}
            isPlaying={stepper.isPlaying}
            onTogglePlay={stepper.togglePlay}
            onStepForward={stepper.stepForward}
            onStepBackward={stepper.stepBackward}
            onReset={stepper.reset}
            onGoToStep={stepper.goToStep}
            stepLabels={stepLabels}
          />
        </div>
      </div>

      {/* Step Visualization Displays */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-mono text-tokyo-cyan bg-tokyo-bg p-2.5 rounded-lg border border-tokyo-border flex items-center gap-2">
          <span className="font-bold text-tokyo-purple">Active Layer {currentLayerIdx + 1} of {numLayers}:</span>
          <span>{stepLabels[stepper.currentStep]}</span>
        </div>

        {stepper.currentStep === 0 && (
          <MatrixHeatmap
            matrix={activeLayer.input}
            rowLabels={tokens}
            colLabels={['d_0', 'd_1', 'd_2', 'd_3']}
            title={`Layer ${currentLayerIdx + 1} Input Representation (X)`}
            colorScheme="blue"
            precision={2}
          />
        )}

        {stepper.currentStep === 1 && (
          <MatrixHeatmap
            matrix={activeLayer.result.selfAttention.output}
            rowLabels={tokens}
            colLabels={['d_0', 'd_1', 'd_2', 'd_3']}
            title={`Layer ${currentLayerIdx + 1} Self-Attention Output`}
            subtitle="Multi-Head Self-Attention applied to X"
            colorScheme="purple"
            precision={2}
          />
        )}

        {stepper.currentStep === 2 && (
          <MatrixHeatmap
            matrix={activeLayer.result.attnNormOutput}
            rowLabels={tokens}
            colLabels={['d_0', 'd_1', 'd_2', 'd_3']}
            title={`Layer ${currentLayerIdx + 1} Sub-layer 1 Add & LayerNorm Output`}
            subtitle="LayerNorm(X + SelfAttention(X))"
            colorScheme="cyan"
            precision={2}
          />
        )}

        {stepper.currentStep === 3 && (
          <MatrixHeatmap
            matrix={activeLayer.result.ffnOutput}
            rowLabels={tokens}
            colLabels={['d_0', 'd_1', 'd_2', 'd_3']}
            title={`Layer ${currentLayerIdx + 1} Feed-Forward Network Output`}
            subtitle="FFN(X) = max(0, X*W1 + b1)*W2 + b2"
            colorScheme="orange"
            precision={2}
          />
        )}

        {stepper.currentStep === 4 && (
          <div className="space-y-3">
            <MatrixHeatmap
              matrix={activeLayer.result.finalOutput}
              rowLabels={tokens}
              colLabels={['d_0', 'd_1', 'd_2', 'd_3']}
              title={`Layer ${currentLayerIdx + 1} Final Output (LayerNorm(AttnNorm + FFN))` }
              colorScheme="green"
              precision={2}
            />
            {currentLayerIdx < numLayers - 1 && (
              <div className="text-center text-xs font-mono text-tokyo-green flex items-center justify-center gap-1">
                <ArrowDown className="w-4 h-4 animate-bounce" />
                Passes as input to Encoder Layer {currentLayerIdx + 2}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EncoderStackViz;
