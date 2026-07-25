import { Matrix, addMatrices, layerNorm, relu, createMatrix, matmul } from './matrix';
import { multiHeadAttention, MultiHeadResult } from './multihead';

export interface EncoderLayerResult {
  selfAttention: MultiHeadResult;
  attnNormOutput: Matrix;
  ffnOutput: Matrix;
  finalOutput: Matrix;
}

/**
 * Single Transformer Encoder Layer (Section 3.1)
 * 1. Sub-layer 1: Self-Attention + Residual Add & LayerNorm
 * 2. Sub-layer 2: Feed Forward Network + Residual Add & LayerNorm
 */
export function transformerEncoderLayer(
  X: Matrix,
  numHeads: number = 2
): EncoderLayerResult {
  const dModel = X[0].length;

  // Sub-layer 1: Self-Attention
  const selfAttnResult = multiHeadAttention(X, X, X, numHeads);
  const attnResidual = addMatrices(X, selfAttnResult.output);
  const attnNormOutput = layerNorm(attnResidual);

  // Sub-layer 2: Feed-Forward Network
  // FFN(x) = max(0, xW1 + b1)W2 + b2
  // We use deterministic toy weights for W1 (dModel x 4*dModel) and W2 (4*dModel x dModel)
  const dFF = dModel * 2; // toy inner dimension
  const W1 = createMatrix(dModel, dFF, 0.5);
  const W2 = createMatrix(dFF, dModel, 0.5);

  const ffnHidden = relu(matmul(attnNormOutput, W1));
  const ffnOutput = matmul(ffnHidden, W2);

  const ffnResidual = addMatrices(attnNormOutput, ffnOutput);
  const finalOutput = layerNorm(ffnResidual);

  return {
    selfAttention: selfAttnResult,
    attnNormOutput,
    ffnOutput,
    finalOutput,
  };
}
