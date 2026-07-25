# Attention, Visualized ⚡

An interactive, hands-on visual explainer for the Transformer architecture from *Attention Is All You Need* (Vaswani et al., 2017, arXiv:1706.03762).

Live site powered by **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS (Tokyo Night theme)**, **Framer Motion**, and **KaTeX**.

---

## 🌟 Key Features

1. **Full Forward Pass Integration Demo (`Feature 7`):** Live end-to-end forward pass execution: Source Input $\rightarrow$ Tokenization $\rightarrow$ Embedding $+ PE \rightarrow$ Encoder Stack ($N$ layers) $\rightarrow$ Decoder Stack (Cross-Attention & Causal Masking) $\rightarrow$ Softmax Token Probabilities.
2. **Scaled Dot-Product Attention Step-Through (`Feature 3 — Centerpiece`):** Pausable, steppable animation walking through $Q, K, V$ projections, raw similarity $QK^T$, scaling by $1/\sqrt{d_k}$, causal masking, softmax attention weights, and value output $A \cdot V$.
3. **Multi-Head Attention View (`Feature 4`):** Interactive head count toggle ($h \in \{1, 2, 4, 8\}$), per-head subspace projections ($d_k = d_{\text{model}} / h$), side-by-side per-head attention heatmaps, and final output concatenation.
4. **Encoder & Decoder Stack Animations (`Features 5 & 6`):** Animated data flow through $N=6$ stacked layers highlighting Self-Attention, Add & LayerNorm, Cross-Attention, and Feed-Forward Networks.
5. **Tokenizer & Embedding Playground (`Feature 1`):** Interactive text entry mapping words to token IDs, $\sqrt{d_{\text{model}}}$-scaled embedding matrices, and 2D vector space scatter views.
6. **Positional Encoding Visualizer (`Feature 2`):** Sine and cosine sinusoidal curves (Equation 1) and PE matrix heatmaps with position sliders.
7. **Computational Complexity Table (`Feature 8`):** Live sliders comparing Self-Attention ($O(n^2 \cdot d)$), Recurrent ($O(n \cdot d^2)$), and Convolutional ($O(k \cdot n \cdot d^2)$) operation counts and path lengths.
8. **Original Redrawn Architecture SVGs (`Feature 9`):** Hand-authored, themeable vector recreations for the Encoder-Decoder stack, Scaled Dot-Product Attention, and Multi-Head Attention.
9. **Collapsible Paper Reference Panel (`Feature 9`):** Paraphrased section summaries, key takeaways, and KaTeX-rendered equations synced to reading position.

---

## 📐 Mathematical Correctness & Pure TS Engine

All linear algebra (`matmul`, `transpose`, `softmax`, `applyMask`, `layerNorm`, `relu`), sinusoidal positional encodings, scaled attention, multi-head projections, and Transformer layers are implemented in a hand-rolled, pure TypeScript module in `lib/math/`.

- **Zero ML Framework Overhead:** Computes 100% in-browser in plain TypeScript (< 5ms execution time for 16 tokens).
- **Step-by-Step Tensor Export:** Exposes raw, scaled, masked, and softmax intermediate step matrices for step-through visual inspection.
- **Unit Tested:** 16 unit tests in `tests/mathEngine.test.ts` verify every math module against hand-computable examples.

---

## 🎨 Design System: Tokyo Night

Built with custom Tokyo Night color tokens:
- Background: `#1a1b26` (`tokyo-bg`)
- Surface: `#24283b` (`tokyo-surface`)
- Queries ($Q$) & Softmax: `#bb9af7` (`tokyo-purple`)
- Keys ($K$) & Projections: `#7aa2f7` (`tokyo-blue`)
- Values ($V$) & Embeddings: `#7dcfff` (`tokyo-cyan`)
- Outputs & Success States: `#9ece6a` (`tokyo-green`)
- Positional Encodings: `#ff9e64` (`tokyo-orange`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and `npm`

### Installation
```bash
git clone https://github.com/your-username/attention-visualized.git
cd attention-visualized
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Unit Tests
```bash
npm run test
```

### Static Production Build
```bash
npm run build
```
Compiles a static export bundle (`output: 'export'`) ready for Vercel or GitHub Pages deployment.

---

## 📜 Documentation Index

Detailed phase-by-phase technical documentation is available in the [`docs/`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs) directory:
- [`docs/PRD.md`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs/PRD.md) — Product Requirements & Feature Specs
- [`docs/IMPLEMENTATION_PLAN.md`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs/IMPLEMENTATION_PLAN.md) — Phased Build Plan
- [`docs/AGENTS.md`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs/AGENTS.md) — Project Working Rules & Directory Conventions
- [`docs/TECH_STACK.md`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs/TECH_STACK.md) — Tech Stack Decisions
- [`docs/RULES.md`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs/RULES.md) — Non-negotiable Project Guardrails
- [`docs/PHASE_0_DOCUMENTATION.md`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs/PHASE_0_DOCUMENTATION.md) — Setup & Design System Documentation
- [`docs/PHASE_1_DOCUMENTATION.md`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs/PHASE_1_DOCUMENTATION.md) — Content Model & Original SVGs Documentation
- [`docs/PHASE_2_DOCUMENTATION.md`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs/PHASE_2_DOCUMENTATION.md) — Pure TS Math Engine Documentation
- [`docs/PHASE_3_DOCUMENTATION.md`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs/PHASE_3_DOCUMENTATION.md) — Core Visualizations & Stepper Architecture Documentation
- [`docs/PHASE_4_DOCUMENTATION.md`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs/PHASE_4_DOCUMENTATION.md) — Architecture-Level Visualizations Documentation
- [`docs/PHASE_5_DOCUMENTATION.md`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs/PHASE_5_DOCUMENTATION.md) — Scrollytelling & Side Panel Documentation
- [`docs/PHASE_6_DOCUMENTATION.md`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs/PHASE_6_DOCUMENTATION.md) — Polish, Responsive & Accessibility Documentation
- [`docs/PHASE_7_DOCUMENTATION.md`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/docs/PHASE_7_DOCUMENTATION.md) — Release & Ship Documentation

---

## 📄 Citation

```bibtex
@inproceedings{vaswani2017attention,
  title     = {Attention is all you need},
  author    = {Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N and Kaiser, {\L}ukasz and Polosukhin, Illia},
  booktitle = {Advances in neural information processing systems},
  pages     = {5998--6008},
  year      = {2017}
}
```
