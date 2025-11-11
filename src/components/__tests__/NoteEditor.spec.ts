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
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find("textarea").exists()).toBe(true);
    // Save button should NOT be in the form (moved to header)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(false);
  });

  it("should have appropriate placeholders in fields", () => {
    // Act
    const wrapper = mount(NoteEditor);

    // Assert
    expect(wrapper.find('input[type="text"]').attributes("placeholder")).toBe(
      "Title"
    );
    expect(wrapper.find("textarea").attributes("placeholder")).toBe(
      "Write your note..."
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

  it("should expose submit method for external use", () => {
    // Act
    const wrapper = mount(NoteEditor);

    // Assert - submit method should be exposed
    const exposedSubmit = (wrapper.vm as any).submit;
    expect(exposedSubmit).toBeDefined();
    expect(typeof exposedSubmit).toBe("function");
  });

  it("should expose isSaving state for external use", () => {
    // Act
    const wrapper = mount(NoteEditor);

    // Assert - isSaving should be exposed
    const exposedIsSaving = (wrapper.vm as any).isSaving;
    expect(exposedIsSaving).toBeDefined();
    expect(typeof exposedIsSaving).toBe("boolean");
  });

  it("should call saveNote with valid data when submit is called", async () => {
    // Arrange
    const wrapper = mount(NoteEditor, {
      props: {
        saveNote: mockSaveNote,
      },
    });

    // Act
    await wrapper.find('input[type="text"]').setValue("Test Title");
    await wrapper.find("textarea").setValue("Test body content");
    await (wrapper.vm as any).submit();

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
    await (wrapper.vm as any).submit();

    // Assert
    expect(mockSaveNote).toHaveBeenCalledWith({
      title: "Test Title", // Should be trimmed
      body: "Test body",
    });
  });

  it("should set isSaving to true during save operation", async () => {
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
    const submitPromise = (wrapper.vm as any).submit();

    // Wait for the async operation to start
    await wrapper.vm.$nextTick();

    // Assert - isSaving should be true during save
    expect((wrapper.vm as any).isSaving).toBe(true);

    // Complete the save
    resolvePromise!(undefined);
    await submitPromise;
    await wrapper.vm.$nextTick();

    // Should be false again after save completes
    expect((wrapper.vm as any).isSaving).toBe(false);
  });

  it("should clear form after saving when note is null", async () => {
    // Arrange
    mockSaveNote.mockResolvedValue(undefined);
    const wrapper = mount(NoteEditor, {
      props: {
        saveNote: mockSaveNote,
        note: null,
      },
    });

    // Act
    await wrapper.find('input[type="text"]').setValue("Test Title");
    await wrapper.find("textarea").setValue("Test body");
    await (wrapper.vm as any).submit();
    await wrapper.vm.$nextTick();

    // Assert - form should be cleared when creating new note
    expect(
      (wrapper.find('input[type="text"]').element as HTMLInputElement).value
    ).toBe("");
    expect(
      (wrapper.find("textarea").element as HTMLTextAreaElement).value
    ).toBe("");
  });

  it("should display error when save fails", async () => {
    // Arrange
    const error = new NoteStoreError(
      "STORAGE_WRITE_FAILED",
      "Could not save. Try again."
    );
    mockSaveNote.mockRejectedValue(error);
    const wrapper = mount(NoteEditor, {
      props: {
        saveNote: mockSaveNote,
      },
    });

    // Act
    await wrapper.find('input[type="text"]').setValue("Test Title");
    await (wrapper.vm as any).submit();

    // Assert
    expect(wrapper.find(".text-red-600").text()).toBe(
      "Could not save. Try again."
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
    await (wrapper.vm as any).submit();

    // Assert
    expect(wrapper.find(".text-red-600").text()).toBe("Title is required");
  });

  it("should clear error when user starts typing in title", async () => {
    // Arrange
    const wrapper = mount(NoteEditor);

    // Act - trigger error first by calling submit with empty title
    await (wrapper.vm as any).submit();
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

  it("should have appropriate input attributes for accessibility", () => {
    // Act
    const wrapper = mount(NoteEditor);

    // Assert - inputs should have id attributes for accessibility
    const titleInput = wrapper.find('input[type="text"]');
    const bodyTextarea = wrapper.find("textarea");

    expect(titleInput.attributes("id")).toBe("note-title");
    expect(bodyTextarea.attributes("id")).toBe("note-body");
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

  describe("edit mode", () => {
    it("should accept optional note prop", () => {
      // Arrange
      const testNote = {
        id: "test-id",
        title: "Test Note",
        body: "Test body",
        tags: [],
        pinned: false,
        createdAt: 1000,
        updatedAt: 1000,
      };

      // Act
      const wrapper = mount(NoteEditor, {
        props: {
          note: testNote,
        },
      });

      // Assert
      expect(wrapper.props("note")).toStrictEqual(testNote);
    });

    it("should populate fields when note prop is provided", () => {
      // Arrange
      const testNote = {
        id: "test-id",
        title: "Test Note",
        body: "Test body",
        tags: [],
        pinned: false,
        createdAt: 1000,
        updatedAt: 1000,
      };

      // Act
      const wrapper = mount(NoteEditor, {
        props: {
          note: testNote,
        },
      });

      // Assert
      const titleInput = wrapper.find('input[type="text"]');
      const bodyTextarea = wrapper.find("textarea");
      expect((titleInput.element as HTMLInputElement).value).toBe("Test Note");
      expect((bodyTextarea.element as HTMLTextAreaElement).value).toBe(
        "Test body"
      );
    });

    it("should show placeholders when note is null", () => {
      // Act
      const wrapper = mount(NoteEditor, {
        props: {
          note: null,
        },
      });

      // Assert
      const titleInput = wrapper.find('input[type="text"]');
      const bodyTextarea = wrapper.find("textarea");
      expect(titleInput.attributes("placeholder")).toBe("Title");
      expect(bodyTextarea.attributes("placeholder")).toBe("Write your note...");
      expect((titleInput.element as HTMLInputElement).value).toBe("");
      expect((bodyTextarea.element as HTMLTextAreaElement).value).toBe("");
    });

    it("should update fields when note prop changes", async () => {
      // Arrange
      const testNote1 = {
        id: "test-id-1",
        title: "Note 1",
        body: "Body 1",
        tags: [],
        pinned: false,
        createdAt: 1000,
        updatedAt: 1000,
      };
      const testNote2 = {
        id: "test-id-2",
        title: "Note 2",
        body: "Body 2",
        tags: [],
        pinned: false,
        createdAt: 2000,
        updatedAt: 2000,
      };

      // Act
      const wrapper = mount(NoteEditor, {
        props: {
          note: testNote1,
        },
      });

      // Assert initial state
      const titleInput = wrapper.find('input[type="text"]');
      const bodyTextarea = wrapper.find("textarea");
      expect((titleInput.element as HTMLInputElement).value).toBe("Note 1");

      // Update prop
      await wrapper.setProps({ note: testNote2 });
      await wrapper.vm.$nextTick();

      // Assert updated state
      expect((titleInput.element as HTMLInputElement).value).toBe("Note 2");
      expect((bodyTextarea.element as HTMLTextAreaElement).value).toBe(
        "Body 2"
      );
    });
  });
});
