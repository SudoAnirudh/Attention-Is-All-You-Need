# Core Utilities & Math Engine (`lib/`)

The `lib/` directory contains pure TypeScript logic, custom React hooks, and the zero-dependency mathematical computation engine powering **Attention, Visualized**.

---

## 📁 Directory Structure

```
lib/
├── math/             # Pure TypeScript linear algebra & Transformer math engine
└── hooks/            # Custom React hooks (steppable animation playback state)
```

---

## 🧮 Math Engine (`lib/math/`)

The math engine contains zero React code or external ML dependencies (no PyTorch.js / TensorFlow.js / mathjs). It executes all matrix operations client-side in plain TypeScript and exports intermediate step matrices for UI visualization.

| File | Functions & Operations | Description |
|---|---|---|
| [`matrix.ts`](./math/matrix.ts) | `matmul`, `transpose`, `softmax`, `applyMask`, `layerNorm`, `relu`, `scaleMatrix` | Pure linear algebra primitives. Softmax is numerically stable ($\max(x)$ subtracted before exp). |
| [`tokenizer.ts`](./math/tokenizer.ts) | `tokenize`, `detokenize`, `VOCAB` | Subword/word tokenizer mapping text into vocabulary token IDs. |
| [`embedding.ts`](./math/embedding.ts) | `EmbeddingTable`, `lookupEmbedding` | Deterministic embedding lookup scaling feature vectors by $\sqrt{d_{\text{model}}}$ per paper Section 3.4. |
| [`positionalEncoding.ts`](./math/positionalEncoding.ts) | `generatePositionalEncoding` | Sinusoidal positional encodings implementing Vaswani et al. Eq. 1. |
| [`attention.ts`](./math/attention.ts) | `scaledDotProductAttention` | Computes $\text{softmax}(QK^T / \sqrt{d_k})V$, returning all 5 intermediate step matrices ($QK^T$, scaled, masked, weights, output). |
| [`multihead.ts`](./math/multihead.ts) | `multiHeadAttention` | Splits representations into $h$ parallel head projections, runs attention, and concatenates results. |
| [`encoderLayer.ts`](./math/encoderLayer.ts) | `transformerEncoderLayer` | Full Encoder Layer forward pass ($\text{Self-Attn} \rightarrow \text{Add \& LayerNorm} \rightarrow \text{FFN} \rightarrow \text{Add \& LayerNorm}$). |
| [`decoderLayer.ts`](./math/decoderLayer.ts) | `transformerDecoderLayer` | Full Decoder Layer forward pass ($\text{Masked Causal Self-Attn} \rightarrow \text{Cross-Attn} \rightarrow \text{FFN}$). |

---

## 🪝 Custom Hooks (`lib/hooks/`)

| File | Purpose |
|---|---|
| [`useStepper.ts`](./hooks/useStepper.ts) | State management hook for pausable, steppable animations (`currentStep`, `isPlaying`, `speedMs`, `stepForward`, `stepBackward`, `togglePlay`, `reset`). |
