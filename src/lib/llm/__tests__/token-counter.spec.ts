import { describe, it, expect } from "vitest";
import { estimateTokens } from "../token-counter";

describe("estimateTokens", () => {
  it("should return 0 for empty string", () => {
    // Act
    const result = estimateTokens("");

    // Assert
    expect(result).toBe(0);
  });

  it("should return 1 token for 4 characters", () => {
    // Act
    const result = estimateTokens("test");

    // Assert
    expect(result).toBe(1);
  });

  it("should return 2 tokens for 5 characters (Math.ceil)", () => {
    // Act
    const result = estimateTokens("tests");

    // Assert
    expect(result).toBe(2);
  });

  it("should handle multi-line text", () => {
    // Arrange
    const multiLineText = "Line 1\nLine 2\nLine 3";

    // Act
    const result = estimateTokens(multiLineText);

    // Assert
    // 20 characters = 5 tokens
    expect(result).toBe(5);
  });

  it("should handle special characters", () => {
    // Arrange
    const specialChars = "!@#$%^&*()";

    // Act
    const result = estimateTokens(specialChars);

    // Assert
    // 10 characters = 3 tokens (Math.ceil(10/4) = 3)
    expect(result).toBe(3);
  });

  it("should handle unicode characters", () => {
    // Arrange
    const unicodeText = "Hello 世界 🌍";

    // Act
    const result = estimateTokens(unicodeText);

    // Assert
    // Counts characters, not bytes
    expect(result).toBeGreaterThan(0);
  });

  it("should handle very long text", () => {
    // Arrange
    const longText = "a".repeat(1000);

    // Act
    const result = estimateTokens(longText);

    // Assert
    // 1000 characters = 250 tokens
    expect(result).toBe(250);
  });
});
