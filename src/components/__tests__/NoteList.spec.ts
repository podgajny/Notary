import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import NoteList from "../NoteList.vue";
import type { Note } from "../../stores/notes.store";

describe("NoteList", () => {
  const createMockNote = (overrides: Partial<Note> = {}): Note => ({
    id: "test-id",
    title: "Test Note",
    body: "Test body content",
    tags: [],
    pinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  });

  it("should render notes list without section wrapper", () => {
    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [],
      },
    });

    // Assert - should not have section wrapper or h2 heading
    expect(wrapper.find("section").exists()).toBe(false);
    expect(wrapper.find("h2").exists()).toBe(false);
  });

  it("should display loading state", () => {
    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [],
        isLoading: true,
      },
    });

    // Assert
    expect(wrapper.find(".text-slate-500").text()).toBe("Loading notes…");
  });

  it("should display loading error", () => {
    // Arrange
    const errorMessage = "Could not load notes";

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [],
        loadError: errorMessage,
      },
    });

    // Assert
    expect(wrapper.find(".text-red-600").text()).toBe(errorMessage);
  });

  it("should display empty state when there are no notes", () => {
    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [],
        isLoading: false,
        loadError: "",
      },
    });

    // Assert
    expect(wrapper.find(".text-slate-600").text()).toBe(
      "No notes yet. Once you save a note it will appear here."
    );
  });

  it("should render list of notes", () => {
    // Arrange
    const notes = [
      createMockNote({ id: "1", title: "First Note", body: "First body" }),
      createMockNote({ id: "2", title: "Second Note", body: "Second body" }),
    ];

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes,
      },
    });

    // Assert
    const listItems = wrapper.findAll("li");
    expect(listItems).toHaveLength(2);

    expect(listItems[0].find(".text-sm").text()).toBe("First Note");
    expect(listItems[1].find(".text-sm").text()).toBe("Second Note");
  });

  it("should display note title and body", () => {
    // Arrange
    const note = createMockNote({
      title: "My Test Note",
      body: "This is the body content of the note",
    });

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Assert
    const listItem = wrapper.find("li");
    expect(listItem.find(".text-sm").text()).toBe("My Test Note");
    expect(listItem.find(".text-slate-600").text()).toBe(
      "This is the body content of the note"
    );
  });

  it("should display maximum 5 lines of text for long notes", () => {
    // Arrange - creating note with long content (200+ words, which will definitely exceed 5 lines)
    const longBody =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.";

    const note = createMockNote({
      title: "Long Multiline Note",
      body: longBody,
    });

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Assert - check if element has line-clamp class
    const bodyElement = wrapper.find(".text-slate-600");
    expect(bodyElement.classes()).toContain("line-clamp-3");
    expect(bodyElement.classes()).toContain("break-words");
  });

  it("should have break-words for short note", () => {
    // Arrange - short note (20-30 words, 1-2 lines)
    const shortBody =
      "This is a short note with just a few words that should display normally without any truncation issues.";

    const note = createMockNote({
      title: "Short Note",
      body: shortBody,
    });

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Assert - even short notes should have both classes
    const bodyElement = wrapper.find(".text-slate-600");
    expect(bodyElement.classes()).toContain("line-clamp-3");
    expect(bodyElement.classes()).toContain("break-words");
  });

  it("should break very long unbreakable character sequences", () => {
    // Arrange - note with very long word without spaces (simulating bug with "Dłuuuuuuu...")
    const unbreakableString = "Dł" + "u".repeat(500) + "ga notatka";

    const note = createMockNote({
      title: "Unbreakable String Note",
      body: unbreakableString,
    });

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Assert - break-words must be present to prevent horizontal overflow
    const bodyElement = wrapper.find(".text-slate-600");
    expect(bodyElement.classes()).toContain("break-words");
    expect(bodyElement.classes()).toContain("line-clamp-3");
  });

  it("should display full content when it is short", () => {
    // Arrange
    const shortBody = "Short body";
    const note = createMockNote({
      title: "Short Note",
      body: shortBody,
    });

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Assert
    expect(wrapper.find(".text-slate-600").text()).toBe("Short body");
  });

  it('should display "No body text yet" when content is empty', () => {
    // Arrange
    const note = createMockNote({
      title: "Empty Note",
      body: "",
    });

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Assert
    expect(wrapper.find(".text-slate-400").text()).toBe("No body text yet.");
  });

  it("should format timestamp in readable way", () => {
    // Arrange
    const timestamp = new Date("2024-01-15T14:30:00Z").getTime();
    const note = createMockNote({
      title: "Timestamped Note",
      updatedAt: timestamp,
    });

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Assert
    const timeElement = wrapper.find("time");
    expect(timeElement.exists()).toBe(true);
    expect(timeElement.text()).toContain("Jan");
    expect(timeElement.text()).toContain("2024");
  });

  it("should have appropriate attributes for accessibility", () => {
    // Arrange
    const note = createMockNote();

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Assert
    const timeElement = wrapper.find("time");
    expect(timeElement.exists()).toBe(true);
    expect(timeElement.attributes("class")).toContain("text-xs");
  });

  it("should render notes in correct order", () => {
    // Arrange
    const now = Date.now();
    const notes = [
      createMockNote({ id: "1", title: "Older Note", updatedAt: now - 1000 }),
      createMockNote({ id: "2", title: "Newer Note", updatedAt: now }),
    ];

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes,
      },
    });

    // Assert
    const listItems = wrapper.findAll("li");
    expect(listItems[0].find(".text-sm").text()).toBe("Older Note");
    expect(listItems[1].find(".text-sm").text()).toBe("Newer Note");
  });

  it("should have appropriate CSS classes for sidebar styling", () => {
    // Arrange
    const note = createMockNote();

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Assert - should not have section wrapper
    expect(wrapper.find("section").exists()).toBe(false);

    const listItem = wrapper.find("li");
    expect(listItem.classes()).toContain("rounded-md");
    expect(listItem.classes()).toContain("border");
    expect(listItem.classes()).toContain("p-3");
  });

  it("should handle default prop values", () => {
    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [],
      },
    });

    // Assert
    expect(wrapper.props("isLoading")).toBe(false);
    expect(wrapper.props("loadError")).toBe("");
  });

  it("should display loading state instead of empty state", () => {
    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [],
        isLoading: true,
        loadError: "",
      },
    });

    // Assert
    expect(wrapper.find(".text-slate-500").exists()).toBe(true);
    expect(wrapper.find(".text-slate-600").exists()).toBe(false);
  });

  it("should display error instead of empty state", () => {
    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [],
        isLoading: false,
        loadError: "Network error",
      },
    });

    // Assert
    expect(wrapper.find(".text-red-600").exists()).toBe(true);
    expect(wrapper.find(".text-slate-600").exists()).toBe(false);
  });

  it("should emit 'note-clicked' event with note object when user clicks note", async () => {
    // Arrange
    const note = createMockNote({
      id: "test-123",
      title: "Clickable Note",
      body: "Click me!",
    });

    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Act
    const listItem = wrapper.find("li");
    await listItem.trigger("click");

    // Assert
    expect(wrapper.emitted("note-clicked")).toBeTruthy();
    expect(wrapper.emitted("note-clicked")?.[0]).toEqual([note]);
  });

  it("should add cursor-pointer to note elements", () => {
    // Arrange
    const note = createMockNote();

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Assert
    const listItem = wrapper.find("li");
    expect(listItem.classes()).toContain("cursor-pointer");
  });

  it("should display hover effect on notes", () => {
    // Arrange
    const note = createMockNote();

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Assert
    const listItem = wrapper.find("li");
    // Check if hover classes are present - using regex/contains
    const hasHoverClass =
      listItem.classes().some((cls) => cls.includes("hover:")) ||
      listItem.attributes("class")?.includes("hover:");
    expect(hasHoverClass).toBe(true);
  });

  describe("header area", () => {
    it("should render a header section at the top", () => {
      // Act
      const wrapper = mount(NoteList, {
        props: {
          notes: [],
        },
      });

      // Assert
      const header = wrapper.find("header");
      expect(header.exists()).toBe(true);
    });

    it("should contain a dummy button in the header", () => {
      // Act
      const wrapper = mount(NoteList, {
        props: {
          notes: [],
        },
      });

      // Assert
      const header = wrapper.find("header");
      const dummyButton = header.find("button");
      expect(dummyButton.exists()).toBe(true);
      expect(dummyButton.text()).toBe("Dummy");
    });

    it("should have dummy button taking approximately 1/4 of header width", () => {
      // Act
      const wrapper = mount(NoteList, {
        props: {
          notes: [],
        },
      });

      // Assert
      const header = wrapper.find("header");
      const dummyButton = header.find("button");
      // Check for w-1/4 class or similar width class
      const hasQuarterWidth =
        dummyButton.classes().includes("w-1/4") ||
        dummyButton.attributes("class")?.includes("w-1/4");
      expect(hasQuarterWidth).toBe(true);
    });

    it("should have header visible when component is rendered", () => {
      // Act
      const wrapper = mount(NoteList, {
        props: {
          notes: [],
        },
      });

      // Assert
      const header = wrapper.find("header");
      expect(header.exists()).toBe(true);
      expect(header.isVisible()).toBe(true);
    });
  });

  describe("sidebar styling", () => {
    it("should not render section wrapper", () => {
      // Act
      const wrapper = mount(NoteList, {
        props: {
          notes: [],
        },
      });

      // Assert
      expect(wrapper.find("section").exists()).toBe(false);
    });

    it("should not render 'Notes' heading", () => {
      // Act
      const wrapper = mount(NoteList, {
        props: {
          notes: [],
        },
      });

      // Assert
      expect(wrapper.find("h2").exists()).toBe(false);
    });

    it("should accept optional currentNote prop", () => {
      // Arrange
      const note = createMockNote();

      // Act
      const wrapper = mount(NoteList, {
        props: {
          notes: [note],
          currentNote: note,
        },
      });

      // Assert
      expect(wrapper.props("currentNote")).toStrictEqual(note);
    });

    it("should highlight active note when currentNote matches", () => {
      // Arrange
      const note1 = createMockNote({ id: "note-1", title: "Note 1" });
      const note2 = createMockNote({ id: "note-2", title: "Note 2" });

      // Act
      const wrapper = mount(NoteList, {
        props: {
          notes: [note1, note2],
          currentNote: note1,
        },
      });

      // Assert
      const listItems = wrapper.findAll("li");
      // First note should have active highlighting (bg-slate-100 or border-l-4)
      const firstNoteClasses = listItems[0].classes();
      const hasActiveHighlight =
        firstNoteClasses.includes("bg-slate-100") ||
        firstNoteClasses.includes("border-l-4");
      expect(hasActiveHighlight).toBe(true);

      // Second note should not have active highlighting
      const secondNoteClasses = listItems[1].classes();
      const secondHasActiveHighlight =
        secondNoteClasses.includes("bg-slate-100") ||
        secondNoteClasses.includes("border-l-4");
      expect(secondHasActiveHighlight).toBe(false);
    });

    it("should not highlight any note when currentNote is null", () => {
      // Arrange
      const note1 = createMockNote({ id: "note-1", title: "Note 1" });
      const note2 = createMockNote({ id: "note-2", title: "Note 2" });

      // Act
      const wrapper = mount(NoteList, {
        props: {
          notes: [note1, note2],
          currentNote: null,
        },
      });

      // Assert
      const listItems = wrapper.findAll("li");
      listItems.forEach((item) => {
        const classes = item.classes();
        const hasActiveHighlight =
          classes.includes("bg-slate-100") || classes.includes("border-l-4");
        expect(hasActiveHighlight).toBe(false);
      });
    });
  });
});
