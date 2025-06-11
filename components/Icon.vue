<template>
  <component :is="iconComponent" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

interface Props {
  name: string
}

const props = defineProps<Props>()

// Extract icon name from "lucide:icon-name" format
const iconName = computed(() => {
  const name = props.name.replace('lucide:', '')
  // Convert kebab-case to PascalCase
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
})

// Get the actual icon component
const iconComponent = computed(() => {
  const componentName = iconName.value
  return (LucideIcons as any)[componentName] || LucideIcons.HelpCircle
})
</script> 