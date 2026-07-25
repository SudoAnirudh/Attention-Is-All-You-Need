# React Components (`components/`)

The `components/` directory contains all user interface primitives and interactive visualization components for **Attention, Visualized**.

---

## 📁 Directory Structure

```
components/
├── ui/              # Shared UI primitives (heatmaps, steppers, LaTeX blocks, side panel)
└── viz/             # Individual interactive visualization components (Features 1–8)
```

---

## 🎨 UI Primitives (`components/ui/`)

| File | Component | Description |
|---|---|---|
| [`MatrixHeatmap.tsx`](./ui/MatrixHeatmap.tsx) | `MatrixHeatmap` | Numerical matrix renderer with Tokyo Night color intensity shading, fixed-precision numbers in JetBrains Mono, and touch inspection. |
| [`StepperControls.tsx`](./ui/StepperControls.tsx) | `StepperControls` | Reusable playback control bar (Play/Pause, Step Forward/Backward, Reset, Progress Dots) with 44px touch targets and Arrow/Spacebar keyboard navigation. |
| [`KatexBlock.tsx`](./ui/KatexBlock.tsx) | `KatexBlock` | Client-side, SSR-safe LaTeX equation renderer dynamically importing KaTeX. |
| [`PaperSidePanel.tsx`](./ui/PaperSidePanel.tsx) | `PaperSidePanel` | Collapsible paper reference drawer displaying paraphrased section summaries, key insights, and KaTeX equations. |
| [`StickyToc.tsx`](./ui/StickyToc.tsx) | `StickyToc` | Sticky mini-TOC navigation bar anchored to the top of the viewport. |
| [`DiagramViewer.tsx`](./ui/DiagramViewer.tsx) | `DiagramViewer` | Tabbed interactive vector SVG viewer for original architecture diagrams. |

---

## 🚀 Interactive Visualizations (`components/viz/`)

| File | Component | Feature & Scope |
|---|---|---|
| [`TokenizerPlayground.tsx`](./viz/TokenizerPlayground.tsx) | `TokenizerPlayground` | **Feature 1**: Tokenizer & Embedding playground with 2D scatter view. |
| [`PositionalEncodingViz.tsx`](./viz/PositionalEncodingViz.tsx) | `PositionalEncodingViz` | **Feature 2**: Positional Encoding sinusoid curves and matrix heatmap. |
| [`ScaledAttentionViz.tsx`](./viz/ScaledAttentionViz.tsx) | `ScaledAttentionViz` | **Feature 3**: Scaled Dot-Product Attention step-through centerpiece. |
| [`MultiHeadViz.tsx`](./viz/MultiHeadViz.tsx) | `MultiHeadViz` | **Feature 4**: Multi-Head Attention head count toggle and per-head heatmaps. |
| [`EncoderStackViz.tsx`](./viz/EncoderStackViz.tsx) | `EncoderStackViz` | **Feature 5**: Data flow animation through $N=6$ stacked Encoder layers. |
| [`DecoderStackViz.tsx`](./viz/DecoderStackViz.tsx) | `DecoderStackViz` | **Feature 6**: Decoder stack animation with Causal Masking & Cross-Attention. |
| [`FullForwardPassViz.tsx`](./viz/FullForwardPassViz.tsx) | `FullForwardPassViz` | **Feature 7**: Sub-5ms End-to-End Forward Pass integration demo. |
| [`ComplexityTableViz.tsx`](./viz/ComplexityTableViz.tsx) | `ComplexityTableViz` | **Feature 8**: Interactive computational complexity comparison table. |
| [`ScrollytellingLayout.tsx`](./viz/ScrollytellingLayout.tsx) | `ScrollytellingLayout` | Scrollytelling wrapper unifying navigation, visualizers, and paper reference side panel. |
