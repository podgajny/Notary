import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import HomeView from "../HomeView.vue";
import { type Note } from "../../stores/notes.store";

// Mock the database functions
vi.mock("../../lib/db", () => ({
  getNotes: vi.fn().mockResolvedValue([]),
  setNotes: vi.fn().mockResolvedValue(undefined),
  DbError: class MockDbError extends Error {
    code: string;
    constructor(code: string, message: string) {
      super(message);
      this.code = code;
    }
  },
}));

describe("HomeView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("should render two-pane layout structure", () => {
    // Act
    const wrapper = mount(HomeView);

    // Assert - should have flex layout with two main sections
    const main = wrapper.find("main");
    expect(main.classes()).toContain("flex");
    expect(main.classes()).toContain("h-screen");

    // Should have sidebar (aside) and main content (section)
    const sidebar = wrapper.find("aside");
    const contentSection = wrapper.find("section");
    expect(sidebar.exists()).toBe(true);
    expect(contentSection.exists()).toBe(true);
  });

  it("should not render header section", () => {
    // Act
    const wrapper = mount(HomeView);

    // Assert - header with h1 "Notary" should not exist
    const header = wrapper.find("header");
    expect(header.exists()).toBe(false);
    expect(wrapper.find("h1").exists()).toBe(false);
  });

  it("should not import or render NoteDetailDialog", () => {
    // Act
    const wrapper = mount(HomeView);

    // Assert - NoteDetailDialog component should not exist
    // This is a structural test - if NoteDetailDialog is in template, it would be found
    const dialog = wrapper.findComponent({ name: "NoteDetailDialog" });
    expect(dialog.exists()).toBe(false);
  });

  it("should render NoteList in sidebar", () => {
    // Act
    const wrapper = mount(HomeView);

    // Assert
    const noteList = wrapper.findComponent({ name: "NoteList" });
    expect(noteList.exists()).toBe(true);
  });

  it("should render NoteEditor in right pane", () => {
    // Act
    const wrapper = mount(HomeView);

    // Assert
    const noteEditor = wrapper.findComponent({ name: "NoteEditor" });
    expect(noteEditor.exists()).toBe(true);
  });

  it("should have 'New Note' button in right pane header", () => {
    // Act
    const wrapper = mount(HomeView);

    // Assert
    const buttons = wrapper.findAll("button");
    const newNoteButton = buttons.find((btn) =>
      btn.text().includes("New Note")
    );
    expect(newNoteButton).toBeDefined();
    expect(newNoteButton?.exists()).toBe(true);
  });

  it("should have sidebar collapse toggle button", () => {
    // Act
    const wrapper = mount(HomeView);

    // Assert - should have a toggle button in sidebar
    const sidebar = wrapper.find("aside");
    const toggleButton = sidebar.find('button[aria-label*="Collapse"]');
    expect(toggleButton.exists()).toBe(true);
  });

  it("should default to sidebar expanded", () => {
    // Act
    const wrapper = mount(HomeView);

    // Assert - sidebar should be visible (not collapsed)
    const sidebar = wrapper.find("aside");
    // When expanded, sidebar should have width or not be hidden
    expect(sidebar.classes()).not.toContain("hidden");
    expect(sidebar.classes()).not.toContain("w-0");
  });

  it("should toggle sidebar collapse state when toggle button clicked", async () => {
    // Act
    const wrapper = mount(HomeView);
    const sidebar = wrapper.find("aside");
    const initialClasses = sidebar.classes();

    // Find toggle button (assuming it's in the sidebar)
    const toggleButton = sidebar.find("button");
    expect(toggleButton.exists()).toBe(true);

    // Click toggle
    await toggleButton.trigger("click");
    await wrapper.vm.$nextTick();

    // Assert - sidebar classes should change
    const afterClasses = wrapper.find("aside").classes();
    // Either collapsed or expanded state should be different
    expect(afterClasses).not.toEqual(initialClasses);
  });

  it("should set currentNote to null when 'New Note' button clicked", async () => {
    // Arrange
    const wrapper = mount(HomeView);
    const testNote: Note = {
      id: "test-id",
      title: "Test Note",
      body: "Test body",
      tags: [],
      pinned: false,
      createdAt: 1000,
      updatedAt: 1000,
    };

    // Set a current note first
    const noteList = wrapper.findComponent({ name: "NoteList" });
    await noteList.vm.$emit("note-clicked", testNote);
    await wrapper.vm.$nextTick();

    // Act - click New Note button
    const buttons = wrapper.findAll("button");
    const newNoteButton = buttons.find((btn) =>
      btn.text().includes("New Note")
    );
    expect(newNoteButton).toBeDefined();
    await newNoteButton!.trigger("click");
    await wrapper.vm.$nextTick();

    // Assert - NoteEditor should receive null as note prop
    const noteEditor = wrapper.findComponent({ name: "NoteEditor" });
    expect(noteEditor.props("note")).toBeNull();
  });

  it("should set currentNote when note is clicked", async () => {
    // Arrange
    const wrapper = mount(HomeView);
    const testNote: Note = {
      id: "test-id",
      title: "Test Note",
      body: "Test body",
      tags: [],
      pinned: false,
      createdAt: 1000,
      updatedAt: 1000,
    };

    // Act - emit note-clicked event from NoteList
    const noteList = wrapper.findComponent({ name: "NoteList" });
    await noteList.vm.$emit("note-clicked", testNote);
    await wrapper.vm.$nextTick();

    // Assert - NoteEditor should receive the note as prop
    const noteEditor = wrapper.findComponent({ name: "NoteEditor" });
    expect(noteEditor.props("note")).toStrictEqual(testNote);
  });

  it("should pass currentNote to NoteList for active highlighting", async () => {
    // Arrange
    const wrapper = mount(HomeView);
    const testNote: Note = {
      id: "test-id",
      title: "Test Note",
      body: "Test body",
      tags: [],
      pinned: false,
      createdAt: 1000,
      updatedAt: 1000,
    };

    // Act - set current note
    const noteList = wrapper.findComponent({ name: "NoteList" });
    await noteList.vm.$emit("note-clicked", testNote);
    await wrapper.vm.$nextTick();

    // Assert - NoteList should receive currentNote prop
    const updatedNoteList = wrapper.findComponent({ name: "NoteList" });
    expect(updatedNoteList.props("currentNote")).toStrictEqual(testNote);
  });
});
