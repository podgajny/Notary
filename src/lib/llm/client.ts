import type { Note } from "../../stores/notes.store";

export type LLMProvider = "openai" | "anthropic";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type StreamChunk = {
  content: string;
  done: boolean;
};

/**
 * Detects the LLM provider from an API key format.
 *
 * @param key - The API key to analyze
 * @returns The detected provider or null if invalid
 */
export function detectProvider(key: string): LLMProvider | null {
  if (!key || typeof key !== "string") {
    return null;
  }

  // Anthropic keys start with sk-ant-
  if (key.startsWith("sk-ant-")) {
    return "anthropic";
  }

  // OpenAI keys start with sk-
  if (key.startsWith("sk-")) {
    return "openai";
  }

  return null;
}

/**
 * Formats notes into context messages for the LLM.
 *
 * @param notes - Array of notes to format as context
 * @returns Formatted context string
 */
export function formatNotesAsContext(notes: Note[]): string {
  if (notes.length === 0) {
    return "";
  }

  return notes
    .map((note) => {
      return `Title: ${note.title}\nContent: ${note.body || "(empty)"}`;
    })
    .join("\n\n---\n\n");
}

/**
 * Abstract interface for LLM providers.
 */
export interface LLMClient {
  sendMessage(
    messages: ChatMessage[],
    context: Note[],
    apiKey: string,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<void>;
}
