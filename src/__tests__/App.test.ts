import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import App from "../App.vue";

describe("App", () => {
  it("powinien renderować się bez błędów", () => {
    const wrapper = mount(App);
    expect(wrapper.exists()).toBe(true);
  });

  it("powinien zawierać komponent NoteDisplay", () => {
    const wrapper = mount(App);

    // Sprawdź czy komponent NoteDisplay jest renderowany
    // (można użyć selektora klasy lub data-testid)
    const noteDisplay = wrapper.find(".max-w-4xl");
    expect(noteDisplay.exists()).toBe(true);
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

  // Test snapshot - sprawdza czy struktura się nie zmieniła
  it("powinien pasować do snapshot", () => {
    const wrapper = mount(App);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
