<template>
  <div>
    <!-- Delete button -->
    <button
      @click="openDialog"
      class="bg-transparent text-red-400 hover:scale-105 transition duration-200"
      title="Delete chat"
    >
      <Icon name="lucide:trash" size="17" />
    </button>

    <!-- Confirmation dialog -->
    <Teleport to="body">
      <div 
        v-if="showDialog" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="closeDialog"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/30" />
        
        <!-- Dialog panel -->
        <div 
          class="relative w-full max-w-md transform rounded-2xl bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 p-6 text-left align-middle shadow-xl transition-all"
          @click.stop
        >
          <h3 class="text-lg font-medium leading-6 dark:text-white mb-2">
            Delete Confirmation
          </h3>
          <p class="text-sm dark:text-white/70 text-black/70 mb-6">
            Are you sure you want to delete this chat?
          </p>
          
          <div class="flex flex-row items-end justify-end space-x-4">
            <button
              @click="closeDialog"
              :disabled="loading"
              class="text-black/50 dark:text-white/50 text-sm hover:text-black/70 hover:dark:text-white/70 transition duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              :disabled="loading"
              class="text-red-400 text-sm hover:text-red-500 transition duration-200 disabled:opacity-50"
            >
              {{ loading ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const props = defineProps({
  chatId: {
    type: String,
    required: true
  },
  redirect: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['deleted'])

const showDialog = ref(false)
const loading = ref(false)

const openDialog = () => {
  showDialog.value = true
}

const closeDialog = () => {
  if (!loading.value) {
    showDialog.value = false
  }
}

const handleDelete = async () => {
  loading.value = true
  
  try {
    const response = await $fetch(`/api/chats/${props.chatId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status !== 200) {
      throw new Error('Failed to delete chat')
    }

    emit('deleted', props.chatId)
    
    if (props.redirect) {
      await navigateTo('/')
    }
    
    showDialog.value = false
  } catch (error) {
    console.error('Error deleting chat:', error)
    // You can add toast notification here
  } finally {
    loading.value = false
  }
}
</script> 