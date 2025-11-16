import type { LLMClient, ChatMessage, StreamChunk } from "../client";
import { formatNotesAsContext } from "../client";
import type { Note } from "../../../stores/notes.store";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

export function createOpenAIClient(): LLMClient {
  return {
    async sendMessage(
      messages: ChatMessage[],
      context: Note[],
      apiKey: string,
      onChunk: (chunk: StreamChunk) => void
    ): Promise<void> {
      // Format context notes as system message
      const systemMessages: ChatMessage[] = [];
      if (context.length > 0) {
        const contextText = formatNotesAsContext(context);
        systemMessages.push({
          role: "system",
          content: `You are a helpful assistant. Here are the user's notes for context:\n\n${contextText}`,
        });
      }

      const allMessages = [...systemMessages, ...messages];

      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: allMessages,
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
                const content = parsed.choices?.[0]?.delta?.content || "";
                if (content) {
                  onChunk({ content, done: false });
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
