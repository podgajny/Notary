<script setup lang="ts">
import type { ChatMessage } from "../stores/chat.store";

defineProps<{
  message: ChatMessage;
}>();
</script>

<template>
  <div
    class="mb-4 flex"
    :class="{
      'justify-end': message.role === 'user',
      'justify-start': message.role === 'assistant',
    }"
  >
    <div
      data-testid="message"
      class="max-w-[80%] rounded-lg px-4 py-2"
      :class="{
        'bg-slate-900 text-white': message.role === 'user',
        'bg-slate-100 text-slate-900': message.role === 'assistant',
      }"
    >
      <p
        v-if="message.role === 'assistant' || message.content"
        class="whitespace-pre-wrap break-words"
      >
        <template v-if="message.content">{{ message.content }}</template>
        <template v-else-if="message.role === 'assistant' && !message.error"
          >...</template
        >
      </p>
      <div
        v-if="message.error"
        data-testid="error"
        class="mt-2 text-sm text-red-600"
      >
        Error: {{ message.error }}
      </div>
    </div>
  </div>
</template>
