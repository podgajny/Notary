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

  it("powinien renderować tytuł notatki w DialogTitle", async () => {
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

  it("powinien renderować treść notatki z zachowaniem formatowania", async () => {
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

  it("powinien renderować datę utworzenia w formacie czytelnym dla użytkownika", async () => {
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

  it("powinien wyświetlić Dialog gdy isOpen jest true", async () => {
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

  it("powinien ukryć Dialog gdy isOpen jest false", async () => {
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

  it("powinien emitować zdarzenie 'update:isOpen' z wartością false gdy użytkownik zamyka Dialog", async () => {
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

  it("powinien zawierać przycisk zamykający (X button)", async () => {
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

  it("powinien renderować poprawną strukturę komponentu", async () => {
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
