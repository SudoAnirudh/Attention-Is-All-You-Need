import {
  Matrix,
  matmul,
  transpose,
  scaleMatrix,
  applyMask,
  softmax,
} from './matrix';

export interface ScaledAttentionResult {
  Q: Matrix;
  K: Matrix;
  V: Matrix;
  rawScores: Matrix;
  scaledScores: Matrix;
  maskedScores: Matrix;
  attentionWeights: Matrix;
  output: Matrix;
}

/**
 * Computes Scaled Dot-Product Attention (Eq. 1) and exposes
 * all intermediate step matrices for step-by-step visual exploration.
 *
 * @param Q Query matrix (seqLenQ x d_k)
 * @param K Key matrix (seqLenK x d_k)
 * @param V Value matrix (seqLenK x d_v)
 * @param mask Optional binary mask matrix (1 = masked/blocked out, 0 = visible)
 */
export function scaledDotProductAttention(
  Q: Matrix,
  K: Matrix,
  V: Matrix,
  mask?: Matrix
): ScaledAttentionResult {
  const d_k = K[0].length;
  const scaleFactor = 1 / Math.sqrt(d_k);

  // Step 1: Raw Dot Product (Q * K^T)
  const KT = transpose(K);
  const rawScores = matmul(Q, KT);

  // Step 2: Scale by 1 / sqrt(d_k)
  const scaledScores = scaleMatrix(rawScores, scaleFactor);

  // Step 3: Apply Mask if provided (e.g. Causal Mask in Decoder)
  const maskedScores = mask ? applyMask(scaledScores, mask, -1e9) : scaledScores;

  // Step 4: Softmax along rows
  const attentionWeights = softmax(maskedScores, 'row');

  // Step 5: Matmul Attention Weights * V
  const output = matmul(attentionWeights, V);

  return {
    Q,
    K,
    V,
    rawScores,
    scaledScores,
    maskedScores,
    attentionWeights,
    output,
  };
}

/**
 * Creates a causal lower-triangular mask (seqLen x seqLen).
 * 1 represents masked/future positions that must NOT be attended to.
 */
export function createCausalMask(seqLen: number): Matrix {
  const mask: Matrix = [];
  for (let i = 0; i < seqLen; i++) {
    const row: number[] = [];
    for (let j = 0; j < seqLen; j++) {
      // Allow current position and past positions (j <= i). Block future (j > i).
      row.push(j > i ? 1 : 0);
    }
    mask.push(row);
  }
  return mask;
}
