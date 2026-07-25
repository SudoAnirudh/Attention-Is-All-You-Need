export interface PaperEquation {
  id: string;
  name: string;
  latex: string;
  description: string;
}

export interface PaperSection {
  id: string;
  title: string;
  paperSection: string;
  summary: string;
  keyTakeaway: string;
  equations: PaperEquation[];
  figureRef?: 'encoder-decoder' | 'scaled-dot-product' | 'multi-head';
}

export const PAPER_SECTIONS: PaperSection[] = [
  {
    id: 'abstract',
    title: 'Abstract & Core Innovation',
    paperSection: 'Abstract',
    summary:
      'Dominant sequence transduction models relied on complex recurrent (RNN) or convolutional (CNN) neural networks connecting an encoder and decoder. The Transformer abandons recurrence and convolutions entirely, building sequence modeling solely on attention mechanisms to draw global dependencies between input and output.',
    keyTakeaway:
      'Replacing recurrent loops with parallelizable self-attention allows dramatic gains in computational speed and state-of-the-art translation quality.',
    equations: [],
  },
  {
    id: 'introduction',
    title: 'Introduction: Beyond Sequential Processing',
    paperSection: 'Section 1: Introduction',
    summary:
      'Recurrent models (LSTM, GRU) process sequence tokens step-by-step along position indices, creating an inherent computational bottleneck ($O(n)$ sequential steps) that prevents parallel execution across hardware acceleration clusters during training.',
    keyTakeaway:
      'Attention mechanisms permit model dependencies without regard to physical position distance, enabling massive training parallelization across GPUs.',
    equations: [],
  },
  {
    id: 'background',
    title: 'Background: Reducing Path Lengths',
    paperSection: 'Section 2: Background',
    summary:
      'Previous efforts like ByteNet and ConvS2S used convolutional layers to process token representations in parallel. However, connecting signals across arbitrary distances required combining multiple layers, increasing operations quadratically or logarithmically with sequence length.',
    keyTakeaway:
      'Self-attention reduces the maximum operation path length between any two token positions to a constant $O(1)$ operations.',
    equations: [],
  },
  {
    id: 'model-architecture',
    title: 'Model Architecture: Encoder-Decoder Stack',
    paperSection: 'Section 3.1: Encoder and Decoder Stacks',
    summary:
      'The Transformer follows an encoder-decoder framework. The encoder maps an input sequence $(x_1, \\dots, x_n)$ to continuous representations $z$. The decoder generates an output sequence $(y_1, \\dots, y_m)$ auto-regressively token by token.',
    keyTakeaway:
      'Both encoder and decoder stacks consist of $N=6$ identical layers, using residual connections around each sub-layer followed by Layer Normalization.',
    figureRef: 'encoder-decoder',
    equations: [
      {
        id: 'residual-norm',
        name: 'Sub-layer Output with Residual & LayerNorm',
        latex: '\\text{LayerNorm}(x + \\text{SubLayer}(x))',
        description:
          'Every sub-layer outputs a residual addition passed through Layer Normalization, maintaining a uniform model dimension $d_{\\text{model}} = 512$.',
      },
    ],
  },
  {
    id: 'scaled-dot-product',
    title: 'Scaled Dot-Product Attention',
    paperSection: 'Section 3.2.1: Scaled Dot-Product Attention',
    summary:
      'Attention takes Query ($Q$), Key ($K$), and Value ($V$) matrices. The dot products of queries with keys calculate similarity scores, scaled down by $\\sqrt{d_k}$ to prevent gradient vanishing in the softmax function.',
    keyTakeaway:
      'Scaling dot products by $1/\\sqrt{d_k}$ stabilizes softmax gradients for large feature dimensions, avoiding flat gradients.',
    figureRef: 'scaled-dot-product',
    equations: [
      {
        id: 'scaled-attention-eq',
        name: 'Scaled Dot-Product Attention Formula',
        latex: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
        description:
          'Computes softmax weights from scaled query-key dot products and multiplies them against values.',
      },
    ],
  },
  {
    id: 'multi-head-attention',
    title: 'Multi-Head Attention',
    paperSection: 'Section 3.2.2: Multi-Head Attention',
    summary:
      'Rather than performing single attention across $d_{\\text{model}}$ dimensions, Multi-Head Attention linearly projects queries, keys, and values $h=8$ times with separate learned projection matrices to distinct $d_k$ dimensions.',
    keyTakeaway:
      'Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions simultaneously.',
    figureRef: 'multi-head',
    equations: [
      {
        id: 'multi-head-eq',
        name: 'Multi-Head Projection & Concatenation',
        latex: '\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O',
        description:
          'Where $\\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$. Projections split total dimension $d_{\\text{model}} = 512$ across $h=8$ heads into $d_k = 64$.',
      },
    ],
  },
  {
    id: 'positional-encoding',
    title: 'Positional Encoding: Injecting Sequence Order',
    paperSection: 'Section 3.5: Positional Encoding',
    summary:
      'Because the network contains no recurrence or convolution, positional encodings are added to input embeddings to convey word order. Sinusoidal functions of varying frequencies span dimensions $2i$ and $2i+1$.',
    keyTakeaway:
      'Sinusoidal functions allow the model to easily learn relative position relationships, as $PE_{pos+k}$ can be expressed as a linear function of $PE_{pos}$.',
    equations: [
      {
        id: 'pe-even',
        name: 'Even Dimension Positional Encoding',
        latex: 'PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d_{\\text{model}}}}\\right)',
        description:
          'Sine function applied to even feature dimensions $2i$.',
      },
      {
        id: 'pe-odd',
        name: 'Odd Dimension Positional Encoding',
        latex: 'PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d_{\\text{model}}}}\\right)',
        description:
          'Cosine function applied to odd feature dimensions $2i+1$.',
      },
    ],
  },
  {
    id: 'why-self-attention',
    title: 'Why Self-Attention: Computational Complexity',
    paperSection: 'Section 4: Why Self-Attention',
    summary:
      'Self-attention layers compare favorably to recurrent and convolutional layers across three criteria: total computational complexity per layer, amount of parallelizable computation, and path length between long-range sequence dependencies.',
    keyTakeaway:
      'When sequence length $n$ is smaller than representation dimension $d$, self-attention is faster per layer ($O(n^2 \\cdot d)$ vs $O(n \\cdot d^2)$ for RNNs).',
    equations: [],
  },
  {
    id: 'training-results',
    title: 'Training & Results',
    paperSection: 'Sections 5 & 6: Training and Results',
    summary:
      'Trained on WMT 2014 English-to-German and English-to-French translation benchmarks using Adam optimizer with warmup schedule, Label Smoothing, and Residual Dropout.',
    keyTakeaway:
      'Achieved a state-of-the-art BLEU score of 28.4 on English-to-German while training in just 3.5 days on 8 P100 GPUs—a fraction of former training costs.',
    equations: [
      {
        id: 'ffn-eq',
        name: 'Position-wise Feed-Forward Network',
        latex: '\\text{FFN}(x) = \\max(0, xW_1 + b_1)W_2 + b_2',
        description:
          'Two linear transformations with a ReLU activation in between, applied independently to each position.',
      },
    ],
  },
];
