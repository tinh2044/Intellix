<template>
  <div>
    <!-- Search Button -->
    <button
      v-if="!loading && videos === null"
      :id="`search-videos-${messageId}`"
      @click="searchVideos"
      class="border border-dashed border-light-200 dark:border-dark-200 hover:bg-light-200 dark:hover:bg-dark-200 active:scale-95 duration-200 transition px-4 py-2 flex flex-row items-center justify-between rounded-lg dark:text-white text-sm w-full"
    >
      <div class="flex flex-row items-center space-x-2">
        <Icon name="lucide:video" class="w-4 h-4" />
        <p>Search videos</p>
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

    <!-- Videos Grid -->
    <div v-if="videos !== null && videos.length > 0">
      <div class="grid grid-cols-2 gap-2">
        <!-- Display first 3 or all videos if <= 4 -->
        <div
          v-for="(video, i) in (videos.length > 4 ? videos.slice(0, 3) : videos)"
          :key="i"
          @click="openVideoPlayer(i)"
          class="relative transition duration-200 active:scale-95 hover:scale-[1.02] cursor-pointer"
        >
          <img
            :src="video.img_src"
            :alt="video.title"
            class="relative h-full w-full aspect-video object-cover rounded-lg"
          />
          <div class="absolute bg-white/70 dark:bg-black/70 text-black/70 dark:text-white/70 px-2 py-1 flex flex-row items-center space-x-1 bottom-1 right-1 rounded-md">
            <Icon name="lucide:play-circle" class="w-3 h-3" />
            <p class="text-xs">Video</p>
          </div>
        </div>

        <!-- More videos button if > 4 -->
        <button
          v-if="videos.length > 4"
          @click="openVideoPlayer(3)"
          class="bg-light-100 hover:bg-light-200 dark:bg-dark-100 dark:hover:bg-dark-200 transition duration-200 active:scale-95 hover:scale-[1.02] h-auto w-full rounded-lg flex flex-col justify-between text-white p-2"
        >
          <div class="flex flex-row items-center space-x-1">
            <img
              v-for="(video, i) in videos.slice(3, 6)"
              :key="i"
              :src="video.img_src"
              :alt="video.title"
              class="h-6 w-12 rounded-md lg:h-3 lg:w-6 lg:rounded-sm aspect-video object-cover"
            />
          </div>
          <p class="text-black/70 dark:text-white/70 text-xs">
            View {{ videos.length - 3 }} more
          </p>
        </button>
      </div>
    </div>

    <!-- Video Player Modal -->
    <div v-if="isPlayerOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div class="relative w-[95vw] h-[95vh] max-w-6xl">
        <!-- Close button -->
        <button
          @click="closeVideoPlayer"
          class="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
        >
          <Icon name="lucide:x" class="w-6 h-6" />
        </button>

        <!-- Navigation buttons -->
        <button
          v-if="currentVideoIndex > 0"
          @click="previousVideo"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
        >
          <Icon name="lucide:chevron-left" class="w-6 h-6" />
        </button>

        <button
          v-if="currentVideoIndex < videos.length - 1"
          @click="nextVideo"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
        >
          <Icon name="lucide:chevron-right" class="w-6 h-6" />
        </button>

        <!-- Video iframe -->
        <iframe
          :src="`${videos[currentVideoIndex]?.iframe_src}${videos[currentVideoIndex]?.iframe_src.includes('?') ? '&' : '?'}enablejsapi=1`"
          class="w-full h-full rounded-2xl"
          allowfullscreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        />

        <!-- Video info -->
        <div class="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg">
          <h3 class="font-medium">{{ videos[currentVideoIndex]?.title }}</h3>
          <p class="text-sm opacity-75">{{ currentVideoIndex + 1 }} of {{ videos.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface VideoResult {
  url: string
  img_src: string
  title: string
  iframe_src: string
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
const videos = ref<VideoResult[] | null>(null)
const loading = ref(false)
const isPlayerOpen = ref(false)
const currentVideoIndex = ref(0)

// Methods
const searchVideos = async () => {
  loading.value = true

  try {
    // Get settings from localStorage
    const chatModelProvider = process.client ? localStorage.getItem('chatModelProvider') : null
    const chatModel = process.client ? localStorage.getItem('chatModel') : null
    const customOpenAIBaseURL = process.client ? localStorage.getItem('openAIBaseURL') : null
    const customOpenAIKey = process.client ? localStorage.getItem('openAIApiKey') : null

    const response = await $fetch<{ videos: VideoResult[] }>('/api/videos', {
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

    videos.value = response.videos ?? []
  } catch (error) {
    console.error('Failed to search videos:', error)
    videos.value = []
  } finally {
    loading.value = false
  }
}

const openVideoPlayer = (index: number) => {
  currentVideoIndex.value = index
  isPlayerOpen.value = true
  document.body.classList.add('overflow-hidden')
}

const closeVideoPlayer = () => {
  isPlayerOpen.value = false
  document.body.classList.remove('overflow-hidden')
}

const nextVideo = () => {
  if (currentVideoIndex.value < videos.value!.length - 1) {
    currentVideoIndex.value++
  }
}

const previousVideo = () => {
  if (currentVideoIndex.value > 0) {
    currentVideoIndex.value--
  }
}

// Handle keyboard navigation
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (isPlayerOpen.value) {
      if (e.key === 'Escape') {
        closeVideoPlayer()
      } else if (e.key === 'ArrowLeft') {
        previousVideo()
      } else if (e.key === 'ArrowRight') {
        nextVideo()
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