<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-8">
    <div class="max-w-2xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-4 dark:text-white">
          Welcome to Intellix
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Your AI-powered search engine. Ask me anything!
        </p>
      </div>

      <!-- Message Input -->
      <div class="mb-6">
        <div class="relative">
          <textarea
            v-model="inputMessage"
            @keydown.enter.exact.prevent="handleSend"
            @keydown.enter.shift="addNewLine"
            placeholder="Ask me anything..."
            class="w-full p-4 pr-12 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            rows="3"
          />
          <button
            @click="handleSend"
            :disabled="!inputMessage.trim() || loading"
            class="absolute right-3 bottom-3 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="lucide:send" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Settings -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Focus Mode -->
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-white">
            Focus Mode
          </label>
          <select
            v-model="localFocusMode"
            class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="webSearch">Web Search</option>
            <option value="academic">Academic</option>
            <option value="writing">Writing</option>
            <option value="wolfram">Wolfram Alpha</option>
            <option value="youtube">YouTube</option>
            <option value="reddit">Reddit</option>
          </select>
        </div>

        <!-- Optimization Mode -->
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-white">
            Optimization Mode
          </label>
          <select
            v-model="localOptimizationMode"
            class="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="speed">Speed</option>
            <option value="balanced">Balanced</option>
            <option value="quality">Quality</option>
          </select>
        </div>
      </div>

      <!-- File Upload Area (placeholder) -->
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        <Icon name="lucide:upload" class="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p class="text-gray-500 dark:text-gray-400">
          Drag & drop files here, or click to select
        </p>
        <p class="text-sm text-gray-400 mt-1">
          {{ files.length }} file{{ files.length !== 1 ? 's' : '' }} selected
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FileType } from '~/types'

interface Props {
  focusMode: string
  optimizationMode: string
  fileIds: string[]
  files: FileType[]
  loading?: boolean
}

interface Emits {
  sendMessage: [message: string]
  'update:focusMode': [mode: string]
  'update:optimizationMode': [mode: string]
  'update:fileIds': [ids: string[]]
  'update:files': [files: FileType[]]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

// Local state
const inputMessage = ref('')

// Local models for two-way binding
const localFocusMode = computed({
  get: () => props.focusMode,
  set: (value) => emit('update:focusMode', value)
})

const localOptimizationMode = computed({
  get: () => props.optimizationMode,
  set: (value) => emit('update:optimizationMode', value)
})

// Handle send message
const handleSend = () => {
  const message = inputMessage.value.trim()
  if (message && !props.loading) {
    emit('sendMessage', message)
    inputMessage.value = ''
  }
}

// Handle adding new line (Shift+Enter)
const addNewLine = () => {
  inputMessage.value += '\n'
}

// Auto-focus input on mount
onMounted(() => {
  const textarea = document.querySelector('textarea')
  if (textarea) {
    textarea.focus()
  }
})
</script>

<style scoped>
/* Custom styles if needed */
</style> 