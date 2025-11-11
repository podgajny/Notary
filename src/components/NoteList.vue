<script setup lang="ts">
import { computed } from "vue";
import type { Note } from "../stores/notes.store";

const props = withDefaults(
  defineProps<{
    notes: Note[];
    isLoading?: boolean;
    loadError?: string;
    currentNote?: Note | null;
  }>(),
  {
    isLoading: false,
    loadError: "",
    currentNote: null,
  }
);

const emit = defineEmits<{
  (e: "note-clicked", note: Note): void;
}>();

const showEmptyState = computed(
  () => !props.isLoading && !props.loadError && props.notes.length === 0
);

const formatUpdatedAt = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const handleNoteClick = (note: Note) => {
  emit("note-clicked", note);
};

const isNoteActive = (note: Note) => {
  return props.currentNote?.id === note.id;
};
</script>

<template>
  <div class="flex h-full flex-col overflow-y-auto">
    <header class="flex items-center gap-2 border-b border-slate-200 p-4">
      <button
        type="button"
        class="inline-flex w-1/4 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Dummy
      </button>
    </header>
    <div class="flex-1 overflow-y-auto p-4">
      <p v-if="props.isLoading" class="text-sm text-slate-500">
        Loading notes…
      </p>
      <p v-else-if="props.loadError" class="text-sm text-red-600">
        {{ props.loadError }}
      </p>
      <p v-else-if="showEmptyState" class="text-sm text-slate-600">
        No notes yet. Once you save a note it will appear here.
      </p>
      <ul v-else class="space-y-2">
        <li
          v-for="note in props.notes"
          :key="note.id"
          class="cursor-pointer rounded-md border border-slate-200 p-3 transition hover:bg-slate-50"
          :class="{
            'border-l-4 border-l-slate-900 bg-slate-100': isNoteActive(note),
          }"
          @click="handleNoteClick(note)"
        >
          <header
            class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <p class="text-sm font-semibold text-slate-900">{{ note.title }}</p>
            <time class="text-xs uppercase tracking-wide text-slate-500">
              {{ formatUpdatedAt(note.updatedAt) }}
            </time>
          </header>
          <p
            v-if="note.body"
            class="mt-2 line-clamp-3 break-words text-xs text-slate-600"
          >
            {{ note.body }}
          </p>
          <p v-else class="mt-2 text-xs text-slate-400">No body text yet.</p>
        </li>
      </ul>
    </div>
  </div>
</template>
