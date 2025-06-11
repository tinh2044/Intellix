<template>
  <div class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Left side -->
        <div class="flex items-center">
          <h1 class="text-lg font-semibold dark:text-white">
            Chat
          </h1>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <!-- Message count -->
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ messages.length }} messages
          </span>

          <!-- Settings link -->
          <NuxtLink 
            to="/settings"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Icon name="lucide:settings" class="w-5 h-5 dark:text-white" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <!-- Spacer to account for fixed navbar -->
  <div class="h-16"></div>
</template>

<script setup lang="ts">
import type { Message } from '~/types'

interface Props {
  chatId: string
  messages: Message[]
}

defineProps<Props>()
</script>

<style scoped>
/* Custom styles if needed */
</style> 