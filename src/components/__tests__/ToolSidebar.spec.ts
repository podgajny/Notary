import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import ToolSidebar from "../ToolSidebar.vue";

describe("ToolSidebar", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should render ChatInterface component", () => {
    // Act
    const wrapper = mount(ToolSidebar);

    // Assert
    const chatInterface = wrapper.findComponent({ name: "ChatInterface" });
    expect(chatInterface.exists()).toBe(true);
  });
});
