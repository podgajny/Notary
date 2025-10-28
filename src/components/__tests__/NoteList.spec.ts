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

  it("powinien wyświetlać maksymalnie 5 linii tekstu dla długich notatek", () => {
    // Arrange - tworzenie notatki z długą treścią (200+ słów, która na pewno przekroczy 5 linii)
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

    // Assert - sprawdzenie czy element ma klasę line-clamp
    const bodyElement = wrapper.find(".text-slate-600");
    expect(bodyElement.classes()).toContain("line-clamp-5");
    expect(bodyElement.classes()).toContain("break-words");
  });

  it("powinien mieć break-words dla krótkiej notatki", () => {
    // Arrange - krótka notatka (20-30 słów, 1-2 linie)
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

    // Assert - nawet krótkie notatki powinny mieć obie klasy
    const bodyElement = wrapper.find(".text-slate-600");
    expect(bodyElement.classes()).toContain("line-clamp-5");
    expect(bodyElement.classes()).toContain("break-words");
  });

  it("powinien łamać bardzo długie nierozdzielne ciągi znaków", () => {
    // Arrange - notatka z bardzo długim słowem bez spacji (symulacja buga z "Dłuuuuuuu...")
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

    // Assert - break-words musi być obecny, aby zapobiec poziomemu przepełnieniu
    const bodyElement = wrapper.find(".text-slate-600");
    expect(bodyElement.classes()).toContain("break-words");
    expect(bodyElement.classes()).toContain("line-clamp-5");
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
