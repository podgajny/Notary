import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ApiKeyDialog from "../ApiKeyDialog.vue";

describe("ApiKeyDialog", () => {
  it("should render dialog component", () => {
    // Act
    const wrapper = mount(ApiKeyDialog, {
      props: {
        open: true,
      },
    });

    // Assert
    expect(wrapper.exists()).toBe(true);
  });

  it("should emit 'update:open' with false when cancel is called", async () => {
    // Act
    const wrapper = mount(ApiKeyDialog, {
      props: {
        open: true,
      },
    });

    const exposed = wrapper.vm as any;
    exposed.handleCancel();

    // Assert
    expect(wrapper.emitted("update:open")).toBeTruthy();
    expect(wrapper.emitted("update:open")?.[0]).toEqual([false]);
  });
});
