import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import App from "../App.vue";

describe("App", () => {
  it("powinien renderować się bez błędów", () => {
    const wrapper = mount(App);
    expect(wrapper.exists()).toBe(true);
  });

  it("powinien mieć odpowiednią strukturę HTML", () => {
    const wrapper = mount(App);

    // Sprawdź czy główny div ma id="app"
    expect(wrapper.attributes("id")).toBe("app");
  });

  // Test snapshot - sprawdza czy struktura się nie zmieniła
  it("powinien pasować do snapshot", () => {
    const wrapper = mount(App);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
