'use client';

import React, { useState, useMemo } from 'react';
import { multiHeadAttention } from '@/lib/math/multihead';
import MatrixHeatmap from '@/components/ui/MatrixHeatmap';
import { GitFork, Layers, Layers3 } from 'lucide-react';
import KatexBlock from '@/components/ui/KatexBlock';

export const MultiHeadViz: React.FC = () => {
  const [numHeads, setNumHeads] = useState<number>(2);
  const [tokens] = useState<string[]>(['The', 'transformer', 'is', 'fast']);
  const dModel = 8; // dModel = 8, so h can be 1, 2, 4, 8

  // Toy 4x8 Input Matrix X
  const X = useMemo(
    () => [
      [0.8, -0.2, 1.2, 0.4, 0.1, -0.9, 0.5, 0.3],
      [0.2, 1.1, -0.4, 0.8, -0.5, 0.6, 1.0, -0.2],
      [-0.6, 0.3, 0.9, -0.1, 1.2, -0.4, 0.2, 0.7],
      [1.0, -0.5, 0.2, 0.6, -0.8, 0.4, -0.1, 0.9],
    ],
    []
  );

  const result = useMemo(() => {
    return multiHeadAttention(X, X, X, numHeads);
  }, [X, numHeads]);

  const d_k = dModel / numHeads;

  return (
    <div className="space-y-6 bg-tokyo-surface border border-tokyo-border rounded-xl p-6 shadow-xl">
      {/* Header */}
      <div className="border-b border-tokyo-border pb-4 space-y-1">
        <div className="flex items-center gap-2 text-tokyo-cyan font-mono text-xs font-bold uppercase tracking-wider">
          <GitFork className="w-4 h-4" />
          Feature 4 — Section 3.2.2
        </div>
        <h3 className="text-xl font-bold text-tokyo-text font-sans">Multi-Head Attention Visualizer</h3>
        <p className="text-xs text-tokyo-subtext font-mono">
          Splitting <KatexBlock math="d_{\text{model}} = 8" /> across <KatexBlock math="h" /> parallel attention heads allows attending to information from different representation subspaces simultaneously.
        </p>
      </div>

      {/* Head Count Toggle */}
      <div className="flex items-center justify-between bg-tokyo-bg-dark border border-tokyo-border rounded-xl p-4">
        <div className="space-y-0.5">
          <span className="text-xs font-mono font-bold text-tokyo-text flex items-center gap-1.5">
            <Layers3 className="w-4 h-4 text-tokyo-cyan" />
            Number of Attention Heads (<KatexBlock math="h" />):
          </span>
          <p className="text-[10px] text-tokyo-muted font-mono">
            Dimension per head: <KatexBlock math={`d_k = d_{\\text{model}} / h = 8 / ${numHeads} = ${d_k}`} />.
          </p>
        </div>

        <div className="flex gap-2">
          {[1, 2, 4, 8].map((h) => (
            <button
              key={h}
              onClick={() => setNumHeads(h)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                numHeads === h
                  ? 'bg-tokyo-cyan text-tokyo-bg shadow ring-2 ring-tokyo-cyan/50'
                  : 'bg-tokyo-surface border border-tokyo-border text-tokyo-subtext hover:text-tokyo-text'
              }`}
            >
              h = {h}
            </button>
          ))}
        </div>
      </div>

      {/* Equation */}
      <div className="bg-tokyo-bg border border-tokyo-border rounded-lg p-3 text-center text-xs font-mono">
        <KatexBlock
          math="\text{MultiHead}(Q,K,V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)W^O"
          block
        />
      </div>

      {/* Side-by-side Per-Head Attention Heatmaps */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-tokyo-purple flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-tokyo-purple" />
          Per-Head Softmax Attention Weights ({numHeads} {numHeads === 1 ? 'Head' : 'Heads'})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {result.heads.map((head, idx) => (
            <MatrixHeatmap
              key={idx}
              matrix={head.attentionWeights}
              rowLabels={tokens}
              colLabels={tokens}
              title={`Head ${idx + 1} Attention (d_k=${d_k})`}
              colorScheme={
                idx % 4 === 0
                  ? 'purple'
                  : idx % 4 === 1
                  ? 'blue'
                  : idx % 4 === 2
                  ? 'cyan'
                  : 'orange'
              }
              precision={2}
            />
          ))}
        </div>
      </div>

      {/* Output Concatenation View */}
      <div className="pt-2">
        <MatrixHeatmap
          matrix={result.concatenated}
          rowLabels={tokens}
          colLabels={Array.from({ length: dModel }).map((_, i) => `c_${i}`)}
          title="Concatenated Multi-Head Output (seqLen × d_model)"
          subtitle="All h head outputs concatenated together back to d_model = 8"
          colorScheme="green"
          precision={2}
        />
      </div>
    </div>
  );
};

export default MultiHeadViz;
