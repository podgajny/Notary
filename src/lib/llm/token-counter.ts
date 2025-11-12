/**
 * Estimates the number of tokens in a text string.
 * Uses a simple approximation: 4 characters = 1 token.
 *
 * @param text - The text to estimate tokens for
 * @returns The estimated number of tokens
 */
export function estimateTokens(text: string): number {
  if (!text || text.length === 0) {
    return 0;
  }

  return Math.ceil(text.length / 4);
}
