<template>
  <SettingsSection title="System Instructions">
    <div class="flex flex-col space-y-4">
      <Inputs
        type="textarea"
        :model-value="systemInstructions"
        placeholder="Enter system instructions for the AI assistant..."
        :is-saving="savingStates.systemInstructions"
        @update:model-value="updateInstructions"
        @save="saveInstructions"
      />
    </div>
  </SettingsSection>
</template>

<script setup>
const props = defineProps({
  systemInstructions: {
    type: String,
    default: ''
  },
  savingStates: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:systemInstructions', 'saveConfig'])

const updateInstructions = (value) => {
  emit('update:systemInstructions', value)
}

const saveInstructions = (value) => {
  emit('saveConfig', 'systemInstructions', value)
}
</script> 