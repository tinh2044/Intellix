<template>
  <div>
    <!-- Desktop Sidebar -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-20 lg:flex-col">
      <div class="flex grow flex-col items-center justify-between gap-y-5 overflow-y-auto bg-light-secondary dark:bg-dark-secondary px-2 py-8">
        <NuxtLink to="/" class="cursor-pointer">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </NuxtLink>
        
        <div class="flex flex-col items-center gap-y-3 w-full">
          <NuxtLink
            v-for="(link, i) in navLinks"
            :key="i"
            :to="link.href"
            :class="linkClass(link.active)"
          >
            <component :is="link.icon" />
            <div
              v-if="link.active"
              class="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-black dark:bg-white"
            />
          </NuxtLink>
        </div>

        <NuxtLink to="/settings" class="cursor-pointer">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Mobile Bottom Navigation -->
    <div class="fixed bottom-0 w-full z-50 flex flex-row items-center gap-x-6 bg-light-primary dark:bg-dark-primary px-4 py-4 shadow-sm lg:hidden">
      <NuxtLink
        v-for="(link, i) in navLinks"
        :key="i"
        :to="link.href"
        :class="mobileLinkClass(link.active)"
      >
        <div
          v-if="link.active"
          class="absolute top-0 -mt-4 h-1 w-full rounded-b-lg bg-black dark:bg-white"
        />
        <component :is="link.icon" />
        <p class="text-xs">{{ link.label }}</p>
      </NuxtLink>
    </div>

    <!-- Main Content Layout -->
    <main class="lg:pl-20 bg-light-primary dark:bg-dark-primary min-h-screen">
      <div class="max-w-screen-lg lg:mx-auto mx-4">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Get current route
const route = useRoute()

// Home icon component
const HomeIcon = {
  template: `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  `
}

// Search icon component
const SearchIcon = {
  template: `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  `
}

// Library icon component
const LibraryIcon = {
  template: `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  `
}

// Define navigation links
const navLinks = computed(() => [
  {
    icon: HomeIcon,
    href: '/',
    active: route.path === '/' || route.path.startsWith('/c'),
    label: 'Home',
  },
  {
    icon: SearchIcon,
    href: '/discover',
    active: route.path.includes('discover'),
    label: 'Discover',
  },
  {
    icon: LibraryIcon,
    href: '/library',
    active: route.path.includes('library'),
    label: 'Library',
  },
])

// Link classes
const linkClass = (active: boolean) => {
  return [
    'relative flex flex-row items-center justify-center cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 duration-150 transition w-full py-2 rounded-lg',
    active
      ? 'text-black dark:text-white'
      : 'text-black/70 dark:text-white/70'
  ].join(' ')
}

const mobileLinkClass = (active: boolean) => {
  return [
    'relative flex flex-col items-center space-y-1 text-center w-full',
    active
      ? 'text-black dark:text-white'
      : 'text-black dark:text-white/70'
  ].join(' ')
}
</script>

 