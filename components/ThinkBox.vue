<template>
  <div class="my-4 bg-light-secondary/50 dark:bg-dark-secondary/50 rounded-xl border border-light-200 dark:border-dark-200 overflow-hidden">
    <button
      @click="toggleExpanded"
      class="w-full flex items-center justify-between px-4 py-1 text-black/90 dark:text-white/90 hover:bg-light-200 dark:hover:bg-dark-200 transition duration-200"
    >
      <div class="flex items-center space-x-2">
        <Icon 
          name="lucide:brain-circuit" 
          size="20" 
          class="text-[#9C27B0] dark:text-[#CE93D8]" 
        />
        <p class="font-medium text-sm">Thinking Process</p>
      </div>
      <Icon 
        :name="isExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
        size="18" 
        class="text-black/70 dark:text-white/70" 
      />
    </button>

    <div 
      v-if="isExpanded" 
      class="px-4 py-3 text-black/80 dark:text-white/80 text-sm border-t border-light-200 dark:border-dark-200 bg-light-100/50 dark:bg-dark-100/50 whitespace-pre-wrap"
    >
      {{ content }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const isExpanded = ref(false)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script> 