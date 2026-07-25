export interface TokenizerResult {
  tokens: string[];
  tokenIds: number[];
}

export class SimpleTokenizer {
  private vocab: Map<string, number> = new Map();
  private invVocab: Map<number, string> = new Map();

  constructor(customVocab?: string[]) {
    const defaultTokens = [
      '<PAD>',
      '<UNK>',
      '<BOS>',
      '<EOS>',
      'The',
      'transformer',
      'is',
      'all',
      'you',
      'need',
      'Attention',
      'Is',
      'All',
      'You',
      'Need',
      'Je',
      'suis',
      'étudiant',
      'I',
      'am',
      'a',
      'student',
      '.',
      ',',
      '?',
      '!',
    ];

    const tokensToBuild = customVocab || defaultTokens;
    tokensToBuild.forEach((token, idx) => {
      this.vocab.set(token, idx);
      this.invVocab.set(idx, token);
    });
  }

  public tokenize(text: string): TokenizerResult {
    // Basic whitespace & punctuation split
    const rawTokens = text
      .trim()
      .replace(/([.,?!])/g, ' $1')
      .split(/\s+/)
      .filter((t) => t.length > 0);

    const tokenIds = rawTokens.map((t) => {
      if (this.vocab.has(t)) return this.vocab.get(t)!;
      // Try lowercase
      if (this.vocab.has(t.toLowerCase())) return this.vocab.get(t.toLowerCase())!;
      return 1; // <UNK>
    });

    return {
      tokens: rawTokens,
      tokenIds,
    };
  }

  public detokenize(tokenIds: number[]): string {
    return tokenIds
      .map((id) => this.invVocab.get(id) || '<UNK>')
      .join(' ')
      .replace(/\s+([.,?!])/g, '$1');
  }

  public getVocabSize(): number {
    return this.vocab.size;
  }
}

export const defaultTokenizer = new SimpleTokenizer();
