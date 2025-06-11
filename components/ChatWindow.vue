<template>
  <div class="h-full">
    <!-- Error State -->
    <div v-if="hasError" class="relative">
      <div class="absolute w-full flex flex-row items-center justify-end mr-5 mt-5">
        <NuxtLink to="/settings">
          <Icon name="lucide:settings" class="cursor-pointer lg:hidden" />
        </NuxtLink>
      </div>
      <div class="flex flex-col items-center justify-center min-h-screen">
        <p class="dark:text-white/70 text-black/70 text-sm">
          Failed to connect to the server. Please try again later.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="!isReady" class="flex flex-row items-center justify-center min-h-screen">
      <Icon name="lucide:loader-2" class="w-8 h-8 text-light-200 fill-light-secondary dark:text-[#202020] animate-spin dark:fill-[#ffffff3b]" />
    </div>

    <!-- Not Found State -->
    <NuxtErrorBoundary v-else-if="notFound">
      <template #error="{ error }">
        <div class="flex flex-col items-center justify-center min-h-screen">
          <h1 class="text-2xl font-bold">Chat Not Found</h1>
          <p class="text-gray-600 mt-2">The chat you're looking for doesn't exist.</p>
          <NuxtLink to="/" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Go Home
          </NuxtLink>
        </div>
      </template>
    </NuxtErrorBoundary>

    <!-- Main Chat Interface -->
    <div v-else>
      <div v-if="messages.length > 0">
        <!-- Navbar -->
        <Navbar :chat-id="chatId!" :messages="messages" />
        
        <!-- Chat Messages -->
        <Chat
          :loading="loading"
          :messages="messages"
          :message-appeared="messageAppeared"
          :file-ids="fileIds"
          :files="files"
          @send-message="handleSendMessage"
          @rewrite="handleRewrite"
          @update:file-ids="fileIds = $event"
          @update:files="setFiles"
        />
      </div>

      <!-- Empty Chat State -->
      <EmptyChat
        v-else
        :focus-mode="focusMode"
        :optimization-mode="optimizationMode"
        :file-ids="fileIds"
        :files="files"
        @send-message="handleSendMessage"
        @update:focus-mode="setFocusMode"
        @update:optimization-mode="setOptimizationMode"
        @update:file-ids="fileIds = $event"
        @update:files="setFiles"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message, FileType } from '~/types'

interface Props {
  id?: string
}

const props = defineProps<Props>()

// Initialize chat composable
const {
  chatId,
  messages,
  loading,
  messageAppeared,
  files,
  fileIds,
  focusMode,
  optimizationMode,
  isReady,
  notFound,
  hasError,
  isConfigReady,
  checkConfig,
  sendMessage,
  rewrite,
  initializeChat,
  setFiles,
  setFocusMode,
  setOptimizationMode,
} = useChat()

// Handle send message
const handleSendMessage = async (message: string) => {
  try {
    await sendMessage(message)
  } catch (error) {
    console.error('Failed to send message:', error)
    // You could show a toast notification here
  }
}

// Handle rewrite
const handleRewrite = (messageId: string) => {
  rewrite(messageId)
}

// Initialize on mount
onMounted(async () => {
  await checkConfig()
  await initializeChat(props.id)
})

// Handle initial message from URL params
const route = useRoute()
const initialMessage = computed(() => route.query.q as string)

// Send initial message when ready
watch([isConfigReady, isReady, initialMessage], () => {
  if (isReady.value && isConfigReady.value && initialMessage.value) {
    handleSendMessage(initialMessage.value)
  }
}, { immediate: true })

// SEO and meta
useHead({
  title: computed(() => {
    if (messages.value.length > 0) {
      // Use first user message as title
      const firstUserMessage = messages.value.find(m => m.role === 'user')
      return firstUserMessage ? `${firstUserMessage.content.substring(0, 50)}... - Intellix` : 'Chat - Intellix'
    }
    return 'New Chat - Intellix'
  })
})
</script>

<style scoped>
/* Additional component-specific styles if needed */
</style> 