import { describe, it, expect, vi, beforeEach } from "vitest";
import { createOpenAIClient } from "../openai";
import type { Note } from "../../../../stores/notes.store";
import type { ChatMessage } from "../../client";

// Mock fetch globally
global.fetch = vi.fn();

describe("createOpenAIClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle successful streaming response", async () => {
    // Arrange
    const mockResponse = {
      ok: true,
      body: {
        getReader: () => {
          const chunks = [
            'data: {"id":"chatcmpl-123","choices":[{"delta":{"content":"Hello"},"index":0,"finish_reason":null}]}\n\n',
            'data: {"id":"chatcmpl-123","choices":[{"delta":{"content":" world"},"index":0,"finish_reason":null}]}\n\n',
            "data: [DONE]\n\n",
          ];
          let index = 0;

          return {
            read: () => {
              if (index >= chunks.length) {
                return Promise.resolve({ done: true, value: undefined });
              }

              const chunk = chunks[index++];
              return Promise.resolve({
                done: false,
                value: new TextEncoder().encode(chunk),
              });
            },
            releaseLock: vi.fn(),
          };
        },
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockResponse as unknown as Response
    );

    const client = createOpenAIClient();
    const messages: ChatMessage[] = [{ role: "user", content: "Hello" }];
    const context: Note[] = [];
    const apiKey = "sk-test123";
    const chunks: string[] = [];

    // Act
    await client.sendMessage(messages, context, apiKey, (chunk) => {
      chunks.push(chunk.content);
    });

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        }),
      })
    );
    expect(chunks.join("")).toBe("Hello world");
  });

  it("should handle network errors", async () => {
    // Arrange
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Network error")
    );

    const client = createOpenAIClient();
    const messages: ChatMessage[] = [{ role: "user", content: "Hello" }];
    const context: Note[] = [];
    const apiKey = "sk-test123";

    // Act & Assert
    await expect(
      client.sendMessage(messages, context, apiKey, () => {})
    ).rejects.toThrow("Network error");
  });

  it("should handle API errors (invalid key)", async () => {
    // Arrange
    const mockResponse = {
      ok: false,
      status: 401,
      json: async () => ({ error: { message: "Invalid API key" } }),
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockResponse as unknown as Response
    );

    const client = createOpenAIClient();
    const messages: ChatMessage[] = [{ role: "user", content: "Hello" }];
    const context: Note[] = [];
    const apiKey = "sk-invalid";

    // Act & Assert
    await expect(
      client.sendMessage(messages, context, apiKey, () => {})
    ).rejects.toThrow();
  });

  it("should handle rate limit errors", async () => {
    // Arrange
    const mockResponse = {
      ok: false,
      status: 429,
      json: async () => ({ error: { message: "Rate limit exceeded" } }),
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockResponse as unknown as Response
    );

    const client = createOpenAIClient();
    const messages: ChatMessage[] = [{ role: "user", content: "Hello" }];
    const context: Note[] = [];
    const apiKey = "sk-test123";

    // Act & Assert
    await expect(
      client.sendMessage(messages, context, apiKey, () => {})
    ).rejects.toThrow();
  });

  it("should format context notes correctly", async () => {
    // Arrange
    const mockResponse = {
      ok: true,
      body: {
        getReader: () => {
          return {
            read: () => Promise.resolve({ done: true, value: undefined }),
            releaseLock: vi.fn(),
          };
        },
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockResponse as unknown as Response
    );

    const client = createOpenAIClient();
    const messages: ChatMessage[] = [
      { role: "user", content: "Tell me about my notes" },
    ];
    const context: Note[] = [
      {
        id: "1",
        title: "Note 1",
        body: "Content 1",
        tags: [],
        pinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
    const apiKey = "sk-test123";

    // Act
    await client.sendMessage(messages, context, apiKey, () => {});

    // Assert
    const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const requestBody = JSON.parse(callArgs[1].body);
    expect(requestBody.messages).toHaveLength(2); // system + user
    expect(requestBody.messages[0].role).toBe("system");
    expect(requestBody.messages[0].content).toContain("Note 1");
    expect(requestBody.messages[0].content).toContain("Content 1");
  });
});
