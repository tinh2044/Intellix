<template>
  <div v-if="mounted">
    <select
      :value="$colorMode.preference"
      @change="handleThemeChange"
      :class="[
        'w-full px-3 py-2 border border-light-200 dark:border-dark-200 rounded-lg bg-light-secondary dark:bg-dark-secondary text-black/90 dark:text-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#24A0ED]/50 transition-all duration-300',
        className
      ]"
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  className: {
    type: String,
    default: ''
  }
})

const mounted = ref(false)

const handleThemeChange = (event) => {
  const newTheme = event.target.value
  const { $colorMode } = useNuxtApp()
  $colorMode.preference = newTheme
}

// Prevent hydration mismatch
onMounted(() => {
  mounted.value = true
})
</script> 