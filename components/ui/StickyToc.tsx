'use client';

import React from 'react';
import { Zap, Cpu, Layers, Layers3, Sparkles, Activity, GitFork, Table, BookOpen } from 'lucide-react';

export type TocSectionId =
  | 'forward-pass'
  | 'scaled-attn'
  | 'encoder'
  | 'decoder'
  | 'tokenizer'
  | 'pe'
  | 'multihead'
  | 'complexity'
  | 'reader';

interface StickyTocProps {
  activeSectionId: TocSectionId;
  onSelectSection: (sectionId: TocSectionId) => void;
  className?: string;
}

export const StickyToc: React.FC<StickyTocProps> = ({
  activeSectionId,
  onSelectSection,
  className = '',
}) => {
  const items: { id: TocSectionId; label: string; icon: React.ReactNode }[] = [
    { id: 'forward-pass', label: 'Forward Pass', icon: <Zap className="w-3.5 h-3.5 text-tokyo-green" /> },
    { id: 'scaled-attn', label: 'Scaled Attention', icon: <Cpu className="w-3.5 h-3.5 text-tokyo-purple" /> },
    { id: 'encoder', label: 'Encoder (N=6)', icon: <Layers className="w-3.5 h-3.5 text-tokyo-purple" /> },
    { id: 'decoder', label: 'Decoder & Mask', icon: <Layers3 className="w-3.5 h-3.5 text-tokyo-cyan" /> },
    { id: 'tokenizer', label: 'Tokenizer', icon: <Sparkles className="w-3.5 h-3.5 text-tokyo-cyan" /> },
    { id: 'pe', label: 'PE Sinusoids', icon: <Activity className="w-3.5 h-3.5 text-tokyo-orange" /> },
    { id: 'multihead', label: 'Multi-Head', icon: <GitFork className="w-3.5 h-3.5 text-tokyo-blue" /> },
    { id: 'complexity', label: 'Complexity Table', icon: <Table className="w-3.5 h-3.5 text-tokyo-green" /> },
    { id: 'reader', label: 'Paper Reference', icon: <BookOpen className="w-3.5 h-3.5 text-tokyo-subtext" /> },
  ];

  return (
    <nav
      className={`sticky top-0 z-40 bg-tokyo-bg/90 backdrop-blur border-b border-tokyo-border px-4 py-2.5 shadow-md ${className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs font-bold text-tokyo-purple">
          <span className="w-2 h-2 rounded-full bg-tokyo-green animate-pulse" />
          <span>Attention, Visualized</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                activeSectionId === item.id
                  ? 'bg-tokyo-surface text-tokyo-cyan border border-tokyo-cyan/50 shadow'
                  : 'text-tokyo-subtext hover:text-tokyo-text hover:bg-tokyo-surface/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default StickyToc;
