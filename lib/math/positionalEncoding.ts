import { Matrix } from './matrix';

/**
 * Computes sinusoidal Positional Encoding matrix (seqLen x dModel)
 * exactly per Eq. 1 of Vaswani et al., 2017:
 * PE(pos, 2i)   = sin(pos / (10000 ^ (2i / d_model)))
 * PE(pos, 2i+1) = cos(pos / (10000 ^ (2i / d_model)))
 */
export function getPositionalEncoding(seqLen: number, dModel: number): Matrix {
  const pe: Matrix = [];

  for (let pos = 0; pos < seqLen; pos++) {
    const row: number[] = [];
    for (let i = 0; i < dModel; i++) {
      const dimIndex = Math.floor(i / 2);
      const denominator = Math.pow(10000, (2 * dimIndex) / dModel);
      const angle = pos / denominator;

      if (i % 2 === 0) {
        row.push(Number(Math.sin(angle).toFixed(4)));
      } else {
        row.push(Number(Math.cos(angle).toFixed(4)));
      }
    }
    pe.push(row);
  }

  return pe;
}
