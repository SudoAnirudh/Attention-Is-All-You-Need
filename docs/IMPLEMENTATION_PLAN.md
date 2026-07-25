# Implementation Plan — "Attention, Visualized"

Phased so each milestone is independently shippable/demoable. Estimates assume
solo, part-time work (evenings/weekends).

## Phase 0 — Setup (0.5–1 day)
- [ ] Init Next.js (App Router) + TypeScript + Tailwind project.
- [ ] Set up repo structure per TECH_STACK.md.
- [ ] Add KaTeX for equation rendering, Framer Motion for animations.
- [ ] Set up dark Tokyo Night theme tokens (colors, fonts) in Tailwind config.
- [ ] Deploy an empty shell to Vercel to confirm CI/CD pipeline works.

## Phase 1 — Content Extraction & Structuring (1–2 days)
- [ ] Parse the arXiv PDF (via `pdf-parse` or manual transcription) into a
      structured JSON/MDX content model: one entry per section with paraphrased
      summary text, key equations (LaTeX strings), and figure references.
- [ ] Write paraphrased (never verbatim-copied) summaries for each paper section.
- [ ] Re-derive the 3 core diagrams as your own SVGs (encoder-decoder stack,
      scaled dot-product attention, multi-head attention) — do NOT trace/copy the
      original figures pixel-for-pixel; redraw from the described architecture.
- [ ] Store equations as KaTeX-renderable strings in the content model.

## Phase 2 — Math Engine (2–3 days) — the core, do this before any UI polish
- [ ] Implement a small linear-algebra module (or use `mathjs`/`ndarray`) supporting:
      matmul, transpose, softmax, scaling, masking.
- [ ] Implement tokenizer (simple whitespace/BPE-lite tokenizer for toy sentences).
- [ ] Implement embedding lookup with a small random (seeded) embedding table.
- [ ] Implement sinusoidal positional encoding exactly per Eq. 1 in the paper.
- [ ] Implement scaled dot-product attention function, returning intermediate
      tensors at each step (QKᵀ, scaled, masked, softmax, output) — not just the
      final result, since the UI needs to show each step.
- [ ] Implement multi-head split/concat logic.
- [ ] Implement a minimal encoder layer (self-attn + FFN + residual + LayerNorm)
      and decoder layer (masked self-attn + cross-attn + FFN).
- [ ] **Unit test everything** against hand-computed small examples (e.g. 2 tokens,
      d_model=4) before wiring to UI. This is the highest-risk-of-bugs layer.

## Phase 3 — Core Visualizations (3–5 days)
Build in this order — each depends on the math engine, not on each other:
- [ ] Feature 1: Tokenizer + Embedding playground (text input → token/embedding table)
- [ ] Feature 2: Positional Encoding visualizer (slider-driven sinusoid + heatmap)
- [ ] Feature 3: Scaled Dot-Product Attention step-through (the centerpiece — invest
      the most polish here)
- [ ] Feature 4: Multi-Head Attention (head-count toggle, per-head heatmaps)
- [ ] Feature 8: Complexity comparison table (self-attn vs RNN vs CNN, live sliders)

## Phase 4 — Architecture-Level Visualizations (3–4 days)
- [ ] Feature 5: Encoder stack animation (data flow through N layers)
- [ ] Feature 6: Decoder stack + causal masking demo
- [ ] Feature 7: End-to-end forward pass, linking all previous vizzes into one
      scrollytelling sequence (this is integration work — wire existing components
      into a shared state/context rather than rebuilding)

## Phase 5 — Scrollytelling & Paper-Reference Panel (2–3 days)
- [ ] Implement scroll-driven section transitions (e.g. via `framer-motion`'s
      `useScroll` or Intersection Observer).
- [ ] Build collapsible "paper reference" side panel synced to scroll position.
- [ ] Add jump-to-section navigation (sticky mini-TOC).

## Phase 6 — Polish, Responsive, Perf (2–3 days)
- [ ] Mobile layout pass — linearize panels, verify touch interactions for
      sliders/steppers.
- [ ] Perf pass: memoize matrix computations, lazy-load heavy Canvas/WebGL sections,
      confirm forward pass computes in <1s for ≤16 tokens.
- [ ] Accessibility pass: keyboard nav for steppers, alt text/ARIA for visualizations,
      color contrast check against Tokyo Night palette.
- [ ] Cross-browser check (Chrome/Firefox/Safari, mobile Safari especially for
      Canvas quirks).

## Phase 7 — Ship (1 day)
- [ ] Final deploy to Vercel with custom domain (if desired).
- [ ] Write README with architecture overview + screenshots.
- [ ] Add to portfolio site as a linked project.
- [ ] Optional: write a short companion blog post/thread walking through what was learned.

## Total estimate: ~15–22 working days part-time (~3–4 weeks calendar time)

## Suggested cut-lines if time-constrained
1. First cut if squeezed: drop Feature 8 (complexity table) — nice-to-have, lowest
   teaching value.
2. Second cut: reduce Feature 7 (full forward pass) to a static diagram with
   annotations instead of full scrollytelling integration.
3. Never cut: Feature 3 (scaled dot-product attention step-through) — it's the
   core pedagogical payload of the whole site.
