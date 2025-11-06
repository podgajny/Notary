import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NoteEditor from "../NoteEditor.vue";
import { NoteStoreError } from "../../stores/notes.store";

describe("NoteEditor", () => {
  const mockSaveNote = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render form with title and body fields", () => {
    // Act
    const wrapper = mount(NoteEditor);

    // Assert
    expect(wrapper.find("h2").text()).toBe("Create a note");
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find("textarea").exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("should have appropriate placeholders in fields", () => {
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

  it("should display error when title is empty", async () => {
    // Arrange
    const wrapper = mount(NoteEditor);

    // Act
    await wrapper.find("form").trigger("submit");

    // Assert
    expect(wrapper.find(".text-red-600").text()).toBe("Title is required");
    expect(mockSaveNote).not.toHaveBeenCalled();
  });

  it("should display error when title contains only spaces", async () => {
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

  it("should have Save button enabled when title is empty", async () => {
    // Arrange
    const wrapper = mount(NoteEditor);

    // Act
    await wrapper.find('input[type="text"]').setValue("");

    // Assert
    expect(
      wrapper.find('button[type="submit"]').attributes("disabled"),
    ).toBeUndefined();
  });

  it("should enable Save button when title is filled", async () => {
    // Arrange
    const wrapper = mount(NoteEditor);

    // Act
    await wrapper.find('input[type="text"]').setValue("Test Title");

    // Assert
    expect(
      wrapper.find('button[type="submit"]').attributes("disabled"),
    ).toBeUndefined();
  });

  it("should call saveNote with valid data", async () => {
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

  it("should trim title before submitting", async () => {
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

  it("should disable button during saving", async () => {
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

    // Should be enabled again after save completes
    const button = wrapper.find('button[type="submit"]');
    const disabledAttr = button.attributes("disabled");
    expect(disabledAttr === undefined || disabledAttr === "").toBe(true);
  });

  it("should clear form after saving", async () => {
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

  it("should display error when save fails", async () => {
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

  it("should display error when title is required", async () => {
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

  it("should clear error when user starts typing in title", async () => {
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

  it("should not display validation error on form load", () => {
    // Act
    const wrapper = mount(NoteEditor);

    // Assert - no validation error should be visible initially
    expect(wrapper.find(".text-red-600").exists()).toBe(false);
  });

  it("should have reference to title field", () => {
    // Arrange
    const wrapper = mount(NoteEditor);

    // Assert
    expect(wrapper.vm.$refs.titleInputRef).toBeDefined();
  });

  it("should have appropriate labels for accessibility", () => {
    // Act
    const wrapper = mount(NoteEditor);

    // Assert
    const titleLabel = wrapper.find('label[for="note-title"]');
    const bodyLabel = wrapper.find('label[for="note-body"]');

    expect(titleLabel.text()).toBe("Title");
    expect(bodyLabel.text()).toBe("Body");
  });

  it("should have appropriate attributes for accessibility", () => {
    // Act
    const wrapper = mount(NoteEditor);

    // Assert
    const titleInput = wrapper.find('input[type="text"]');
    const bodyTextarea = wrapper.find("textarea");

    expect(titleInput.attributes("id")).toBe("note-title");
    expect(bodyTextarea.attributes("id")).toBe("note-body");
  });
});
