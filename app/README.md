# Next.js App Directory (`app/`)

The `app/` directory contains the Next.js 14 (App Router) routes, root layout, and global styling definitions for **Attention, Visualized**.

---

## 📁 Files Overview

| File | Description & Purpose |
|---|---|
| [`page.tsx`](./page.tsx) | Root application page rendering `ScrollytellingLayout` and uniting all visualization features into a single-page interactive experience. |
| [`layout.tsx`](./layout.tsx) | Root HTML layout providing the Tokyo Night dark theme container (`bg-tokyo-bg text-tokyo-fg`) and JetBrains Mono / Inter font configurations. |
| [`globals.css`](./globals.css) | Global Tailwind CSS directives, KaTeX stylesheet imports, custom scrollbar rules (`.no-scrollbar`), and Tokyo Night background utility classes. |

---

## 🚀 Static Export Configuration

This app is configured with static HTML/JS/CSS export in `next.config.js`:
```js
module.exports = {
  output: 'export',
  images: { unoptimized: true }
};
```
Running `npm run build` generates a standalone static web bundle in the `out/` directory, ready for deployment on Vercel, GitHub Pages, or any static host.
