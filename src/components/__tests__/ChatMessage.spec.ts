import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ChatMessage from "../ChatMessage.vue";
import type { ChatMessage as ChatMessageType } from "../../stores/chat.store";

describe("ChatMessage", () => {
  const createMockMessage = (
    overrides: Partial<ChatMessageType> = {}
  ): ChatMessageType => ({
    id: "test-id",
    role: "user",
    content: "Test message",
    error: null,
    ...overrides,
  });

  it("should render user message (right-aligned)", () => {
    // Arrange
    const message = createMockMessage({
      role: "user",
      content: "Hello, world!",
    });

    // Act
    const wrapper = mount(ChatMessage, {
      props: {
        message,
      },
    });

    // Assert
    const messageElement = wrapper.find('[data-testid="message"]');
    expect(messageElement.exists()).toBe(true);
    expect(messageElement.text()).toContain("Hello, world!");
    // Check for right alignment classes
    const hasRightAlignment =
      messageElement.classes().includes("ml-auto") ||
      messageElement.classes().includes("justify-end") ||
      wrapper.html().includes("justify-end");
    expect(hasRightAlignment).toBe(true);
  });

  it("should render assistant message (left-aligned)", () => {
    // Arrange
    const message = createMockMessage({
      role: "assistant",
      content: "Hi there!",
    });

    // Act
    const wrapper = mount(ChatMessage, {
      props: {
        message,
      },
    });

    // Assert
    const messageElement = wrapper.find('[data-testid="message"]');
    expect(messageElement.exists()).toBe(true);
    expect(messageElement.text()).toContain("Hi there!");
    // Check for left alignment (default or explicit)
    const hasLeftAlignment =
      !messageElement.classes().includes("ml-auto") ||
      messageElement.classes().includes("justify-start") ||
      !wrapper.html().includes("justify-end");
    expect(hasLeftAlignment).toBe(true);
  });

  it("should render error message with error styling", () => {
    // Arrange
    const message = createMockMessage({
      role: "assistant",
      content: "",
      error: "API error occurred",
    });

    // Act
    const wrapper = mount(ChatMessage, {
      props: {
        message,
      },
    });

    // Assert
    const errorElement = wrapper.find('[data-testid="error"]');
    expect(errorElement.exists()).toBe(true);
    expect(errorElement.text()).toContain("API error occurred");
    // Check for error styling (red text)
    const hasErrorStyling =
      errorElement.classes().includes("text-red") ||
      errorElement.classes().includes("text-red-600") ||
      wrapper.html().includes("text-red");
    expect(hasErrorStyling).toBe(true);
  });

  it("should display message content correctly", () => {
    // Arrange
    const message = createMockMessage({
      content: "This is a test message with multiple words.",
    });

    // Act
    const wrapper = mount(ChatMessage, {
      props: {
        message,
      },
    });

    // Assert
    expect(wrapper.text()).toContain(
      "This is a test message with multiple words."
    );
  });

  it("should handle empty messages", () => {
    // Arrange
    const message = createMockMessage({
      content: "",
    });

    // Act
    const wrapper = mount(ChatMessage, {
      props: {
        message,
      },
    });

    // Assert
    const messageElement = wrapper.find('[data-testid="message"]');
    expect(messageElement.exists()).toBe(true);
  });
});
