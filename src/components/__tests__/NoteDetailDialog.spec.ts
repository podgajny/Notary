import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NoteDetailDialog from "../NoteDetailDialog.vue";
import type { Note } from "../../stores/notes.store";

describe("NoteDetailDialog", () => {
  const mockNote: Note = {
    id: "test-id-123",
    title: "Test Note Title",
    body: "This is the test note body content.\nWith multiple lines.",
    tags: [],
    pinned: false,
    createdAt: new Date("2025-10-28T10:30:00.000Z").getTime(),
    updatedAt: new Date("2025-10-28T10:30:00.000Z").getTime(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render note title in DialogTitle", async () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    // Assert - check in document body where portal renders
    expect(document.body.textContent).toContain("Test Note Title");

    wrapper.unmount();
  });

  it("should render note body with formatting preserved", async () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    // Assert
    const bodyText = document.body.textContent || "";
    expect(bodyText).toContain("This is the test note body content.");
    expect(bodyText).toContain("With multiple lines.");

    wrapper.unmount();
  });

  it("should render creation date in user-readable format", async () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    // Assert - should display date in readable format
    const bodyText = document.body.textContent || "";
    expect(bodyText).toContain("Created:");
    expect(bodyText).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // Date pattern like MM/DD/YYYY or similar

    wrapper.unmount();
  });

  it("should display Dialog when isOpen is true", async () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    // Assert - check in document body where portal renders
    const dialog = document.querySelector("[role='dialog']");
    expect(dialog).toBeTruthy();

    wrapper.unmount();
  });

  it("should hide Dialog when isOpen is false", async () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: false,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    // Assert
    const dialog = document.querySelector("[role='dialog']");
    expect(dialog).toBeFalsy();

    wrapper.unmount();
  });

  it("should emit 'update:isOpen' event with false value when user closes Dialog", async () => {
    // Arrange
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    // Act - find and click close button in document
    const closeButton = document.querySelector("button");
    expect(closeButton).toBeTruthy();
    closeButton?.click();

    await wrapper.vm.$nextTick();

    // Assert
    expect(wrapper.emitted("update:isOpen")).toBeTruthy();
    expect(wrapper.emitted("update:isOpen")?.[0]).toEqual([false]);

    wrapper.unmount();
  });

  it("should contain close button (X button)", async () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    // Assert - look for close button in document
    const closeButton = document.querySelector("button");
    expect(closeButton).toBeTruthy();

    wrapper.unmount();
  });

  it("should render correct component structure", async () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    // Assert - snapshot test of the dialog content in document
    const dialogContent = document.querySelector("[role='dialog']");
    expect(dialogContent?.innerHTML).toMatchSnapshot();

    wrapper.unmount();
  });
});
