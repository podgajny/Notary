import type { LLMClient, ChatMessage, StreamChunk } from "../client";
import { formatNotesAsContext } from "../client";
import type { Note } from "../../../stores/notes.store";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-3-5-haiku-20241022";
const ANTHROPIC_VERSION = "2023-06-01";

export function createAnthropicClient(): LLMClient {
  return {
    async sendMessage(
      messages: ChatMessage[],
      context: Note[],
      apiKey: string,
      onChunk: (chunk: StreamChunk) => void
    ): Promise<void> {
      // Format context notes as system message
      let systemMessage = "";
      if (context.length > 0) {
        const contextText = formatNotesAsContext(context);
        systemMessage = `You are a helpful assistant. Here are the user's notes for context:\n\n${contextText}`;
      }

      // Convert messages to Anthropic format
      // Anthropic uses a different message format - only user/assistant, no system in messages array
      const anthropicMessages = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          max_tokens: 1024,
          system: systemMessage || undefined,
          messages: anthropicMessages,
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: { message: `HTTP ${response.status}: ${response.statusText}` },
        }));
        throw new Error(error.error?.message || "API request failed");
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            onChunk({ content: "", done: true });
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim() === "") continue;
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                onChunk({ content: "", done: true });
                return;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === "content_block_delta") {
                  const content = parsed.delta?.text || "";
                  if (content) {
                    onChunk({ content, done: false });
                  }
                } else if (parsed.type === "message_stop") {
                  onChunk({ content: "", done: true });
                  return;
                }
              } catch (e) {
                // Skip invalid JSON
              }
            } else {
              // Anthropic also sends JSON without "data: " prefix
              try {
                const parsed = JSON.parse(line);
                if (parsed.type === "content_block_delta") {
                  const content = parsed.delta?.text || "";
                  if (content) {
                    onChunk({ content, done: false });
                  }
                } else if (parsed.type === "message_stop") {
                  onChunk({ content: "", done: true });
                  return;
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        if (reader.releaseLock) {
          reader.releaseLock();
        }
      }
    },
  };
}
