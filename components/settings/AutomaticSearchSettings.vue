<template>
  <SettingsSection title="Automatic Search">
    <div class="flex flex-col space-y-4">
      <!-- Automatic Image Search -->
      <div class="flex items-center justify-between p-3 bg-light-secondary dark:bg-dark-secondary rounded-lg hover:bg-light-200 dark:hover:bg-dark-200 transition-colors">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-light-200 dark:bg-dark-200 rounded-lg">
            <Icon name="lucide:images" size="18" class="text-black/70 dark:text-white/70" />
          </div>
          <div>
            <p class="text-sm text-black/90 dark:text-white/90 font-medium">Automatic Image Search</p>
            <p class="text-xs text-black/60 dark:text-white/60 mt-0.5">Automatically search for relevant images in chat responses</p>
          </div>
        </div>
        
        <!-- Toggle Switch -->
        <div 
          @click="toggleImageSearch"
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer',
            automaticImageSearch ? 'bg-[#24A0ED]' : 'bg-light-200 dark:bg-dark-200'
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              automaticImageSearch ? 'translate-x-6' : 'translate-x-1'
            ]"
          />
        </div>
      </div>

      <!-- Automatic Video Search -->
      <div class="flex items-center justify-between p-3 bg-light-secondary dark:bg-dark-secondary rounded-lg hover:bg-light-200 dark:hover:bg-dark-200 transition-colors">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-light-200 dark:bg-dark-200 rounded-lg">
            <Icon name="lucide:video" size="18" class="text-black/70 dark:text-white/70" />
          </div>
          <div>
            <p class="text-sm text-black/90 dark:text-white/90 font-medium">Automatic Video Search</p>
            <p class="text-xs text-black/60 dark:text-white/60 mt-0.5">Automatically search for relevant videos in chat responses</p>
          </div>
        </div>
        
        <!-- Toggle Switch -->
        <div 
          @click="toggleVideoSearch"
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer',
            automaticVideoSearch ? 'bg-[#24A0ED]' : 'bg-light-200 dark:bg-dark-200'
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              automaticVideoSearch ? 'translate-x-6' : 'translate-x-1'
            ]"
          />
        </div>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup>
const props = defineProps({
  automaticImageSearch: {
    type: Boolean,
    default: false
  },
  automaticVideoSearch: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:automaticImageSearch', 'update:automaticVideoSearch', 'saveConfig'])

const toggleImageSearch = () => {
  const newValue = !props.automaticImageSearch
  emit('update:automaticImageSearch', newValue)
  emit('saveConfig', 'automaticImageSearch', newValue)
}

const toggleVideoSearch = () => {
  const newValue = !props.automaticVideoSearch
  emit('update:automaticVideoSearch', newValue)
  emit('saveConfig', 'automaticVideoSearch', newValue)
}
</script> 