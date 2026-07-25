'use client';

import React, { useState } from 'react';
import { PAPER_SECTIONS, PaperSection } from '@/content/paperContent';
import KatexBlock from '@/components/ui/KatexBlock';
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle2, FileText } from 'lucide-react';

interface PaperSidePanelProps {
  activeSectionId: string;
  onSelectSection: (sectionId: string) => void;
  className?: string;
}

export const PaperSidePanel: React.FC<PaperSidePanelProps> = ({
  activeSectionId,
  onSelectSection,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const activeSection: PaperSection =
    PAPER_SECTIONS.find((s) => s.id === activeSectionId) || PAPER_SECTIONS[0];

  return (
    <aside
      className={`transition-all duration-300 ${
        isOpen ? 'w-full lg:w-96' : 'w-12'
      } bg-tokyo-surface border border-tokyo-border rounded-xl shadow-xl flex flex-col overflow-hidden ${className}`}
    >
      {/* Header bar with toggle */}
      <div className="bg-tokyo-bg-dark border-b border-tokyo-border p-3 flex items-center justify-between">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 text-xs font-mono font-bold text-tokyo-purple hover:text-tokyo-text transition-colors"
        >
          <BookOpen className="w-4 h-4 text-tokyo-purple shrink-0" />
          {isOpen && <span>Paper Reference Panel</span>}
        </button>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-1 rounded bg-tokyo-bg text-tokyo-subtext hover:text-tokyo-text transition-colors"
          title={isOpen ? 'Collapse Panel' : 'Expand Panel'}
        >
          {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Section Selector Dropdown */}
          <div className="space-y-1">
            <label className="block text-[10px] font-mono uppercase text-tokyo-muted font-bold">
              Jump to Section
            </label>
            <select
              value={activeSectionId}
              onChange={(e) => onSelectSection(e.target.value)}
              className="w-full bg-tokyo-bg border border-tokyo-border rounded-lg p-2 text-xs font-mono text-tokyo-cyan focus:outline-none focus:border-tokyo-purple"
            >
              {PAPER_SECTIONS.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.paperSection}: {sec.title}
                </option>
              ))}
            </select>
          </div>

          {/* Active Section Info Card */}
          <div className="space-y-3">
            <div className="text-[10px] text-tokyo-purple font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-tokyo-purple" />
              {activeSection.paperSection}
            </div>

            <h3 className="text-base font-bold text-tokyo-text">{activeSection.title}</h3>
            <p className="text-xs text-tokyo-subtext leading-relaxed font-sans">{activeSection.summary}</p>

            {/* Key Takeaway Box */}
            <div className="bg-tokyo-bg border border-tokyo-border rounded-lg p-3 space-y-1">
              <div className="text-[11px] text-tokyo-green font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-tokyo-green" />
                Key Insight
              </div>
              <p className="text-xs text-tokyo-text leading-relaxed">{activeSection.keyTakeaway}</p>
            </div>

            {/* Section Equations */}
            {activeSection.equations.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-tokyo-border">
                <div className="text-[11px] text-tokyo-cyan font-mono font-bold">Key Equations</div>
                {activeSection.equations.map((eq) => (
                  <div key={eq.id} className="bg-tokyo-bg border border-tokyo-border rounded-lg p-2.5 space-y-1">
                    <div className="text-[10px] text-tokyo-purple font-mono font-bold">{eq.name}</div>
                    <div className="py-1 text-center text-xs">
                      <KatexBlock math={eq.latex} block />
                    </div>
                    <p className="text-[10px] text-tokyo-muted font-mono">{eq.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default PaperSidePanel;
