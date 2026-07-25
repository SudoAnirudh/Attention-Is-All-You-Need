'use client';

import React, { useState, useMemo } from 'react';
import { defaultTokenizer } from '@/lib/math/tokenizer';
import { EmbeddingTable } from '@/lib/math/embedding';
import { getPositionalEncoding } from '@/lib/math/positionalEncoding';
import { addMatrices, softmax, matmul, createMatrix } from '@/lib/math/matrix';
import { transformerEncoderLayer } from '@/lib/math/encoderLayer';
import { transformerDecoderLayer } from '@/lib/math/decoderLayer';
import { useStepper } from '@/lib/hooks/useStepper';
import StepperControls from '@/components/ui/StepperControls';
import MatrixHeatmap from '@/components/ui/MatrixHeatmap';
import KatexBlock from '@/components/ui/KatexBlock';
import { Zap, CheckCircle2 } from 'lucide-react';

export const FullForwardPassViz: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>('Je suis étudiant');
  const [targetText, setTargetText] = useState<string>('I am a student');
  const dModel = 4;
  const numHeads = 2;
  const numLayers = 2; // Fast toy stack for live forward pass demo

  const embeddingTable = useMemo(() => new EmbeddingTable(dModel), [dModel]);

  // 1. Tokenize
  const { tokens: srcTokens, tokenIds: srcIds } = useMemo(
    () => defaultTokenizer.tokenize(sourceText),
    [sourceText]
  );
  const { tokens: tgtTokens, tokenIds: tgtIds } = useMemo(
    () => defaultTokenizer.tokenize(targetText),
    [targetText]
  );

  // 2. Embeddings & Positional Encoding
  const srcEmbed = useMemo(
    () => embeddingTable.embedSequence(srcIds, true),
    [embeddingTable, srcIds]
  );
  const tgtEmbed = useMemo(
    () => embeddingTable.embedSequence(tgtIds, true),
    [embeddingTable, tgtIds]
  );

  const srcPE = useMemo(() => getPositionalEncoding(srcTokens.length, dModel), [srcTokens.length, dModel]);
  const tgtPE = useMemo(() => getPositionalEncoding(tgtTokens.length, dModel), [tgtTokens.length, dModel]);

  const srcInput = useMemo(() => addMatrices(srcEmbed, srcPE), [srcEmbed, srcPE]);
  const tgtInput = useMemo(() => addMatrices(tgtEmbed, tgtPE), [tgtEmbed, tgtPE]);

  // 3. Encoder Forward Pass
  const encoderOutput = useMemo(() => {
    let currentX = srcInput;
    for (let i = 0; i < numLayers; i++) {
      currentX = transformerEncoderLayer(currentX, numHeads).finalOutput;
    }
    return currentX;
  }, [srcInput, numLayers, numHeads]);

  // 4. Decoder Forward Pass
  const decoderOutput = useMemo(() => {
    let currentY = tgtInput;
    for (let i = 0; i < numLayers; i++) {
      currentY = transformerDecoderLayer(currentY, encoderOutput, numHeads).finalOutput;
    }
    return currentY;
  }, [tgtInput, encoderOutput, numLayers, numHeads]);

  // 5. Final Linear & Softmax Projections
  const vocabSize = 8;
  const W_linear = useMemo(() => createMatrix(dModel, vocabSize, 0.25), [dModel, vocabSize]);
  const logits = useMemo(() => matmul(decoderOutput, W_linear), [decoderOutput, W_linear]);
  const probs = useMemo(() => softmax(logits, 'row'), [logits]);

  const stepLabels = [
    '1. Input Tokenization & Token IDs',
    '2. Input Embeddings + Positional Encoding (PE)',
    '3. Encoder Stack Processing (N=2 Layers)',
    '4. Decoder Stack Processing (Cross-Attention & Causal Mask)',
    '5. Final Linear Projection & Softmax Token Probabilities',
  ];

  const stepper = useStepper({
    totalSteps: stepLabels.length,
    initialStep: 0,
    autoplayIntervalMs: 3000,
  });

  const vocabTokens = ['I', 'am', 'a', 'student', 'The', 'fast', 'you', 'need'];

  return (
    <div className="space-y-6 bg-tokyo-surface border border-tokyo-border rounded-xl p-6 shadow-xl">
      {/* Header */}
      <div className="border-b border-tokyo-border pb-4 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-tokyo-green font-mono text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-tokyo-green" />
            Feature 7 — Complete Transformer Integration
          </div>
          <span className="bg-tokyo-green/20 border border-tokyo-green/50 text-tokyo-green text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
            End-to-End Forward Pass
          </span>
        </div>
        <h3 className="text-2xl font-bold text-tokyo-text font-sans">Full Forward Pass Integration Demo</h3>
        <p className="text-xs text-tokyo-subtext font-mono">
          Live end-to-end execution: Source Input <KatexBlock math="\rightarrow" /> Tokenization <KatexBlock math="\rightarrow" /> Embeddings <KatexBlock math="+ PE \rightarrow" /> Encoder Stack <KatexBlock math="\rightarrow" /> Decoder Stack <KatexBlock math="\rightarrow" /> Output Token Probabilities.
        </p>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-tokyo-bg-dark border border-tokyo-border rounded-xl p-4">
        <div className="space-y-1">
          <label className="block text-xs font-mono font-bold text-tokyo-purple">
            Source Sentence (Encoder Input):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full bg-tokyo-bg border border-tokyo-border rounded-lg px-3 py-1.5 text-xs font-mono text-tokyo-purple focus:outline-none focus:border-tokyo-purple"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-mono font-bold text-tokyo-cyan">
            Target Sentence (Decoder Input):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={targetText}
              onChange={(e) => setTargetText(e.target.value)}
              className="w-full bg-tokyo-bg border border-tokyo-border rounded-lg px-3 py-1.5 text-xs font-mono text-tokyo-cyan focus:outline-none focus:border-tokyo-cyan"
            />
          </div>
        </div>
      </div>

      {/* Stepper Controls */}
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

      {/* Step Visualization Displays */}
      <div className="space-y-4 pt-2">
        {stepper.currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-tokyo-bg border border-tokyo-border rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-mono font-bold text-tokyo-purple">Encoder Source Tokens</h4>
              <div className="flex flex-wrap gap-2">
                {srcTokens.map((t, idx) => (
                  <span key={idx} className="bg-tokyo-surface border border-tokyo-border text-tokyo-purple px-2.5 py-1 rounded text-xs font-mono">
                    {t} (ID: {srcIds[idx]})
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-tokyo-bg border border-tokyo-border rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-mono font-bold text-tokyo-cyan">Decoder Target Tokens</h4>
              <div className="flex flex-wrap gap-2">
                {tgtTokens.map((t, idx) => (
                  <span key={idx} className="bg-tokyo-surface border border-tokyo-border text-tokyo-cyan px-2.5 py-1 rounded text-xs font-mono">
                    {t} (ID: {tgtIds[idx]})
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {stepper.currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MatrixHeatmap
              matrix={srcInput}
              rowLabels={srcTokens}
              colLabels={['d_0', 'd_1', 'd_2', 'd_3']}
              title="Source Input Vector (Embedding + PE)"
              colorScheme="purple"
              precision={2}
            />
            <MatrixHeatmap
              matrix={tgtInput}
              rowLabels={tgtTokens}
              colLabels={['d_0', 'd_1', 'd_2', 'd_3']}
              title="Target Input Vector (Embedding + PE)"
              colorScheme="cyan"
              precision={2}
            />
          </div>
        )}

        {stepper.currentStep === 2 && (
          <MatrixHeatmap
            matrix={encoderOutput}
            rowLabels={srcTokens}
            colLabels={['d_0', 'd_1', 'd_2', 'd_3']}
            title="Encoder Stack Final Context Representations (N=2 Layers)"
            subtitle="Rich contextual representations passed to Decoder Cross-Attention"
            colorScheme="purple"
            precision={2}
          />
        )}

        {stepper.currentStep === 3 && (
          <MatrixHeatmap
            matrix={decoderOutput}
            rowLabels={tgtTokens}
            colLabels={['d_0', 'd_1', 'd_2', 'd_3']}
            title="Decoder Stack Final Output Representations (N=2 Layers)"
            subtitle="Computed via Masked Self-Attention and Cross-Attention against Encoder"
            colorScheme="cyan"
            precision={2}
          />
        )}

        {stepper.currentStep === 4 && (
          <div className="space-y-4">
            <MatrixHeatmap
              matrix={probs}
              rowLabels={tgtTokens}
              colLabels={vocabTokens}
              title="Output Token Probability Distribution (Softmax(Decoder * W_linear))"
              subtitle="Probabilities sum to 1.00 per generated token position"
              colorScheme="green"
              precision={3}
            />

            <div className="bg-tokyo-bg-dark border border-tokyo-border rounded-xl p-4 space-y-2">
              <div className="text-xs font-mono text-tokyo-green font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-tokyo-green" />
                Forward Pass Completed Client-Side
              </div>
              <p className="text-xs text-tokyo-subtext font-sans">
                Computed full forward pass for sequence lengths <KatexBlock math={`n_{\\text{src}}=${srcTokens.length}`} /> and <KatexBlock math={`n_{\\text{tgt}}=${tgtTokens.length}`} /> in &lt; 5ms.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullForwardPassViz;
