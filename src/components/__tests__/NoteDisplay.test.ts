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

  it("powinien mieć odpowiednią strukturę HTML", () => {
    const wrapper = mount(NoteDisplay);

    // Sprawdź główny kontener
    const mainContainer = wrapper.find(".max-w-4xl");
    expect(mainContainer.exists()).toBe(true);
    expect(mainContainer.classes()).toContain("mx-auto");
    expect(mainContainer.classes()).toContain("p-6");
    expect(mainContainer.classes()).toContain("bg-white");
  });

  it("powinien mieć odpowiednie klasy CSS dla tytułu", () => {
    const wrapper = mount(NoteDisplay);

    const title = wrapper.find("h1");
    expect(title.classes()).toContain("text-3xl");
    expect(title.classes()).toContain("font-bold");
    expect(title.classes()).toContain("text-gray-900");
  });

  it("powinien mieć odpowiednie klasy CSS dla treści", () => {
    const wrapper = mount(NoteDisplay);

    const content = wrapper.find(".text-base");
    expect(content.classes()).toContain("text-gray-700");
    expect(content.classes()).toContain("leading-relaxed");
    expect(content.classes()).toContain("space-y-4");
  });

  // Test dostępności
  it("powinien być dostępny (accessibility)", () => {
    const wrapper = mount(NoteDisplay);

    // Sprawdź czy tytuł używa odpowiedniego tagu h1
    const title = wrapper.find("h1");
    expect(title.element.tagName).toBe("H1");

    // Sprawdź czy struktura jest logiczna
    expect(wrapper.html()).toMatchSnapshot();
  });
});
