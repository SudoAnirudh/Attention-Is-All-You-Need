# Documentation Index — Attention, Visualized

Welcome to the documentation folder for **Attention, Visualized**, an interactive explainer of the Transformer architecture from *Attention Is All You Need* (Vaswani et al., 2017).

---

## 📚 Project Specifications & Guidelines

- [`PRD.md`](./PRD.md) — Product Requirements Document detailing project goals, feature list, target user persona, UX direction, and success metrics.
- [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) — Phased engineering roadmap breaking down project execution into 8 distinct milestones (Phases 0–7).
- [`AGENTS.md`](./AGENTS.md) — Ground rules, design system guidelines, math verification requirements, and directory conventions for AI coding agents.
- [`TECH_STACK.md`](./TECH_STACK.md) — Technical stack choices (Next.js 14 App Router, TypeScript, Tailwind CSS Tokyo Night theme, Framer Motion, KaTeX, Vitest).
- [`RULES.md`](./RULES.md) — Mandatory development guidelines and non-negotiable constraints.
- [`IMPLEMENTATION_PROMPT.md`](./IMPLEMENTATION_PROMPT.md) — Initial prompt specification used to guide autonomous multi-phase development.

---

## 🏗️ Phase-by-Phase Technical Documentation

Each phase of development is thoroughly documented with architectural decisions, mathematical mechanics, and verification results:

| Milestone | Document | Summary & Scope |
|---|---|---|
| **Phase 0** | [`PHASE_0_DOCUMENTATION.md`](./PHASE_0_DOCUMENTATION.md) | Next.js 14 static export setup, Tokyo Night color tokens, dynamic SSR-safe KaTeX rendering, and Vitest pipeline setup. |
| **Phase 1** | [`PHASE_1_DOCUMENTATION.md`](./PHASE_1_DOCUMENTATION.md) | Structured content model (`paperContent.ts`), paraphrased section summaries, and original redrawn SVG architecture diagrams. |
| **Phase 2** | [`PHASE_2_DOCUMENTATION.md`](./PHASE_2_DOCUMENTATION.md) | Pure TypeScript math engine (`lib/math/`), exposing step-by-step intermediate tensors ($QK^T$, scaling, masking, softmax weights, outputs) and 16 unit tests passing. |
| **Phase 3** | [`PHASE_3_DOCUMENTATION.md`](./PHASE_3_DOCUMENTATION.md) | Core interactive visualizers: Tokenizer playground, Positional Encoding sinusoid curves, Scaled Dot-Product Attention step-through centerpiece, Multi-Head split view, and Complexity comparison table. |
| **Phase 4** | [`PHASE_4_DOCUMENTATION.md`](./PHASE_4_DOCUMENTATION.md) | Macro architecture visualizers: $N=6$ Encoder Stack data flow, $N=6$ Decoder Stack with Causal Masking & Cross-Attention, and sub-5ms End-to-End Forward Pass integration. |
| **Phase 5** | [`PHASE_5_DOCUMENTATION.md`](./PHASE_5_DOCUMENTATION.md) | Scrollytelling layout, sticky mini-TOC navigation bar, and collapsible paper-reference side panel. |
| **Phase 6** | [`PHASE_6_DOCUMENTATION.md`](./PHASE_6_DOCUMENTATION.md) | Mobile viewport linearization (`overflow-x-auto`), WCAG 2.2 accessibility pass (keyboard navigation, ARIA live regions), and performance memoization. |
| **Phase 7** | [`PHASE_7_DOCUMENTATION.md`](./PHASE_7_DOCUMENTATION.md) | Release checklist verification, production static export compilation (`output: 'export'`), and deployment preparation. |

---

## 🧪 Math & Test Verification

All mathematical computations are verified using pure unit tests without external ML frameworks:
```bash
npm run test
```
* **16/16 Unit Tests Passing**: Matrix multiplication, softmax normalization, additive causal masking, sinusoidal positional encoding, scaled dot-product attention, multi-head splitting, and encoder/decoder forward passes.
