# Phase 0 Technical Documentation — Project Setup & Design System

## 1. Overview & Purpose
Phase 0 established the foundational environment for **"Attention, Visualized"**, an interactive client-side explainer of the Transformer architecture from *Attention Is All You Need* (Vaswani et al., 2017). The primary objective of Phase 0 was to build a rock-solid, static-exportable Next.js 14+ scaffold paired with the dark **Tokyo Night** design system, client-side math typesetting capabilities via KaTeX, smooth UI transitions via Framer Motion, and a lightweight Vitest testing pipeline.

---

## 2. Architecture & Tech Stack Choices

### Why Next.js 14 (App Router) & Static Export (`output: 'export'`)
- **How it works:** Next.js compiles the React component tree down to static HTML, JS, and CSS files during `next build`.
- **Why this happens:** The project rules require pure client-side execution with zero backend/database dependencies. Static export allows zero-cost static hosting on platforms like Vercel or GitHub Pages while maintaining modern React 18 DX and server-side pre-rendering capabilities for fast initial loads.

### Why Tokyo Night Color Palette in Tailwind CSS
- **How it works:** Color tokens are defined under `theme.extend.colors.tokyo` in `tailwind.config.ts`.
- **Token Map:**
  - `tokyo-bg` (`#1a1b26`): Deep dark background minimizing eye strain during dense mathematical exploration.
  - `tokyo-surface` (`#24283b`): Elevated card/panel containers providing visual hierarchy.
  - `tokyo-purple` (`#bb9af7`) & `tokyo-blue` (`#7aa2f7`): Accent colors assigned to Queries ($Q$) and Keys ($K$).
  - `tokyo-cyan` (`#7dcfff`): Accent color assigned to Values ($V$).
  - `tokyo-green` (`#9ece6a`): Terminal green for output matrices and success states.
  - `tokyo-orange` (`#ff9e64`): Warning highlights and Positional Encoding parameters.
- **Why this happens:** Standard web explainer templates rely on generic light modes or high-contrast plain dark themes. The Tokyo Night palette offers a premium IDE-like visual language tailored for technical readers inspecting dense numerical matrices.

### Why Dynamic KaTeX Loading (`KatexBlock.tsx`)
- **How it works:** Instead of relying on SSR-unfriendly node-fetch wrappers, `components/ui/KatexBlock.tsx` dynamically imports `katex` inside a `useEffect` hook on client mount and renders LaTeX strings to HTML using `katex.renderToString()`. During initial SSR prerendering, a monospace fallback string is rendered.
- **Why this happens:** Pre-rendering complex third-party CJS math libraries during Next.js static generation can trigger Webpack chunk resolution errors or Google Fonts fetch timeouts. Client-side dynamic import ensures 100% build reliability and offline static export capability.

---

## 3. Directory & File Overview

| File Path | Description & Purpose |
|---|---|
| [`package.json`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/package.json) | Package manifest defining Next.js 14, React 18, Tailwind, Framer Motion, KaTeX, and Vitest. |
| [`tsconfig.json`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/tsconfig.json) | Strict TypeScript compiler options with `@/*` root path resolution. |
| [`next.config.js`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/next.config.js) | Configured with `output: 'export'` for static bundle output. |
| [`tailwind.config.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/tailwind.config.ts) | Tokyo Night color tokens, custom scrollbars, and monospace typography definitions. |
| [`app/globals.css`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/app/globals.css) | Global Tailwind imports, KaTeX CSS stylesheet import, and scrollbar styling. |
| [`app/layout.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/app/layout.tsx) | Root layout wrapping children in the Tokyo Night dark theme shell. |
| [`components/ui/KatexBlock.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/ui/KatexBlock.tsx) | Reusable, SSR-safe LaTeX equation rendering component. |
| [`vitest.config.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/vitest.config.ts) | Vitest runner configuration mirroring project module resolution. |
| [`tests/placeholder.test.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/tests/placeholder.test.ts) | Initial sanity test verifying Vitest suite readiness. |

---

## 4. Verification & Status
- `npm run test` verified working (1/1 tests passing).
- `npm run build` verified compiling to a static production export without errors.
