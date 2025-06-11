<template>
  <div class="relative">
    <!-- File display area -->
    <div v-if="files.length > 0" class="mb-3">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="file in files"
          :key="file.fileId"
          class="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm"
        >
          <Icon name="lucide:file" class="w-4 h-4" />
          <span>{{ file.fileName }}</span>
          <button
            @click="removeFile(file.fileId)"
            class="text-gray-500 hover:text-red-500"
          >
            <Icon name="lucide:x" class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main input area -->
    <div class="relative flex items-end space-x-3">
      <!-- File upload button -->
      <button
        type="button"
        class="flex-shrink-0 p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        title="Attach file"
      >
        <Icon name="lucide:paperclip" class="w-5 h-5" />
      </button>

      <!-- Text input -->
      <div class="flex-1 relative">
        <textarea
          ref="textareaRef"
          v-model="inputMessage"
          @keydown.enter.exact.prevent="handleSend"
          @keydown.enter.shift="addNewLine"
          @input="adjustHeight"
          placeholder="Type your message..."
          :disabled="loading"
          class="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          rows="1"
        />

        <!-- Send button -->
        <button
          @click="handleSend"
          :disabled="!canSend"
          class="absolute right-2 bottom-2 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="lucide:send" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Input hints -->
    <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
      Press Enter to send, Shift+Enter for new line
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FileType } from '~/types'

interface Props {
  loading: boolean
  fileIds: string[]
  files: FileType[]
}

interface Emits {
  'send-message': [message: string]
  'update:file-ids': [ids: string[]]
  'update:files': [files: FileType[]]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local state
const inputMessage = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

// Computed properties
const canSend = computed(() => {
  return inputMessage.value.trim().length > 0 && !props.loading
})

// Methods
const handleSend = () => {
  const message = inputMessage.value.trim()
  if (message && !props.loading) {
    emit('send-message', message)
    inputMessage.value = ''
    adjustHeight()
  }
}

const addNewLine = () => {
  inputMessage.value += '\n'
  nextTick(() => {
    adjustHeight()
  })
}

const adjustHeight = () => {
  if (textareaRef.value) {
    const textarea = textareaRef.value
    textarea.style.height = 'auto'
    const newHeight = Math.min(textarea.scrollHeight, 150) // Max height of ~6 lines
    textarea.style.height = `${newHeight}px`
  }
}

const removeFile = (fileId: string) => {
  const newFiles = props.files.filter(f => f.fileId !== fileId)
  const newFileIds = props.fileIds.filter(id => id !== fileId)
  
  emit('update:files', newFiles)
  emit('update:file-ids', newFileIds)
}

// Auto-adjust height on mount and when content changes
onMounted(() => {
  adjustHeight()
})

watch(inputMessage, () => {
  nextTick(() => {
    adjustHeight()
  })
})
</script>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 4px;
}

textarea::-webkit-scrollbar-track {
  background: transparent;
}

textarea::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 2px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Dark mode scrollbar */
.dark textarea::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.dark textarea::-webkit-scrollbar-thumb:hover {
  background: #2d3748;
}
</style> 