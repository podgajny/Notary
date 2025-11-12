<script setup lang="ts">
import { computed, ref } from "vue";
import { useChatStore } from "../stores/chat.store";
import { useNotesStore } from "../stores/notes.store";
import ChatMessage from "./ChatMessage.vue";
import ChatInput from "./ChatInput.vue";
import ApiKeyDialog from "./ApiKeyDialog.vue";
import NoteSelector from "./NoteSelector.vue";

const chatStore = useChatStore();
const notesStore = useNotesStore();

const isApiKeyDialogOpen = ref(false);

const tokenCount = computed(() => {
  return chatStore.getContextTokens(notesStore.notes);
});

const handleSendMessage = async (message: string) => {
  await chatStore.sendMessage(message, notesStore.notes);
};

const handleApiKeySave = (key: string) => {
  chatStore.setApiKey(key);
  isApiKeyDialogOpen.value = false;
};

const handleNewChat = () => {
  chatStore.clearChat();
};

const handleToggleSelection = () => {
  chatStore.toggleSelectionMode();
};
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="flex items-center gap-2 border-b border-slate-200 p-4">
      <button
        type="button"
        class="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
        @click="isApiKeyDialogOpen = true"
      >
        API Key
      </button>
      <NoteSelector
        :is-active="chatStore.selectionModeActive"
        :token-count="tokenCount"
        @toggle="handleToggleSelection"
      />
      <button
        type="button"
        class="ml-auto rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
        @click="handleNewChat"
      >
        New Chat
      </button>
    </header>
    <div class="flex-1 overflow-y-auto p-4">
      <div
        v-if="chatStore.messages.length === 0"
        class="text-center text-sm text-slate-500"
      >
        Start a conversation by typing a message below.
      </div>
      <div v-else>
        <ChatMessage
          v-for="message in chatStore.messages"
          :key="message.id"
          :message="message"
        />
      </div>
      <div
        v-if="chatStore.isLoading"
        class="mt-4 text-center text-sm text-slate-500"
      >
        Thinking...
      </div>
    </div>
    <div class="border-t border-slate-200 p-4">
      <ChatInput :is-loading="chatStore.isLoading" @send="handleSendMessage" />
    </div>
    <ApiKeyDialog
      :open="isApiKeyDialogOpen"
      :current-key="chatStore.apiKey"
      @update:open="isApiKeyDialogOpen = $event"
      @save="handleApiKeySave"
    />
  </div>
</template>
