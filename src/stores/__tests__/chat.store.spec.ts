import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useChatStore } from "../chat.store";
import type { Note } from "../notes.store";

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

// Mock LLM providers
const mockSendMessage = vi.fn();

vi.mock("../../lib/llm/providers/openai", () => ({
  createOpenAIClient: () => ({
    sendMessage: mockSendMessage,
  }),
}));

vi.mock("../../lib/llm/providers/anthropic", () => ({
  createAnthropicClient: () => ({
    sendMessage: mockSendMessage,
  }),
}));

describe("chat.store.ts - Pinia store for chat", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    sessionStorageMock.clear();
    vi.clearAllMocks();
    mockSendMessage.mockClear();
  });

  describe("initial state", () => {
    it("should have empty messages array", () => {
      // Act
      const store = useChatStore();

      // Assert
      expect(store.messages).toEqual([]);
    });

    it("should have no API key", () => {
      // Act
      const store = useChatStore();

      // Assert
      expect(store.apiKey).toBe("");
    });

    it("should have selection mode off", () => {
      // Act
      const store = useChatStore();

      // Assert
      expect(store.selectionModeActive).toBe(false);
    });

    it("should have empty selected note IDs", () => {
      // Act
      const store = useChatStore();

      // Assert
      expect(store.selectedNoteIds).toEqual([]);
    });

    it("should have no active provider", () => {
      // Act
      const store = useChatStore();

      // Assert
      expect(store.activeProvider).toBeNull();
    });
  });

  describe("setApiKey", () => {
    it("should validate and store OpenAI key in sessionStorage", () => {
      // Arrange
      const store = useChatStore();
      const apiKey = "sk-1234567890abcdef";

      // Act
      store.setApiKey(apiKey);

      // Assert
      expect(store.apiKey).toBe(apiKey);
      expect(store.activeProvider).toBe("openai");
      expect(sessionStorage.getItem("chatApiKey")).toBe(apiKey);
    });

    it("should validate and store Anthropic key in sessionStorage", () => {
      // Arrange
      const store = useChatStore();
      const apiKey = "sk-ant-1234567890abcdef";

      // Act
      store.setApiKey(apiKey);

      // Assert
      expect(store.apiKey).toBe(apiKey);
      expect(store.activeProvider).toBe("anthropic");
      expect(sessionStorage.getItem("chatApiKey")).toBe(apiKey);
    });

    it("should reject invalid keys", () => {
      // Arrange
      const store = useChatStore();
      const invalidKey = "invalid-key";

      // Act & Assert
      expect(() => store.setApiKey(invalidKey)).toThrow();
      expect(store.apiKey).toBe("");
      expect(store.activeProvider).toBeNull();
    });

    it("should load API key from sessionStorage on initialization", () => {
      // Arrange
      const savedKey = "sk-1234567890abcdef";
      sessionStorage.setItem("chatApiKey", savedKey);

      // Act
      const store = useChatStore();

      // Assert
      expect(store.apiKey).toBe(savedKey);
      expect(store.activeProvider).toBe("openai");
    });
  });

  describe("toggleSelectionMode", () => {
    it("should toggle selection mode on", () => {
      // Arrange
      const store = useChatStore();
      expect(store.selectionModeActive).toBe(false);

      // Act
      store.toggleSelectionMode();

      // Assert
      expect(store.selectionModeActive).toBe(true);
    });

    it("should toggle selection mode off", () => {
      // Arrange
      const store = useChatStore();
      store.selectionModeActive = true;

      // Act
      store.toggleSelectionMode();

      // Assert
      expect(store.selectionModeActive).toBe(false);
    });
  });

  describe("addNoteToContext", () => {
    it("should add note ID to selected notes", () => {
      // Arrange
      const store = useChatStore();
      const noteId = "note-1";

      // Act
      store.addNoteToContext(noteId);

      // Assert
      expect(store.selectedNoteIds).toContain(noteId);
      expect(store.selectedNoteIds).toHaveLength(1);
    });

    it("should not add duplicate note IDs", () => {
      // Arrange
      const store = useChatStore();
      const noteId = "note-1";

      // Act
      store.addNoteToContext(noteId);
      store.addNoteToContext(noteId);

      // Assert
      expect(store.selectedNoteIds).toHaveLength(1);
      expect(store.selectedNoteIds).toEqual([noteId]);
    });
  });

  describe("removeNoteFromContext", () => {
    it("should remove note ID from selected notes", () => {
      // Arrange
      const store = useChatStore();
      store.selectedNoteIds = ["note-1", "note-2"];

      // Act
      store.removeNoteFromContext("note-1");

      // Assert
      expect(store.selectedNoteIds).not.toContain("note-1");
      expect(store.selectedNoteIds).toContain("note-2");
      expect(store.selectedNoteIds).toHaveLength(1);
    });

    it("should handle removing non-existent note ID", () => {
      // Arrange
      const store = useChatStore();
      store.selectedNoteIds = ["note-1"];

      // Act
      store.removeNoteFromContext("note-2");

      // Assert
      expect(store.selectedNoteIds).toHaveLength(1);
      expect(store.selectedNoteIds).toEqual(["note-1"]);
    });
  });

  describe("getContextTokens", () => {
    it("should calculate tokens from selected notes", () => {
      // Arrange
      const store = useChatStore();
      const notes: Note[] = [
        {
          id: "note-1",
          title: "Test Note",
          body: "This is a test note with some content",
          tags: [],
          pinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "note-2",
          title: "Another Note",
          body: "More content here",
          tags: [],
          pinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      store.selectedNoteIds = ["note-1", "note-2"];

      // Act
      const tokens = store.getContextTokens(notes);

      // Assert
      // "Test Note" + "This is a test note with some content" = ~50 chars = ~13 tokens
      // "Another Note" + "More content here" = ~35 chars = ~9 tokens
      // Total should be around 22 tokens
      expect(tokens).toBeGreaterThan(0);
    });

    it("should return 0 when no notes selected", () => {
      // Arrange
      const store = useChatStore();
      const notes: Note[] = [];

      // Act
      const tokens = store.getContextTokens(notes);

      // Assert
      expect(tokens).toBe(0);
    });

    it("should only count tokens from selected notes", () => {
      // Arrange
      const store = useChatStore();
      const notes: Note[] = [
        {
          id: "note-1",
          title: "Selected",
          body: "This note is selected",
          tags: [],
          pinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: "note-2",
          title: "Not Selected",
          body: "This note is not selected",
          tags: [],
          pinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      store.selectedNoteIds = ["note-1"];

      // Act
      const tokens = store.getContextTokens(notes);

      // Assert
      // Should only count "Selected" + "This note is selected" = ~35 chars = ~9 tokens
      expect(tokens).toBeGreaterThan(0);
      expect(tokens).toBeLessThan(50); // Should be less than if both were counted
    });
  });

  describe("clearChat", () => {
    it("should clear messages and selected notes", () => {
      // Arrange
      const store = useChatStore();
      store.messages = [
        { id: "1", role: "user", content: "Hello", error: null },
        { id: "2", role: "assistant", content: "Hi", error: null },
      ];
      store.selectedNoteIds = ["note-1", "note-2"];

      // Act
      store.clearChat();

      // Assert
      expect(store.messages).toEqual([]);
      expect(store.selectedNoteIds).toEqual([]);
    });
  });

  describe("sendMessage", () => {
    it("should add user message to state", async () => {
      // Arrange
      const store = useChatStore();
      store.apiKey = "sk-test123";
      store.activeProvider = "openai";
      mockSendMessage.mockResolvedValue(undefined);

      // Act
      await store.sendMessage("Hello", []);

      // Assert
      expect(store.messages.length).toBeGreaterThanOrEqual(1);
      const userMessage = store.messages.find((m) => m.role === "user");
      expect(userMessage).toBeDefined();
      expect(userMessage?.content).toBe("Hello");
    });

    it("should handle streaming responses", async () => {
      // Arrange
      const store = useChatStore();
      store.apiKey = "sk-test123";
      store.activeProvider = "openai";

      mockSendMessage.mockImplementation(
        async (_messages, _context, _apiKey, onChunk) => {
          // Simulate streaming
          onChunk({ content: "Hello", done: false });
          onChunk({ content: " world", done: false });
          onChunk({ content: "", done: true });
        }
      );

      // Act
      await store.sendMessage("Hi", []);

      // Assert
      expect(store.messages.length).toBeGreaterThanOrEqual(2); // user + assistant
      const assistantMessage = store.messages.find(
        (m) => m.role === "assistant"
      );
      expect(assistantMessage).toBeDefined();
      expect(assistantMessage?.content).toBe("Hello world");
    });

    it("should handle errors per message", async () => {
      // Arrange
      const store = useChatStore();
      store.apiKey = "sk-test123";
      store.activeProvider = "openai";

      mockSendMessage.mockRejectedValue(new Error("API error"));

      // Act
      await store.sendMessage("Hello", []);

      // Assert
      expect(store.messages.length).toBeGreaterThanOrEqual(2); // user + assistant with error
      const assistantMessage = store.messages.find(
        (m) => m.role === "assistant"
      );
      expect(assistantMessage).toBeDefined();
      expect(assistantMessage?.error).toBeTruthy();
      expect(assistantMessage?.error).toContain("API error");
    });
  });
});
