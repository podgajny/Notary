<script setup lang="ts">
import { nextTick, ref } from "vue";

type Message = {
  id: string;
  content: string;
  timestamp: number;
};

const messages = ref<Message[]>([]);
const inputValue = ref("");
const messagesContainerRef = ref<HTMLDivElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainerRef.value) {
    messagesContainerRef.value.scrollTop =
      messagesContainerRef.value.scrollHeight;
  }
};

const handleSend = async () => {
  const trimmedValue = inputValue.value.trim();
  if (!trimmedValue) return;

  messages.value.push({
    id: crypto.randomUUID(),
    content: trimmedValue,
    timestamp: Date.now(),
  });

  inputValue.value = "";
  await scrollToBottom();
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
};
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      ref="messagesContainerRef"
      class="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex justify-end"
      >
        <div
          class="max-w-[80%] rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-900"
        >
          {{ message.content }}
        </div>
      </div>
      <p
        v-if="messages.length === 0"
        class="flex flex-1 items-center justify-center text-sm text-slate-500"
      >
        Start a conversation by typing a message below.
      </p>
    </div>
    <div class="border-t border-slate-200 bg-white p-4">
      <form class="flex gap-3" @submit.prevent="handleSend">
        <input
          v-model="inputValue"
          type="text"
          class="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          placeholder="Type your message..."
          @keydown="handleKeyDown"
        />
        <button
          type="submit"
          class="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          :disabled="!inputValue.trim()"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>
