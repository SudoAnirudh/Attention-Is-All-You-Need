'use client';

import React, { useState, useMemo } from 'react';
import { getPositionalEncoding } from '@/lib/math/positionalEncoding';
import MatrixHeatmap from '@/components/ui/MatrixHeatmap';
import { Activity, Sliders, Info } from 'lucide-react';
import KatexBlock from '@/components/ui/KatexBlock';

export const PositionalEncodingViz: React.FC = () => {
  const [seqLen, setSeqLen] = useState<number>(8);
  const [dModel, setDModel] = useState<number>(8);
  const [selectedPos, setSelectedPos] = useState<number>(0);

  const peMatrix = useMemo(() => {
    return getPositionalEncoding(seqLen, dModel);
  }, [seqLen, dModel]);

  // Sine & Cosine curves across position range pos in [0 .. 32]
  const curvePoints = useMemo(() => {
    const points: { pos: number; sinVal: number; cosVal: number }[] = [];
    const maxP = 32;
    for (let p = 0; p <= maxP; p++) {
      const denominator = Math.pow(10000, 0 / dModel);
      const angle = p / denominator;
      points.push({
        pos: p,
        sinVal: Math.sin(angle),
        cosVal: Math.cos(angle),
      });
    }
    return points;
  }, [dModel]);

  return (
    <div className="space-y-6 bg-tokyo-surface border border-tokyo-border rounded-xl p-6 shadow-xl">
      {/* Header */}
      <div className="border-b border-tokyo-border pb-4 space-y-1">
        <div className="flex items-center gap-2 text-tokyo-orange font-mono text-xs font-bold uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          Feature 2 — Section 3.5
        </div>
        <h3 className="text-xl font-bold text-tokyo-text font-sans">Positional Encoding Visualizer</h3>
        <p className="text-xs text-tokyo-subtext font-mono">
          Sine and cosine sinusoidal functions of varying frequencies inject sequence order into token embeddings.
        </p>
      </div>

      {/* Equations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-tokyo-bg-dark border border-tokyo-border rounded-xl p-4">
        <div className="space-y-1">
          <span className="text-xs font-mono text-tokyo-purple font-bold">Even Dimensions (2i):</span>
          <KatexBlock math="PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)" block />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono text-tokyo-cyan font-bold">Odd Dimensions (2i+1):</span>
          <KatexBlock math="PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)" block />
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-tokyo-bg border border-tokyo-border rounded-xl p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-tokyo-subtext">Sequence Length (<KatexBlock math="n" />):</span>
            <span className="text-tokyo-cyan font-bold">{seqLen}</span>
          </div>
          <input
            type="range"
            min={4}
            max={16}
            value={seqLen}
            onChange={(e) => setSeqLen(parseInt(e.target.value))}
            className="w-full accent-tokyo-purple cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-tokyo-subtext">Dimension (<KatexBlock math="d_{\text{model}}" />):</span>
            <span className="text-tokyo-orange font-bold">{dModel}</span>
          </div>
          <input
            type="range"
            min={4}
            max={16}
            step={2}
            value={dModel}
            onChange={(e) => setDModel(parseInt(e.target.value))}
            className="w-full accent-tokyo-orange cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-tokyo-subtext">Highlight Position (<KatexBlock math="pos" />):</span>
            <span className="text-tokyo-green font-bold">{selectedPos}</span>
          </div>
          <input
            type="range"
            min={0}
            max={seqLen - 1}
            value={selectedPos}
            onChange={(e) => setSelectedPos(parseInt(e.target.value))}
            className="w-full accent-tokyo-green cursor-pointer"
          />
        </div>
      </div>

      {/* Visualizations: Sinusoid Curve Plot & Matrix Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Plot for i=0 Sinusoid */}
        <div className="lg:col-span-5 bg-tokyo-bg-dark border border-tokyo-border rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold text-tokyo-cyan flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-tokyo-cyan" />
              Sinusoid Frequencies (i = 0)
            </h4>
            <p className="text-[10px] text-tokyo-muted font-mono">
              Purple = <KatexBlock math="\sin(pos)" />, Cyan = <KatexBlock math="\cos(pos)" />. Vertical bar = pos={selectedPos}.
            </p>
          </div>

          <div className="relative w-full h-48 bg-tokyo-surface border border-tokyo-border rounded-lg p-2 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 320 160" width="100%" height="100%" className="overflow-visible">
              <line x1="0" y1="80" x2="320" y2="80" stroke="#292e42" strokeWidth="1.5" strokeDasharray="3,3" />

              <path
                d={curvePoints
                  .map(
                    (pt, idx) =>
                      `${idx === 0 ? 'M' : 'L'} ${pt.pos * 10} ${80 - pt.sinVal * 60}`
                  )
                  .join(' ')}
                fill="none"
                stroke="#bb9af7"
                strokeWidth="2.5"
              />

              <path
                d={curvePoints
                  .map(
                    (pt, idx) =>
                      `${idx === 0 ? 'M' : 'L'} ${pt.pos * 10} ${80 - pt.cosVal * 60}`
                  )
                  .join(' ')}
                fill="none"
                stroke="#7dcfff"
                strokeWidth="2"
                strokeDasharray="4,4"
              />

              <line
                x1={selectedPos * 10}
                y1="10"
                x2={selectedPos * 10}
                y2="150"
                stroke="#9ece6a"
                strokeWidth="2"
              />
              <circle cx={selectedPos * 10} cy={80 - Math.sin(selectedPos) * 60} r="4" fill="#9ece6a" />
            </svg>
          </div>

          <div className="text-[10px] text-tokyo-subtext font-mono bg-tokyo-bg p-2 rounded border border-tokyo-border flex items-center gap-1">
            <Info className="w-3 h-3 text-tokyo-yellow shrink-0" />
            Sinusoids enable the model to attend by relative positions since PE_(pos+k) is a linear transformation of PE_pos.
          </div>
        </div>

        {/* Matrix Heatmap */}
        <div className="lg:col-span-7">
          <MatrixHeatmap
            matrix={peMatrix}
            rowLabels={Array.from({ length: seqLen }).map((_, i) => `pos_${i}`)}
            colLabels={Array.from({ length: dModel }).map((_, j) => `d_${j}`)}
            title="Positional Encoding Matrix (PE)"
            subtitle="Rows = Sequence positions, Cols = Feature dimensions"
            colorScheme="orange"
            precision={2}
            highlightCell={{ row: selectedPos, col: 0 }}
          />
        </div>
      </div>
    </div>
  );
};

export default PositionalEncodingViz;
