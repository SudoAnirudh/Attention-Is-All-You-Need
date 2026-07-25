# PRD — "Attention, Visualized": An Interactive Explainer for *Attention Is All You Need*

## 1. Summary
A single-page, scroll-driven website that teaches the Transformer architecture from
Vaswani et al., 2017 ("Attention Is All You Need", arXiv:1706.03762) by pairing every
section of the paper with a live, interactive visualization. The goal is not to
reproduce the paper as text — it's to make the mechanics (embeddings → positional
encoding → scaled dot-product attention → multi-head attention → encoder/decoder
stacks → masking → training) *tangible* by letting the user manipulate real numbers
and watch tensors move.

## 2. Problem Statement
The paper is dense and notation-heavy. Most explainer blogs (Jay Alammar's "Illustrated
Transformer" etc.) are static images. There's no single site where a learner can:
- feed in their own toy sentence,
- watch tokenization → embedding → attention scores compute step by step,
- toggle number of heads and see how the split changes results,
- see WHY masking is needed in the decoder,
without reading raw PyTorch.

## 3. Goals / Non-Goals

**Goals**
- Explain all 7 core mechanisms of the paper interactively (see §6).
- Make attention weights visually explorable (hover a token, see what it attends to).
- Let the user adjust hyperparameters (d_model, num_heads, seq_len) within safe
  bounds and see live recomputation, entirely client-side.
- Be usable as a personal portfolio piece — demonstrates ML understanding + frontend skill.
- Ship as a static site (no backend needed for v1) deployable on Vercel/GitHub Pages.

**Non-Goals**
- Not a full training playground (no gradient descent / backprop visualization in v1).
- Not a paper-reading PDF viewer — the PDF is a reference, not the UI.
- Not trying to reproduce BLEU benchmark reproduction from the paper.
- No user accounts, no backend persistence in v1.

## 4. Target User
Primary: the site's own builder (Anirudh) and other AI/ML students/fresher engineers
who've read about attention but haven't built the intuition. Secondary: recruiters /
portfolio reviewers assessing both ML depth and frontend craft.

## 5. Source Material Ingestion
- Parse `1706.03762.pdf` into structured sections (Abstract, Intro, Background,
  Model Architecture, Why Self-Attention, Training, Results, Conclusion).
- Extract the 3 canonical figures (encoder-decoder diagram, scaled dot-product
  attention diagram, multi-head attention diagram) as reference — redraw them
  natively in SVG/Canvas rather than embedding paper screenshots (cleaner, themeable,
  and avoids copyright reproduction of the original figures).
- Extract key equations (scaled dot-product attention, positional encoding sinusoid
  formula, multi-head projection, FFN, label smoothing) — re-typeset with KaTeX.

## 6. Core Feature List (mapped to paper sections)

| # | Feature | Paper Section | Interaction |
|---|---|---|---|
| 1 | Tokenizer + Embedding Playground | 3.1 | Type a sentence → see token IDs → embedding vectors (reduced to 2D via PCA for viz) |
| 2 | Positional Encoding Visualizer | 3.5 | Slider for position & dimension → live sinusoid curves, heatmap of PE matrix |
| 3 | Scaled Dot-Product Attention | 3.2.1 | Step-through animation: Q·Kᵀ → scale → mask (optional) → softmax → ×V, with matrix values shown at each step |
| 4 | Multi-Head Attention | 3.2.2 | Toggle head count (1/2/4/8), see Q/K/V split per head, per-head attention heatmaps side by side |
| 5 | Encoder Stack | 3.1, Fig 1 (left) | Animated data flow through N=6 stacked layers, residual + LayerNorm highlighted |
| 6 | Decoder Stack + Masking | 3.1, Fig 1 (right) | Same as above + masked self-attention demo showing which future tokens are blocked, with causal mask matrix rendered |
| 7 | Full Forward Pass Demo | 3 (whole) | End-to-end: input sentence → output token probabilities, all prior visualizations linked in one scrollytelling flow |
| 8 | Complexity/Why-Self-Attention Table | Table 1 | Interactive table: adjust sequence length n and dimension d, see live complexity numbers for self-attn vs RNN vs CNN |
| 9 | "Read the paper alongside" panel | all | Collapsible original-text summaries (paraphrased, not reproduced verbatim) synced to scroll position |

## 7. UX / Design Direction
- Dark terminal / Tokyo Night theme, consistent with existing personal-site aesthetic.
- Scrollytelling layout: left/center = narrative + viz, right (or collapsible) = "paper
  reference" panel with paraphrased section text and jump links.
- Monospace type for numbers/matrices, a secondary humanist sans for prose.
- Animations should be steppable (play/pause/step-forward) — not just autoplay, so
  the user can pause and inspect matrix values.
- Mobile: linearize to single column, disable heavy WebGL/Canvas animations in favor
  of static frame-by-frame steps if performance requires it.

## 8. Success Metrics (personal-project framing)
- All 9 features functional and deployed.
- Page loads and computes a full forward pass client-side in < 1s for toy inputs (≤16 tokens).
- Positive qualitative signal: someone unfamiliar with attention can explain scaled
  dot-product attention after 10 minutes on the site.
- Usable as a linked project in resume/portfolio.

## 9. Risks
- **Scope creep**: 9 interactive features is a lot — implementation plan phases this.
- **Math-in-JS correctness**: matrix ops must exactly match the paper's formulas;
  needs unit tests against known small examples.
- **Copyright**: do not embed paper screenshots/figures directly — redraw diagrams
  natively (see §5).
- **Performance on mobile**: WebGL/Canvas-heavy visualizations may lag on low-end phones.

## 10. Out of Scope for v1 (Future Ideas)
- Real pretrained model weights (e.g., a tiny distilled transformer) instead of
  toy/random values.
- Backprop/training-loop visualization.
- Multi-paper mode (extend the same engine to other architectures, e.g. BERT, ViT).
