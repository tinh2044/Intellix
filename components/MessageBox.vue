<template>
  <div 
    :class="[
      'flex w-full',
      message.role === 'user' ? 'justify-end' : 'justify-start'
    ]"
  >
    <div 
      :class="[
        'max-w-3xl rounded-lg p-4 shadow-sm',
        message.role === 'user' 
          ? 'bg-blue-500 text-white ml-8' 
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white mr-8 border border-gray-200 dark:border-gray-700'
      ]"
    >
      <!-- Message content -->
      <div class="prose prose-sm max-w-none dark:prose-invert">
        <div v-if="message.role === 'user'" class="whitespace-pre-wrap">
          {{ message.content }}
        </div>
        
        <!-- Assistant message with markdown support -->
        <div v-else>
          <div v-if="message.content" class="whitespace-pre-wrap">
            {{ message.content }}
          </div>
          
          <!-- Sources -->
          <div v-if="message.sources && message.sources.length > 0" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 class="text-sm font-semibold mb-2">Sources:</h4>
            <div class="space-y-2">
              <div 
                v-for="(source, index) in message.sources.slice(0, 3)" 
                :key="index"
                class="text-xs"
              >
                <a 
                  :href="source.metadata?.url" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ source.metadata?.title || source.metadata?.url || `Source ${index + 1}` }}
                </a>
              </div>
            </div>
          </div>

          <!-- Suggestions -->
          <div v-if="message.suggestions && message.suggestions.length > 0" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 class="text-sm font-semibold mb-2">Suggested follow-ups:</h4>
            <div class="space-y-2">
              <button
                v-for="(suggestion, index) in message.suggestions.slice(0, 3)"
                :key="index"
                @click="$emit('suggest', suggestion)"
                class="block w-full text-left text-xs p-2 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Images and Videos -->
      <div v-if="message.role === 'assistant'" class="lg:sticky lg:top-20 flex flex-col items-center space-y-3 w-full lg:w-3/12 z-30 h-full pb-4">
        <SearchImages
          :query="getSearchQuery()"
          :chat-history="getChatHistory()"
          :message-id="message.messageId"
        />
        <SearchVideos
          :query="getSearchQuery()"
          :chat-history="getChatHistory()"
          :message-id="message.messageId"
        />
      </div>
    </div>

    <!-- User message styling -->
    <div v-if="message.role === 'user'" class="flex justify-end">
      <div class="bg-blue-500 text-white p-4 rounded-lg max-w-3xl">
        <div class="whitespace-pre-wrap">
          {{ message.content }}
        </div>
      </div>

      <!-- Message actions -->
      <div v-if="message.role === 'assistant'" class="flex items-center justify-end mt-3 space-x-2">
        <!-- Rewrite button -->
        <button
          @click="$emit('rewrite', message.messageId)"
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Rewrite response"
        >
          <Icon name="lucide:refresh-cw" class="w-3 h-3" />
        </button>

        <!-- Copy button -->
        <button
          @click="copyToClipboard"
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Copy message"
        >
          <Icon name="lucide:copy" class="w-3 h-3" />
        </button>

        <!-- Search images button -->
        <button
          :id="`search-images-${message.messageId}`"
          @click="$emit('search-images', message.messageId)"
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Search related images"
        >
          <Icon name="lucide:image" class="w-3 h-3" />
        </button>

        <!-- Search videos button -->
        <button
          :id="`search-videos-${message.messageId}`"
          @click="$emit('search-videos', message.messageId)"
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Search related videos"
        >
          <Icon name="lucide:video" class="w-3 h-3" />
        </button>
      </div>

      <!-- Timestamp -->
      <div class="text-xs opacity-70 mt-2">
        {{ formatTimeDifference(message.createdAt) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '~/types'

interface Props {
  message: Message
}

interface Emits {
  rewrite: [messageId: string]
  suggest: [suggestion: string]
  'search-images': [messageId: string]
  'search-videos': [messageId: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Copy to clipboard
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.message.content)
    // You could show a toast notification here
    console.log('Message copied to clipboard')
  } catch (err) {
    console.error('Failed to copy message:', err)
  }
}
</script>

<style scoped>
/* Custom styles if needed */
.prose {
  @apply text-inherit;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  @apply text-inherit;
}

.prose p {
  @apply text-inherit;
}

.prose a {
  @apply text-blue-600 dark:text-blue-400;
}

.prose code {
  @apply bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm;
}

.prose pre {
  @apply bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-x-auto;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic;
}
</style> 