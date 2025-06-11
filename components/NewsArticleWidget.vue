<template>
  <div class="bg-light-secondary dark:bg-dark-secondary rounded-xl border border-light-200 dark:border-dark-200 shadow-sm flex flex-row items-center w-full h-24 min-h-[96px] max-h-[96px] px-3 py-2 gap-3 overflow-hidden">
    <!-- Loading state -->
    <div v-if="loading" class="animate-pulse flex flex-row items-center w-full h-full">
      <div class="rounded-lg w-16 min-w-16 max-w-16 h-16 min-h-16 max-h-16 bg-light-200 dark:bg-dark-200 mr-3" />
      <div class="flex flex-col justify-center flex-1 h-full w-0 gap-2">
        <div class="h-4 w-3/4 rounded bg-light-200 dark:bg-dark-200" />
        <div class="h-3 w-1/2 rounded bg-light-200 dark:bg-dark-200" />
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="w-full text-xs text-red-400">
      Could not load news.
    </div>

    <!-- Article content -->
    <NuxtLink
      v-else-if="article"
      :to="`/?q=Summary: ${article.url}`"
      class="flex flex-row items-center w-full h-full group"
    >
      <img
        :src="processedThumbnail"
        :alt="article.title"
        class="object-cover rounded-lg w-16 min-w-16 max-w-16 h-16 min-h-16 max-h-16 border border-light-200 dark:border-dark-200 bg-light-200 dark:bg-dark-200 group-hover:opacity-90 transition"
      />
      <div class="flex flex-col justify-center flex-1 h-full pl-3 w-0">
        <div class="font-bold text-xs text-black dark:text-white leading-tight truncate overflow-hidden whitespace-nowrap">
          {{ article.title }}
        </div>
        <p class="text-black/70 dark:text-white/70 text-xs leading-snug truncate overflow-hidden whitespace-nowrap">
          {{ article.content }}
        </p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
interface Article {
  title: string
  content: string
  url: string
  thumbnail: string
}

const article = ref<Article | null>(null)
const loading = ref(true)
const error = ref(false)

const processedThumbnail = computed(() => {
  if (!article.value?.thumbnail) return ''
  
  try {
    const url = new URL(article.value.thumbnail)
    const id = url.searchParams.get('id')
    return `${url.origin}${url.pathname}${id ? `?id=${id}` : ''}`
  } catch {
    return article.value.thumbnail
  }
})

// Fetch article on component mount
onMounted(async () => {
  try {
    const data = await $fetch('/api/discover?mode=preview')
    const articles = (data.blogs || []).filter((a: Article) => a.thumbnail)
    
    if (articles.length > 0) {
      article.value = articles[Math.floor(Math.random() * articles.length)]
    }
  } catch (err) {
    error.value = true
    console.error('Error loading news article:', err)
  } finally {
    loading.value = false
  }
})
</script> 