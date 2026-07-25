# RULES.md — Project Guardrails

These are the non-negotiable rules for this project, for both human and AI
contributors. AGENTS.md covers agent-specific workflow; this file is the shorter,
canonical "what must always be true" reference.

## 1. Copyright & Source Fidelity
- Never embed screenshots or direct image copies of the paper's figures. All
  diagrams are original recreations.
- Never copy more than a short phrase of the paper's prose verbatim anywhere in
  shipped content. All explanations are paraphrased, in this project's own voice.
- Equations may be re-typeset (via KaTeX) since mathematical notation itself isn't
  copyrightable expression — but surrounding explanatory text must still be original.
- Always cite the paper clearly (title, authors, arXiv ID, link) in a visible
  "Source" section/footer.

## 2. Mathematical Correctness
- Every formula implemented (scaled dot-product attention, sinusoidal positional
  encoding, multi-head split/concat, FFN, softmax) must match the paper's equations
  exactly. No approximations "close enough for visualization" — approximation
  defeats the pedagogical purpose.
- Every math function must have a unit test with a hand-computable small example.
- If a visualization simplifies for clarity (e.g. showing only 2D projections of
  high-dim embeddings via PCA), the simplification must be labeled in the UI so
  users don't mistake it for the raw computation.

## 3. Pedagogical Integrity
- Every interactive control must map to something the paper actually describes —
  no invented mechanics that aren't in the source material.
- Prefer step-through/pausable animations over autoplay-only — the user must be
  able to stop and inspect any intermediate value.
- Where a concept has a well-known analogy (e.g. attention as a soft key-value
  lookup), analogies are welcome in prose but must be clearly separated from the
  literal math, not conflated with it.

## 4. Design Consistency
- Dark terminal / Tokyo Night theme throughout; no light-mode-only components.
- Retro terminal / pixel-art accents are welcome but must not compromise
  readability of dense numeric content (matrices, equations).
- Monospace for anything numeric/code; humanist sans for prose. Don't mix
  arbitrarily per-component.

## 5. Performance
- Full client-side forward pass for a toy input (≤16 tokens) must compute and
  render in under 1 second on a mid-range device.
- Heavy Canvas/WebGL visualizations must degrade gracefully (simplified/static
  fallback) on low-end mobile rather than freezing the page.

## 6. Scope Discipline
- v1 ships the 9 features in PRD §6 — resist adding new ones mid-build. New ideas
  go into PRD §10 (Future Ideas) for later, not into the active implementation plan.
- If a phase in IMPLEMENTATION_PLAN.md is taking >2x its estimate, cut per the
  "Suggested cut-lines" section rather than pushing the whole timeline silently.

## 7. Accessibility
- All interactive controls (sliders, steppers, toggles) must be keyboard-operable.
- Color is never the only signal (e.g. attention-weight heatmaps need a secondary
  cue like opacity or a numeric label, not just hue, for colorblind accessibility).
- Sufficient contrast against the dark theme background for all text and controls.

## 8. Version Control Hygiene
- One feature/fix per commit.
- Math changes (`lib/math/*`) are never merged without an accompanying/updated test.
- No committed secrets, API keys, or `.env` files (this project shouldn't need any
  for v1 — flag it as a smell if a PR introduces one).
