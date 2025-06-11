<template>
  <SettingsSection title="Model Settings">
    <div class="space-y-6">
      <!-- Chat Model Configuration -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium dark:text-white">Chat Model</h3>
        
        <!-- Chat Model Provider -->
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-white/80">
            Chat Model Provider
          </label>
          <select
            v-model="selectedChatModelProvider"
            @change="onChatProviderChange"
            class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="" disabled>Select a provider</option>
            <option
              v-for="(models, provider) in chatModelProviders"
              :key="provider"
              :value="provider"
              :disabled="Object.keys(models).length === 0"
            >
              {{ formatProviderName(provider) }}
              {{ Object.keys(models).length === 0 ? ' (No models available)' : '' }}
            </option>
          </select>
        </div>

        <!-- Chat Model -->
        <div v-if="selectedChatModelProvider">
          <label class="block text-sm font-medium mb-2 dark:text-white/80">
            Chat Model
          </label>
          <select
            v-model="selectedChatModel"
            @change="onChatModelChange"
            class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="" disabled>Select a model</option>
            <option
              v-for="(config, model) in availableChatModels"
              :key="model"
              :value="model"
            >
              {{ model }}
            </option>
          </select>
        </div>
      </div>

      <!-- Embedding Model Configuration -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium dark:text-white">Embedding Model</h3>
        
        <!-- Embedding Model Provider -->
        <div>
          <label class="block text-sm font-medium mb-2 dark:text-white/80">
            Embedding Model Provider
          </label>
          <select
            v-model="selectedEmbeddingModelProvider"
            @change="onEmbeddingProviderChange"
            class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="" disabled>Select a provider</option>
            <option
              v-for="(models, provider) in embeddingModelProviders"
              :key="provider"
              :value="provider"
              :disabled="Object.keys(models).length === 0"
            >
              {{ formatProviderName(provider) }}
              {{ Object.keys(models).length === 0 ? ' (No models available)' : '' }}
            </option>
          </select>
        </div>

        <!-- Embedding Model -->
        <div v-if="selectedEmbeddingModelProvider">
          <label class="block text-sm font-medium mb-2 dark:text-white/80">
            Embedding Model
          </label>
          <select
            v-model="selectedEmbeddingModel"
            @change="onEmbeddingModelChange"
            class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="" disabled>Select a model</option>
            <option
              v-for="(config, model) in availableEmbeddingModels"
              :key="model"
              :value="model"
            >
              {{ model }}
            </option>
          </select>
        </div>
      </div>

      <!-- Model Info -->
      <div v-if="selectedChatModel || selectedEmbeddingModel" class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 class="font-medium text-blue-900 dark:text-blue-100 mb-2">Current Configuration</h4>
        <div class="space-y-1 text-sm text-blue-800 dark:text-blue-200">
          <p v-if="selectedChatModel">
            <span class="font-medium">Chat:</span> {{ selectedChatModelProvider }} / {{ selectedChatModel }}
          </p>
          <p v-if="selectedEmbeddingModel">
            <span class="font-medium">Embedding:</span> {{ selectedEmbeddingModelProvider }} / {{ selectedEmbeddingModel }}
          </p>
        </div>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup lang="ts">
interface ModelConfig {
  [key: string]: any
}

interface ModelProviders {
  [provider: string]: ModelConfig
}

interface Props {
  chatModelProviders: ModelProviders
  embeddingModelProviders: ModelProviders
  selectedChatModelProvider: string
  selectedChatModel: string
  selectedEmbeddingModelProvider: string
  selectedEmbeddingModel: string
}

interface Emits {
  'update:selectedChatModelProvider': [provider: string]
  'update:selectedChatModel': [model: string]
  'update:selectedEmbeddingModelProvider': [provider: string]
  'update:selectedEmbeddingModel': [model: string]
  'save-config': [key: string, value: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Computed properties
const availableChatModels = computed(() => {
  if (!props.selectedChatModelProvider) return {}
  return props.chatModelProviders[props.selectedChatModelProvider] || {}
})

const availableEmbeddingModels = computed(() => {
  if (!props.selectedEmbeddingModelProvider) return {}
  return props.embeddingModelProviders[props.selectedEmbeddingModelProvider] || {}
})

// Methods
const formatProviderName = (provider: string) => {
  return provider
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const onChatProviderChange = () => {
  emit('update:selectedChatModelProvider', props.selectedChatModelProvider)
  
  // Auto-select first available model
  const models = Object.keys(availableChatModels.value)
  if (models.length > 0) {
    const firstModel = models[0]
    emit('update:selectedChatModel', firstModel)
    emit('save-config', 'chatModelProvider', props.selectedChatModelProvider)
    emit('save-config', 'chatModel', firstModel)
  }
}

const onChatModelChange = () => {
  emit('update:selectedChatModel', props.selectedChatModel)
  emit('save-config', 'chatModel', props.selectedChatModel)
}

const onEmbeddingProviderChange = () => {
  emit('update:selectedEmbeddingModelProvider', props.selectedEmbeddingModelProvider)
  
  // Auto-select first available model
  const models = Object.keys(availableEmbeddingModels.value)
  if (models.length > 0) {
    const firstModel = models[0]
    emit('update:selectedEmbeddingModel', firstModel)
    emit('save-config', 'embeddingModelProvider', props.selectedEmbeddingModelProvider)
    emit('save-config', 'embeddingModel', firstModel)
  }
}

const onEmbeddingModelChange = () => {
  emit('update:selectedEmbeddingModel', props.selectedEmbeddingModel)
  emit('save-config', 'embeddingModel', props.selectedEmbeddingModel)
}
</script>

<style scoped>
/* Additional component-specific styles if needed */
</style> 