'use client';

import React, { useState, useMemo } from 'react';
import { scaledDotProductAttention, createCausalMask } from '@/lib/math/attention';
import { useStepper } from '@/lib/hooks/useStepper';
import StepperControls from '@/components/ui/StepperControls';
import MatrixHeatmap from '@/components/ui/MatrixHeatmap';
import KatexBlock from '@/components/ui/KatexBlock';
import { Cpu, ShieldAlert, Sparkles } from 'lucide-react';

export const ScaledAttentionViz: React.FC = () => {
  const [tokens] = useState<string[]>(['The', 'transformer', 'is', 'fast']);
  const [useCausalMask, setUseCausalMask] = useState<boolean>(false);
  const [hoveredTokenIdx, setHoveredTokenIdx] = useState<number | null>(null);

  // Toy 4x2 Q, K, V matrices
  const Q = useMemo(
    () => [
      [1.0, 0.5],
      [0.2, 1.2],
      [-0.5, 0.8],
      [1.1, -0.4],
    ],
    []
  );

  const K = useMemo(
    () => [
      [0.8, 0.4],
      [0.1, 1.0],
      [-0.6, 0.5],
      [0.9, -0.2],
    ],
    []
  );

  const V = useMemo(
    () => [
      [0.5, 1.5],
      [1.2, 0.2],
      [0.1, -0.8],
      [0.9, 0.9],
    ],
    []
  );

  const mask = useMemo(
    () => (useCausalMask ? createCausalMask(tokens.length) : undefined),
    [useCausalMask, tokens.length]
  );

  const attnResult = useMemo(() => {
    return scaledDotProductAttention(Q, K, V, mask);
  }, [Q, K, V, mask]);

  const stepLabels = [
    '1. Input Q, K, V Matrices',
    '2. Raw Similarity Scores (Q · Kᵀ)',
    '3. Scaling by 1 / √d_k',
    '4. Applying Mask (Optional Causal)',
    '5. Softmax Attention Weights',
    '6. Value Weighting & Output Matrix',
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
            <Cpu className="w-4 h-4 text-tokyo-purple" />
            Feature 3 — Section 3.2.1 (Centerpiece)
          </div>
          <span className="bg-tokyo-purple/20 border border-tokyo-purple/50 text-tokyo-purple text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
            Steppable Animation
          </span>
        </div>
        <h3 className="text-2xl font-bold text-tokyo-text font-sans">Scaled Dot-Product Attention Step-Through</h3>
        <p className="text-xs text-tokyo-subtext font-mono">
          Step through every intermediate tensor operation computing <KatexBlock math="\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V" />.
        </p>
      </div>

      {/* Stepper Controls Bar */}
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

      {/* Causal Mask Toggle */}
      <div className="flex items-center justify-between bg-tokyo-bg-dark border border-tokyo-border rounded-xl p-4">
        <div className="space-y-0.5">
          <span className="text-xs font-mono font-bold text-tokyo-text flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-tokyo-orange" />
            Causal Masking (Decoder Mode)
          </span>
          <p className="text-[10px] text-tokyo-muted font-mono">
            Blocks future token positions (lower-triangular mask) so tokens cannot look ahead.
          </p>
        </div>
        <button
          onClick={() => setUseCausalMask((prev) => !prev)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            useCausalMask
              ? 'bg-tokyo-orange text-tokyo-bg shadow'
              : 'bg-tokyo-surface border border-tokyo-border text-tokyo-subtext hover:text-tokyo-text'
          }`}
        >
          {useCausalMask ? 'Mask Enabled' : 'Mask Disabled (Encoder)'}
        </button>
      </div>

      {/* Step Visualization Displays */}
      <div className="space-y-6">
        {/* Step 0: Q, K, V Matrices */}
        {stepper.currentStep === 0 && (
          <div className="space-y-4">
            <div className="bg-tokyo-bg border border-tokyo-border rounded-lg p-3 text-xs font-mono text-tokyo-subtext flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-tokyo-yellow shrink-0" />
              Initial projections for Queries (<KatexBlock math="Q" />), Keys (<KatexBlock math="K" />), and Values (<KatexBlock math="V" />).
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MatrixHeatmap
                matrix={attnResult.Q}
                rowLabels={tokens}
                colLabels={['q_0', 'q_1']}
                title="Query Matrix (Q)"
                colorScheme="purple"
                precision={2}
              />
              <MatrixHeatmap
                matrix={attnResult.K}
                rowLabels={tokens}
                colLabels={['k_0', 'k_1']}
                title="Key Matrix (K)"
                colorScheme="blue"
                precision={2}
              />
              <MatrixHeatmap
                matrix={attnResult.V}
                rowLabels={tokens}
                colLabels={['v_0', 'v_1']}
                title="Value Matrix (V)"
                colorScheme="cyan"
                precision={2}
              />
            </div>
          </div>
        )}

        {/* Step 1: Raw Dot-Product Scores Q * K^T */}
        {stepper.currentStep === 1 && (
          <div className="space-y-4">
            <div className="bg-tokyo-bg border border-tokyo-border rounded-lg p-3 text-xs font-mono text-tokyo-subtext">
              <KatexBlock math="\text{Raw Scores} = Q \cdot K^T" block />
              Computes pairwise dot-product similarity between query vectors and key vectors.
            </div>

            <MatrixHeatmap
              matrix={attnResult.rawScores}
              rowLabels={tokens}
              colLabels={tokens}
              title="Raw Similarity Matrix (Q · Kᵀ)"
              subtitle="Higher values indicate stronger semantic similarity."
              colorScheme="purple"
              precision={2}
            />
          </div>
        )}

        {/* Step 2: Scaling by 1 / sqrt(d_k) */}
        {stepper.currentStep === 2 && (
          <div className="space-y-4">
            <div className="bg-tokyo-bg border border-tokyo-border rounded-lg p-3 text-xs font-mono text-tokyo-subtext">
              <KatexBlock math="\text{Scaled Scores} = \frac{Q \cdot K^T}{\sqrt{d_k}}" block />
              Divided by <KatexBlock math="\sqrt{d_k} = \sqrt{2} \approx 1.414" /> to prevent large dot-product values from pushing softmax into regions with vanishingly small gradients.
            </div>

            <MatrixHeatmap
              matrix={attnResult.scaledScores}
              rowLabels={tokens}
              colLabels={tokens}
              title="Scaled Similarity Matrix"
              colorScheme="orange"
              precision={2}
            />
          </div>
        )}

        {/* Step 3: Masking */}
        {stepper.currentStep === 3 && (
          <div className="space-y-4">
            <div className="bg-tokyo-bg border border-tokyo-border rounded-lg p-3 text-xs font-mono text-tokyo-subtext">
              {useCausalMask ? (
                <span>Future token positions are set to <KatexBlock math="-10^9" /> so they become <KatexBlock math="0" /> after softmax.</span>
              ) : (
                <span>No mask applied (Encoder Mode — every token can attend to every token).</span>
              )}
            </div>

            <MatrixHeatmap
              matrix={attnResult.maskedScores}
              rowLabels={tokens}
              colLabels={tokens}
              title="Masked Scores Matrix"
              colorScheme={useCausalMask ? 'orange' : 'blue'}
              precision={2}
            />
          </div>
        )}

        {/* Step 4: Softmax Attention Weights */}
        {stepper.currentStep === 4 && (
          <div className="space-y-4">
            <div className="bg-tokyo-bg border border-tokyo-border rounded-lg p-3 text-xs font-mono text-tokyo-subtext space-y-1">
              <KatexBlock math="\text{Attention Weights} = \text{softmax}\left(\text{Masked Scores}\right)" block />
              <span>Rows sum to exactly 1.00. Hover a token to inspect its attention distribution.</span>
            </div>

            {/* Hover Token Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-tokyo-muted">Inspect Token:</span>
              {tokens.map((t, idx) => (
                <button
                  key={t}
                  onMouseEnter={() => setHoveredTokenIdx(idx)}
                  onMouseLeave={() => setHoveredTokenIdx(null)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                    hoveredTokenIdx === idx
                      ? 'bg-tokyo-cyan text-tokyo-bg shadow'
                      : 'bg-tokyo-bg border border-tokyo-border text-tokyo-subtext'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <MatrixHeatmap
              matrix={attnResult.attentionWeights}
              rowLabels={tokens}
              colLabels={tokens}
              title="Softmax Attention Weights Matrix"
              subtitle="Hover cells or tokens above to inspect attention focus"
              colorScheme="purple"
              precision={3}
              highlightCell={
                hoveredTokenIdx !== null
                  ? { row: hoveredTokenIdx, col: 0 }
                  : undefined
              }
            />
          </div>
        )}

        {/* Step 5: Output Matrix (Softmax * V) */}
        {stepper.currentStep === 5 && (
          <div className="space-y-4">
            <div className="bg-tokyo-bg border border-tokyo-border rounded-lg p-3 text-xs font-mono text-tokyo-subtext">
              <KatexBlock math="\text{Output} = \text{Attention Weights} \cdot V" block />
              Final contextual representation computed as a weighted average of Value vectors.
            </div>

            <MatrixHeatmap
              matrix={attnResult.output}
              rowLabels={tokens}
              colLabels={['v_out_0', 'v_out_1']}
              title="Final Attention Output Matrix"
              colorScheme="green"
              precision={2}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScaledAttentionViz;
