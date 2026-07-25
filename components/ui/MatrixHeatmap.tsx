'use client';

import React, { useState } from 'react';
import { Matrix } from '@/lib/math/matrix';

interface MatrixHeatmapProps {
  matrix: Matrix;
  rowLabels?: string[];
  colLabels?: string[];
  title?: string;
  subtitle?: string;
  colorScheme?: 'purple' | 'blue' | 'cyan' | 'green' | 'orange';
  precision?: number;
  highlightCell?: { row: number; col: number } | null;
  onCellHover?: (row: number, col: number) => void;
  className?: string;
}

export const MatrixHeatmap: React.FC<MatrixHeatmapProps> = ({
  matrix,
  rowLabels,
  colLabels,
  title,
  subtitle,
  colorScheme = 'purple',
  precision = 2,
  highlightCell,
  onCellHover,
  className = '',
}) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  if (!matrix || matrix.length === 0 || !matrix[0]) {
    return <div className="text-tokyo-muted text-xs font-mono">Empty Matrix</div>;
  }

  const allValues = matrix.flat();
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;

  const getColor = (val: number, opacity: number) => {
    switch (colorScheme) {
      case 'blue':
        return `rgba(122, 162, 247, ${opacity})`;
      case 'cyan':
        return `rgba(125, 207, 255, ${opacity})`;
      case 'green':
        return `rgba(158, 206, 106, ${opacity})`;
      case 'orange':
        return `rgba(255, 158, 100, ${opacity})`;
      case 'purple':
      default:
        return `rgba(187, 154, 247, ${opacity})`;
    }
  };

  return (
    <div className={`space-y-2 bg-tokyo-surface border border-tokyo-border rounded-xl p-4 shadow-lg ${className}`}>
      {(title || subtitle) && (
        <div className="border-b border-tokyo-border pb-2">
          {title && <h4 className="text-sm font-bold text-tokyo-text font-mono">{title}</h4>}
          {subtitle && <p className="text-xs text-tokyo-muted font-mono">{subtitle}</p>}
        </div>
      )}

      {/* Horizontal scrolling wrapper for mobile responsiveness */}
      <div className="overflow-x-auto no-scrollbar">
        <table
          aria-label={title || 'Numerical Matrix Heatmap'}
          className="border-collapse text-center text-xs font-mono mx-auto min-w-full"
        >
          {colLabels && (
            <thead>
              <tr>
                {rowLabels && <th scope="col" className="p-1.5 text-tokyo-muted font-normal text-[10px]"></th>}
                {colLabels.map((lbl, j) => (
                  <th
                    key={j}
                    scope="col"
                    className={`p-1.5 font-bold transition-colors ${
                      hoveredCol === j ? 'text-tokyo-cyan bg-tokyo-bg-dark rounded' : 'text-tokyo-subtext'
                    }`}
                  >
                    {lbl}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                {rowLabels && (
                  <th
                    scope="row"
                    className={`p-1.5 font-bold text-left transition-colors ${
                      hoveredRow === i ? 'text-tokyo-purple bg-tokyo-bg-dark rounded' : 'text-tokyo-subtext'
                    }`}
                  >
                    {rowLabels[i] || `r${i}`}
                  </th>
                )}

                {row.map((val, j) => {
                  const norm = (val - minVal) / range;
                  const opacity = Math.max(0.1, Math.min(1.0, norm));
                  const isHighlighted =
                    (highlightCell && highlightCell.row === i && highlightCell.col === j) ||
                    (hoveredRow === i && hoveredCol === j);

                  return (
                    <td
                      key={j}
                      tabIndex={0}
                      aria-label={`Row ${rowLabels ? rowLabels[i] : i}, Column ${
                        colLabels ? colLabels[j] : j
                      }, Value ${val.toFixed(precision)}`}
                      onMouseEnter={() => {
                        setHoveredRow(i);
                        setHoveredCol(j);
                        if (onCellHover) onCellHover(i, j);
                      }}
                      onMouseLeave={() => {
                        setHoveredRow(null);
                        setHoveredCol(null);
                      }}
                      onTouchStart={() => {
                        setHoveredRow(i);
                        setHoveredCol(j);
                        if (onCellHover) onCellHover(i, j);
                      }}
                      style={{
                        backgroundColor: getColor(val, opacity * 0.4),
                        borderColor: isHighlighted ? 'rgba(125, 207, 255, 0.8)' : '#292e42',
                      }}
                      className={`p-2 border border-tokyo-border transition-all duration-150 cursor-pointer rounded-sm ${
                        isHighlighted
                          ? 'ring-2 ring-tokyo-cyan shadow-md scale-105 z-10 text-tokyo-bg font-bold bg-tokyo-cyan'
                          : 'text-tokyo-text'
                      }`}
                      title={`Row: ${rowLabels ? rowLabels[i] : i}, Col: ${
                        colLabels ? colLabels[j] : j
                      }, Value: ${val.toFixed(4)}`}
                    >
                      {val.toFixed(precision)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatrixHeatmap;
