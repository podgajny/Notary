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

describe("App Integration", () => {
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

  it("should render RouterView", () => {
    // Act
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    });

    // Assert
    expect(wrapper.findComponent({ name: "RouterView" }).exists()).toBe(true);
  });

  it("should display HomeView on main page", async () => {
    // Act
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    });

    // Navigate to home route
    await router.push("/");
    await wrapper.vm.$nextTick();

    // Assert
    expect(wrapper.find("h1").text()).toBe("Notary");
  });

  it("should contain NoteEditor and NoteList on main page", async () => {
    // Act
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    });

    // Navigate to home route
    await router.push("/");
    await wrapper.vm.$nextTick();

    // Assert
    expect(wrapper.findComponent({ name: "NoteEditor" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "NoteList" }).exists()).toBe(true);
  });

  it("should have correct HTML structure", async () => {
    // Act
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    });

    // Navigate to home route
    await router.push("/");
    await wrapper.vm.$nextTick();

    // Assert
    const main = wrapper.find("main");
    expect(main.exists()).toBe(true);
    expect(main.classes()).toContain("min-h-screen");
    expect(main.classes()).toContain("bg-slate-100");

    const header = wrapper.find("header");
    expect(header.exists()).toBe(true);
    expect(header.find("h1").text()).toBe("Notary");
  });
});
