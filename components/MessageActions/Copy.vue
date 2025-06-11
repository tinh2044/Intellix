<template>
  <button
    @click="copyMessage"
    class="p-2 text-black/70 dark:text-white/70 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200 hover:text-black dark:hover:text-white"
  >
    <Icon
      :name="copied ? 'lucide:check' : 'lucide:clipboard-list'"
      size="18"
    />
  </button>
</template>

<script setup lang="ts">
interface Props {
  message: {
    messageId: string
    role: 'user' | 'assistant'
    content: string
    sources?: Array<{
      metadata: {
        url: string
        title: string
      }
    }>
  }
  initialMessage?: string
}

const props = defineProps<Props>()
const copied = ref(false)

const copyMessage = async () => {
  try {
    let contentToCopy = props.initialMessage || props.message.content
    
    // Add citations if available
    if (props.message.sources && props.message.sources.length > 0) {
      const citations = props.message.sources
        .map((source: any, i: number) => `[${i + 1}] ${source.metadata.url}`)
        .join('\n')
      
      contentToCopy = `${contentToCopy}\n\nCitations:\n${citations}`
    }
    
    await navigator.clipboard.writeText(contentToCopy)
    copied.value = true
    
    // Reset copied state after 1 second
    setTimeout(() => {
      copied.value = false
    }, 1000)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}
</script> 