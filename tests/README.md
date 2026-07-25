# Unit Test Suite (`tests/`)

The `tests/` directory contains the unit test suite for **Attention, Visualized** executed via **Vitest**.

---

## 🧪 Running Tests

Execute the unit test suite:
```bash
npm run test
```

For continuous watch mode during development:
```bash
npx vitest
```

---

## 📋 Test Files & Coverage

| File | Test Scope & Verification |
|---|---|
| [`mathEngine.test.ts`](./mathEngine.test.ts) | 15 unit tests verifying pure linear algebra, matrix operations, softmax, positional encoding, scaled dot-product attention intermediate step matrices, multi-head splitting, and encoder/decoder layer forward passes against hand-computed small examples. |
| [`placeholder.test.ts`](./placeholder.test.ts) | Initial environment sanity verification test. |

---

## 🎯 Verification Criteria

Per **AGENTS.md & RULES.md**:
- **100% Math Verification**: Every mathematical calculation in `lib/math/` must be unit-tested against small, hand-verifiable matrices ($2 \times 2$, $d_{\text{model}} = 4$, $h = 2$).
- Softmax outputs must sum to $1.00000$.
- Additive causal masking must set future token positions to $-10^9$ before softmax evaluation.
- Positional encodings must match Vaswani et al. Eq. 1 values ($\sin(0) = 0, \cos(0) = 1$).
