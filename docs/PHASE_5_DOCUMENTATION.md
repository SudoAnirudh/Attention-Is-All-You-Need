# Phase 5 Technical Documentation — Scrollytelling & Paper Reference Panel

## 1. Overview & Purpose
Phase 5 implemented the **Scrollytelling & Navigation Architecture** for **"Attention, Visualized"**. It created a smooth scrollytelling container pairing every narrative section of the paper with interactive visualization features, a collapsible paper reference side panel, and a sticky mini-Table of Contents (TOC) navigation bar.

---

## 2. Component Architecture & Design

### 1. Sticky Mini-TOC Navigation Bar (`components/ui/StickyToc.tsx`)
- **How it works:** Positioned as `sticky top-0 z-40` with backdrop blur (`bg-tokyo-bg/90 backdrop-blur`). Displays active section indicators and quick jump buttons to switch between visualization features (`Forward Pass`, `Scaled Attention`, `Encoder`, `Decoder`, `Tokenizer`, `PE`, `Multi-Head`, `Complexity Table`, `Paper Reference`).
- **Why this happens:** Allows readers to jump directly to any paper concept or interactive tool without losing their place during long reading sessions.

### 2. Collapsible Paper Reference Side Panel (`components/ui/PaperSidePanel.tsx`)
- **How it works:** A collapsible side drawer displaying:
  - Active paper section title & section reference (e.g. `Section 3.2.1: Scaled Dot-Product Attention`)
  - Paraphrased section summary explaining the intuition
  - Key takeaway card
  - KaTeX-rendered equations
  - Dropdown selector for rapid section jumps
- **Why this happens:** Provides a dedicated space for original paper prose context alongside live interactive matrix visualizations, fulfilling the "Read the paper alongside" feature requirement (PRD §6 Feature 9).

### 3. Scrollytelling Layout (`components/viz/ScrollytellingLayout.tsx`)
- **How it works:** Wraps the entire application view inside a responsive grid layout combining the `StickyToc` navigation bar, active visualization view, and `PaperSidePanel`.
- **Why this happens:** Unifies all 9 core features into one cohesive, single-page application.

---

## 3. File Inventory for Phase 5

| File Path | Purpose |
|---|---|
| [`components/ui/StickyToc.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/ui/StickyToc.tsx) | Sticky mini-TOC navigation bar anchored to top of viewport. |
| [`components/ui/PaperSidePanel.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/ui/PaperSidePanel.tsx) | Collapsible side panel displaying section summaries, key insights, and KaTeX equations. |
| [`components/viz/ScrollytellingLayout.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/viz/ScrollytellingLayout.tsx) | Scrollytelling container layout combining navigation, main visualizer, and paper side panel. |
| [`app/page.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/app/page.tsx) | Root page rendering `ScrollytellingLayout`. |

---

## 4. Verification
- `npm run test` verified passing (16/16 unit tests).
- `npx tsc --noEmit` verified 0 TypeScript errors.
- `npm run build` verified compiling to static export (Route `/` size: 19.2 kB).
