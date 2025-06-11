<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      {{ title }}
    </h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<style scoped>
/* Additional component-specific styles if needed */
</style> 