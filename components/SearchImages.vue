<template>
  <div>
    <!-- Search Button -->
    <button
      v-if="!loading && images === null"
      :id="`search-images-${messageId}`"
      @click="searchImages"
      class="border border-dashed border-light-200 dark:border-dark-200 hover:bg-light-200 dark:hover:bg-dark-200 active:scale-95 duration-200 transition px-4 py-2 flex flex-row items-center justify-between rounded-lg dark:text-white text-sm w-full"
    >
      <div class="flex flex-row items-center space-x-2">
        <Icon name="lucide:images" class="w-4 h-4" />
        <p>Search images</p>
      </div>
      <Icon name="lucide:plus" class="w-4 h-4 text-[#24A0ED]" />
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-2 gap-2">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-light-secondary dark:bg-dark-secondary h-32 w-full rounded-lg animate-pulse aspect-video object-cover"
      />
    </div>

    <!-- Images Grid -->
    <div v-if="images !== null && images.length > 0">
      <div class="grid grid-cols-2 gap-2">
        <!-- Display first 3 or all images if <= 4 -->
        <img
          v-for="(image, i) in (images.length > 4 ? images.slice(0, 3) : images)"
          :key="i"
          :src="image.img_src"
          :alt="image.title"
          @click="openLightbox(i)"
          class="h-full w-full aspect-video object-cover rounded-lg transition duration-200 active:scale-95 hover:scale-[1.02] cursor-zoom-in"
        />

        <!-- More images button if > 4 -->
        <button
          v-if="images.length > 4"
          @click="openLightbox(3)"
          class="bg-light-100 hover:bg-light-200 dark:bg-dark-100 dark:hover:bg-dark-200 transition duration-200 active:scale-95 hover:scale-[1.02] h-auto w-full rounded-lg flex flex-col justify-between text-white p-2"
        >
          <div class="flex flex-row items-center space-x-1">
            <img
              v-for="(image, i) in images.slice(3, 6)"
              :key="i"
              :src="image.img_src"
              :alt="image.title"
              class="h-6 w-12 rounded-md lg:h-3 lg:w-6 lg:rounded-sm aspect-video object-cover"
            />
          </div>
          <p class="text-black/70 dark:text-white/70 text-xs">
            View {{ images.length - 3 }} more
          </p>
        </button>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div v-if="isLightboxOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div class="relative max-w-[90vw] max-h-[90vh]">
        <!-- Close button -->
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
        >
          <Icon name="lucide:x" class="w-6 h-6" />
        </button>

        <!-- Navigation buttons -->
        <button
          v-if="currentImageIndex > 0"
          @click="previousImage"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
        >
          <Icon name="lucide:chevron-left" class="w-6 h-6" />
        </button>

        <button
          v-if="currentImageIndex < images.length - 1"
          @click="nextImage"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
        >
          <Icon name="lucide:chevron-right" class="w-6 h-6" />
        </button>

        <!-- Main image -->
        <img
          :src="images[currentImageIndex]?.img_src"
          :alt="images[currentImageIndex]?.title"
          class="max-w-full max-h-full object-contain rounded-lg"
        />

        <!-- Image info -->
        <div class="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg">
          <h3 class="font-medium">{{ images[currentImageIndex]?.title }}</h3>
          <p class="text-sm opacity-75">{{ currentImageIndex + 1 }} of {{ images.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ImageResult {
  url: string
  img_src: string
  title: string
}

interface MessageHistory {
  role: string
  content: string
}

interface Props {
  query: string
  chatHistory: MessageHistory[]
  messageId: string
}

const props = defineProps<Props>()

// State
const images = ref<ImageResult[] | null>(null)
const loading = ref(false)
const isLightboxOpen = ref(false)
const currentImageIndex = ref(0)

// Methods
const searchImages = async () => {
  loading.value = true

  try {
    // Get settings from localStorage
    const chatModelProvider = process.client ? localStorage.getItem('chatModelProvider') : null
    const chatModel = process.client ? localStorage.getItem('chatModel') : null
    const customOpenAIBaseURL = process.client ? localStorage.getItem('openAIBaseURL') : null
    const customOpenAIKey = process.client ? localStorage.getItem('openAIApiKey') : null

    const response = await $fetch<{ images: ImageResult[] }>('/api/images', {
      method: 'POST',
      body: {
        query: props.query,
        chatHistory: props.chatHistory,
        chatModel: {
          provider: chatModelProvider,
          model: chatModel,
          ...(chatModelProvider === 'custom_openai' && {
            customOpenAIBaseURL: customOpenAIBaseURL,
            customOpenAIKey: customOpenAIKey,
          }),
        },
      },
    })

    images.value = response.images ?? []
  } catch (error) {
    console.error('Failed to search images:', error)
    images.value = []
  } finally {
    loading.value = false
  }
}

const openLightbox = (index: number) => {
  currentImageIndex.value = index
  isLightboxOpen.value = true
  document.body.classList.add('overflow-hidden')
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  document.body.classList.remove('overflow-hidden')
}

const nextImage = () => {
  if (currentImageIndex.value < images.value!.length - 1) {
    currentImageIndex.value++
  }
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

// Handle keyboard navigation
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (isLightboxOpen.value) {
      if (e.key === 'Escape') {
        closeLightbox()
      } else if (e.key === 'ArrowLeft') {
        previousImage()
      } else if (e.key === 'ArrowRight') {
        nextImage()
      }
    }
  }

  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
/* Additional styles if needed */
</style> 