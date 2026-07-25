'use client';

import React, { useState, useMemo } from 'react';
import { Table, Sliders, CheckCircle2, Zap } from 'lucide-react';
import KatexBlock from '@/components/ui/KatexBlock';

export const ComplexityTableViz: React.FC = () => {
  const [n, setN] = useState<number>(32); // Sequence length
  const [d, setD] = useState<number>(512); // Representation dimension
  const [k, setK] = useState<number>(3); // Kernel size
  const [r, setR] = useState<number>(7); // Restricted neighborhood size

  const calculations = useMemo(() => {
    // 1. Self-Attention: n^2 * d
    const selfAttnOps = n * n * d;
    const selfAttnSeq = 1;
    const selfAttnPath = 1;

    // 2. Recurrent: n * d^2
    const rnnOps = n * d * d;
    const rnnSeq = n;
    const rnnPath = n;

    // 3. Convolutional: k * n * d^2
    const cnnOps = k * n * d * d;
    const cnnSeq = 1;
    const cnnPath = Math.ceil(Math.log(n) / Math.log(k)) || 1;

    // 4. Restricted Self-Attention: r * n * d
    const restrOps = r * n * d;
    const restrSeq = 1;
    const restrPath = Math.ceil(n / r);

    return [
      {
        type: 'Self-Attention (Transformer)',
        complexityFormula: 'O(n^2 \\cdot d)',
        ops: selfAttnOps,
        seqOpsFormula: 'O(1)',
        seqOps: selfAttnSeq,
        maxPathFormula: 'O(1)',
        maxPath: selfAttnPath,
        highlight: true,
        color: 'text-tokyo-purple',
      },
      {
        type: 'Recurrent (RNN / LSTM)',
        complexityFormula: 'O(n \\cdot d^2)',
        ops: rnnOps,
        seqOpsFormula: 'O(n)',
        seqOps: rnnSeq,
        maxPathFormula: 'O(n)',
        maxPath: rnnPath,
        highlight: false,
        color: 'text-tokyo-subtext',
      },
      {
        type: 'Convolutional (CNN)',
        complexityFormula: 'O(k \\cdot n \\cdot d^2)',
        ops: cnnOps,
        seqOpsFormula: 'O(1)',
        seqOps: cnnSeq,
        maxPathFormula: 'O(\\log_k(n))',
        maxPath: cnnPath,
        highlight: false,
        color: 'text-tokyo-subtext',
      },
      {
        type: 'Self-Attention (Restricted r)',
        complexityFormula: 'O(r \\cdot n \\cdot d)',
        ops: restrOps,
        seqOpsFormula: 'O(1)',
        seqOps: restrSeq,
        maxPathFormula: 'O(n / r)',
        maxPath: restrPath,
        highlight: false,
        color: 'text-tokyo-cyan',
      },
    ];
  }, [n, d, k, r]);

  return (
    <div className="space-y-6 bg-tokyo-surface border border-tokyo-border rounded-xl p-6 shadow-xl">
      {/* Header */}
      <div className="border-b border-tokyo-border pb-4 space-y-1">
        <div className="flex items-center gap-2 text-tokyo-green font-mono text-xs font-bold uppercase tracking-wider">
          <Table className="w-4 h-4" />
          Feature 8 — Paper Table 1
        </div>
        <h3 className="text-xl font-bold text-tokyo-text font-sans">Computational Complexity Comparison</h3>
        <p className="text-xs text-tokyo-subtext font-mono">
          Compare total operations per layer, sequential steps, and maximum path lengths between Self-Attention, RNNs, and CNNs.
        </p>
      </div>

      {/* Sliders for n and d */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-tokyo-bg border border-tokyo-border rounded-xl p-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-tokyo-subtext">Seq Length ($n$):</span>
            <span className="text-tokyo-cyan font-bold">{n}</span>
          </div>
          <input
            type="range"
            min={4}
            max={256}
            step={4}
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full accent-tokyo-cyan cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-tokyo-subtext">Dimension ($d$):</span>
            <span className="text-tokyo-purple font-bold">{d}</span>
          </div>
          <input
            type="range"
            min={64}
            max={1024}
            step={64}
            value={d}
            onChange={(e) => setD(parseInt(e.target.value))}
            className="w-full accent-tokyo-purple cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-tokyo-subtext">CNN Kernel ($k$):</span>
            <span className="text-tokyo-orange font-bold">{k}</span>
          </div>
          <input
            type="range"
            min={2}
            max={9}
            value={k}
            onChange={(e) => setK(parseInt(e.target.value))}
            className="w-full accent-tokyo-orange cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-tokyo-subtext">Restricted ($r$):</span>
            <span className="text-tokyo-green font-bold">{r}</span>
          </div>
          <input
            type="range"
            min={3}
            max={31}
            step={2}
            value={r}
            onChange={(e) => setR(parseInt(e.target.value))}
            className="w-full accent-tokyo-green cursor-pointer"
          />
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-tokyo-border text-tokyo-muted">
              <th className="p-3">Layer Type</th>
              <th className="p-3">Complexity / Layer</th>
              <th className="p-3">Live Ops ($n={n}, d={d}$)</th>
              <th className="p-3">Sequential Ops</th>
              <th className="p-3">Max Path Length</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-tokyo-border">
            {calculations.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-colors ${
                  row.highlight
                    ? 'bg-tokyo-purple/10 font-bold border-l-4 border-l-tokyo-purple'
                    : 'hover:bg-tokyo-bg-dark'
                }`}
              >
                <td className={`p-3 font-semibold ${row.color} flex items-center gap-2`}>
                  {row.highlight && <Zap className="w-4 h-4 text-tokyo-yellow shrink-0" />}
                  {row.type}
                </td>
                <td className="p-3 text-tokyo-text">
                  <KatexBlock math={row.complexityFormula} />
                </td>
                <td className="p-3 font-mono font-bold text-tokyo-green">
                  {row.ops.toLocaleString()} ops
                </td>
                <td className="p-3 text-tokyo-subtext">
                  <KatexBlock math={row.seqOpsFormula} /> ({row.seqOps} step{row.seqOps > 1 ? 's' : ''})
                </td>
                <td className="p-3 text-tokyo-cyan">
                  <KatexBlock math={row.maxPathFormula} /> ({row.maxPath} hop{row.maxPath > 1 ? 's' : ''})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key Insight Box */}
      <div className="bg-tokyo-bg-dark border border-tokyo-border rounded-xl p-4 space-y-2">
        <div className="text-xs font-mono text-tokyo-green font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-tokyo-green" />
          Why Self-Attention Wins for Transformers
        </div>
        <p className="text-xs text-tokyo-subtext leading-relaxed font-sans">
          When sequence length $n &lt; d$ (e.g. $n={n} &lt; d={d}$), Self-Attention requires fewer total operations per layer than RNNs ({calculations[0].ops.toLocaleString()} vs {calculations[1].ops.toLocaleString()}) while reducing maximum path length between long-range dependencies to a constant $O(1)$ operations and enabling full GPU parallelization ($O(1)$ sequential steps).
        </p>
      </div>
    </div>
  );
};

export default ComplexityTableViz;
