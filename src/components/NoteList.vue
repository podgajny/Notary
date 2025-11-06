<script setup lang="ts">
import { computed } from "vue";
import type { Note } from "../stores/notes.store";

const props = withDefaults(
  defineProps<{
    notes: Note[];
    isLoading?: boolean;
    loadError?: string;
  }>(),
  {
    isLoading: false,
    loadError: "",
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
</script>

<template>
  <section class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <h2 class="text-lg font-semibold text-slate-900">Notes</h2>
    <p v-if="props.isLoading" class="mt-2 text-sm text-slate-500">
      Loading notes…
    </p>
    <p v-else-if="props.loadError" class="mt-2 text-sm text-red-600">
      {{ props.loadError }}
    </p>
    <p v-else-if="showEmptyState" class="mt-2 text-sm text-slate-600">
      No notes yet. Once you save a note it will appear here.
    </p>
    <ul v-else class="mt-4 space-y-4">
      <li
        v-for="note in props.notes"
        :key="note.id"
        class="cursor-pointer rounded-md border border-slate-200 p-4 transition hover:bg-slate-50"
        @click="handleNoteClick(note)"
      >
        <header
          class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"
        >
          <p class="text-base font-semibold text-slate-900">{{ note.title }}</p>
          <time class="text-xs uppercase tracking-wide text-slate-500">
            {{ formatUpdatedAt(note.updatedAt) }}
          </time>
        </header>
        <p
          v-if="note.body"
          class="mt-2 line-clamp-5 break-words text-sm text-slate-600"
        >
          {{ note.body }}
        </p>
        <p v-else class="mt-2 text-sm text-slate-400">No body text yet.</p>
      </li>
    </ul>
  </section>
</template>
