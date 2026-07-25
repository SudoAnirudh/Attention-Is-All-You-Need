import { Matrix } from './matrix';

/**
 * Deterministic pseudo-random number generator (Mulberry32)
 */
function pseudoRandom(seed: number) {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export class EmbeddingTable {
  private dModel: number;
  private table: Map<number, number[]> = new Map();

  constructor(dModel: number = 4) {
    this.dModel = dModel;
  }

  /**
   * Retrieves or deterministically generates embedding vector for a given tokenId
   */
  public getVector(tokenId: number): number[] {
    if (this.table.has(tokenId)) {
      return this.table.get(tokenId)!;
    }

    // Generate deterministic values between -1.0 and 1.0
    const vec: number[] = [];
    for (let i = 0; i < this.dModel; i++) {
      const val = pseudoRandom(tokenId * 100 + i) * 2 - 1;
      vec.push(Number(val.toFixed(4)));
    }
    this.table.set(tokenId, vec);
    return vec;
  }

  /**
   * Maps sequence of tokenIds to embedding matrix (seqLen x dModel).
   * Per paper Section 3.4, embedding weights are multiplied by sqrt(d_model).
   */
  public embedSequence(tokenIds: number[], scaleBySqrt: boolean = true): Matrix {
    const scale = scaleBySqrt ? Math.sqrt(this.dModel) : 1.0;
    return tokenIds.map((id) => {
      const rawVec = this.getVector(id);
      return rawVec.map((val) => Number((val * scale).toFixed(4)));
    });
  }
}
