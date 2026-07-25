# Tech Stack — "Attention, Visualized"

## Core Framework
- **Next.js 14+ (App Router), TypeScript** — static export friendly (`output: 'export'`
  if pure client-side is confirmed), good DX, matches your existing portfolio-site stack.
- **React 18** — component model fits the "one component per visualization" structure.

## Styling / Design System
- **Tailwind CSS** — utility-first, fast to theme.
- Custom **Tokyo Night** color tokens in `tailwind.config.ts` (background, surface,
  accent purple/blue/cyan, terminal green for success states).
- **JetBrains Mono / Fira Code** (or similar) for numeric/matrix/code content.
- **Inter / a humanist sans** for prose.

## Math / Computation
- **mathjs** or a small hand-rolled `lib/math` module — for matmul, softmax, transpose.
  Hand-rolled is preferable here: the matrices are small (toy sentences, ≤16 tokens),
  and a hand-rolled module makes every intermediate step explicit and easy to expose
  to the UI (which `mathjs` abstracts away).
- **No Python/backend inference** — everything computes in-browser in plain TS.

## Visualization / Animation
- **Framer Motion** — scroll-driven transitions, step animations, layout transitions.
- **D3.js** (or lightweight custom SVG) — for heatmaps (attention weight matrices),
  positional encoding curves.
- **KaTeX** (`react-katex` or `katex` directly) — equation rendering, much lighter
  than MathJax.
- Plain **SVG** for the 3 redrawn architecture diagrams (encoder-decoder, scaled
  dot-product attention, multi-head attention) — hand-authored or generated once
  and stored as static SVG files, not re-rendered from data.

## Content Pipeline
- **MDX** or structured JSON for section content (paraphrased summaries + LaTeX
  equation strings + figure references) — MDX preferred if prose needs inline
  interactive components; JSON is fine if content stays purely descriptive.
- PDF text extraction (one-time, offline) via `pdf-parse` (Node) or manual
  transcription — used only during content authoring, not at runtime.

## State Management
- **React Context + hooks** (e.g. `useStepper`, `useAttentionState`) — this app's
  state graph is small enough that Redux/Zustand would be overkill. Introduce
  Zustand only if cross-component state sharing (Phase 4/7 full forward pass)
  gets unwieldy with plain Context.

## Testing
- **Vitest** — unit tests for `lib/math/*` (fast, works well with Vite/Next).
- **React Testing Library** — light component tests for interactive controls
  (sliders, steppers) if time allows; not required for every visualization.

## Deployment
- **Vercel** — zero-config Next.js hosting, matches likely existing portfolio deploy
  target. GitHub Pages is a fallback if a fully static export is preferred and no
  Vercel account is desired.
- **GitHub Actions** — CI to run `vitest` on every PR before merge (optional but
  recommended given the "math correctness is non-negotiable" rule in AGENTS.md).

## Explicitly NOT Used (for v1)
- No backend framework (FastAPI/Express) — no server-side computation needed.
- No database — no persistence needed for v1.
- No real ML framework (PyTorch.js/TensorFlow.js) in the browser — the point is
  pedagogical transparency with small toy matrices, not running a real model.
  (Revisit only if the "future ideas" pretrained-weights feature gets prioritized.)
- No heavy state library (Redux) — unjustified complexity for this app's size.
- No CMS — content is static/versioned in the repo, not editor-managed.

## Repo Structure (proposed)
```
/app                  — Next.js routes (mostly one long page + section anchors)
/components/viz        — one component per visualization feature
/components/ui         — shared primitives (Slider, Stepper, MatrixHeatmap, KatexBlock)
/lib/math               — pure, unit-tested math functions
/content                — paraphrased section text, equations, figure refs (MDX/JSON)
/content/figures         — original SVG diagrams
/research                — local extraction notes, gitignored, never shipped
/tests                   — vitest unit tests mirroring /lib/math
AGENTS.md
TECH_STACK.md
PRD.md
IMPLEMENTATION_PLAN.md
RULES.md
```
