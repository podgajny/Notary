import { describe, it, expect, vi, beforeEach } from "vitest";
import { createAnthropicClient } from "../anthropic";
import type { Note } from "../../../../stores/notes.store";
import type { ChatMessage } from "../../client";

// Mock fetch globally
global.fetch = vi.fn();

describe("createAnthropicClient", () => {
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
            '{"type":"message_start","message":{"id":"msg_123","type":"message","role":"assistant","content":[],"model":"claude-3-5-haiku-20241022","stop_reason":null,"stop_sequence":null}}',
            '{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}',
            '{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" world"}}',
            '{"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null}}',
            '{"type":"message_stop"}',
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
                value: new TextEncoder().encode(chunk + "\n"),
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

    const client = createAnthropicClient();
    const messages: ChatMessage[] = [{ role: "user", content: "Hello" }];
    const context: Note[] = [];
    const apiKey = "sk-ant-test123";
    const chunks: string[] = [];

    // Act
    await client.sendMessage(messages, context, apiKey, (chunk) => {
      chunks.push(chunk.content);
    });

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.anthropic.com/v1/messages",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
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

    const client = createAnthropicClient();
    const messages: ChatMessage[] = [{ role: "user", content: "Hello" }];
    const context: Note[] = [];
    const apiKey = "sk-ant-test123";

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

    const client = createAnthropicClient();
    const messages: ChatMessage[] = [{ role: "user", content: "Hello" }];
    const context: Note[] = [];
    const apiKey = "sk-ant-invalid";

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

    const client = createAnthropicClient();
    const messages: ChatMessage[] = [{ role: "user", content: "Hello" }];
    const context: Note[] = [];
    const apiKey = "sk-ant-test123";

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

    const client = createAnthropicClient();
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
    const apiKey = "sk-ant-test123";

    // Act
    await client.sendMessage(messages, context, apiKey, () => {});

    // Assert
    const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const requestBody = JSON.parse(callArgs[1].body);
    expect(requestBody.system).toContain("Note 1");
    expect(requestBody.system).toContain("Content 1");
  });
});
