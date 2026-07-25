# Phase 3 Technical Documentation — Core Visualizations

## 1. Overview & Purpose
Phase 3 delivered the **Core Interactive Visualization Features (Features 1, 2, 3, 4, and 8)** of **"Attention, Visualized"**. Leveraging the pure TypeScript math engine built in Phase 2, Phase 3 created interactive, steppable React components that render every key paper mechanism with numerical heatmaps, sinusoid vector plots, and pausable step-by-step animation controls.

---

## 2. Shared UI Primitives & Stepper Architecture

### 1. Pausable Stepper Hook (`lib/hooks/useStepper.ts`) & Controls (`components/ui/StepperControls.tsx`)
- **How it works:** `useStepper` maintains `currentStep`, `isPlaying`, `speedMs`, and playback state controls (`stepForward`, `stepBackward`, `goToStep`, `togglePlay`, `reset`). `StepperControls.tsx` renders Play/Pause, Step Forward/Back, Reset, active step labels, and progress indicator dots.
- **Why this happens:** **Rule 3 of RULES.md & AGENTS.md** strictly forbids autoplay-only animations. Learners must be able to pause playback at any intermediate tensor step to inspect raw numbers.

### 2. Matrix Heatmap (`components/ui/MatrixHeatmap.tsx`)
- **How it works:** Renders $m \times n$ numerical matrices with Tokyo Night color intensity shading ($0.0 \dots 1.0$ opacity), row/column headers, precision formatting, and hover states.
- **Color Schemes:**
  - `purple`: Queries ($Q$) and Softmax Attention Weights
  - `blue`: Keys ($K$) and Linear Projections
  - `cyan`: Values ($V$) and Embedding Vectors
  - `orange`: Positional Encodings and Scaling Factors
  - `green`: Attention Outputs and Concat matrices
- **Accessibility:** Color is never the sole indicator; every cell displays numeric values formatted to fixed precision for colorblind accessibility (Rule 7).

---

## 3. Core Visualization Features

### Feature 1: Tokenizer & Embedding Playground (`components/viz/TokenizerPlayground.tsx`)
- **Mechanics:** User inputs custom text or selects presets ("Attention Is All You Need", "Je suis étudiant"). The tokenizer splits text into tokens and vocabulary IDs, and `EmbeddingTable` generates $d_{\text{model}}$ feature embeddings scaled by $\sqrt{d_{\text{model}}}$ per paper Section 3.4. Includes a 2D scatter plot visualizing tokens in embedding subspace.

### Feature 2: Positional Encoding Visualizer (`components/viz/PositionalEncodingViz.tsx`)
- **Mechanics:** Slider-driven controls for sequence length ($n$), embedding dimension ($d_{\text{model}}$), and position ($pos$). Renders an SVG plot of the sine ($\sin$) and cosine ($\cos$) curves (Eq. 1) alongside a full $PE$ matrix heatmap. Demonstrates how alternating frequencies form relative position transformations.

### Feature 3: Scaled Dot-Product Attention Step-Through (`components/viz/ScaledAttentionViz.tsx`) — *Centerpiece*
- **Mechanics:** Steppable animation walking through 6 distinct stages:
  1. Input $Q, K, V$ Matrices
  2. Raw Similarity Scores $Q \cdot K^T$
  3. Scaling by $1 / \sqrt{d_k}$
  4. Causal Masking (Decoder Toggle)
  5. Softmax Attention Weights (rows sum to $1.00$)
  6. Value Weighting & Output Matrix ($A \cdot V$)
- **Token Inspection:** Hovering over a token highlights its specific attention distribution across all sequence tokens.

### Feature 4: Multi-Head Attention View (`components/viz/MultiHeadViz.tsx`)
- **Mechanics:** Interactive head count toggle ($h \in \{1, 2, 4, 8\}$). Splits $d_{\text{model}} = 8$ into $h$ parallel head projections ($d_k = d_{\text{model}} / h$). Displays side-by-side per-head attention heatmaps and final output concatenation ($\text{Concat}(\text{head}_1, \dots, \text{head}_h)$).

### Feature 8: Computational Complexity Table (`components/viz/ComplexityTableViz.tsx`)
- **Mechanics:** Interactive sliders for sequence length $n$ ($4 \dots 256$) and dimension $d$ ($64 \dots 1024$). Computes live operation counts comparing:
  - **Self-Attention:** $O(n^2 \cdot d)$ complexity, $O(1)$ sequential steps, $O(1)$ max path length.
  - **Recurrent (RNN):** $O(n \cdot d^2)$ complexity, $O(n)$ sequential steps, $O(n)$ max path length.
  - **Convolutional (CNN):** $O(k \cdot n \cdot d^2)$ complexity, $O(1)$ sequential steps, $O(\log_k(n))$ max path length.

---

## 4. File Inventory for Phase 3

| File Path | Purpose |
|---|---|
| [`lib/hooks/useStepper.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/lib/hooks/useStepper.ts) | Custom React hook for steppable animation state management. |
| [`components/ui/StepperControls.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/ui/StepperControls.tsx) | Reusable steppable playback control bar (Play, Pause, Step, Reset, Progress Dots). |
| [`components/ui/MatrixHeatmap.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/ui/MatrixHeatmap.tsx) | Reusable matrix heatmap component with Tokyo Night color schemes and cell highlighting. |
| [`components/viz/TokenizerPlayground.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/viz/TokenizerPlayground.tsx) | Feature 1: Tokenizer and embedding playground with 2D scatter view. |
| [`components/viz/PositionalEncodingViz.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/viz/PositionalEncodingViz.tsx) | Feature 2: Positional Encoding sinusoid curves and matrix heatmap. |
| [`components/viz/ScaledAttentionViz.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/viz/ScaledAttentionViz.tsx) | Feature 3: Scaled Dot-Product Attention step-through centerpiece. |
| [`components/viz/MultiHeadViz.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/viz/MultiHeadViz.tsx) | Feature 4: Multi-Head Attention head toggle and per-head heatmaps. |
| [`components/viz/ComplexityTableViz.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/viz/ComplexityTableViz.tsx) | Feature 8: Interactive computational complexity comparison table. |
| [`app/page.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/app/page.tsx) | Main page updated with navigation tabs to switch between all visualization features. |

---

## 5. Verification
- `npm run test` verified passing (16/16 unit tests).
- `npm run build` verified compiling cleanly with static export (Route `/` size: 15.4 kB).
