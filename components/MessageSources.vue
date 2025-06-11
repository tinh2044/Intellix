<template>
  <div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
      <!-- Main sources (first 3) -->
      <a
        v-for="(source, i) in sources.slice(0, 3)"
        :key="i"
        :href="source.metadata.url"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-light-100 hover:bg-light-200 dark:bg-dark-100 dark:hover:bg-dark-200 transition duration-200 rounded-lg p-3 flex flex-col space-y-2 font-medium"
      >
        <p class="dark:text-white text-xs overflow-hidden whitespace-nowrap text-ellipsis">
          {{ source.metadata.title }}
        </p>
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-row items-center space-x-1">
            <!-- File icon for uploaded files -->
            <div 
              v-if="source.metadata.url === 'File'" 
              class="bg-dark-200 hover:bg-dark-100 transition duration-200 flex items-center justify-center w-6 h-6 rounded-full"
            >
              <Icon name="lucide:file" class="w-3 h-3 text-white/70" />
            </div>
            <!-- Favicon for web sources -->
            <img
              v-else
              :src="`https://s2.googleusercontent.com/s2/favicons?domain_url=${source.metadata.url}`"
              width="16"
              height="16"
              alt="favicon"
              class="rounded-lg h-4 w-4"
            />
            <p class="text-xs text-black/50 dark:text-white/50 overflow-hidden whitespace-nowrap text-ellipsis">
              {{ getDisplayUrl(source.metadata.url) }}
            </p>
          </div>
          <div class="flex flex-row items-center space-x-1 text-black/50 dark:text-white/50 text-xs">
            <div class="bg-black/50 dark:bg-white/50 h-[4px] w-[4px] rounded-full" />
            <span>{{ i + 1 }}</span>
          </div>
        </div>
      </a>

      <!-- More sources button -->
      <button
        v-if="sources.length > 3"
        @click="openModal"
        class="bg-light-100 hover:bg-light-200 dark:bg-dark-100 dark:hover:bg-dark-200 transition duration-200 rounded-lg p-3 flex flex-col space-y-2 font-medium"
      >
        <div class="flex flex-row items-center space-x-1">
          <img
            v-for="(source, i) in sources.slice(3, 6)"
            :key="i"
            :src="source.metadata.url === 'File' 
              ? '/file-icon.png' 
              : `https://s2.googleusercontent.com/s2/favicons?domain_url=${source.metadata.url}`"
            width="16"
            height="16"
            alt="favicon"
            class="rounded-lg h-4 w-4"
          />
        </div>
        <p class="text-xs text-black/50 dark:text-white/50">
          View {{ sources.length - 3 }} more
        </p>
      </button>
    </div>

    <!-- Modal for all sources -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black/30" @click="closeModal" />
      <div class="relative bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 class="text-lg font-medium leading-6 dark:text-white mb-4">
          Sources
        </h3>
        
        <div class="grid grid-cols-2 gap-2 overflow-auto max-h-[300px] pr-2">
          <a
            v-for="(source, i) in sources"
            :key="i"
            :href="source.metadata.url"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-light-secondary hover:bg-light-200 dark:bg-dark-secondary dark:hover:bg-dark-200 border border-light-200 dark:border-dark-200 transition duration-200 rounded-lg p-3 flex flex-col space-y-2 font-medium"
          >
            <p class="dark:text-white text-xs overflow-hidden whitespace-nowrap text-ellipsis">
              {{ source.metadata.title }}
            </p>
            <div class="flex flex-row items-center justify-between">
              <div class="flex flex-row items-center space-x-1">
                <div 
                  v-if="source.metadata.url === 'File'" 
                  class="bg-dark-200 hover:bg-dark-100 transition duration-200 flex items-center justify-center w-6 h-6 rounded-full"
                >
                  <Icon name="lucide:file" class="w-3 h-3 text-white/70" />
                </div>
                <img
                  v-else
                  :src="`https://s2.googleusercontent.com/s2/favicons?domain_url=${source.metadata.url}`"
                  width="16"
                  height="16"
                  alt="favicon"
                  class="rounded-lg h-4 w-4"
                />
                <p class="text-xs text-black/50 dark:text-white/50 overflow-hidden whitespace-nowrap text-ellipsis">
                  {{ getDisplayUrl(source.metadata.url) }}
                </p>
              </div>
              <div class="flex flex-row items-center space-x-1 text-black/50 dark:text-white/50 text-xs">
                <div class="bg-black/50 dark:bg-white/50 h-[4px] w-[4px] rounded-full" />
                <span>{{ i + 1 }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DocumentSource {
  metadata: {
    url: string
    title: string
  }
}

interface Props {
  sources: DocumentSource[]
}

defineProps<Props>()

// Modal state
const isModalOpen = ref(false)

// Methods
const openModal = () => {
  isModalOpen.value = true
  document.body.classList.add('overflow-hidden')
}

const closeModal = () => {
  isModalOpen.value = false
  document.body.classList.remove('overflow-hidden')
}

const getDisplayUrl = (url: string) => {
  if (url === 'File') return 'File'
  return url.replace(/.+\/\/|www.|\..+/g, '')
}

// Handle escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isModalOpen.value) {
      closeModal()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
/* Additional component-specific styles if needed */
</style> 