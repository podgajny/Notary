import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import App from "../App.vue";
import HomeView from "../views/HomeView.vue";

// Mock the database functions
vi.mock("../lib/db", () => ({
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

describe("App", () => {
  let router: any;
  let pinia: any;

  beforeEach(() => {
    // Create fresh instances for each test
    pinia = createPinia();
    setActivePinia(pinia);

    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: "/",
          name: "home",
          component: HomeView,
        },
      ],
    });
  });

  it("powinien renderować się bez błędów", () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("powinien mieć odpowiednią strukturę HTML", () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    });

    // Sprawdź czy główny div ma id="app"
    expect(wrapper.attributes("id")).toBe("app");
    expect(wrapper.findComponent({ name: "RouterView" }).exists()).toBe(true);
  });

  // Test snapshot - sprawdza czy struktura się nie zmieniła
  it("powinien pasować do snapshot", () => {
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
