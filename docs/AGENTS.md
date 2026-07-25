# AGENTS.md — Instructions for AI Coding Agents

This file governs how any AI coding agent (Claude Code, Cursor, Copilot Workspace,Antigravity
etc.) should work in this repository. Read this before making changes45.

## Project Context
This is an educational, interactive explainer for the paper "Attention Is All You
Need" (Vaswani et al., 2017). It is NOT a production ML system — it's a teaching
website. Correctness of the *math* and clarity of the *visualization* matter more
than raw performance or feature count.

## Ground Rules

1. **Math correctness is non-negotiable.** Every attention/embedding/positional-encoding
   computation must match the formulas in the paper exactly (scaled dot-product
   attention, Eq. 1 sinusoidal PE, multi-head split). When implementing or modifying
   `lib/math/*`, always add or update a unit test with a hand-verifiable small example
   (e.g. 2 tokens, d_model=4) alongside the change. Do not merge math changes without tests.

2. **Never copy the paper's figures or text verbatim.** All diagrams must be
   original SVG/Canvas recreations. All explanatory text must be paraphrased in
   the project's own voice, not copy-pasted from the PDF. If you extract text from
   the PDF for reference, store it only in a non-shipped `/research/` note, never
   in a component or content file that renders to the user.

3. **Every visualization must be steppable, not just autoplay.** Users need to
   pause and inspect intermediate values. When building an animation, always
   expose play/pause/step controls via the shared `useStepper` hook (or equivalent)
   rather than a bare CSS/Framer Motion autoplay.

4. **Respect the design system.** Dark terminal / Tokyo Night theme. Use the
   Tailwind tokens defined in `tailwind.config.ts` — do not hardcode hex colors in
   components. Monospace font for all numeric/matrix content; the humanist sans
   only for prose.

5. **Keep it client-side.** No backend/API calls for the core computations — all
   math runs in-browser (this is a static-hosting project). Do not introduce a
   server dependency for v1 features without discussing it first.

6. **Small, reviewable commits.** One feature or one bugfix per commit. Don't bundle
   unrelated refactors with feature work.

7. **Test before claiming done.** For any change to `lib/math/*`, run the unit
   test suite. For any UI change, describe (in the PR/commit message) what was
   manually verified (e.g. "verified attention heatmap updates correctly when
   toggling head count 1→4→8").

## Directory Conventions
- `lib/math/` — pure functions only, no React, no side effects. Fully unit-tested.
- `components/viz/` — one component per visualization feature (see PRD §6, features 1–9).
- `components/ui/` — shared primitives (sliders, steppers, matrix-heatmap renderer).
- `content/` — structured paraphrased section content + LaTeX equation strings.
- `content/figures/` — original SVGs for the 3 core diagrams.
- `research/` — local-only notes extracted while reading the source PDF; never imported
  into shipped code; should be gitignored or clearly marked non-shipped.

## What NOT to do
- Don't add a backend/database for v1 — this is a static site.
- Don't reproduce paper figures via screenshot or image embed — redraw natively.
- Don't quote more than a short phrase of the paper's prose anywhere in shipped content.
- Don't skip unit tests on math changes, even for "obviously correct" refactors.
- Don't introduce new dependencies for things already covered by the chosen stack
  (see TECH_STACK.md) without flagging it — keep the bundle lean.
- Don't build autoplay-only animations with no pause/step control.

## Definition of Done (per feature)
A visualization feature (per PRD §6) is done when:
- [ ] Underlying math has unit tests passing.
- [ ] Component is steppable (play/pause/step).
- [ ] Works on mobile viewport (linearized layout, no broken overflow).
- [ ] Matches Tokyo Night theme tokens.
- [ ] Paraphrased reference text (not paper-verbatim) is wired into the side panel.
