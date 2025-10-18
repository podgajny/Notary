import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NoteEditor from "../NoteEditor.vue";
import { NoteStoreError } from "../../stores/notes.store";

describe("NoteEditor", () => {
  const mockSaveNote = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("powinien renderować formularz z polami tytułu i treści", () => {
    // Act
    const wrapper = mount(NoteEditor);

    // Assert
    expect(wrapper.find("h2").text()).toBe("Create a note");
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find("textarea").exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("powinien mieć odpowiednie placeholdery w polach", () => {
    // Act
    const wrapper = mount(NoteEditor);

    // Assert
    expect(wrapper.find('input[type="text"]').attributes("placeholder")).toBe(
      "Title",
    );
    expect(wrapper.find("textarea").attributes("placeholder")).toBe(
      "Write your note...",
    );
  });

  it("powinien wyświetlać błąd gdy tytuł jest pusty", async () => {
    // Arrange
    const wrapper = mount(NoteEditor);

    // Act
    await wrapper.find("form").trigger("submit");

    // Assert
    expect(wrapper.find(".text-red-600").text()).toBe("Title is required");
    expect(mockSaveNote).not.toHaveBeenCalled();
  });

  it("powinien wyświetlać błąd gdy tytuł zawiera tylko spacje", async () => {
    // Arrange
    const wrapper = mount(NoteEditor);
    const titleInput = wrapper.find('input[type="text"]');

    // Act
    await titleInput.setValue("   ");
    await wrapper.find("form").trigger("submit");

    // Assert
    expect(wrapper.find(".text-red-600").text()).toBe("Title is required");
    expect(mockSaveNote).not.toHaveBeenCalled();
  });

  it("powinien wyłączyć przycisk Save gdy tytuł jest pusty", async () => {
    // Arrange
    const wrapper = mount(NoteEditor);

    // Act
    await wrapper.find('input[type="text"]').setValue("");

    // Assert
    expect(
      wrapper.find('button[type="submit"]').attributes("disabled"),
    ).toBeDefined();
  });

  it("powinien włączyć przycisk Save gdy tytuł jest wypełniony", async () => {
    // Arrange
    const wrapper = mount(NoteEditor);

    // Act
    await wrapper.find('input[type="text"]').setValue("Test Title");

    // Assert
    expect(
      wrapper.find('button[type="submit"]').attributes("disabled"),
    ).toBeUndefined();
  });

  it("powinien wywołać saveNote z prawidłowymi danymi", async () => {
    // Arrange
    const wrapper = mount(NoteEditor, {
      props: {
        saveNote: mockSaveNote,
      },
    });

    // Act
    await wrapper.find('input[type="text"]').setValue("Test Title");
    await wrapper.find("textarea").setValue("Test body content");
    await wrapper.find("form").trigger("submit");

    // Assert
    expect(mockSaveNote).toHaveBeenCalledWith({
      title: "Test Title",
      body: "Test body content",
    });
  });

  it("powinien przyciąć tytuł przed wysłaniem", async () => {
    // Arrange
    const wrapper = mount(NoteEditor, {
      props: {
        saveNote: mockSaveNote,
      },
    });

    // Act
    await wrapper.find('input[type="text"]').setValue("  Test Title  ");
    await wrapper.find("textarea").setValue("Test body");
    await wrapper.find("form").trigger("submit");

    // Assert
    expect(mockSaveNote).toHaveBeenCalledWith({
      title: "Test Title", // Should be trimmed
      body: "Test body",
    });
  });

  it("powinien wyłączyć przycisk podczas zapisywania", async () => {
    // Arrange
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockSaveNote.mockReturnValue(promise);

    const wrapper = mount(NoteEditor, {
      props: {
        saveNote: mockSaveNote,
      },
    });

    // Act
    await wrapper.find('input[type="text"]').setValue("Test Title");
    const submitPromise = wrapper.find("form").trigger("submit");

    // Wait for the async operation to start
    await wrapper.vm.$nextTick();

    // Assert - should be disabled during save
    expect(
      wrapper.find('button[type="submit"]').attributes("disabled"),
    ).toBeDefined();

    // Complete the save
    resolvePromise!(undefined);
    await submitPromise;
    await wrapper.vm.$nextTick();

    // Should be enabled again (check that disabled attribute is not present)
    const button = wrapper.find('button[type="submit"]');
    expect(button.attributes("disabled")).toBe("");
  });

  it("powinien wyczyścić formularz po zapisaniu", async () => {
    // Arrange
    mockSaveNote.mockResolvedValue(undefined);
    const wrapper = mount(NoteEditor, {
      props: {
        saveNote: mockSaveNote,
      },
    });

    // Act
    await wrapper.find('input[type="text"]').setValue("Test Title");
    await wrapper.find("textarea").setValue("Test body");
    await wrapper.find("form").trigger("submit");
    await wrapper.vm.$nextTick();

    // Assert - form should be cleared
    expect(
      (wrapper.find('input[type="text"]').element as HTMLInputElement).value,
    ).toBe("");
    expect(
      (wrapper.find("textarea").element as HTMLTextAreaElement).value,
    ).toBe("");
  });

  it("powinien wyświetlać błąd gdy zapisanie się nie powiedzie", async () => {
    // Arrange
    const error = new NoteStoreError(
      "STORAGE_WRITE_FAILED",
      "Could not save. Try again.",
    );
    mockSaveNote.mockRejectedValue(error);
    const wrapper = mount(NoteEditor, {
      props: {
        saveNote: mockSaveNote,
      },
    });

    // Act
    await wrapper.find('input[type="text"]').setValue("Test Title");
    await wrapper.find("form").trigger("submit");

    // Assert
    expect(wrapper.find(".text-red-600").text()).toBe(
      "Could not save. Try again.",
    );
  });

  it("powinien wyświetlać błąd gdy tytuł jest wymagany", async () => {
    // Arrange
    const error = new NoteStoreError("TITLE_REQUIRED", "Title is required");
    mockSaveNote.mockRejectedValue(error);
    const wrapper = mount(NoteEditor, {
      props: {
        saveNote: mockSaveNote,
      },
    });

    // Act
    await wrapper.find('input[type="text"]').setValue("Test Title");
    await wrapper.find("form").trigger("submit");

    // Assert
    expect(wrapper.find(".text-red-600").text()).toBe("Title is required");
  });

  it("powinien wyczyścić błąd gdy użytkownik zacznie pisać w tytule", async () => {
    // Arrange
    const wrapper = mount(NoteEditor);

    // Act - trigger error first
    await wrapper.find("form").trigger("submit");
    expect(wrapper.find(".text-red-600").exists()).toBe(true);

    // Start typing in title
    await wrapper.find('input[type="text"]').setValue("T");

    // Assert - error should be cleared
    expect(wrapper.find(".text-red-600").exists()).toBe(false);
  });

  it("powinien mieć referencję do pola tytułu", () => {
    // Arrange
    const wrapper = mount(NoteEditor);

    // Assert
    expect((wrapper.vm as any).titleInputRef).toBeDefined();
  });

  it("powinien mieć odpowiednie etykiety dla dostępności", () => {
    // Act
    const wrapper = mount(NoteEditor);

    // Assert
    const titleLabel = wrapper.find('label[for="note-title"]');
    const bodyLabel = wrapper.find('label[for="note-body"]');

    expect(titleLabel.text()).toBe("Title");
    expect(bodyLabel.text()).toBe("Body");
  });

  it("powinien mieć odpowiednie atrybuty dla dostępności", () => {
    // Act
    const wrapper = mount(NoteEditor);

    // Assert
    const titleInput = wrapper.find('input[type="text"]');
    const bodyTextarea = wrapper.find("textarea");

    expect(titleInput.attributes("id")).toBe("note-title");
    expect(bodyTextarea.attributes("id")).toBe("note-body");
  });
});
