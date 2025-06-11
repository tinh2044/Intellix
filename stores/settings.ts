import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  // API Keys
  const openaiApiKey = useLocalStorage('openaiApiKey', '')
  const anthropicApiKey = useLocalStorage('anthropicApiKey', '')
  const geminiApiKey = useLocalStorage('geminiApiKey', '')
  const groqApiKey = useLocalStorage('groqApiKey', '')
  const deepseekApiKey = useLocalStorage('deepseekApiKey', '')
  
  // Model Configuration
  const chatModel = useLocalStorage('chatModel', '')
  const chatModelProvider = useLocalStorage('chatModelProvider', '')
  const embeddingModel = useLocalStorage('embeddingModel', '')
  const embeddingModelProvider = useLocalStorage('embeddingModelProvider', '')
  
  // Search Settings
  const autoImageSearch = useLocalStorage('autoImageSearch', true)
  const autoVideoSearch = useLocalStorage('autoVideoSearch', false)
  
  // System Configuration
  const systemInstructions = useLocalStorage('systemInstructions', '')
  
  // Custom OpenAI Configuration
  const customOpenAIBaseURL = useLocalStorage('customOpenAIBaseURL', '')
  const customOpenAIApiKey = useLocalStorage('customOpenAIApiKey', '')
  
  // LM Studio Configuration
  const lmStudioBaseURL = useLocalStorage('lmStudioBaseURL', 'http://localhost:1234')
  
  // Actions
  const updateApiKey = (provider: string, key: string) => {
    switch (provider) {
      case 'openai':
        openaiApiKey.value = key
        break
      case 'anthropic':
        anthropicApiKey.value = key
        break
      case 'gemini':
        geminiApiKey.value = key
        break
      case 'groq':
        groqApiKey.value = key
        break
      case 'deepseek':
        deepseekApiKey.value = key
        break
      case 'custom-openai':
        customOpenAIApiKey.value = key
        break
    }
  }
  
  const updateChatModel = (provider: string, model: string) => {
    chatModelProvider.value = provider
    chatModel.value = model
  }
  
  const updateEmbeddingModel = (provider: string, model: string) => {
    embeddingModelProvider.value = provider
    embeddingModel.value = model
  }
  
  const updateSearchSettings = (imageSearch: boolean, videoSearch: boolean) => {
    autoImageSearch.value = imageSearch
    autoVideoSearch.value = videoSearch
  }
  
  const updateSystemInstructions = (instructions: string) => {
    systemInstructions.value = instructions
  }
  
  const updateCustomOpenAI = (baseURL: string, apiKey: string) => {
    customOpenAIBaseURL.value = baseURL
    customOpenAIApiKey.value = apiKey
  }
  
  const updateLMStudioBaseURL = (baseURL: string) => {
    lmStudioBaseURL.value = baseURL
  }
  
  // Getters
  const getApiKey = computed(() => (provider: string) => {
    switch (provider) {
      case 'openai':
        return openaiApiKey.value
      case 'anthropic':
        return anthropicApiKey.value
      case 'gemini':
        return geminiApiKey.value
      case 'groq':
        return groqApiKey.value
      case 'deepseek':
        return deepseekApiKey.value
      case 'custom-openai':
        return customOpenAIApiKey.value
      default:
        return ''
    }
  })
  
  const isConfigured = computed(() => {
    return chatModel.value && chatModelProvider.value && 
           embeddingModel.value && embeddingModelProvider.value
  })
  
  const hasValidApiKey = computed(() => (provider: string) => {
    const key = getApiKey.value(provider)
    return key && key.length > 0
  })
  
  return {
    // State
    openaiApiKey,
    anthropicApiKey,
    geminiApiKey,
    groqApiKey,
    deepseekApiKey,
    chatModel,
    chatModelProvider,
    embeddingModel,
    embeddingModelProvider,
    autoImageSearch,
    autoVideoSearch,
    systemInstructions,
    customOpenAIBaseURL,
    customOpenAIApiKey,
    lmStudioBaseURL,
    
    // Actions
    updateApiKey,
    updateChatModel,
    updateEmbeddingModel,
    updateSearchSettings,
    updateSystemInstructions,
    updateCustomOpenAI,
    updateLMStudioBaseURL,
    
    // Getters
    getApiKey,
    isConfigured,
    hasValidApiKey
  }
})

// Helper composable for localStorage with SSR safety
function useLocalStorage<T>(key: string, defaultValue: T) {
  const storedValue = process.client 
    ? localStorage.getItem(key) 
    : null
    
  const value = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  )
  
  if (process.client) {
    watch(value, (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    }, { deep: true })
  }
  
  return value
} 