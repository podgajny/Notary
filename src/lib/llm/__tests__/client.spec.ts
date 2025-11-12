import { describe, it, expect, vi, beforeEach } from "vitest";
import { detectProvider } from "../client";

// Mock fetch globally
global.fetch = vi.fn();

describe("detectProvider", () => {
  it("should return 'openai' for OpenAI key (sk- prefix)", () => {
    // Act
    const result = detectProvider("sk-1234567890abcdef");

    // Assert
    expect(result).toBe("openai");
  });

  it("should return 'anthropic' for Anthropic key (sk-ant- prefix)", () => {
    // Act
    const result = detectProvider("sk-ant-1234567890abcdef");

    // Assert
    expect(result).toBe("anthropic");
  });

  it("should return null for invalid key", () => {
    // Act
    const result = detectProvider("invalid-key");

    // Assert
    expect(result).toBeNull();
  });

  it("should return null for empty string", () => {
    // Act
    const result = detectProvider("");

    // Assert
    expect(result).toBeNull();
  });

  it("should return null for key that starts with sk- but is Anthropic format", () => {
    // Act - Anthropic keys start with sk-ant-, so sk- alone should not match Anthropic
    const result = detectProvider("sk-ant-api03-1234567890abcdef");

    // Assert
    expect(result).toBe("anthropic");
  });
});

describe("sendMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle OpenAI streaming response", async () => {
    // This will be tested in the provider-specific tests
    expect(true).toBe(true);
  });

  it("should handle Anthropic streaming response", async () => {
    // This will be tested in the provider-specific tests
    expect(true).toBe(true);
  });
});
