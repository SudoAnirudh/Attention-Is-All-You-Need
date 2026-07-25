'use client';

import React, { useState } from 'react';
import { Layers, Cpu, GitFork } from 'lucide-react';

export type DiagramType = 'encoder-decoder' | 'scaled-dot-product' | 'multi-head';

interface DiagramViewerProps {
  initialDiagram?: DiagramType;
  className?: string;
}

export const DiagramViewer: React.FC<DiagramViewerProps> = ({
  initialDiagram = 'encoder-decoder',
  className = '',
}) => {
  const [activeDiagram, setActiveDiagram] = useState<DiagramType>(initialDiagram);

  const diagrams: { id: DiagramType; label: string; icon: React.ReactNode; src: string; caption: string }[] = [
    {
      id: 'encoder-decoder',
      label: '1. Encoder-Decoder Stack',
      icon: <Layers className="w-4 h-4 text-tokyo-purple" />,
      src: '/content/figures/encoder_decoder_stack.svg',
      caption: 'Figure 1: Full Transformer architecture featuring stacked Encoder (N=6) and Decoder (N=6) layers with residual connections.',
    },
    {
      id: 'scaled-dot-product',
      label: '2. Scaled Dot-Product Attention',
      icon: <Cpu className="w-4 h-4 text-tokyo-blue" />,
      src: '/content/figures/scaled_dot_product_attention.svg',
      caption: 'Figure 2(a): Scaled Dot-Product Attention mechanism computing Q·Kᵀ scaled by √dₖ, masked, softmaxed, and multiplied by V.',
    },
    {
      id: 'multi-head',
      label: '3. Multi-Head Attention',
      icon: <GitFork className="w-4 h-4 text-tokyo-cyan" />,
      src: '/content/figures/multi_head_attention.svg',
      caption: 'Figure 2(b): Multi-Head Attention projecting Q, K, V into h parallel attention heads before concatenating and projecting.',
    },
  ];

  const current = diagrams.find((d) => d.id === activeDiagram) || diagrams[0];

  return (
    <div className={`bg-tokyo-surface border border-tokyo-border rounded-xl p-4 md:p-6 space-y-4 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-tokyo-border pb-3">
        {diagrams.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveDiagram(d.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-mono transition-colors ${
              activeDiagram === d.id
                ? 'bg-tokyo-purple/20 text-tokyo-purple border border-tokyo-purple/50'
                : 'text-tokyo-subtext hover:bg-tokyo-bg hover:text-tokyo-text'
            }`}
          >
            {d.icon}
            <span>{d.label}</span>
          </button>
        ))}
      </div>

      {/* Diagram SVG Container */}
      <div className="bg-tokyo-bg-dark border border-tokyo-border rounded-lg p-4 flex justify-center items-center overflow-auto max-h-[600px]">
        <img
          src={current.src}
          alt={current.caption}
          className="max-w-full h-auto rounded shadow-lg object-contain"
        />
      </div>

      {/* Caption & Reference Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-tokyo-subtext">
        <p className="flex-1">{current.caption}</p>
        <span className="bg-tokyo-bg border border-tokyo-border text-tokyo-cyan px-2.5 py-1 rounded">
          Original SVG Recreation
        </span>
      </div>
    </div>
  );
};

export default DiagramViewer;
