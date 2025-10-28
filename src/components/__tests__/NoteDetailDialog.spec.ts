import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NoteDetailDialog from "../NoteDetailDialog.vue";

describe("NoteDetailDialog", () => {
  const mockNote = {
    id: "test-id-123",
    title: "Test Note Title",
    body: "This is the test note body content.\nWith multiple lines.",
    createdAt: new Date("2025-10-28T10:30:00.000Z"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("powinien renderować tytuł notatki w DialogTitle", () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
    });

    // Assert
    expect(wrapper.text()).toContain("Test Note Title");
  });

  it("powinien renderować treść notatki z zachowaniem formatowania", () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
    });

    // Assert
    expect(wrapper.text()).toContain(
      "This is the test note body content.\nWith multiple lines.",
    );
  });

  it("powinien renderować datę utworzenia w formacie czytelnym dla użytkownika", () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
    });

    // Assert - should display date in readable format
    expect(wrapper.text()).toContain("Created:");
    expect(wrapper.text()).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // Date pattern like MM/DD/YYYY or similar
  });

  it("powinien wyświetlić Dialog gdy isOpen jest true", () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
    });

    // Assert
    expect(wrapper.find("[role='dialog']").exists()).toBe(true);
  });

  it("powinien ukryć Dialog gdy isOpen jest false", () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: false,
      },
    });

    // Assert
    expect(wrapper.find("[role='dialog']").exists()).toBe(false);
  });

  it("powinien emitować zdarzenie 'update:isOpen' z wartością false gdy użytkownik zamyka Dialog", async () => {
    // Arrange
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
    });

    // Act - find and click close button
    const closeButton = wrapper.find("button[aria-label='Close']");
    await closeButton.trigger("click");

    // Assert
    expect(wrapper.emitted("update:isOpen")).toBeTruthy();
    expect(wrapper.emitted("update:isOpen")?.[0]).toEqual([false]);
  });

  it("powinien zawierać przycisk zamykający (X button)", () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
    });

    // Assert - look for close button
    const closeButton = wrapper.find("button[aria-label='Close']");
    expect(closeButton.exists()).toBe(true);
  });

  it("powinien renderować poprawną strukturę komponentu", () => {
    // Arrange & Act
    const wrapper = mount(NoteDetailDialog, {
      props: {
        note: mockNote,
        isOpen: true,
      },
    });

    // Assert - snapshot test
    expect(wrapper.html()).toMatchSnapshot();
  });
});
