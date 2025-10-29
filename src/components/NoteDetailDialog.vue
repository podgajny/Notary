<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Note } from "../stores/notes.store";

defineProps<{
  note: Note;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
}>();

// Formatuj datę do czytelnego formatu - timestamp w ms
const formatDate = (timestamp: number): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp));
};

const handleOpenChange = (open: boolean) => {
  emit("update:isOpen", open);
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="max-h-[80vh] max-w-2xl overflow-y-auto p-6">
      <DialogHeader>
        <DialogTitle class="text-lg font-semibold text-slate-900">
          {{ note.title }}
        </DialogTitle>
        <DialogDescription class="sr-only">
          View full note details including title, content, and creation date
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-slate-700">Body</label>
          <div class="mt-1 whitespace-pre-wrap text-slate-900">
            {{ note.body }}
          </div>
        </div>

        <div>
          <p class="text-sm text-slate-600">
            <span class="font-medium">Created:</span>
            {{ formatDate(note.createdAt) }}
          </p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
