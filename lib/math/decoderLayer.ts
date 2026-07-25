import { Matrix, addMatrices, layerNorm, relu, createMatrix, matmul } from './matrix';
import { multiHeadAttention, MultiHeadResult } from './multihead';
import { createCausalMask } from './attention';

export interface DecoderLayerResult {
  maskedSelfAttn: MultiHeadResult;
  maskedAttnNorm: Matrix;
  crossAttn: MultiHeadResult;
  crossAttnNorm: Matrix;
  ffnOutput: Matrix;
  finalOutput: Matrix;
}

/**
 * Single Transformer Decoder Layer (Section 3.1)
 * 1. Sub-layer 1: Masked Self-Attention (Causal Mask) + Residual Add & LayerNorm
 * 2. Sub-layer 2: Multi-Head Cross-Attention (Keys & Values from Encoder Output) + Residual Add & LayerNorm
 * 3. Sub-layer 3: Feed-Forward Network + Residual Add & LayerNorm
 */
export function transformerDecoderLayer(
  Y: Matrix,
  encoderOutput: Matrix,
  numHeads: number = 2
): DecoderLayerResult {
  const seqLenY = Y.length;
  const dModel = Y[0].length;

  // Causal Mask to prevent attending to future tokens
  const causalMask = createCausalMask(seqLenY);

  // Sub-layer 1: Masked Self-Attention
  const maskedSelfAttn = multiHeadAttention(Y, Y, Y, numHeads, causalMask);
  const maskedResidual = addMatrices(Y, maskedSelfAttn.output);
  const maskedAttnNorm = layerNorm(maskedResidual);

  // Sub-layer 2: Cross-Attention (Q from Decoder, K & V from Encoder)
  const crossAttn = multiHeadAttention(
    maskedAttnNorm,
    encoderOutput,
    encoderOutput,
    numHeads
  );
  const crossResidual = addMatrices(maskedAttnNorm, crossAttn.output);
  const crossAttnNorm = layerNorm(crossResidual);

  // Sub-layer 3: Feed-Forward Network
  const dFF = dModel * 2;
  const W1 = createMatrix(dModel, dFF, 0.5);
  const W2 = createMatrix(dFF, dModel, 0.5);

  const ffnHidden = relu(matmul(crossAttnNorm, W1));
  const ffnOutput = matmul(ffnHidden, W2);

  const ffnResidual = addMatrices(crossAttnNorm, ffnOutput);
  const finalOutput = layerNorm(ffnResidual);

  return {
    maskedSelfAttn,
    maskedAttnNorm,
    crossAttn,
    crossAttnNorm,
    ffnOutput,
    finalOutput,
  };
}
