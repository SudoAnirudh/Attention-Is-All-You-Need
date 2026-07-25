'use client';

import React, { useState, useMemo } from 'react';
import { defaultTokenizer } from '@/lib/math/tokenizer';
import { EmbeddingTable } from '@/lib/math/embedding';
import MatrixHeatmap from '@/components/ui/MatrixHeatmap';
import { Type, Sparkles, Hash } from 'lucide-react';
import KatexBlock from '@/components/ui/KatexBlock';

export const TokenizerPlayground: React.FC = () => {
  const [inputText, setInputText] = useState<string>('Attention Is All You Need');
  const [dModel, setDModel] = useState<number>(4);

  const presets = [
    'Attention Is All You Need',
    'The transformer is all you need',
    'Je suis étudiant',
    'I am a student',
  ];

  const embeddingTable = useMemo(() => new EmbeddingTable(dModel), [dModel]);

  const { tokens, tokenIds } = useMemo(() => {
    return defaultTokenizer.tokenize(inputText);
  }, [inputText]);

  const embeddingMatrix = useMemo(() => {
    return embeddingTable.embedSequence(tokenIds, true);
  }, [embeddingTable, tokenIds]);

  const projection2D = useMemo(() => {
    return embeddingMatrix.map((vec, idx) => {
      const x = vec[0] || 0;
      const y = vec[1] || 0;
      return { token: tokens[idx] || `t${idx}`, x, y, id: tokenIds[idx] };
    });
  }, [embeddingMatrix, tokens, tokenIds]);

  return (
    <div className="space-y-6 bg-tokyo-surface border border-tokyo-border rounded-xl p-6 shadow-xl">
      {/* Header */}
      <div className="border-b border-tokyo-border pb-4 space-y-1">
        <div className="flex items-center gap-2 text-tokyo-purple font-mono text-xs font-bold uppercase tracking-wider">
          <Type className="w-4 h-4" />
          Feature 1 — Section 3.1 &amp; 3.4
        </div>
        <h3 className="text-xl font-bold text-tokyo-text font-sans">Tokenizer &amp; Embedding Playground</h3>
        <p className="text-xs text-tokyo-subtext font-mono">
          Convert text into token IDs and inspect <KatexBlock math="d_{\text{model}}" /> feature embeddings (scaled by <KatexBlock math="\sqrt{d_{\text{model}}}" />).
        </p>
      </div>

      {/* Inputs & Controls */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-bold text-tokyo-subtext mb-1">
            Input Sentence:
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-tokyo-bg border border-tokyo-border rounded-lg px-4 py-2 text-sm font-mono text-tokyo-cyan focus:outline-none focus:border-tokyo-purple"
            placeholder="Type a sentence..."
          />
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-tokyo-muted">Presets:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => setInputText(preset)}
              className="text-xs font-mono px-2.5 py-1 rounded bg-tokyo-bg border border-tokyo-border text-tokyo-subtext hover:text-tokyo-purple hover:border-tokyo-purple/50 transition-colors"
            >
              "{preset}"
            </button>
          ))}
        </div>

        {/* Dimension Selector */}
        <div className="flex items-center gap-4 bg-tokyo-bg-dark border border-tokyo-border rounded-lg p-3">
          <span className="text-xs font-mono text-tokyo-subtext">
            Embedding Dimension (<KatexBlock math="d_{\text{model}}" />):
          </span>
          {[4, 8, 16].map((dim) => (
            <button
              key={dim}
              onClick={() => setDModel(dim)}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                dModel === dim
                  ? 'bg-tokyo-purple text-tokyo-bg shadow'
                  : 'bg-tokyo-surface text-tokyo-subtext border border-tokyo-border hover:text-tokyo-text'
              }`}
            >
              {dim}
            </button>
          ))}
        </div>
      </div>

      {/* Token List Badges */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono font-bold text-tokyo-text flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-tokyo-green" />
          Extracted Tokens &amp; Vocabulary IDs
        </h4>
        <div className="flex flex-wrap gap-2">
          {tokens.map((token, idx) => (
            <div
              key={idx}
              className="bg-tokyo-bg border border-tokyo-border rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-mono"
            >
              <span className="text-tokyo-cyan font-bold">{token}</span>
              <span className="bg-tokyo-surface px-1.5 py-0.5 rounded text-[10px] text-tokyo-purple font-mono">
                ID: {tokenIds[idx]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Embedding Matrix Heatmap & 2D Projection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <MatrixHeatmap
            matrix={embeddingMatrix}
            rowLabels={tokens}
            colLabels={Array.from({ length: dModel }).map((_, i) => `d_${i}`)}
            title="Scaled Embedding Matrix (seqLen × d_model)"
            subtitle="Values are multiplied by √d_model per paper Section 3.4"
            colorScheme="cyan"
            precision={2}
          />
        </div>

        {/* 2D Vector Space Scatter */}
        <div className="lg:col-span-4 bg-tokyo-bg-dark border border-tokyo-border rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold text-tokyo-purple flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-tokyo-yellow" />
              Embedding Subspace (Dim 0 vs Dim 1)
            </h4>
            <p className="text-[10px] text-tokyo-muted font-mono">
              2D slice of tokens in feature space.
            </p>
          </div>

          <div className="relative w-full h-48 bg-tokyo-surface border border-tokyo-border rounded-lg p-2 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-x-0 top-1/2 border-b border-tokyo-border border-dashed" />
            <div className="absolute inset-y-0 left-1/2 border-r border-tokyo-border border-dashed" />

            {projection2D.map((pt, idx) => {
              const leftPercent = Math.max(10, Math.min(90, 50 + pt.x * 12));
              const topPercent = Math.max(10, Math.min(90, 50 - pt.y * 12));

              return (
                <div
                  key={idx}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                >
                  <div className="w-3 h-3 rounded-full bg-tokyo-cyan border border-tokyo-bg group-hover:scale-150 transition-transform shadow-lg" />
                  <span className="absolute left-4 top-0 bg-tokyo-bg border border-tokyo-border text-tokyo-cyan px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap opacity-90 group-hover:opacity-100 group-hover:z-20">
                    {pt.token}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenizerPlayground;
