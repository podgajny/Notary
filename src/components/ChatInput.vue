<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    isLoading?: boolean;
  }>(),
  {
    isLoading: false,
  }
);

const emit = defineEmits<{
  (e: "send", message: string): void;
}>();

const input = ref("");

const handleSubmit = () => {
  const trimmed = input.value.trim();
  if (trimmed && !props.isLoading) {
    emit("send", trimmed);
    input.value = "";
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSubmit();
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex gap-2">
      <textarea
        v-model="input"
        :disabled="isLoading"
        class="flex-1 resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
        placeholder="Type your message..."
        rows="3"
        @keydown="handleKeyDown"
      />
      <button
        type="submit"
        :disabled="!input.trim() || isLoading"
        class="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        Send
      </button>
    </div>
  </form>
</template>
