# MASTER BUILD PROMPT — "Attention, Visualized"

Paste this whole prompt into your coding agent (Claude Code, Cursor, etc.) as the
first message in the project. It tells the agent to work phase-by-phase, stop and
report after each phase, and wait for a go-ahead before continuing.

---

## PROMPT START

You are building "Attention, Visualized" — an interactive website that teaches the
Transformer architecture from *Attention Is All You Need* (Vaswani et al., 2017,
arXiv:1706.03762) through live, hands-on visualizations, not static text.

Before writing any code, read these five files in this repo (create the repo root
if they don't exist yet, and put these files there first if I haven't already):
- `PRD.md` — product requirements, feature list, UX direction
- `IMPLEMENTATION_PLAN.md` — the phased plan you must follow
- `AGENTS.md` — your working rules (directory conventions, what not to do)
- `TECH_STACK.md` — the exact stack to use, and what NOT to introduce
- `RULES.md` — non-negotiable guardrails (math correctness, copyright, a11y, perf)

### How you must work
1. Work through `IMPLEMENTATION_PLAN.md` **one phase at a time, in order**
   (Phase 0 → Phase 7). Do not skip ahead or start a later phase's work early.
2. Within a phase, complete every checklist item listed for that phase in
   `IMPLEMENTATION_PLAN.md`.
3. **After finishing each phase, stop and give me a summary before continuing.**
   Do not proceed to the next phase until I reply "continue" or "go" (or give
   corrections). The summary must include:
   - What was built/changed (bullet list, filenames).
   - Any deviations from the plan/PRD, and why.
   - For Phase 2 (math engine) specifically: the unit test results (pass/fail count).
   - Any open questions or decisions you made unilaterally that I should sanity-check.
   - A short "what's next" line naming the next phase.
4. If you hit a genuine ambiguity that would change the architecture (not a minor
   styling choice), stop mid-phase and ask rather than guessing.
5. Obey `RULES.md` and `AGENTS.md` at all times — especially:
   - No copied paper figures/text; original SVGs and paraphrased prose only.
   - Every `lib/math/*` function ships with a unit test against a hand-computable
     example, before you consider that piece done.
   - Every visualization is steppable (play/pause/step), never autoplay-only.
   - Stay within the stack in `TECH_STACK.md` — flag it explicitly if you think a
     new dependency is genuinely needed, don't just add it.
6. Keep commits small and scoped to one feature/fix each, per `AGENTS.md`.

### Phase order to follow (full detail lives in IMPLEMENTATION_PLAN.md)
- **Phase 0 — Setup**: Next.js + TS + Tailwind scaffold, Tokyo Night theme tokens,
  KaTeX + Framer Motion added, empty shell deployed to Vercel.
- **Phase 1 — Content extraction**: structured content model from the paper
  (paraphrased summaries, LaTeX equations, figure refs), 3 original redrawn SVG diagrams.
- **Phase 2 — Math engine**: pure TS module for matmul/softmax/masking, tokenizer,
  embeddings, positional encoding, scaled dot-product attention (with intermediate
  step outputs), multi-head split/concat, minimal encoder/decoder layer — all unit-tested.
- **Phase 3 — Core visualizations**: tokenizer/embedding playground, positional
  encoding visualizer, scaled dot-product attention step-through (the centerpiece),
  multi-head attention view, complexity comparison table.
- **Phase 4 — Architecture-level visualizations**: encoder stack animation, decoder
  stack + causal masking demo, end-to-end forward pass integration.
- **Phase 5 — Scrollytelling**: scroll-driven transitions, collapsible paper-reference
  panel, sticky mini-TOC.
- **Phase 6 — Polish**: mobile responsive pass, performance pass (<1s forward pass
  for ≤16 tokens), accessibility pass, cross-browser check.
- **Phase 7 — Ship**: final deploy, README with screenshots, link into portfolio.

### First action
Start with Phase 0 right now. When it's done, give me the Phase 0 summary in the
format above and wait for me to say "continue."

## PROMPT END

---

## Notes for you (not part of the pasted prompt)
- If your agent supports it, run this in a fresh repo/branch so Phase 0's scaffold
  doesn't collide with anything existing.
- If the agent tries to blow past the "stop after each phase" instruction, just
  reply "stop — give me the phase summary first" — most agents will comply
  immediately once reminded.
- Keep `PRD.md`, `IMPLEMENTATION_PLAN.md`, `AGENTS.md`, `TECH_STACK.md`, and
  `RULES.md` physically present in the repo root — agents that can read files will
  re-check them, and it also documents intent for future-you or anyone else reading the repo.