<template>
  <button
    @click="handleRewrite"
    class="py-2 px-3 text-black/70 dark:text-white/70 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200 hover:text-black dark:hover:text-white flex flex-row items-center space-x-1"
  >
    <Icon name="lucide:arrow-left-right" size="18" />
    <p class="text-xs font-medium">Rewrite</p>
  </button>
</template>

<script setup lang="ts">
interface Props {
  messageId: string
}

interface Emits {
  rewrite: [messageId: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleRewrite = () => {
  emit('rewrite', props.messageId)
}
</script> 