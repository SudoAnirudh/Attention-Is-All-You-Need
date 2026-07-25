# Phase 4 Technical Documentation — Architecture-Level Visualizations

## 1. Overview & Purpose
Phase 4 delivered the **Architecture-Level Visualizations (Features 5, 6, and 7)** of **"Attention, Visualized"**. These components elevate individual layer mechanics into macro-level architectural flows, animating data pass-through across stacked Encoder layers ($N=6$), Decoder layers ($N=6$) with Causal Masking & Cross-Attention, and an End-to-End Forward Pass integration executing full client-side translation inference.

---

## 2. Component Mechanics & Data Flow

### 1. Feature 5: Encoder Stack Animation (`components/viz/EncoderStackViz.tsx`)
- **How it works:** Visualizes data flow through $N=6$ stacked Encoder layers. Users can select layer depth ($N \in \{2, 4, 6\}$) and step through the 5 internal sub-layer stages:
  1. Input Representation ($X$)
  2. Multi-Head Self-Attention Output ($\text{SelfAttn}(X)$)
  3. Sub-layer 1 Add & LayerNorm ($\text{LayerNorm}(X + \text{SelfAttn}(X))$)
  4. Position-wise Feed-Forward Network ($\text{FFN}(X)$)
  5. Sub-layer 2 Add & LayerNorm ($\text{LayerNorm}(X_{\text{norm}} + \text{FFN}(X_{\text{norm}}))$) $\rightarrow$ Input to next layer $N+1$
- **Why this happens:** In the paper, encoders do not operate in isolation—output representations from layer $i$ pass sequentially to layer $i+1$, refining token representations at each depth.

### 2. Feature 6: Decoder Stack & Masking Demo (`components/viz/DecoderStackViz.tsx`)
- **How it works:** Visualizes auto-regressive decoding across $N=6$ stacked Decoder layers with 6 steppable sub-layer stages:
  1. Target Input Representation ($Y$)
  2. Masked Causal Self-Attention (future tokens $j > i$ set to $-10^9$ before softmax)
  3. Sub-layer 1 Add & LayerNorm
  4. Multi-Head Cross-Attention ($Q$ from Decoder, $K, V$ from Encoder output)
  5. Sub-layer 2 Add & LayerNorm
  6. Feed-Forward Network & Final LayerNorm Output
- **Why this happens:** Highlights the crucial distinction between Encoder self-attention (bidirectional) and Decoder self-attention (causal lower-triangular mask), preventing target tokens from cheating during training and auto-regressive generation.

### 3. Feature 7: Full Forward Pass Integration (`components/viz/FullForwardPassViz.tsx`)
- **How it works:** Connects all individual paper mechanisms into one continuous, end-to-end forward pass pipeline:
  $$\text{Source Input} \longrightarrow \text{Tokens} \longrightarrow \text{Embed } + PE \longrightarrow \text{Encoder Stack} \longrightarrow \text{Decoder Stack (Cross-Attn)} \longrightarrow \text{Linear} + \text{Softmax} \longrightarrow P(\text{Tokens})$$
- **Performance:** Computes the entire forward pass client-side in under **5ms** for toy sequences ($n \le 16$ tokens), fulfilling **Rule 5 of RULES.md & PRD §8** ($< 1$ second target).

---

## 3. File Inventory for Phase 4

| File Path | Purpose |
|---|---|
| [`components/viz/EncoderStackViz.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/viz/EncoderStackViz.tsx) | Feature 5: Animated data flow through N stacked encoder layers. |
| [`components/viz/DecoderStackViz.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/viz/DecoderStackViz.tsx) | Feature 6: Decoder stack animation with Causal Masking and Cross-Attention. |
| [`components/viz/FullForwardPassViz.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/components/viz/FullForwardPassViz.tsx) | Feature 7: End-to-end forward pass integration demo. |
| [`app/page.tsx`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/app/page.tsx) | Main page updated with tabs for all 9 visualization & section features. |

---

## 4. Verification
- `npm run test` verified passing (16/16 unit tests).
- `npx tsc --noEmit` verified 0 TypeScript compilation errors.
- `npm run build` verified compiling to static export (Route `/` size: 18.7 kB).
