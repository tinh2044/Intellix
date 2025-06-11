<template>
  <div class="relative w-full max-w-[15rem] md:max-w-md lg:max-w-lg mt-[6.5px]">
    <!-- Button to toggle dropdown -->
    <button
      type="button"
      @click="showDropdown = !showDropdown"
      class="text-black/50 dark:text-white/50 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary active:scale-95 transition duration-200 hover:text-black dark:hover:text-white"
    >
      <div v-if="focusMode !== 'webSearch'" class="flex flex-row items-center space-x-1">
        <Icon 
          :name="currentMode?.iconName" 
          size="20" 
          :class="currentMode?.iconClass" 
        />
        <p class="text-xs font-medium hidden lg:block">{{ currentMode?.title }}</p>
        <Icon name="lucide:chevron-down" size="20" class="-translate-x-1" />
      </div>
      <div v-else class="flex flex-row items-center space-x-1">
        <Icon name="lucide:scan-eye" size="20" />
        <p class="text-xs font-medium hidden lg:block">Focus</p>
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
          class="absolute z-10 w-64 md:w-[500px] left-0 top-20"
          @click.stop
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 bg-light-primary dark:bg-dark-primary border rounded-lg border-light-200 dark:border-dark-200 w-full p-4 max-h-[200px] md:max-h-none overflow-y-auto">
            <button
              v-for="(mode, i) in focusModes"
              :key="i"
              @click="selectMode(mode)"
              :class="[
                'p-2 rounded-lg flex flex-col items-start justify-start text-start space-y-2 duration-200 cursor-pointer transition',
                focusMode === mode.key
                  ? 'bg-light-secondary dark:bg-dark-secondary'
                  : 'hover:bg-light-secondary dark:hover:bg-dark-secondary'
              ]"
            >
              <div 
                :class="[
                  'flex flex-row items-center space-x-1',
                  focusMode === mode.key
                    ? 'text-[#24A0ED]'
                    : 'text-black dark:text-white'
                ]"
              >
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
  focusMode: {
    type: String,
    default: 'webSearch'
  }
})

const emit = defineEmits(['update:focusMode'])

const showDropdown = ref(false)

const focusModes = [
  {
    key: 'webSearch',
    title: 'All',
    description: 'Searches across all of the internet',
    iconName: 'lucide:globe',
    iconClass: ''
  },
  {
    key: 'academicSearch',
    title: 'Academic',
    description: 'Search in published academic papers',
    iconName: 'lucide:book-open',
    iconClass: ''
  },
  {
    key: 'writingAssistant',
    title: 'Writing',
    description: 'Chat without searching the web',
    iconName: 'lucide:pencil',
    iconClass: ''
  },
  {
    key: 'wolframAlphaSearch',
    title: 'Wolfram Alpha',
    description: 'Computational knowledge engine',
    iconName: 'lucide:percent',
    iconClass: ''
  },
  {
    key: 'youtubeSearch',
    title: 'Youtube',
    description: 'Search and watch videos',
    iconName: 'lucide:video',
    iconClass: 'text-red-500'
  },
  {
    key: 'redditSearch',
    title: 'Reddit',
    description: 'Search for discussions and opinions',
    iconName: 'lucide:message-circle',
    iconClass: 'text-orange-500'
  }
]

const currentMode = computed(() => {
  return focusModes.find(mode => mode.key === props.focusMode)
})

const selectMode = (mode) => {
  emit('update:focusMode', mode.key)
  showDropdown.value = false
}
</script> 