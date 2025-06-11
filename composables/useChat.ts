import type { Message, FileType, ChatModelProvider, EmbeddingModelProvider } from '~/types'

export const useChat = () => {
  // State management
  const chatId = ref<string | undefined>()
  const newChatCreated = ref(false)
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const messageAppeared = ref(false)
  const chatHistory = ref<[string, string][]>([])
  const files = ref<FileType[]>([])
  const fileIds = ref<string[]>([])
  const focusMode = ref('webSearch')
  const optimizationMode = ref('speed')
  const isMessagesLoaded = ref(false)
  const notFound = ref(false)
  const isReady = ref(false)

  // Configuration state
  const chatModelProvider = ref<ChatModelProvider>({
    name: '',
    provider: '',
  })
  
  const embeddingModelProvider = ref<EmbeddingModelProvider>({
    name: '',
    provider: '',
  })
  
  const isConfigReady = ref(false)
  const hasError = ref(false)

  // Generate chat ID
  const generateChatId = () => {
    // Simple implementation - in production use proper UUID or crypto
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Check configuration
  const checkConfig = async () => {
    try {
      // Get from localStorage if available
      if (process.client) {
        let chatModel = localStorage.getItem('chatModel')
        let chatModelProviderLocal = localStorage.getItem('chatModelProvider')
        let embeddingModel = localStorage.getItem('embeddingModel')
        let embeddingModelProviderLocal = localStorage.getItem('embeddingModelProvider')

        const autoImageSearch = localStorage.getItem('autoImageSearch')
        const autoVideoSearch = localStorage.getItem('autoVideoSearch')

        if (!autoImageSearch) {
          localStorage.setItem('autoImageSearch', 'true')
        }

        if (!autoVideoSearch) {
          localStorage.setItem('autoVideoSearch', 'false')
        }

        // Fetch available models from API
        try {
          const providers = await $fetch('/api/models')

          if (
            !chatModel ||
            !chatModelProviderLocal ||
            !embeddingModel ||
            !embeddingModelProviderLocal
          ) {
            if (!chatModel || !chatModelProviderLocal) {
              const chatModelProviders = providers.chatModelProviders

              chatModelProviderLocal =
                chatModelProviderLocal || Object.keys(chatModelProviders)[0]

              chatModel = Object.keys(chatModelProviders[chatModelProviderLocal])[0]

              if (!chatModelProviders || Object.keys(chatModelProviders).length === 0) {
                throw new Error('No chat models available')
              }
            }

            if (!embeddingModel || !embeddingModelProviderLocal) {
              const embeddingModelProviders = providers.embeddingModelProviders

              if (
                !embeddingModelProviders ||
                Object.keys(embeddingModelProviders).length === 0
              ) {
                throw new Error('No embedding models available')
              }

              embeddingModelProviderLocal = Object.keys(embeddingModelProviders)[0]
              embeddingModel = Object.keys(
                embeddingModelProviders[embeddingModelProviderLocal],
              )[0]
            }

            localStorage.setItem('chatModel', chatModel!)
            localStorage.setItem('chatModelProvider', chatModelProviderLocal)
            localStorage.setItem('embeddingModel', embeddingModel!)
            localStorage.setItem('embeddingModelProvider', embeddingModelProviderLocal)
          }

          chatModelProvider.value = {
            name: chatModel!,
            provider: chatModelProviderLocal,
          }

          embeddingModelProvider.value = {
            name: embeddingModel!,
            provider: embeddingModelProviderLocal,
          }

          isConfigReady.value = true
        } catch (err) {
          console.error('Failed to fetch models:', err)
          throw err
        }
      }
    } catch (err) {
      console.error('An error occurred while checking the configuration:', err)
      isConfigReady.value = false
      hasError.value = true
    }
  }

  // Load messages for existing chat
  const loadMessages = async (chatIdParam: string) => {
    try {
      const response = await $fetch(`/api/chats/${chatIdParam}`)
      
      if (response) {
        messages.value = response.messages || []
        chatHistory.value = response.chatHistory || []
        focusMode.value = response.focusMode || 'webSearch'
        files.value = response.files || []
        fileIds.value = response.fileIds || []
        isMessagesLoaded.value = true
      }
    } catch (error: any) {
      if (error.statusCode === 404) {
        notFound.value = true
      } else {
        console.error('Failed to load messages:', error)
      }
    }
  }

  // Send message function (simplified version for now)
  const sendMessage = async (message: string, messageId?: string) => {
    if (loading.value) return
    if (!isConfigReady.value) {
      throw new Error('Cannot send message before the configuration is ready')
    }

    loading.value = true
    messageAppeared.value = false
    messageId = messageId ?? generateChatId()

    // Add user message
    messages.value.push({
      content: message,
      messageId: messageId,
      chatId: chatId.value!,
      role: 'user',
      createdAt: new Date(),
    })

    try {
      // Simplified API call - will enhance later
      const response = await $fetch('/api/chat', {
        method: 'POST',
        body: {
          content: message,
          chatId: chatId.value!,
          focusMode: focusMode.value,
          optimizationMode: optimizationMode.value,
          chatModel: chatModelProvider.value,
          embeddingModel: embeddingModelProvider.value,
        }
      })

      // Add assistant response (simplified)
      messages.value.push({
        content: response.content || '',
        messageId: response.messageId || generateChatId(),
        chatId: chatId.value!,
        role: 'assistant',
        createdAt: new Date(),
        sources: response.sources,
      })

      chatHistory.value.push(['human', message], ['assistant', response.content || ''])
      loading.value = false
    } catch (error) {
      console.error('Failed to send message:', error)
      loading.value = false
      throw error
    }
  }

  // Rewrite message
  const rewrite = (messageId: string) => {
    const index = messages.value.findIndex((msg) => msg.messageId === messageId)
    if (index === -1) return

    const message = messages.value[index - 1]
    messages.value = messages.value.slice(0, messages.value.length > 2 ? index - 1 : 0)
    chatHistory.value = chatHistory.value.slice(0, messages.value.length > 2 ? index - 1 : 0)
    sendMessage(message.content, message.messageId)
  }

  // Initialize chat
  const initializeChat = async (id?: string) => {
    if (id) {
      chatId.value = id
      if (!newChatCreated.value && !isMessagesLoaded.value && messages.value.length === 0) {
        await loadMessages(id)
      }
    } else {
      newChatCreated.value = true
      isMessagesLoaded.value = true
      chatId.value = generateChatId()
    }
  }

  // Watch for ready state
  watch([isMessagesLoaded, isConfigReady], () => {
    isReady.value = isMessagesLoaded.value && isConfigReady.value
  })

  return {
    // State
    chatId: readonly(chatId),
    messages: readonly(messages),
    loading: readonly(loading),
    messageAppeared: readonly(messageAppeared),
    chatHistory: readonly(chatHistory),
    files: readonly(files),
    fileIds,
    focusMode,
    optimizationMode,
    isReady: readonly(isReady),
    notFound: readonly(notFound),
    hasError: readonly(hasError),
    isConfigReady: readonly(isConfigReady),
    chatModelProvider: readonly(chatModelProvider),
    embeddingModelProvider: readonly(embeddingModelProvider),

    // Actions
    checkConfig,
    loadMessages,
    sendMessage,
    rewrite,
    initializeChat,
    setFiles: (newFiles: FileType[]) => { files.value = newFiles },
    setFocusMode: (mode: string) => { focusMode.value = mode },
    setOptimizationMode: (mode: string) => { optimizationMode.value = mode },
  }
} 