<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { detectProvider } from "../lib/llm/client";

const props = withDefaults(
  defineProps<{
    open: boolean;
    currentKey?: string;
  }>(),
  {
    currentKey: "",
  }
);

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "save", key: string): void;
}>();

const apiKey = ref(props.currentKey || "");
const validationError = ref("");

watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      apiKey.value = props.currentKey || "";
      validationError.value = "";
    }
  }
);

const detectedProvider = computed(() => {
  if (!apiKey.value.trim()) {
    return null;
  }
  return detectProvider(apiKey.value);
});

const isValid = computed(() => {
  return detectedProvider.value !== null;
});

const handleSave = () => {
  if (isValid.value) {
    emit("save", apiKey.value.trim());
    emit("update:open", false);
    apiKey.value = "";
  } else {
    validationError.value = "Invalid API key format";
  }
};

const handleCancel = () => {
  emit("update:open", false);
  apiKey.value = props.currentKey || "";
  validationError.value = "";
};

// Expose for testing
defineExpose({
  apiKey,
  detectedProvider,
  isValid,
  handleSave,
  handleCancel,
});
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>API Key</DialogTitle>
        <DialogDescription>
          Enter your API key for OpenAI or Anthropic. The key will be stored
          temporarily in your browser session.
        </DialogDescription>
      </DialogHeader>
      <div class="space-y-4 py-4">
        <div>
          <input
            v-model="apiKey"
            type="text"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            placeholder="sk-..."
            @input="validationError = ''"
          />
          <p v-if="validationError" class="mt-1 text-sm text-red-600">
            {{ validationError }}
          </p>
          <p v-else-if="detectedProvider" class="mt-1 text-sm text-slate-600">
            Detected provider: <strong>{{ detectedProvider }}</strong>
          </p>
        </div>
      </div>
      <DialogFooter>
        <button
          type="button"
          class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          :disabled="!isValid"
          @click="handleSave"
        >
          Save
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
