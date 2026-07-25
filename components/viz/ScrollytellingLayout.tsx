'use client';

import React, { useState } from 'react';
import StickyToc, { TocSectionId } from '@/components/ui/StickyToc';
import PaperSidePanel from '@/components/ui/PaperSidePanel';
import FullForwardPassViz from '@/components/viz/FullForwardPassViz';
import ScaledAttentionViz from '@/components/viz/ScaledAttentionViz';
import EncoderStackViz from '@/components/viz/EncoderStackViz';
import DecoderStackViz from '@/components/viz/DecoderStackViz';
import TokenizerPlayground from '@/components/viz/TokenizerPlayground';
import PositionalEncodingViz from '@/components/viz/PositionalEncodingViz';
import MultiHeadViz from '@/components/viz/MultiHeadViz';
import ComplexityTableViz from '@/components/viz/ComplexityTableViz';
import DiagramViewer from '@/components/ui/DiagramViewer';
import { PAPER_SECTIONS } from '@/content/paperContent';
import KatexBlock from '@/components/ui/KatexBlock';
import { BookOpen, CheckCircle2, Layers } from 'lucide-react';

export const ScrollytellingLayout: React.FC = () => {
  const [activeTocSection, setActiveTocSection] = useState<TocSectionId>('forward-pass');
  const [paperSectionId, setPaperSectionId] = useState<string>('abstract');

  const activePaperSection =
    PAPER_SECTIONS.find((s) => s.id === paperSectionId) || PAPER_SECTIONS[0];

  return (
    <div className="min-h-screen bg-tokyo-bg text-tokyo-text flex flex-col">
      {/* Sticky Mini-TOC Bar */}
      <StickyToc
        activeSectionId={activeTocSection}
        onSelectSection={(id) => setActiveTocSection(id)}
      />

      {/* Main Scrollytelling Body Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 space-y-12">
          {activeTocSection === 'forward-pass' && <FullForwardPassViz />}
          {activeTocSection === 'scaled-attn' && <ScaledAttentionViz />}
          {activeTocSection === 'encoder' && <EncoderStackViz />}
          {activeTocSection === 'decoder' && <DecoderStackViz />}
          {activeTocSection === 'tokenizer' && <TokenizerPlayground />}
          {activeTocSection === 'pe' && <PositionalEncodingViz />}
          {activeTocSection === 'multihead' && <MultiHeadViz />}
          {activeTocSection === 'complexity' && <ComplexityTableViz />}

          {activeTocSection === 'reader' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center justify-between border-b border-tokyo-border pb-3">
                  <h2 className="text-lg font-bold text-tokyo-text font-mono flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-tokyo-purple" />
                    Paper Reader
                  </h2>
                  <span className="text-xs text-tokyo-muted font-mono">{PAPER_SECTIONS.length} Sections</span>
                </div>

                <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                  {PAPER_SECTIONS.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setPaperSectionId(sec.id)}
                      className={`text-left p-3 rounded-lg border text-sm transition-all ${
                        paperSectionId === sec.id
                          ? 'bg-tokyo-surface border-tokyo-purple text-tokyo-purple font-medium shadow-md'
                          : 'bg-tokyo-bg-dark border-tokyo-border text-tokyo-subtext hover:border-tokyo-muted hover:text-tokyo-text'
                      }`}
                    >
                      <div className="text-xs text-tokyo-muted font-mono">{sec.paperSection}</div>
                      <div className="font-semibold text-tokyo-text">{sec.title}</div>
                    </button>
                  ))}
                </div>

                <div className="bg-tokyo-surface border border-tokyo-border rounded-xl p-6 space-y-4">
                  <div className="text-xs text-tokyo-purple font-mono font-bold uppercase tracking-wider">
                    {activePaperSection.paperSection}
                  </div>
                  <h3 className="text-xl font-bold text-tokyo-text">{activePaperSection.title}</h3>
                  <p className="text-sm text-tokyo-subtext leading-relaxed">{activePaperSection.summary}</p>

                  <div className="bg-tokyo-bg-dark border border-tokyo-border rounded-lg p-4 space-y-2">
                    <div className="text-xs text-tokyo-green font-mono font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-tokyo-green" />
                      Key Takeaway
                    </div>
                    <p className="text-xs text-tokyo-text leading-relaxed font-sans">{activePaperSection.keyTakeaway}</p>
                  </div>

                  {activePaperSection.equations.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="text-xs text-tokyo-cyan font-mono font-semibold">Key Equations:</div>
                      {activePaperSection.equations.map((eq) => (
                        <div key={eq.id} className="bg-tokyo-bg border border-tokyo-border rounded-lg p-3 space-y-1">
                          <div className="text-xs text-tokyo-purple font-mono font-bold">{eq.name}</div>
                          <div className="py-2 text-center text-sm">
                            <KatexBlock math={eq.latex} block />
                          </div>
                          <p className="text-xs text-tokyo-muted font-mono">{eq.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between border-b border-tokyo-border pb-3">
                  <h2 className="text-lg font-bold text-tokyo-text font-mono flex items-center gap-2">
                    <Layers className="w-5 h-5 text-tokyo-cyan" />
                    Redrawn Architecture SVGs
                  </h2>
                  <span className="text-xs text-tokyo-muted font-mono">Original SVG Recreations</span>
                </div>

                <DiagramViewer
                  initialDiagram={activePaperSection.figureRef || 'encoder-decoder'}
                />
              </div>
            </div>
          )}
        </div>

        {/* Collapsible Paper Side Panel */}
        <PaperSidePanel
          activeSectionId={paperSectionId}
          onSelectSection={(id) => setPaperSectionId(id)}
        />
      </div>
    </div>
  );
};

export default ScrollytellingLayout;
