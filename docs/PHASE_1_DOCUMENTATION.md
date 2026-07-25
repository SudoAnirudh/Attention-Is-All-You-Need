# Phase 1 Technical Documentation — Content Structuring & Original Diagrams

## 1. Overview & Purpose
Phase 1 focused on extracting, structuring, and paraphrasing the core concepts of the paper *Attention Is All You Need* (Vaswani et al., 2017), alongside creating original SVG recreations for the 3 canonical architecture diagrams. The primary objective was to establish pedagogical clarity without violating copyright rules or using low-quality bitmap paper screenshots.

---

## 2. Structured Content Model (`content/paperContent.ts`)

### Design & Schema
The paper content model is structured as a typed TypeScript array `PAPER_SECTIONS`:
```typescript
export interface PaperEquation {
  id: string;
  name: string;
  latex: string;
  description: string;
}

export interface PaperSection {
  id: string;
  title: string;
  paperSection: string;
  summary: string;
  keyTakeaway: string;
  equations: PaperEquation[];
  figureRef?: 'encoder-decoder' | 'scaled-dot-product' | 'multi-head';
}
```

### Why Paraphrasing & Custom LaTeX Strings
- **How it works:** Each section of the paper (Abstract, 1. Intro, 2. Background, 3. Architecture, 3.2.1 Scaled Dot-Product, 3.2.2 Multi-Head, 3.5 Positional Encoding, 4. Complexity, 5-6. Training/Results) is paraphrased into distinct `summary` and `keyTakeaway` fields. Equations are represented as raw LaTeX string constants rendered via KaTeX.
- **Why this happens:**
  1. **Copyright Compliance:** Copying verbatim paragraphs or figures from published papers creates copyright smells. Paraphrasing explains the mechanics in an original voice.
  2. **Pedagogical Efficiency:** Original paper prose is dense and academic. Paraphrased summaries focus on the *intuition* (e.g. why dot products scale down by $\sqrt{d_k}$, why sinusoidal functions allow relative positional shifts).

---

## 3. Original Vector Diagrams (`content/figures/*.svg`)

Instead of embedding paper screenshots, Phase 1 hand-authored 3 resolution-independent SVG diagrams using Tokyo Night gradients and modern SVG geometry:

### 1. Transformer Architecture (`encoder_decoder_stack.svg`)
- **Visual Mechanics:** Highlights the dual-stack design ($N=6$ Encoder layers on left, $N=6$ Decoder layers on right). Visualizes Input/Output Embeddings, Positional Encoding additions ($+$), Multi-Head Attention, Masked Multi-Head Attention, Cross-Attention connecting Encoder outputs to Decoder inputs, Feed-Forward networks, and Add & Norm residual connections.

### 2. Scaled Dot-Product Attention (`scaled_dot_product_attention.svg`)
- **Visual Mechanics:** Illustrates the step-by-step tensor flow:
  $$\text{Input } Q, K, V \longrightarrow \text{MatMul}(Q, K^T) \longrightarrow \text{Scale }\frac{1}{\sqrt{d_k}} \longrightarrow \text{Optional Mask} \longrightarrow \text{Softmax} \longrightarrow \text{MatMul}(\cdot, V)$$

### 3. Multi-Head Attention (`multi_head_attention.svg`)
- **Visual Mechanics:** Visualizes $Q, K, V$ splitting into $h$ parallel linear projections ($W_i^Q, W_i^K, W_i^V$), passing through $h$ parallel Scaled Dot-Product Attention heads, concatenating, and passing through a final linear projection $W^O$.

---

## 4. Interactive Diagram Viewer (`components/ui/DiagramViewer.tsx`)
- **How it works:** React component providing interactive tabbed selection (`Encoder-Decoder`, `Scaled Dot-Product`, `Multi-Head`). It dynamically loads the corresponding vector graphic from `/content/figures/*.svg` inside a dark, scrollable viewport card.
- **Why this happens:** Allows readers to inspect the architecture diagrams at any point while reading paper sections, maintaining context between the mathematical formulas and visual structural layouts.

---

## 5. File Inventory for Phase 1

| File Path | Description & Purpose |
|---|---|
| [`content/paperContent.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/content/paperContent.ts) | Structured paraphrased section text, key takeaways, and LaTeX equations. |
| [`content/figures/encoder_decoder_stack.svg`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/content/figures/encoder_decoder_stack.svg) | Original redrawn SVG for the full Transformer Encoder-Decoder architecture. |
| [`content/figures/scaled_dot_product_attention.svg`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/content/figures/scaled_dot_product_attention.svg) | Original redrawn SVG for Scaled Dot-Product Attention. |
| [`content/figures/multi_head_attention.svg`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/content/figures/multi_head_attention.svg) | Original redrawn SVG for Multi-Head Attention. |
| [`components/ui/DiagramViewer.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/ui/DiagramViewer.tsx) | Tabbed interactive architecture SVG viewer component. |
| [`app/page.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/app/page.tsx) | Updated main view integrating section navigation, KaTeX equations, and diagram viewer. |

---

## 6. Verification
- Static production build verified (`npm run build` compiled successfully).
- All 3 SVGs tested rendering cleanly in modern viewports.
