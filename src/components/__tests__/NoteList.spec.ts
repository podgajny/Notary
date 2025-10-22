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

  it('powinien renderować sekcję z tytułem "Notes"', () => {
    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [],
      },
    });

    // Assert
    expect(wrapper.find("h2").text()).toBe("Notes");
    expect(wrapper.find("section").exists()).toBe(true);
  });

  it("powinien wyświetlać stan ładowania", () => {
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

  it("powinien wyświetlać błąd ładowania", () => {
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

  it("powinien wyświetlać pusty stan gdy nie ma notatek", () => {
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
      "No notes yet. Once you save a note it will appear here.",
    );
  });

  it("powinien renderować listę notatek", () => {
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

    expect(listItems[0].find(".text-base").text()).toBe("First Note");
    expect(listItems[1].find(".text-base").text()).toBe("Second Note");
  });

  it("powinien wyświetlać tytuł i treść notatki", () => {
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
    expect(listItem.find(".text-base").text()).toBe("My Test Note");
    expect(listItem.find(".text-slate-600").text()).toBe(
      "This is the body content of the note",
    );
  });

  it("powinien wyświetlać skróconą treść gdy jest długa", () => {
    // Arrange
    const longBody =
      "This is a very long body content that should be truncated because it exceeds the maximum length of 120 characters and should show an ellipsis at the end to indicate there is more content";
    const note = createMockNote({
      title: "Long Note",
      body: longBody,
    });

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Assert
    const bodyText = wrapper.find(".text-slate-600").text();
    expect(bodyText).toHaveLength(121); // 120 chars + ellipsis
    expect(bodyText.endsWith("…")).toBe(true);
  });

  it("powinien wyświetlać pełną treść gdy jest krótka", () => {
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

  it('powinien wyświetlać "No body text yet" gdy treść jest pusta', () => {
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

  it("powinien formatować timestamp w czytelny sposób", () => {
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

  it("powinien mieć odpowiednie atrybuty dla dostępności", () => {
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

  it("powinien renderować notatki w odpowiedniej kolejności", () => {
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
    expect(listItems[0].find(".text-base").text()).toBe("Older Note");
    expect(listItems[1].find(".text-base").text()).toBe("Newer Note");
  });

  it("powinien mieć odpowiednie klasy CSS dla stylowania", () => {
    // Arrange
    const note = createMockNote();

    // Act
    const wrapper = mount(NoteList, {
      props: {
        notes: [note],
      },
    });

    // Assert
    const section = wrapper.find("section");
    expect(section.classes()).toContain("rounded-lg");
    expect(section.classes()).toContain("border");
    expect(section.classes()).toContain("bg-white");
    expect(section.classes()).toContain("p-6");
    expect(section.classes()).toContain("shadow-sm");

    const listItem = wrapper.find("li");
    expect(listItem.classes()).toContain("rounded-md");
    expect(listItem.classes()).toContain("border");
    expect(listItem.classes()).toContain("p-4");
  });

  it("powinien obsługiwać domyślne wartości props", () => {
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

  it("powinien wyświetlać stan ładowania zamiast pustego stanu", () => {
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

  it("powinien wyświetlać błąd zamiast pustego stanu", () => {
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
});
