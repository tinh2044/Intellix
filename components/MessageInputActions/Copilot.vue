<template>
  <div class="group flex flex-row items-center space-x-1 active:scale-95 duration-200 transition cursor-pointer">
    <!-- Toggle switch -->
    <div 
      @click="toggleCopilot"
      class="bg-light-secondary dark:bg-dark-secondary border border-light-200/70 dark:border-dark-200 relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full cursor-pointer"
    >
      <span class="sr-only">Copilot</span>
      <span
        :class="[
          'inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full transition-all duration-200',
          copilotEnabled 
            ? 'translate-x-6 bg-[#24A0ED]'
            : 'translate-x-1 bg-black/50 dark:bg-white/50'
        ]"
      />
    </div>
    
    <!-- Label -->
    <p
      @click="toggleCopilot"
      :class="[
        'text-xs font-medium transition-colors duration-150 ease-in-out cursor-pointer',
        copilotEnabled
          ? 'text-[#24A0ED]'
          : 'text-black/50 dark:text-white/50 group-hover:text-black dark:group-hover:text-white'
      ]"
    >
      Copilot
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  copilotEnabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:copilotEnabled'])

const toggleCopilot = () => {
  emit('update:copilotEnabled', !props.copilotEnabled)
}
</script> 