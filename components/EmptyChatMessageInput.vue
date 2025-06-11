<template>
  <form
    @submit.prevent="handleSubmit"
    @keydown="handleFormKeyDown"
    class="w-full"
  >
    <div class="flex flex-col bg-light-secondary dark:bg-dark-secondary px-5 pt-5 pb-2 rounded-lg w-full border border-light-200 dark:border-dark-200">
      <textarea
        ref="inputRef"
        v-model="message"
        :rows="2"
        class="bg-transparent placeholder:text-black/50 dark:placeholder:text-white/50 text-sm text-black dark:text-white resize-none focus:outline-none w-full max-h-24 lg:max-h-36 xl:max-h-48"
        placeholder="Ask anything..."
        style="min-height: 3rem; overflow-y: auto;"
        @input="adjustHeight"
      />
      
      <div class="flex flex-row items-center justify-between mt-4">
        <div class="flex flex-row items-center space-x-2 lg:space-x-4">
          <MessageInputActionsFocus 
            :focus-mode="focusMode"
            @update:focus-mode="$emit('update:focusMode', $event)"
          />
          <MessageInputActionsAttach
            :file-ids="fileIds"
            :files="files"
            :show-text="true"
            @update:file-ids="$emit('update:fileIds', $event)"
            @update:files="$emit('update:files', $event)"
          />
        </div>
        
        <div class="flex flex-row items-center space-x-1 sm:space-x-4">
          <MessageInputActionsOptimization
            :optimization-mode="optimizationMode"
            @update:optimization-mode="$emit('update:optimizationMode', $event)"
          />
          
          <button
            type="submit"
            :disabled="message.trim().length === 0"
            class="bg-[#24A0ED] text-white disabled:text-black/50 dark:disabled:text-white/50 disabled:bg-[#e0e0dc] dark:disabled:bg-[#ececec21] hover:bg-opacity-85 transition duration-100 rounded-full p-2"
          >
            <Icon name="lucide:arrow-right" size="17" />
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
interface FileType {
  id: string
  name: string
  type: string
  url?: string
}

interface Props {
  focusMode: string
  optimizationMode: string
  fileIds: string[]
  files: FileType[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  sendMessage: [message: string]
  'update:focusMode': [mode: string]
  'update:optimizationMode': [mode: string]
  'update:fileIds': [fileIds: string[]]
  'update:files': [files: FileType[]]
}>()

// Reactive state
const message = ref('')
const inputRef = ref<HTMLTextAreaElement>()

// Auto-resize textarea functionality
const adjustHeight = () => {
  const textarea = inputRef.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }
}

// Handle form submission
const handleSubmit = () => {
  if (message.value.trim().length === 0) return
  
  emit('sendMessage', message.value)
  message.value = ''
  
  // Reset textarea height
  nextTick(() => {
    adjustHeight()
  })
}

// Handle form keydown (Enter to submit)
const handleFormKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}

// Global keyboard shortcut handler
const handleGlobalKeyDown = (e: KeyboardEvent) => {
  const activeElement = document.activeElement
  
  const isInputFocused =
    activeElement?.tagName === 'INPUT' ||
    activeElement?.tagName === 'TEXTAREA' ||
    activeElement?.hasAttribute('contenteditable')
  
  if (e.key === '/' && !isInputFocused) {
    e.preventDefault()
    inputRef.value?.focus()
  }
}

// Lifecycle hooks
onMounted(() => {
  // Add global keyboard listener
  document.addEventListener('keydown', handleGlobalKeyDown)
  
  // Focus input on mount
  inputRef.value?.focus()
})

onUnmounted(() => {
  // Remove global keyboard listener
  document.removeEventListener('keydown', handleGlobalKeyDown)
})

// Watch message changes to adjust height
watch(message, () => {
  nextTick(() => {
    adjustHeight()
  })
})
</script> 