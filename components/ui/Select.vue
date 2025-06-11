<template>
  <select
    v-model="internalValue"
    :class="cn(
      'bg-light-secondary dark:bg-dark-secondary px-3 py-2 flex items-center overflow-hidden border border-light-200 dark:border-dark-200 dark:text-white rounded-lg text-sm',
      className
    )"
    v-bind="$attrs"
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
</template>

<script setup lang="ts">
interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface Props {
  options: SelectOption[]
  modelValue?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  className: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Internal value for v-model
const internalValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

// Utility function for class names
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}
</script> 