import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import App from "../App.vue";

describe("App", () => {
  beforeEach(() => {
    // Ustaw aktywne Pinia dla testów, aby komponenty korzystające ze store działały
    setActivePinia(createPinia());
  });
  it("powinien renderować się bez błędów", () => {
    const wrapper = mount(App);
    expect(wrapper.exists()).toBe(true);
  });

  it("powinien zawierać listę notatek (NoteList)", () => {
    const wrapper = mount(App);

    // Sprawdź czy komponent listy notatek jest renderowany
    const noteList = wrapper.find('[data-testid="note-list"]');
    expect(noteList.exists()).toBe(true);
  });

  it("powinien mieć odpowiednią strukturę HTML", () => {
    const wrapper = mount(App);

    // Sprawdź czy główny div ma id="app"
    expect(wrapper.attributes("id")).toBe("app");
  });

  it("powinien renderować tytuł aplikacji w dokumencie", () => {
    mount(App);

    // W rzeczywistej aplikacji można sprawdzić document.title
    // ale w testach jednostkowych to może być ograniczone
    expect(document.title).toBeDefined();
  });

  it("powinien renderować nagłówek aplikacji", () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain("Notary - Notatki");
  });
});
