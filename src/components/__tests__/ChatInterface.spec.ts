import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import ChatInterface from "../ChatInterface.vue";
import { useChatStore } from "../../stores/chat.store";
import { useNotesStore } from "../../stores/notes.store";

// Mock the stores
vi.mock("../../stores/chat.store");
vi.mock("../../stores/notes.store");

describe("ChatInterface", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should render chat header with all buttons", () => {
    // Arrange
    const mockChatStore = {
      messages: [],
      selectionModeActive: false,
      isLoading: false,
      apiKey: "",
      getContextTokens: vi.fn(() => 0),
      toggleSelectionMode: vi.fn(),
      clearChat: vi.fn(),
      sendMessage: vi.fn(),
      setApiKey: vi.fn(),
    };

    const mockNotesStore = {
      notes: [],
    };

    vi.mocked(useChatStore).mockReturnValue(mockChatStore as any);
    vi.mocked(useNotesStore).mockReturnValue(mockNotesStore as any);

    // Act
    const wrapper = mount(ChatInterface);

    // Assert
    expect(wrapper.text()).toContain("API Key");
    expect(wrapper.text()).toContain("New Chat");
  });

  it("should render messages list", () => {
    // Arrange
    const mockChatStore = {
      messages: [
        { id: "1", role: "user", content: "Hello", error: null },
        { id: "2", role: "assistant", content: "Hi", error: null },
      ],
      selectionModeActive: false,
      isLoading: false,
      apiKey: "",
      getContextTokens: vi.fn(() => 0),
      toggleSelectionMode: vi.fn(),
      clearChat: vi.fn(),
      sendMessage: vi.fn(),
      setApiKey: vi.fn(),
    };

    const mockNotesStore = {
      notes: [],
    };

    vi.mocked(useChatStore).mockReturnValue(mockChatStore as any);
    vi.mocked(useNotesStore).mockReturnValue(mockNotesStore as any);

    // Act
    const wrapper = mount(ChatInterface);

    // Assert
    expect(wrapper.text()).toContain("Hello");
    expect(wrapper.text()).toContain("Hi");
  });

  it("should render chat input at bottom", () => {
    // Arrange
    const mockChatStore = {
      messages: [],
      selectionModeActive: false,
      isLoading: false,
      apiKey: "",
      getContextTokens: vi.fn(() => 0),
      toggleSelectionMode: vi.fn(),
      clearChat: vi.fn(),
      sendMessage: vi.fn(),
      setApiKey: vi.fn(),
    };

    const mockNotesStore = {
      notes: [],
    };

    vi.mocked(useChatStore).mockReturnValue(mockChatStore as any);
    vi.mocked(useNotesStore).mockReturnValue(mockNotesStore as any);

    // Act
    const wrapper = mount(ChatInterface);

    // Assert
    const input = wrapper.findComponent({ name: "ChatInput" });
    expect(input.exists()).toBe(true);
  });

  it("should show loading spinner during API calls", () => {
    // Arrange
    const mockChatStore = {
      messages: [],
      selectionModeActive: false,
      isLoading: true,
      apiKey: "",
      getContextTokens: vi.fn(() => 0),
      toggleSelectionMode: vi.fn(),
      clearChat: vi.fn(),
      sendMessage: vi.fn(),
      setApiKey: vi.fn(),
    };

    const mockNotesStore = {
      notes: [],
    };

    vi.mocked(useChatStore).mockReturnValue(mockChatStore as any);
    vi.mocked(useNotesStore).mockReturnValue(mockNotesStore as any);

    // Act
    const wrapper = mount(ChatInterface);

    // Assert
    expect(wrapper.text()).toContain("Thinking...");
  });

  it("should handle 'New chat' button (calls store.clearChat)", async () => {
    // Arrange
    const mockChatStore = {
      messages: [],
      selectionModeActive: false,
      isLoading: false,
      apiKey: "",
      getContextTokens: vi.fn(() => 0),
      toggleSelectionMode: vi.fn(),
      clearChat: vi.fn(),
      sendMessage: vi.fn(),
      setApiKey: vi.fn(),
    };

    const mockNotesStore = {
      notes: [],
    };

    vi.mocked(useChatStore).mockReturnValue(mockChatStore as any);
    vi.mocked(useNotesStore).mockReturnValue(mockNotesStore as any);

    // Act
    const wrapper = mount(ChatInterface);
    const newChatButton = wrapper
      .findAll("button")
      .find((btn) => btn.text().includes("New Chat"));
    if (newChatButton) {
      await newChatButton.trigger("click");
    }

    // Assert
    expect(mockChatStore.clearChat).toHaveBeenCalled();
  });
});
