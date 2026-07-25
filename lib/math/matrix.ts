export type Matrix = number[][];

/**
 * Creates a matrix with given dimensions initialized to a default value.
 */
export function createMatrix(rows: number, cols: number, fillValue: number = 0): Matrix {
  return Array.from({ length: rows }, () => Array(cols).fill(fillValue));
}

/**
 * Matrix multiplication A (m x n) * B (n x p) -> (m x p)
 */
export function matmul(A: Matrix, B: Matrix): Matrix {
  const rowsA = A.length;
  const colsA = A[0].length;
  const rowsB = B.length;
  const colsB = B[0].length;

  if (colsA !== rowsB) {
    throw new Error(`Matmul dimension mismatch: (${rowsA}x${colsA}) * (${rowsB}x${colsB})`);
  }

  const result: Matrix = createMatrix(rowsA, colsB, 0);
  for (let i = 0; i < rowsA; i++) {
    for (let k = 0; k < colsA; k++) {
      for (let j = 0; j < colsB; j++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}

/**
 * Matrix transposition A (m x n) -> A^T (n x m)
 */
export function transpose(A: Matrix): Matrix {
  const rows = A.length;
  const cols = A[0].length;
  const result: Matrix = createMatrix(cols, rows, 0);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = A[i][j];
    }
  }
  return result;
}

/**
 * Scale matrix elements by scalar factor
 */
export function scaleMatrix(A: Matrix, scalar: number): Matrix {
  return A.map((row) => row.map((val) => val * scalar));
}

/**
 * Element-wise matrix addition A + B
 */
export function addMatrices(A: Matrix, B: Matrix): Matrix {
  const rows = A.length;
  const cols = A[0].length;
  if (B.length !== rows || B[0].length !== cols) {
    throw new Error(`Matrix addition dimension mismatch: (${rows}x${cols}) vs (${B.length}x${B[0].length})`);
  }
  return A.map((row, i) => row.map((val, j) => val + B[i][j]));
}

/**
 * Numerically stable Softmax along rows (default) or columns
 */
export function softmax(A: Matrix, dim: 'row' | 'col' = 'row'): Matrix {
  if (dim === 'row') {
    return A.map((row) => {
      const maxVal = Math.max(...row);
      const exps = row.map((x) => Math.exp(x - maxVal));
      const sumExps = exps.reduce((acc, val) => acc + val, 0);
      return exps.map((x) => (sumExps === 0 ? 0 : x / sumExps));
    });
  } else {
    const transposed = transpose(A);
    const softTransposed = softmax(transposed, 'row');
    return transpose(softTransposed);
  }
}

/**
 * Apply additive mask matrix to A.
 * If mask[i][j] === 1 (masked out / blocked), A[i][j] becomes maskValue (-1e9).
 */
export function applyMask(A: Matrix, mask: Matrix, maskValue: number = -1e9): Matrix {
  return A.map((row, i) =>
    row.map((val, j) => (mask[i] && mask[i][j] === 1 ? maskValue : val))
  );
}

/**
 * Layer Normalization across rows: Mean 0, Variance 1 for each token representation
 */
export function layerNorm(A: Matrix, eps: number = 1e-5): Matrix {
  return A.map((row) => {
    const n = row.length;
    const mean = row.reduce((acc, v) => acc + v, 0) / n;
    const variance = row.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
    const std = Math.sqrt(variance + eps);
    return row.map((v) => (v - mean) / std);
  });
}

/**
 * Element-wise ReLU activation max(0, x)
 */
export function relu(A: Matrix): Matrix {
  return A.map((row) => row.map((v) => Math.max(0, v)));
}
