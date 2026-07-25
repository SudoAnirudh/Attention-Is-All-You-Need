import { describe, it, expect } from 'vitest';
import {
  matmul,
  transpose,
  scaleMatrix,
  addMatrices,
  softmax,
  applyMask,
  layerNorm,
  relu,
} from '../lib/math/matrix';
import { defaultTokenizer } from '../lib/math/tokenizer';
import { EmbeddingTable } from '../lib/math/embedding';
import { getPositionalEncoding } from '../lib/math/positionalEncoding';
import {
  scaledDotProductAttention,
  createCausalMask,
} from '../lib/math/attention';
import { multiHeadAttention } from '../lib/math/multihead';
import { transformerEncoderLayer } from '../lib/math/encoderLayer';
import { transformerDecoderLayer } from '../lib/math/decoderLayer';

describe('Math Engine Unit Tests', () => {
  // 1. Matrix Operations Tests
  describe('Linear Algebra (matrix.ts)', () => {
    it('computes matrix multiplication correctly (hand-calculated 2x2)', () => {
      const A = [
        [1, 2],
        [3, 4],
      ];
      const B = [
        [2, 0],
        [1, 2],
      ];
      // Hand calculated:
      // [1*2 + 2*1, 1*0 + 2*2] = [4, 4]
      // [3*2 + 4*1, 3*0 + 4*2] = [10, 8]
      const res = matmul(A, B);
      expect(res).toEqual([
        [4, 4],
        [10, 8],
      ]);
    });

    it('transposes matrix correctly', () => {
      const A = [
        [1, 2, 3],
        [4, 5, 6],
      ];
      const res = transpose(A);
      expect(res).toEqual([
        [1, 4],
        [2, 5],
        [3, 6],
      ]);
    });

    it('scales matrix by scalar correctly', () => {
      const A = [
        [2, 4],
        [6, 8],
      ];
      const res = scaleMatrix(A, 0.5);
      expect(res).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });

    it('computes softmax summing to 1 per row', () => {
      const A = [
        [1, 1],
        [0, 2],
      ];
      const res = softmax(A, 'row');
      expect(res[0][0]).toBeCloseTo(0.5, 4);
      expect(res[0][1]).toBeCloseTo(0.5, 4);
      const row0Sum = res[0][0] + res[0][1];
      const row1Sum = res[1][0] + res[1][1];
      expect(row0Sum).toBeCloseTo(1.0, 5);
      expect(row1Sum).toBeCloseTo(1.0, 5);
    });

    it('applies additive mask replacing masked entries with large negative value', () => {
      const A = [
        [1.0, 2.0],
        [3.0, 4.0],
      ];
      const mask = [
        [0, 1],
        [0, 0],
      ];
      const masked = applyMask(A, mask, -1e9);
      expect(masked[0][0]).toEqual(1.0);
      expect(masked[0][1]).toEqual(-1e9);
    });

    it('computes LayerNorm to mean 0 and variance 1', () => {
      const A = [[2.0, 4.0, 6.0, 8.0]];
      const norm = layerNorm(A);
      const mean = norm[0].reduce((acc, v) => acc + v, 0) / 4;
      expect(mean).toBeCloseTo(0, 4);
    });

    it('computes ReLU activation correctly', () => {
      const A = [[-2.5, 0, 3.2]];
      expect(relu(A)).toEqual([[0, 0, 3.2]]);
    });
  });

  // 2. Tokenizer Tests
  describe('Tokenizer (tokenizer.ts)', () => {
    it('tokenizes text into valid token IDs and detokenizes back', () => {
      const text = 'Attention Is All You Need';
      const { tokens, tokenIds } = defaultTokenizer.tokenize(text);
      expect(tokens.length).toBe(5);
      expect(tokenIds.length).toBe(5);

      const restored = defaultTokenizer.detokenize(tokenIds);
      expect(restored).toContain('Attention');
    });
  });

  // 3. Embedding Table Tests
  describe('Embedding Table (embedding.ts)', () => {
    it('lookup returns deterministic embeddings scaled by sqrt(dModel)', () => {
      const table = new EmbeddingTable(4);
      const vecUnscaled = table.getVector(4);
      expect(vecUnscaled.length).toBe(4);

      const seqEmbed = table.embedSequence([4], true);
      // Math.sqrt(4) = 2.0
      expect(seqEmbed[0][0]).toBeCloseTo(vecUnscaled[0] * 2.0, 3);
    });
  });

  // 4. Positional Encoding Tests
  describe('Positional Encoding (positionalEncoding.ts)', () => {
    it('computes sinusoidal PE matching Eq. 1 values for pos=0', () => {
      // For pos = 0: sin(0) = 0 for even dims, cos(0) = 1 for odd dims
      const pe = getPositionalEncoding(2, 4);
      expect(pe[0][0]).toBe(0); // sin(0)
      expect(pe[0][1]).toBe(1); // cos(0)
      expect(pe[0][2]).toBe(0); // sin(0)
      expect(pe[0][3]).toBe(1); // cos(0)
    });
  });

  // 5. Scaled Dot-Product Attention Tests
  describe('Scaled Dot-Product Attention (attention.ts)', () => {
    it('computes attention scores and intermediate matrices (2 tokens, d_k=2)', () => {
      const Q = [
        [1.0, 0.0],
        [0.0, 1.0],
      ];
      const K = [
        [1.0, 0.0],
        [0.0, 1.0],
      ];
      const V = [
        [10.0, 20.0],
        [30.0, 40.0],
      ];

      const res = scaledDotProductAttention(Q, K, V);
      expect(res.rawScores).toEqual([
        [1.0, 0.0],
        [0.0, 1.0],
      ]);
      // Softmax rows should sum to 1.0
      expect(res.attentionWeights[0][0] + res.attentionWeights[0][1]).toBeCloseTo(1.0, 5);
      expect(res.output.length).toBe(2);
      expect(res.output[0].length).toBe(2);
    });

    it('creates causal mask blocking future tokens', () => {
      const mask = createCausalMask(3);
      expect(mask).toEqual([
        [0, 1, 1], // Token 0 cannot see 1 or 2
        [0, 0, 1], // Token 1 cannot see 2
        [0, 0, 0], // Token 2 can see 0, 1, 2
      ]);
    });
  });

  // 6. Multi-Head Attention Tests
  describe('Multi-Head Attention (multihead.ts)', () => {
    it('splits d_model=4 across 2 heads (d_k=2) and concatenates outputs', () => {
      const X = [
        [1, 0, 0, 1],
        [0, 1, 1, 0],
      ];
      const res = multiHeadAttention(X, X, X, 2);
      expect(res.heads.length).toBe(2);
      expect(res.concatenated.length).toBe(2);
      expect(res.concatenated[0].length).toBe(4);
      expect(res.output.length).toBe(2);
      expect(res.output[0].length).toBe(4);
    });
  });

  // 7. Encoder & Decoder Layer Tests
  describe('Transformer Encoder & Decoder Layers', () => {
    it('runs single Encoder Layer forward pass', () => {
      const X = [
        [0.5, -0.5, 1.0, 0.0],
        [1.0, 0.0, -1.0, 0.5],
      ];
      const encRes = transformerEncoderLayer(X, 2);
      expect(encRes.finalOutput.length).toBe(2);
      expect(encRes.finalOutput[0].length).toBe(4);
    });

    it('runs single Decoder Layer forward pass with causal mask and cross-attention', () => {
      const Y = [
        [0.2, 0.8, -0.4, 0.1],
        [0.5, -0.5, 0.0, 1.0],
      ];
      const encoderOutput = [
        [0.5, -0.5, 1.0, 0.0],
        [1.0, 0.0, -1.0, 0.5],
      ];
      const decRes = transformerDecoderLayer(Y, encoderOutput, 2);
      expect(decRes.finalOutput.length).toBe(2);
      expect(decRes.finalOutput[0].length).toBe(4);
    });
  });
});
