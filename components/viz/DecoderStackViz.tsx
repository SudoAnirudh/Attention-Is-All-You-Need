'use client';

import React, { useState, useMemo } from 'react';
import { transformerDecoderLayer, DecoderLayerResult } from '@/lib/math/decoderLayer';
import { useStepper } from '@/lib/hooks/useStepper';
import StepperControls from '@/components/ui/StepperControls';
import MatrixHeatmap from '@/components/ui/MatrixHeatmap';
import KatexBlock from '@/components/ui/KatexBlock';
import { Layers, ShieldAlert, Sparkles, GitFork } from 'lucide-react';

export const DecoderStackViz: React.FC = () => {
  const [numLayers, setNumLayers] = useState<number>(6);
  const [currentLayerIdx, setCurrentLayerIdx] = useState<number>(0);
  const [targetTokens] = useState<string[]>(['I', 'am', 'a', 'student']);
  const [encoderTokens] = useState<string[]>(['Je', 'suis', 'étudiant']);

  // Initial Decoder Input Representation Y (4 tokens x d_model=4)
  const initialDecoderInput = useMemo(
    () => [
      [0.4, 0.1, -0.5, 0.7],
      [-0.2, 0.8, 0.3, -0.1],
      [0.6, -0.4, 0.2, 0.9],
      [0.1, 0.5, -0.8, 0.2],
    ],
    []
  );

  // Encoder Output Representation (3 tokens x d_model=4)
  const encoderOutput = useMemo(
    () => [
      [0.6, -0.3, 0.9, 0.2],
      [0.2, 0.8, -0.5, 0.7],
      [-0.4, 0.5, 0.6, -0.3],
    ],
    []
  );

  // Compute forward pass through N stacked Decoder layers
  const decoderOutputs = useMemo(() => {
    const outputs: { layerIdx: number; input: number[][]; result: DecoderLayerResult }[] = [];
    let currentY = initialDecoderInput;

    for (let i = 0; i < numLayers; i++) {
      const res = transformerDecoderLayer(currentY, encoderOutput, 2);
      outputs.push({
        layerIdx: i,
        input: currentY,
        result: res,
      });
      currentY = res.finalOutput;
    }
    return outputs;
  }, [initialDecoderInput, encoderOutput, numLayers]);

  const activeLayer = decoderOutputs[currentLayerIdx] || decoderOutputs[0];

  const stepLabels = [
    '1. Input Target Representation (Y)',
    '2. Masked Causal Self-Attention Sub-layer',
    '3. Sub-layer 1 Add & LayerNorm',
    '4. Multi-Head Cross-Attention (Keys/Values from Encoder)',
    '5. Sub-layer 2 Add & LayerNorm',
    '6. Feed-Forward Network & Final LayerNorm Output',
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
          <div className="flex items-center gap-2 text-tokyo-cyan font-mono text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-tokyo-cyan" />
            Feature 6 — Section 3.1 &amp; Figure 1 (Right)
          </div>
          <span className="bg-tokyo-cyan/20 border border-tokyo-cyan/50 text-tokyo-cyan text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
            Decoder &amp; Causal Masking
          </span>
        </div>
        <h3 className="text-xl font-bold text-tokyo-text font-sans">Decoder Stack &amp; Masking Demo</h3>
        <p className="text-xs text-tokyo-subtext font-mono">
          Demonstrates auto-regressive decoding with Causal Self-Attention (blocking future tokens) and Cross-Attention connecting Encoder features.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Layer Selector */}
        <div className="lg:col-span-4 bg-tokyo-bg-dark border border-tokyo-border rounded-xl p-4 space-y-3">
          <div className="text-xs font-mono font-bold text-tokyo-subtext flex items-center justify-between">
            <span>Decoder Layers (<KatexBlock math="N" />):</span>
            <div className="flex gap-1">
              {[2, 4, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setNumLayers(n);
                    if (currentLayerIdx >= n) setCurrentLayerIdx(n - 1);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    numLayers === n ? 'bg-tokyo-cyan text-tokyo-bg' : 'bg-tokyo-surface text-tokyo-subtext'
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
                    ? 'bg-tokyo-surface border-tokyo-cyan text-tokyo-cyan font-bold shadow'
                    : 'bg-tokyo-bg border-tokyo-border text-tokyo-subtext hover:text-tokyo-text'
                }`}
              >
                <span>Decoder Layer {idx + 1}</span>
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
          <span className="font-bold text-tokyo-cyan">Active Decoder Layer {currentLayerIdx + 1}:</span>
          <span>{stepLabels[stepper.currentStep]}</span>
        </div>

        {stepper.currentStep === 0 && (
          <MatrixHeatmap
            matrix={activeLayer.input}
            rowLabels={targetTokens}
            colLabels={['d_0', 'd_1', 'd_2', 'd_3']}
            title={`Decoder Layer ${currentLayerIdx + 1} Target Input (Y)`}
            colorScheme="cyan"
            precision={2}
          />
        )}

        {stepper.currentStep === 1 && (
          <div className="space-y-3">
            <div className="text-xs font-mono text-tokyo-orange bg-tokyo-bg p-2 rounded border border-tokyo-border flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-tokyo-orange shrink-0" />
              Causal Mask applied: Token position i cannot attend to position j &gt; i.
            </div>
            <MatrixHeatmap
              matrix={activeLayer.result.maskedSelfAttn.heads[0].attentionWeights}
              rowLabels={targetTokens}
              colLabels={targetTokens}
              title={`Decoder Layer ${currentLayerIdx + 1} Causal Attention Heatmap (Head 1)`}
              colorScheme="orange"
              precision={3}
            />
          </div>
        )}

        {stepper.currentStep === 2 && (
          <MatrixHeatmap
            matrix={activeLayer.result.maskedAttnNorm}
            rowLabels={targetTokens}
            colLabels={['d_0', 'd_1', 'd_2', 'd_3']}
            title={`Decoder Layer ${currentLayerIdx + 1} Sub-layer 1 Add & LayerNorm`}
            colorScheme="purple"
            precision={2}
          />
        )}

        {stepper.currentStep === 3 && (
          <div className="space-y-3">
            <div className="text-xs font-mono text-tokyo-blue bg-tokyo-bg p-2 rounded border border-tokyo-border flex items-center gap-1.5">
              <GitFork className="w-4 h-4 text-tokyo-blue shrink-0" />
              Cross-Attention: Queries come from Decoder, Keys &amp; Values come from Encoder output.
            </div>
            <MatrixHeatmap
              matrix={activeLayer.result.crossAttn.heads[0].attentionWeights}
              rowLabels={targetTokens}
              colLabels={encoderTokens}
              title={`Cross-Attention Weights (Target vs Source Tokens)`}
              colorScheme="blue"
              precision={3}
            />
          </div>
        )}

        {stepper.currentStep === 4 && (
          <MatrixHeatmap
            matrix={activeLayer.result.crossAttnNorm}
            rowLabels={targetTokens}
            colLabels={['d_0', 'd_1', 'd_2', 'd_3']}
            title={`Decoder Layer ${currentLayerIdx + 1} Sub-layer 2 Cross-Attn Add & LayerNorm`}
            colorScheme="cyan"
            precision={2}
          />
        )}

        {stepper.currentStep === 5 && (
          <MatrixHeatmap
            matrix={activeLayer.result.finalOutput}
            rowLabels={targetTokens}
            colLabels={['d_0', 'd_1', 'd_2', 'd_3']}
            title={`Decoder Layer ${currentLayerIdx + 1} Final Layer Output Matrix`}
            colorScheme="green"
            precision={2}
          />
        )}
      </div>
    </div>
  );
};

export default DecoderStackViz;
