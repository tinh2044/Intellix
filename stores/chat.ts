import { defineStore } from 'pinia'

export interface Message {
  messageId: string
  chatId: string
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{
    title: string
    url: string
    metadata?: any
  }>
  createdAt: Date
}

export interface FileType {
  id: string
  name: string
  type: string
  url?: string
}

export interface ChatModelProvider {
  name: string
  provider: string
}

export interface EmbeddingModelProvider {
  name: string
  provider: string
}

export const useChatStore = defineStore('chat', () => {
  // State
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const currentChatId = ref<string | null>(null)
  
  // Configuration state
  const chatModelProvider = ref<ChatModelProvider>({
    name: '',
    provider: ''
  })
  
  const embeddingModelProvider = ref<EmbeddingModelProvider>({
    name: '',
    provider: ''
  })
  
  const isConfigReady = ref(false)
  
  // Focus and optimization modes
  const focusMode = ref('webSearch')
  const optimizationMode = ref('speed')
  
  // File handling
  const files = ref<FileType[]>([])
  const fileIds = ref<string[]>([])
  
  // Actions
  const addMessage = (message: Message) => {
    messages.value.push(message)
  }
  
  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    const index = messages.value.findIndex(m => m.messageId === messageId)
    if (index !== -1) {
      messages.value[index] = { ...messages.value[index], ...updates }
    }
  }
  
  const clearMessages = () => {
    messages.value = []
  }
  
  const setCurrentChat = (chatId: string | null) => {
    currentChatId.value = chatId
  }
  
  const updateChatModel = (provider: ChatModelProvider) => {
    chatModelProvider.value = provider
  }
  
  const updateEmbeddingModel = (provider: EmbeddingModelProvider) => {
    embeddingModelProvider.value = provider
  }
  
  const setConfigReady = (ready: boolean) => {
    isConfigReady.value = ready
  }
  
  const setFocusMode = (mode: string) => {
    focusMode.value = mode
  }
  
  const setOptimizationMode = (mode: string) => {
    optimizationMode.value = mode
  }
  
  const updateFiles = (newFiles: FileType[]) => {
    files.value = newFiles
  }
  
  const updateFileIds = (ids: string[]) => {
    fileIds.value = ids
  }
  
  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }
  
  // Getters
  const currentModel = computed(() => 
    `${chatModelProvider.value.provider}:${chatModelProvider.value.name}`
  )
  
  const currentEmbeddingModel = computed(() =>
    `${embeddingModelProvider.value.provider}:${embeddingModelProvider.value.name}`
  )
  
  const lastMessage = computed(() => 
    messages.value[messages.value.length - 1]
  )
  
  const userMessages = computed(() =>
    messages.value.filter(m => m.role === 'user')
  )
  
  const assistantMessages = computed(() =>
    messages.value.filter(m => m.role === 'assistant')
  )
  
  return {
    // State
    messages,
    loading,
    currentChatId,
    chatModelProvider,
    embeddingModelProvider,
    isConfigReady,
    focusMode,
    optimizationMode,
    files,
    fileIds,
    
    // Actions
    addMessage,
    updateMessage,
    clearMessages,
    setCurrentChat,
    updateChatModel,
    updateEmbeddingModel,
    setConfigReady,
    setFocusMode,
    setOptimizationMode,
    updateFiles,
    updateFileIds,
    setLoading,
    
    // Getters
    currentModel,
    currentEmbeddingModel,
    lastMessage,
    userMessages,
    assistantMessages
  }
}) 