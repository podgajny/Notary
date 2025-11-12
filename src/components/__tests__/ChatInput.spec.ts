import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ChatInput from "../ChatInput.vue";

describe("ChatInput", () => {
  it("should render textarea and send button", () => {
    // Act
    const wrapper = mount(ChatInput, {
      props: {
        isLoading: false,
      },
    });

    // Assert
    const textarea = wrapper.find("textarea");
    const sendButton = wrapper.find("button[type='submit']");
    expect(textarea.exists()).toBe(true);
    expect(sendButton.exists()).toBe(true);
  });

  it("should disable send button when input empty", async () => {
    // Act
    const wrapper = mount(ChatInput, {
      props: {
        isLoading: false,
      },
    });

    // Assert
    const sendButton = wrapper.find("button[type='submit']");
    expect(sendButton.attributes("disabled")).toBeDefined();
  });

  it("should enable send button when input has text", async () => {
    // Act
    const wrapper = mount(ChatInput, {
      props: {
        isLoading: false,
      },
    });

    const textarea = wrapper.find("textarea");
    await textarea.setValue("Hello");

    // Assert
    const sendButton = wrapper.find("button[type='submit']");
    expect(sendButton.attributes("disabled")).toBeUndefined();
  });

  it("should disable send button when loading", () => {
    // Act
    const wrapper = mount(ChatInput, {
      props: {
        isLoading: true,
      },
    });

    // Assert
    const sendButton = wrapper.find("button[type='submit']");
    expect(sendButton.attributes("disabled")).toBeDefined();
    const textarea = wrapper.find("textarea");
    expect(textarea.attributes("disabled")).toBeDefined();
  });

  it("should emit 'send' event with message text", async () => {
    // Act
    const wrapper = mount(ChatInput, {
      props: {
        isLoading: false,
      },
    });

    const textarea = wrapper.find("textarea");
    await textarea.setValue("Hello, world!");
    await wrapper.find("form").trigger("submit.prevent");

    // Assert
    expect(wrapper.emitted("send")).toBeTruthy();
    expect(wrapper.emitted("send")?.[0]).toEqual(["Hello, world!"]);
  });

  it("should clear input after sending", async () => {
    // Act
    const wrapper = mount(ChatInput, {
      props: {
        isLoading: false,
      },
    });

    const textarea = wrapper.find("textarea");
    await textarea.setValue("Hello");
    await wrapper.find("form").trigger("submit.prevent");

    // Assert
    expect((textarea.element as HTMLTextAreaElement).value).toBe("");
  });

  it("should handle Enter key to send (Shift+Enter for newline)", async () => {
    // Act
    const wrapper = mount(ChatInput, {
      props: {
        isLoading: false,
      },
    });

    const textarea = wrapper.find("textarea");
    await textarea.setValue("Hello");
    await textarea.trigger("keydown", { key: "Enter", shiftKey: false });

    // Assert
    expect(wrapper.emitted("send")).toBeTruthy();
    expect(wrapper.emitted("send")?.[0]).toEqual(["Hello"]);
  });

  it("should not send on Shift+Enter (allows newline)", async () => {
    // Act
    const wrapper = mount(ChatInput, {
      props: {
        isLoading: false,
      },
    });

    const textarea = wrapper.find("textarea");
    await textarea.setValue("Hello");
    await textarea.trigger("keydown", { key: "Enter", shiftKey: true });

    // Assert
    expect(wrapper.emitted("send")).toBeFalsy();
  });
});
