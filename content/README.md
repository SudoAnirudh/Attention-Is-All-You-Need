# Content & Vector Figures (`content/`)

The `content/` directory contains structured paper section text, paraphrased summaries, KaTeX equations, and original vector SVG diagrams for **Attention, Visualized**.

---

## 📁 Directory Structure

```
content/
├── paperContent.ts    # Structured paper content model (paraphrased prose & LaTeX equations)
└── figures/           # Original vector SVG recreations of Transformer architecture diagrams
```

---

## 📝 Structured Content Model (`content/paperContent.ts`)

Defines the typed TypeScript content model for paper sections:
- **`PAPER_SECTIONS`**: Array of section entries containing section titles, paper numbers (e.g. `Section 3.2.1`), paraphrased summaries, key takeaways, and KaTeX equation strings.
- **Copyright Compliance**: No verbatim paper text is copied; all prose is paraphrased in an original voice.

---

## 🎨 Vector Architecture Diagrams (`content/figures/`)

Hand-authored SVG vector diagrams using Tokyo Night gradients and modern SVG geometry:

| File | Diagram Description |
|---|---|
| [`figures/encoder_decoder_stack.svg`](./figures/encoder_decoder_stack.svg) | Original redrawn architecture diagram for the full Transformer Encoder-Decoder stack ($N=6$). |
| [`figures/scaled_dot_product_attention.svg`](./figures/scaled_dot_product_attention.svg) | Original redrawn diagram for Scaled Dot-Product Attention ($Q, K, V \rightarrow \text{MatMul} \rightarrow \text{Scale} \rightarrow \text{Mask} \rightarrow \text{Softmax} \rightarrow \text{MatMul}$). |
| [`figures/multi_head_attention.svg`](./figures/multi_head_attention.svg) | Original redrawn diagram for Multi-Head Attention ($h$ parallel head projections, concatenation, linear $W^O$). |
