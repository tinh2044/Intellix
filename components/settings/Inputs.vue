<template>
  <div class="relative w-full">
    <input
      v-if="type === 'input'"
      v-model="modelValue"
      :type="inputType"
      :placeholder="placeholder"
      :disabled="isSaving"
      :class="[
        'w-full px-3 py-2 border border-light-200 dark:border-dark-200 rounded-lg bg-light-secondary dark:bg-dark-secondary text-black/90 dark:text-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#24A0ED]/50 transition-all duration-300',
        isSaving && 'opacity-50 cursor-not-allowed'
      ]"
      @blur="handleSave"
    />
    
    <textarea
      v-else-if="type === 'textarea'"
      v-model="modelValue"
      :placeholder="placeholder"
      :disabled="isSaving"
      :class="[
        'w-full px-3 py-2 border border-light-200 dark:border-dark-200 rounded-lg bg-light-secondary dark:bg-dark-secondary text-black/90 dark:text-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#24A0ED]/50 transition-all duration-300 min-h-[100px]',
        isSaving && 'opacity-50 cursor-not-allowed'
      ]"
      @blur="handleSave"
    />
    
    <select
      v-else-if="type === 'select'"
      v-model="modelValue"
      :disabled="isSaving"
      :class="[
        'w-full px-3 py-2 border border-light-200 dark:border-dark-200 rounded-lg bg-light-secondary dark:bg-dark-secondary text-black/90 dark:text-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#24A0ED]/50 transition-all duration-300'
      ]"
      @change="handleSave"
    >
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    
    <!-- Loading spinner -->
    <div v-if="isSaving" class="absolute inset-y-0 right-0 flex items-center pr-3">
      <Icon 
        name="lucide:loader-2" 
        size="20" 
        class="animate-spin text-[#24A0ED]" 
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'input'
  },
  inputType: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  isSaving: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const handleSave = () => {
  emit('save', props.modelValue)
}
</script> 