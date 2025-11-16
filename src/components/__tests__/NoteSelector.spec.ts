import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import NoteSelector from "../NoteSelector.vue";

describe("NoteSelector", () => {
  it("should render toggle button", () => {
    // Act
    const wrapper = mount(NoteSelector, {
      props: {
        isActive: false,
        tokenCount: 0,
      },
    });

    // Assert
    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
  });

  it("should show active state when selection mode is on", () => {
    // Act
    const wrapper = mount(NoteSelector, {
      props: {
        isActive: true,
        tokenCount: 0,
      },
    });

    // Assert
    const button = wrapper.find("button");
    const hasActiveClass =
      button.classes().includes("bg-slate-900") ||
      button.classes().includes("bg-slate-800");
    expect(hasActiveClass).toBe(true);
  });

  it("should emit 'toggle' event on click", async () => {
    // Act
    const wrapper = mount(NoteSelector, {
      props: {
        isActive: false,
        tokenCount: 0,
      },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    // Assert
    expect(wrapper.emitted("toggle")).toBeTruthy();
  });

  it("should display token counter when active", () => {
    // Act
    const wrapper = mount(NoteSelector, {
      props: {
        isActive: true,
        tokenCount: 250,
      },
    });

    // Assert
    expect(wrapper.text()).toContain("250");
    expect(wrapper.text()).toContain("1000");
  });

  it("should not display token counter when inactive", () => {
    // Act
    const wrapper = mount(NoteSelector, {
      props: {
        isActive: false,
        tokenCount: 250,
      },
    });

    // Assert
    expect(wrapper.text()).not.toContain("250");
  });

  it("should show token counter in red when > 1000", () => {
    // Act
    const wrapper = mount(NoteSelector, {
      props: {
        isActive: true,
        tokenCount: 1200,
      },
    });

    // Assert
    const html = wrapper.html();
    expect(html).toContain("text-red-600");
  });
});
