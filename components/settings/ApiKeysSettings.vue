<template>
  <SettingsSection title="API Keys">
    <div class="flex flex-col space-y-4">
      <!-- OpenAI API Key -->
      <div class="flex flex-col space-y-1">
        <p class="text-black/70 dark:text-white/70 text-sm">OpenAI API Key</p>
        <Inputs
          :model-value="config.openaiApiKey"
          placeholder="OpenAI API Key"
          :is-saving="savingStates.openaiApiKey"
          @update:model-value="updateConfig('openaiApiKey', $event)"
          @save="saveConfig('openaiApiKey', $event)"
        />
      </div>

      <!-- Ollama API URL -->
      <div class="flex flex-col space-y-1">
        <p class="text-black/70 dark:text-white/70 text-sm">Ollama API URL</p>
        <Inputs
          :model-value="config.ollamaApiUrl"
          placeholder="Ollama API URL"
          :is-saving="savingStates.ollamaApiUrl"
          @update:model-value="updateConfig('ollamaApiUrl', $event)"
          @save="saveConfig('ollamaApiUrl', $event)"
        />
      </div>

      <!-- GROQ API Key -->
      <div class="flex flex-col space-y-1">
        <p class="text-black/70 dark:text-white/70 text-sm">GROQ API Key</p>
        <Inputs
          :model-value="config.groqApiKey"
          placeholder="GROQ API Key"
          :is-saving="savingStates.groqApiKey"
          @update:model-value="updateConfig('groqApiKey', $event)"
          @save="saveConfig('groqApiKey', $event)"
        />
      </div>

      <!-- Anthropic API Key -->
      <div class="flex flex-col space-y-1">
        <p class="text-black/70 dark:text-white/70 text-sm">Anthropic API Key</p>
        <Inputs
          :model-value="config.anthropicApiKey"
          placeholder="Anthropic API key"
          :is-saving="savingStates.anthropicApiKey"
          @update:model-value="updateConfig('anthropicApiKey', $event)"
          @save="saveConfig('anthropicApiKey', $event)"
        />
      </div>

      <!-- Gemini API Key -->
      <div class="flex flex-col space-y-1">
        <p class="text-black/70 dark:text-white/70 text-sm">Gemini API Key</p>
        <Inputs
          :model-value="config.geminiApiKey"
          placeholder="Gemini API key"
          :is-saving="savingStates.geminiApiKey"
          @update:model-value="updateConfig('geminiApiKey', $event)"
          @save="saveConfig('geminiApiKey', $event)"
        />
      </div>

      <!-- Deepseek API Key -->
      <div class="flex flex-col space-y-1">
        <p class="text-black/70 dark:text-white/70 text-sm">Deepseek API Key</p>
        <Inputs
          :model-value="config.deepseekApiKey"
          placeholder="Deepseek API Key"
          :is-saving="savingStates.deepseekApiKey"
          @update:model-value="updateConfig('deepseekApiKey', $event)"
          @save="saveConfig('deepseekApiKey', $event)"
        />
      </div>

      <!-- LM Studio API URL -->
      <div class="flex flex-col space-y-1">
        <p class="text-black/70 dark:text-white/70 text-sm">LM Studio API URL</p>
        <Inputs
          :model-value="config.lmStudioApiUrl"
          placeholder="LM Studio API URL"
          :is-saving="savingStates.lmStudioApiUrl"
          @update:model-value="updateConfig('lmStudioApiUrl', $event)"
          @save="saveConfig('lmStudioApiUrl', $event)"
        />
      </div>
    </div>
  </SettingsSection>
</template>

<script setup>
const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  savingStates: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['updateConfig', 'saveConfig'])

const updateConfig = (key, value) => {
  emit('updateConfig', { key, value })
}

const saveConfig = (key, value) => {
  emit('saveConfig', { key, value })
}
</script> 