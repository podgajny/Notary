<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { NoteStoreError } from "../stores/notes.store";

type SaveNoteInput = {
  title: string;
  body: string;
};

const props = withDefaults(
  defineProps<{
    saveNote?: (input: SaveNoteInput) => Promise<unknown> | unknown;
  }>(),
  {
    saveNote: async () => {},
  },
);

const title = ref("");
const body = ref("");
const isSaving = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
// Walidacja reaktywna - błąd wyświetla się tylko po próbie zapisu
const showTitleError = ref(false);
const titleInputRef = ref<HTMLInputElement | null>(null);
let successTimeoutId: number | undefined;

const TITLE_REQUIRED_COPY = "Title is required";
const SAVE_SUCCESS_COPY = "Note saved";
const SAVE_FAILED_COPY = "Could not save. Try again.";

const isTitleEmpty = computed(() => title.value.trim().length === 0);
const isSaveDisabled = computed(() => isSaving.value);

const focusTitleInput = () => {
  titleInputRef.value?.focus();
};

const clearSuccessAfterDelay = () => {
  if (successTimeoutId) {
    window.clearTimeout(successTimeoutId);
  }

  successTimeoutId = window.setTimeout(() => {
    successMessage.value = "";
    successTimeoutId = undefined;
  }, 2500);
};

const resetForm = async () => {
  title.value = "";
  body.value = "";
  await nextTick();
  focusTitleInput();
};

const mapErrorToMessage = (error: unknown): string => {
  if (error instanceof NoteStoreError) {
    if (error.code === "STORAGE_WRITE_FAILED") {
      return SAVE_FAILED_COPY;
    }

    if (error.code === "TITLE_REQUIRED") {
      return TITLE_REQUIRED_COPY;
    }
  }

  if (error instanceof Error) {
    if (error.message === "STORAGE_WRITE_FAILED") {
      return SAVE_FAILED_COPY;
    }

    if (error.message === "TITLE_REQUIRED") {
      return TITLE_REQUIRED_COPY;
    }
  }

  return SAVE_FAILED_COPY;
};

const submit = async () => {
  if (isTitleEmpty.value) {
    showTitleError.value = true;
    title.value = title.value.trim();
    focusTitleInput();
    return;
  }

  isSaving.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await props.saveNote({
      title: title.value.trim(),
      body: body.value,
    });

    successMessage.value = SAVE_SUCCESS_COPY;
    clearSuccessAfterDelay();
    await resetForm();
  } catch (error) {
    errorMessage.value = mapErrorToMessage(error);
  } finally {
    isSaving.value = false;
  }
};

watch(title, () => {
  if (showTitleError.value && !isTitleEmpty.value) {
    showTitleError.value = false;
  }

  if (errorMessage.value) {
    errorMessage.value = "";
  }

  if (successMessage.value) {
    successMessage.value = "";
  }
});

watch(body, () => {
  if (successMessage.value) {
    successMessage.value = "";
  }
});

onMounted(() => {
  focusTitleInput();
});

onBeforeUnmount(() => {
  if (successTimeoutId) {
    window.clearTimeout(successTimeoutId);
  }
});
</script>

<template>
  <section class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <h2 class="text-lg font-semibold text-slate-900">Create a note</h2>
    <p class="mt-2 text-sm text-slate-600">
      Capture your thoughts quickly. Add a title, jot down the details, and
      save.
    </p>

    <form class="mt-4 space-y-5" @submit.prevent="submit">
      <div>
        <label for="note-title" class="block text-sm font-medium text-slate-700"
          >Title</label
        >
        <input
          id="note-title"
          ref="titleInputRef"
          v-model="title"
          type="text"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          placeholder="Title"
          :disabled="isSaving"
        />
        <p v-if="showTitleError" class="mt-1 text-sm text-red-600">
          {{ TITLE_REQUIRED_COPY }}
        </p>
      </div>

      <div>
        <label for="note-body" class="block text-sm font-medium text-slate-700"
          >Body</label
        >
        <textarea
          id="note-body"
          v-model="body"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          placeholder="Write your note..."
          rows="6"
          :disabled="isSaving"
        />
      </div>

      <div class="flex items-center gap-3">
        <button
          type="submit"
          class="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          :disabled="isSaveDisabled"
        >
          <span v-if="isSaving">Saving…</span>
          <span v-else>Save</span>
        </button>

        <p v-if="successMessage" class="text-sm text-green-600">
          {{ successMessage }}
        </p>
        <p v-else-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>
      </div>
    </form>
  </section>
</template>
