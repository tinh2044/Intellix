<template>
  <Html class="h-full" lang="en">
    <Head>
      <Title>Intellix - Agent search engine</Title>
      <Meta 
        name="description" 
        content="Intellix is an AI agent search engine that is connected to the internet." 
      />
      <Link rel="icon" href="/logo.png" />
      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <Link 
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap" 
        rel="stylesheet" 
      />
    </Head>
    <Body class="h-full font-montserrat">
      <div id="__nuxt">
        <NuxtLoadingIndicator />
        
        <!-- Desktop Sidebar -->
        <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-20 lg:flex-col">
          <div class="flex grow flex-col items-center justify-between gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-2 py-8 shadow-lg">
            <NuxtLink to="/" class="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </NuxtLink>
            
            <div class="flex flex-col items-center gap-y-3 w-full">
              <!-- Home -->
              <NuxtLink
                to="/"
                class="relative flex flex-row items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 duration-150 transition w-full py-2 rounded-lg"
                :class="$route.path === '/' || $route.path.startsWith('/c') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div
                  v-if="$route.path === '/' || $route.path.startsWith('/c')"
                  class="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-blue-600 dark:bg-blue-400"
                />
              </NuxtLink>
              
              <!-- Discover -->
              <NuxtLink
                to="/discover"
                class="relative flex flex-row items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 duration-150 transition w-full py-2 rounded-lg"
                :class="$route.path.includes('discover') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div
                  v-if="$route.path.includes('discover')"
                  class="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-blue-600 dark:bg-blue-400"
                />
              </NuxtLink>
              
              <!-- Library -->
              <NuxtLink
                to="/library"
                class="relative flex flex-row items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 duration-150 transition w-full py-2 rounded-lg"
                :class="$route.path.includes('library') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div
                  v-if="$route.path.includes('library')"
                  class="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-blue-600 dark:bg-blue-400"
                />
              </NuxtLink>
            </div>

            <NuxtLink to="/settings" class="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile Bottom Navigation -->
        <div class="fixed bottom-0 w-full z-50 flex flex-row items-center gap-x-6 bg-white dark:bg-gray-800 px-4 py-4 shadow-lg lg:hidden">
          <NuxtLink
            to="/"
            class="relative flex flex-col items-center space-y-1 text-center w-full"
            :class="$route.path === '/' || $route.path.startsWith('/c') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'"
          >
            <div
              v-if="$route.path === '/' || $route.path.startsWith('/c')"
              class="absolute top-0 -mt-4 h-1 w-full rounded-b-lg bg-blue-600 dark:bg-blue-400"
            />
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <p class="text-xs">Home</p>
          </NuxtLink>
          
          <NuxtLink
            to="/discover"
            class="relative flex flex-col items-center space-y-1 text-center w-full"
            :class="$route.path.includes('discover') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'"
          >
            <div
              v-if="$route.path.includes('discover')"
              class="absolute top-0 -mt-4 h-1 w-full rounded-b-lg bg-blue-600 dark:bg-blue-400"
            />
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p class="text-xs">Discover</p>
          </NuxtLink>
          
          <NuxtLink
            to="/library"
            class="relative flex flex-col items-center space-y-1 text-center w-full"
            :class="$route.path.includes('library') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'"
          >
            <div
              v-if="$route.path.includes('library')"
              class="absolute top-0 -mt-4 h-1 w-full rounded-b-lg bg-blue-600 dark:bg-blue-400"
            />
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p class="text-xs">Library</p>
          </NuxtLink>
        </div>

        <!-- Main Content Layout -->
        <main class="lg:pl-20 bg-gray-50 dark:bg-gray-900 min-h-screen pb-20 lg:pb-0">
          <div class="max-w-screen-lg lg:mx-auto mx-4 py-8">
            <slot />
          </div>
        </main>

        <!-- Toast notifications -->
        <ClientOnly>
          <div id="toast-container" />
        </ClientOnly>
      </div>
    </Body>
  </Html>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'

// Global layout setup
useHead({
  htmlAttrs: {
    class: 'h-full'
  },
  bodyAttrs: {
    class: 'h-full font-montserrat'
  }
})

// Theme initialization
const colorMode = useColorMode()

// Set default theme to dark if not set
onMounted(() => {
  if (!colorMode.preference) {
    colorMode.preference = 'dark'
  }
})
</script>

 