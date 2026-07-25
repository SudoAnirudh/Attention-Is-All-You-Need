# Phase 2 Technical Documentation — Pure TypeScript Math Engine

## 1. Overview & Purpose
Phase 2 built the pure TypeScript mathematical computation engine powering **"Attention, Visualized"**. Located in `lib/math/`, this engine contains zero React code or external ML dependencies (no PyTorch.js / TensorFlow.js / mathjs). It executes all matrix algebra, tokenization, embedding lookup, sinusoidal positional encoding, scaled dot-product attention, multi-head projections, and Transformer encoder/decoder layer forward passes entirely in-browser.

Crucially, every attention operation returns all **intermediate step tensors** ($QK^T$, scaled matrix, masked matrix, softmax weights, output matrix) so that downstream UI visualizers can step through the exact computation step-by-step.

---

## 2. Mathematical Formulations & Architecture

### 1. Matrix Operations (`lib/math/matrix.ts`)
- **Matrix Multiplication ($\text{MatMul}$):** Computes $C = A \cdot B$ where $A \in \mathbb{R}^{m \times n}$ and $B \in \mathbb{R}^{n \times p}$.
- **Transposition ($A^T$):** Swaps row and column indices.
- **Numerically Stable Softmax:**
  $$\text{Softmax}(x_i) = \frac{\exp(x_i - \max(x))}{\sum_j \exp(x_j - \max(x))}$$
  Subtracting $\max(x)$ prevents floating-point overflow during exponentiation.
- **Additive Masking:** Sets masked positions ($1$) to $-10^9$ prior to softmax evaluation, causing $\exp(-10^9) \approx 0$ (effectively blocking attention).
- **Layer Normalization:** Normalizes features across representation dimension $d_{\text{model}}$ to zero mean and unit variance:
  $$\text{LayerNorm}(x) = \frac{x - \mu}{\sqrt{\sigma^2 + \epsilon}}$$

### 2. Tokenizer & Embedding Lookup (`lib/math/tokenizer.ts`, `lib/math/embedding.ts`)
- **Tokenizer:** Converts text into discrete token IDs and vice-versa with vocabulary support for toy sentences.
- **Embedding Lookup:** Maps token IDs to deterministic $d_{\text{model}}$ feature vectors.
- **Paper Section 3.4 Scaling:** In accordance with the paper, embedding vectors are multiplied by $\sqrt{d_{\text{model}}}$ before adding positional encodings.

### 3. Sinusoidal Positional Encoding (`lib/math/positionalEncoding.ts`)
Implements Equation 1 of Vaswani et al. (2017):
$$PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$
$$PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$
- **Why this happens:** Self-attention contains no recurrence or convolution, so sequence order is lost without position markers. Wavelengths form a geometric progression from $2\pi$ to $10000 \cdot 2\pi$, allowing the model to attend by relative positions.

### 4. Scaled Dot-Product Attention (`lib/math/attention.ts`)
Implements Equation 1:
$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$
- **Step-by-step tensor export:**
  1. `rawScores`: $Q \cdot K^T$ (dot-product similarity between queries and keys)
  2. `scaledScores`: $\frac{Q \cdot K^T}{\sqrt{d_k}}$ (prevents vanishing softmax gradients for large $d_k$)
  3. `maskedScores`: Applies additive causal mask (if provided)
  4. `attentionWeights`: $\text{softmax}(\text{maskedScores})$
  5. `output`: $\text{attentionWeights} \cdot V$

### 5. Multi-Head Attention (`lib/math/multihead.ts`)
Implements Section 3.2.2:
- Projects $Q, K, V$ into $h$ head subspaces of dimension $d_k = d_{\text{model}} / h$.
- Executes `scaledDotProductAttention` independently for each head $i \in \{1, \dots, h\}$.
- Concatenates head output matrices along feature dimension and applies final linear projection $W^O$.

### 6. Encoder & Decoder Layers (`lib/math/encoderLayer.ts`, `lib/math/decoderLayer.ts`)
- **Encoder Layer:** Self-Attention $\rightarrow$ Add & LayerNorm $\rightarrow$ FFN $\rightarrow$ Add & LayerNorm.
- **Decoder Layer:** Masked Causal Self-Attention $\rightarrow$ Add & LayerNorm $\rightarrow$ Multi-Head Cross-Attention ($Q$ from Decoder, $K, V$ from Encoder) $\rightarrow$ Add & LayerNorm $\rightarrow$ FFN $\rightarrow$ Add & LayerNorm.

---

## 3. Unit Test Verification (`tests/mathEngine.test.ts`)

Every mathematical module is unit-tested against small, hand-computable examples ($2 \times 2$ matrices, $d_{\text{model}} = 4$, $h = 2$).

### Vitest Test Suite Results:
- **Total Test Files:** 2 passed
- **Total Unit Tests:** **16 passed / 0 failed** (100% pass rate)
  - `matmul` calculation verified against hand matrix multiplication.
  - `transpose` verified.
  - `softmax` row-sum probability normalization verified to equal $1.00000$.
  - `applyMask` additive masking verified.
  - `layerNorm` zero-mean normalization verified.
  - `tokenizer` tokenization/detokenization cycle verified.
  - `EmbeddingTable` $\sqrt{d_{\text{model}}}$ scaling verified.
  - `positionalEncoding` exact $\sin(0)=0$ and $\cos(0)=1$ values verified.
  - `scaledDotProductAttention` raw/scaled/softmax/output steps verified.
  - `createCausalMask` lower-triangular blocking matrix verified.
  - `multiHeadAttention` 2-head split and concatenation verified.
  - `transformerEncoderLayer` forward pass verified.
  - `transformerDecoderLayer` forward pass with causal mask & cross-attention verified.

---

## 4. File Inventory for Phase 2

| File Path | Purpose |
|---|---|
| [`lib/math/matrix.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/lib/math/matrix.ts) | Pure linear algebra operations (matmul, transpose, softmax, scale, mask, layerNorm, relu). |
| [`lib/math/tokenizer.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/lib/math/tokenizer.ts) | Subword/word tokenizer and detokenizer. |
| [`lib/math/embedding.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/lib/math/embedding.ts) | Deterministic embedding table with $\sqrt{d_{\text{model}}}$ scaling. |
| [`lib/math/positionalEncoding.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/lib/math/positionalEncoding.ts) | Sinusoidal positional encoding implementation (Eq. 1). |
| [`lib/math/attention.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/lib/math/attention.ts) | Scaled Dot-Product Attention exposing intermediate tensors and causal masking. |
| [`lib/math/multihead.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/lib/math/multihead.ts) | Multi-Head Attention splitting, parallel head computation, and concatenation. |
| [`lib/math/encoderLayer.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/lib/math/encoderLayer.ts) | Transformer Encoder Layer (Self-Attn + Residual + LayerNorm + FFN). |
| [`lib/math/decoderLayer.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/lib/math/decoderLayer.ts) | Transformer Decoder Layer (Masked Self-Attn + Cross-Attn + FFN). |
| [`tests/mathEngine.test.ts`](file:///home/anirudhs/Documents/Boredom/Pappers/Attention%20Is%20All%20You%20Need/tests/mathEngine.test.ts) | Complete unit test suite for all mathematical modules. |
