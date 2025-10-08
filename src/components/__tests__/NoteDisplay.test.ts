import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import NoteDisplay from "../NoteDisplay.vue";

describe("NoteDisplay", () => {
  // Test TDD: Sprawdzenie czy komponent renderuje się poprawnie
  it("powinien renderować tytuł notatki", () => {
    const wrapper = mount(NoteDisplay);

    // Sprawdź czy tytuł jest widoczny
    expect(wrapper.find("h1").exists()).toBe(true);
    expect(wrapper.find("h1").text()).toContain(
      "TEST: Zmieniony tytuł notatki",
    );
  });

  it("powinien renderować treść notatki", () => {
    const wrapper = mount(NoteDisplay);

    // Sprawdź czy treść jest widoczna
    const contentDiv = wrapper.find(".text-base");
    expect(contentDiv.exists()).toBe(true);
    expect(contentDiv.text()).toContain("Dobry wieczór");
  });

  // Test snapshot - sprawdza czy struktura się nie zmieniła
  it("powinien pasować do snapshot", () => {
    const wrapper = mount(NoteDisplay);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
