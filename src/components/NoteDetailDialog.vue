<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Note = {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
};

const props = defineProps<{
  note: Note;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
}>();

// Formatuj datę do czytelnego formatu
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const handleOpenChange = (open: boolean) => {
  emit("update:isOpen", open);
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="handleOpenChange">
    <DialogContent class="max-w-2xl p-6">
      <DialogHeader>
        <DialogTitle class="text-lg font-semibold text-slate-900">
          {{ note.title }}
        </DialogTitle>
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
