import { Matrix, matmul, createMatrix } from './matrix';
import { scaledDotProductAttention, ScaledAttentionResult } from './attention';

export interface MultiHeadResult {
  heads: ScaledAttentionResult[];
  concatenated: Matrix;
  output: Matrix;
}

/**
 * Multi-Head Attention (Section 3.2.2)
 *
 * @param Q Input Queries (seqLen x dModel)
 * @param K Input Keys (seqLen x dModel)
 * @param V Input Values (seqLen x dModel)
 * @param numHeads Number of attention heads h
 * @param mask Optional mask matrix
 */
export function multiHeadAttention(
  Q: Matrix,
  K: Matrix,
  V: Matrix,
  numHeads: number = 2,
  mask?: Matrix
): MultiHeadResult {
  const seqLen = Q.length;
  const dModel = Q[0].length;

  if (dModel % numHeads !== 0) {
    throw new Error(`dModel (${dModel}) must be divisible by numHeads (${numHeads})`);
  }

  const d_k = dModel / numHeads;
  const heads: ScaledAttentionResult[] = [];
  const headOutputs: Matrix[] = [];

  // Compute per-head projections and attention
  for (let h = 0; h < numHeads; h++) {
    const colStart = h * d_k;
    const colEnd = (h + 1) * d_k;

    // Slice features into head subspace
    const Q_head = Q.map((row) => row.slice(colStart, colEnd));
    const K_head = K.map((row) => row.slice(colStart, colEnd));
    const V_head = V.map((row) => row.slice(colStart, colEnd));

    const headAttn = scaledDotProductAttention(Q_head, K_head, V_head, mask);
    heads.push(headAttn);
    headOutputs.push(headAttn.output);
  }

  // Concatenate head outputs along column dimension -> (seqLen x dModel)
  const concatenated: Matrix = createMatrix(seqLen, dModel, 0);
  for (let i = 0; i < seqLen; i++) {
    for (let h = 0; h < numHeads; h++) {
      for (let j = 0; j < d_k; j++) {
        concatenated[i][h * d_k + j] = headOutputs[h][i][j];
      }
    }
  }

  // Final Output Linear Projection (Identity for default toy model or custom W^O)
  // W_O = Identity (dModel x dModel)
  const W_O = createMatrix(dModel, dModel, 0);
  for (let i = 0; i < dModel; i++) {
    W_O[i][i] = 1.0;
  }

  const output = matmul(concatenated, W_O);

  return {
    heads,
    concatenated,
    output,
  };
}
