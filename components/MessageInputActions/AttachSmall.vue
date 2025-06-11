<template>
  <div class="attach-small-component">
    <!-- Loading state -->
    <div v-if="loading" class="flex flex-row items-center justify-between space-x-1 p-1">
      <Icon name="lucide:loader-circle" size="20" class="text-sky-400 animate-spin" />
    </div>

    <!-- Files attached - show dropdown with button -->
    <div v-else-if="files.length > 0" class="relative">
      <button
        type="button"
        @click="showDropdown = !showDropdown"
        class="flex flex-row items-center justify-between space-x-1 p-1 text-black/50 dark:text-white/50 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary active:scale-95 transition duration-200 hover:text-black dark:hover:text-white"
      >
        <Icon name="lucide:file" size="20" class="text-sky-400" />
      </button>

      <!-- Files dropdown - appears above the button -->
      <div 
        v-if="showDropdown" 
        class="absolute bottom-14 -ml-3 z-50 w-64 md:w-[350px]"
        @click.stop
      >
        <div class="bg-light-primary dark:bg-dark-primary border rounded-md border-light-200 dark:border-dark-200 w-full max-h-[200px] md:max-h-none overflow-y-auto flex flex-col">
          <!-- Header -->
          <div class="flex flex-row items-center justify-between px-3 py-2">
            <h4 class="text-black dark:text-white font-medium text-sm">
              Attached files
            </h4>
            <div class="flex flex-row items-center space-x-4">
              <!-- Add more files -->
              <button
                type="button"
                @click="triggerFileInput"
                class="flex flex-row items-center space-x-1 text-black/70 dark:text-white/70 hover:text-black hover:dark:text-white transition duration-200"
              >
                <Icon name="lucide:plus" size="18" />
                <p class="text-xs">Add</p>
              </button>

              <!-- Clear all files -->
              <button
                @click="clearFiles"
                class="flex flex-row items-center space-x-1 text-black/70 dark:text-white/70 hover:text-black hover:dark:text-white transition duration-200"
              >
                <Icon name="lucide:trash" size="14" />
                <p class="text-xs">Clear</p>
              </button>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-[0.5px] mx-2 bg-white/10" />
          
          <!-- File list -->
          <div class="flex flex-col items-center">
            <div
              v-for="(file, i) in files"
              :key="i"
              class="flex flex-row items-center justify-start w-full space-x-3 p-3"
            >
              <div class="bg-dark-100 flex items-center justify-center w-10 h-10 rounded-md">
                <Icon name="lucide:file" size="16" class="text-white/70" />
              </div>
              <p class="text-black/70 dark:text-white/70 text-sm">
                {{ truncateFileName(file) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Backdrop to close dropdown -->
      <div 
        v-if="showDropdown"
        class="fixed inset-0 z-40"
        @click="showDropdown = false"
      />
    </div>

    <!-- No files - show attach button -->
    <button
      v-else
      type="button"
      @click="triggerFileInput"
      class="flex flex-row items-center space-x-1 text-black/50 dark:text-white/50 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary transition duration-200 hover:text-black dark:hover:text-white p-1"
    >
      <Icon name="lucide:copy-plus" size="20" />
    </button>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      @change="handleFileChange"
      accept=".pdf,.docx,.txt"
      multiple
      hidden
    />
  </div>
</template>

<script setup>
const props = defineProps({
  fileIds: {
    type: Array,
    default: () => []
  },
  files: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:fileIds', 'update:files'])

const loading = ref(false)
const showDropdown = ref(false)
const fileInput = ref(null)

const handleFileChange = async (event) => {
  const selectedFiles = event.target.files
  if (!selectedFiles || selectedFiles.length === 0) return

  loading.value = true

  try {
    const formData = new FormData()
    
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i])
    }

    // Get embedding model settings from localStorage
    if (process.client) {
      const embeddingModelProvider = localStorage.getItem('embeddingModelProvider')
      const embeddingModel = localStorage.getItem('embeddingModel')
      
      if (embeddingModelProvider) {
        formData.append('embedding_model_provider', embeddingModelProvider)
      }
      if (embeddingModel) {
        formData.append('embedding_model', embeddingModel)
      }
    }

    const response = await $fetch('/api/uploads', {
      method: 'POST',
      body: formData
    })

    // Update files and fileIds
    const newFiles = [...props.files, ...response.files]
    const newFileIds = [...props.fileIds, ...response.files.map(file => file.fileId)]
    
    emit('update:files', newFiles)
    emit('update:fileIds', newFileIds)

  } catch (error) {
    console.error('Error uploading files:', error)
  } finally {
    loading.value = false
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const clearFiles = () => {
  emit('update:files', [])
  emit('update:fileIds', [])
  showDropdown.value = false
}

const truncateFileName = (file) => {
  if (!file.fileName) return 'Unknown file'
  
  const fileName = file.fileName
  const extension = file.fileExtension || ''
  
  if (fileName.length > 25) {
    const nameWithoutExt = fileName.replace(/\.\w+$/, '')
    return nameWithoutExt.substring(0, 22) + '...' + extension
  }
  
  return fileName
}
</script> 