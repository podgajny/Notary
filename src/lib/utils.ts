import type { ClassValue } from "clsx"
import type { Ref } from "vue"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Prosty updater wartości Ref bez zależności od @tanstack/vue-table
export function valueUpdater<T>(updaterOrValue: ((v: T) => T) | T, ref: Ref<T>) {
  ref.value
    = typeof updaterOrValue === "function"
      ? (updaterOrValue as (v: T) => T)(ref.value)
      : (updaterOrValue as T)
}
