import { defineStore } from "pinia";
import { detectProvider, type LLMProvider } from "../lib/llm/client";
import { createOpenAIClient } from "../lib/llm/providers/openai";
import { createAnthropicClient } from "../lib/llm/providers/anthropic";
import { estimateTokens } from "../lib/llm/token-counter";
import type { Note } from "./notes.store";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  error: string | null;
};

const STORAGE_KEY = "chatApiKey";

export const useChatStore = defineStore("chat", {
  state: () => {
    // Load API key from sessionStorage on initialization
    let apiKey = "";
    let activeProvider: LLMProvider | null = null;

    if (typeof window !== "undefined") {
      const savedKey = sessionStorage.getItem(STORAGE_KEY);
      if (savedKey) {
        try {
          const provider = detectProvider(savedKey);
          if (provider) {
            apiKey = savedKey;
            activeProvider = provider;
          } else {
            sessionStorage.removeItem(STORAGE_KEY);
          }
        } catch {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    }

    return {
      messages: [] as ChatMessage[],
      selectedNoteIds: [] as string[],
      apiKey,
      activeProvider,
      selectionModeActive: false,
      isLoading: false,
    };
  },

  actions: {
    setApiKey(key: string) {
      const provider = detectProvider(key);
      if (!provider) {
        throw new Error("Invalid API key format");
      }

      this.apiKey = key;
      this.activeProvider = provider;

      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, key);
      }
    },

    toggleSelectionMode() {
      this.selectionModeActive = !this.selectionModeActive;
    },

    addNoteToContext(noteId: string) {
      if (!this.selectedNoteIds.includes(noteId)) {
        this.selectedNoteIds.push(noteId);
      }
    },

    removeNoteFromContext(noteId: string) {
      const index = this.selectedNoteIds.indexOf(noteId);
      if (index > -1) {
        this.selectedNoteIds.splice(index, 1);
      }
    },

    getContextTokens(notes: Note[]): number {
      const selectedNotes = notes.filter((note) =>
        this.selectedNoteIds.includes(note.id)
      );

      if (selectedNotes.length === 0) {
        return 0;
      }

      const totalText = selectedNotes
        .map((note) => `${note.title}\n${note.body || ""}`)
        .join("\n\n");

      return estimateTokens(totalText);
    },

    clearChat() {
      this.messages = [];
      this.selectedNoteIds = [];
    },

    async sendMessage(message: string, notes: Note[]) {
      if (!this.apiKey || !this.activeProvider) {
        throw new Error("API key not set");
      }

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: message,
        error: null,
      };
      this.messages.push(userMessage);

      // Create assistant message placeholder
      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        error: null,
      };
      this.messages.push(assistantMessage);

      this.isLoading = true;

      try {
        // Get client based on provider
        const client =
          this.activeProvider === "openai"
            ? createOpenAIClient()
            : createAnthropicClient();

        // Convert messages to LLM format
        const llmMessages = this.messages
          .filter((msg) => msg.role !== "assistant" || msg.content)
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

        // Get selected notes for context
        const contextNotes = notes.filter((note) =>
          this.selectedNoteIds.includes(note.id)
        );

        // Send message with streaming
        await client.sendMessage(
          llmMessages,
          contextNotes,
          this.apiKey,
          (chunk) => {
            if (chunk.done) {
              this.isLoading = false;
            } else {
              // Find and update the assistant message reactively
              const messageIndex = this.messages.findIndex(
                (msg) => msg.id === assistantMessageId
              );

              if (messageIndex !== -1 && chunk.content) {
                // Direct mutation - Pinia makes arrays reactive
                this.messages[messageIndex].content =
                  this.messages[messageIndex].content + chunk.content;
              }
            }
          }
        );
      } catch (error) {
        this.isLoading = false;
        // Find and update the assistant message with error
        const messageIndex = this.messages.findIndex(
          (msg) => msg.id === assistantMessageId
        );
        if (messageIndex !== -1) {
          this.messages[messageIndex].error =
            error instanceof Error ? error.message : "Unknown error occurred";
        }
      }
    },
  },
});
