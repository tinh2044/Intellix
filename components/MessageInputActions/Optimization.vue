<template>
  <div class="relative w-full max-w-[15rem] md:max-w-md lg:max-w-lg">
    <!-- Button to toggle dropdown -->
    <button
      type="button"
      @click="showDropdown = !showDropdown"
      class="p-2 text-black/50 dark:text-white/50 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary active:scale-95 transition duration-200 hover:text-black dark:hover:text-white"
    >
      <div class="flex flex-row items-center space-x-1">
        <Icon 
          :name="currentMode?.iconName" 
          size="20" 
          :class="currentMode?.iconClass" 
        />
        <p class="text-xs font-medium">{{ currentMode?.title }}</p>
        <Icon name="lucide:chevron-down" size="20" />
      </div>
    </button>

    <!-- Dropdown panel -->
    <Teleport to="body">
      <div 
        v-if="showDropdown" 
        class="fixed inset-0 z-50"
        @click="showDropdown = false"
      >
        <div 
          class="absolute z-10 w-64 md:w-[250px] right-0 top-20"
          @click.stop
        >
          <div class="flex flex-col gap-2 bg-light-primary dark:bg-dark-primary border rounded-lg border-light-200 dark:border-dark-200 w-full p-4 max-h-[200px] md:max-h-none overflow-y-auto">
            <button
              v-for="(mode, i) in optimizationModes"
              :key="i"
              @click="selectMode(mode)"
              :disabled="mode.key === 'quality'"
              :class="[
                'p-2 rounded-lg flex flex-col items-start justify-start text-start space-y-1 duration-200 cursor-pointer transition',
                optimizationMode === mode.key
                  ? 'bg-light-secondary dark:bg-dark-secondary'
                  : 'hover:bg-light-secondary dark:hover:bg-dark-secondary',
                mode.key === 'quality' && 'opacity-50 cursor-not-allowed'
              ]"
            >
              <div class="flex flex-row items-center space-x-1 text-black dark:text-white">
                <Icon 
                  :name="mode.iconName" 
                  size="20" 
                  :class="mode.iconClass" 
                />
                <p class="text-sm font-medium">{{ mode.title }}</p>
              </div>
              <p class="text-black/70 dark:text-white/70 text-xs">
                {{ mode.description }}
              </p>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const props = defineProps({
  optimizationMode: {
    type: String,
    default: 'balanced'
  }
})

const emit = defineEmits(['update:optimizationMode'])

const showDropdown = ref(false)

const optimizationModes = [
  {
    key: 'speed',
    title: 'Speed',
    description: 'Prioritize speed and get the quickest possible answer.',
    iconName: 'lucide:zap',
    iconClass: 'text-[#FF9800]'
  },
  {
    key: 'balanced',
    title: 'Balanced',
    description: 'Find the right balance between speed and accuracy',
    iconName: 'lucide:sliders',
    iconClass: 'text-[#4CAF50]'
  },
  {
    key: 'quality',
    title: 'Quality (Soon)',
    description: 'Get the most thorough and accurate answer',
    iconName: 'lucide:star',
    iconClass: 'text-[#2196F3] dark:text-[#BBDEFB] fill-[#BBDEFB] dark:fill-[#2196F3]'
  }
]

const currentMode = computed(() => {
  return optimizationModes.find(mode => mode.key === props.optimizationMode)
})

const selectMode = (mode) => {
  if (mode.key !== 'quality') {
    emit('update:optimizationMode', mode.key)
    showDropdown.value = false
  }
}
</script> 