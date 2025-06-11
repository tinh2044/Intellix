<template>
  <div class="flex flex-col h-full">
    <!-- Messages area -->
    <div class="flex-1 overflow-y-auto px-4 py-6">
      <div class="max-w-4xl mx-auto space-y-6">
        <MessageBox
          v-for="message in messages"
          :key="message.messageId"
          :message="message"
          @rewrite="$emit('rewrite', $event)"
        />
        
        <!-- Loading indicator -->
        <div v-if="loading" class="flex items-center space-x-2 text-gray-500">
          <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <span>AI is thinking...</span>
        </div>
      </div>
    </div>

    <!-- Input area -->
    <div class="border-t border-gray-200 dark:border-gray-700 p-4">
      <div class="max-w-4xl mx-auto">
        <MessageInput
          :loading="loading"
          :file-ids="fileIds"
          :files="files"
          @send-message="$emit('send-message', $event)"
          @update:file-ids="$emit('update:file-ids', $event)"
          @update:files="$emit('update:files', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message, FileType } from '~/types'

interface Props {
  loading: boolean
  messages: Message[]
  messageAppeared: boolean
  fileIds: string[]
  files: FileType[]
}

interface Emits {
  'send-message': [message: string]
  rewrite: [messageId: string]
  'update:file-ids': [ids: string[]]
  'update:files': [files: FileType[]]
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
/* Custom styles if needed */
</style> 