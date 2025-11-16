<script setup lang="ts">
defineProps<{
  isActive: boolean;
  tokenCount: number;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
}>();

const handleToggle = () => {
  emit("toggle");
};
</script>

<template>
  <div class="flex items-center gap-2">
    <button
      type="button"
      class="rounded-md px-3 py-1.5 text-sm font-medium transition"
      :class="{
        'bg-slate-900 text-white hover:bg-slate-800': isActive,
        'bg-slate-100 text-slate-700 hover:bg-slate-200': !isActive,
      }"
      @click="handleToggle"
    >
      Select Notes
    </button>
    <div v-if="isActive" class="text-sm text-slate-600">
      <span :class="{ 'text-red-600': tokenCount > 1000 }">
        {{ tokenCount }}
      </span>
      /
      <span :class="{ 'text-red-600': tokenCount > 1000 }">1000</span>
      tokens
    </div>
  </div>
</template>
