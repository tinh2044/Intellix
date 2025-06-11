import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import type { ChatModel, EmbeddingModel } from './index'

export const PROVIDER_INFO = {
  key: 'lmstudio',
  displayName: 'LM Studio',
  description: 'Local LM Studio models',
  website: 'https://lmstudio.ai'
}

export const loadLMStudioChatModels = async (): Promise<Record<string, ChatModel>> => {
  const { getLMStudioApiEndpoint } = await import('~/server/utils/config')
  const baseUrl = getLMStudioApiEndpoint()

  try {
    // Get available models from LM Studio
    const response = await fetch(`${baseUrl}/v1/models`)
    if (!response.ok) {
      throw new Error(`LM Studio API not available: ${response.status}`)
    }

    const data = await response.json()
    const models: Record<string, ChatModel> = {}

    for (const model of data.data || []) {
      const modelId = model.id
      
      try {
        models[modelId] = {
          displayName: `LM Studio: ${modelId}`,
          model: new ChatOpenAI({
            openAIApiKey: 'lm-studio',
            modelName: modelId,
            temperature: 0.7,
            configuration: {
              baseURL: `${baseUrl}/v1`,
            },
          }),
        }
      } catch (modelError) {
        console.warn(`Failed to load LM Studio model ${modelId}:`, modelError instanceof Error ? modelError.message : String(modelError))
      }
    }

    return models
  } catch (error) {
    console.error('Error loading LM Studio chat models:', error instanceof Error ? error.message : String(error))
    return {}
  }
}

export const loadLMStudioEmbeddingModels = async (): Promise<Record<string, EmbeddingModel>> => {
  const { getLMStudioApiEndpoint } = await import('~/server/utils/config')
  const baseUrl = getLMStudioApiEndpoint()

  try {
    // Get available models
    const response = await fetch(`${baseUrl}/v1/models`)
    if (!response.ok) {
      throw new Error(`LM Studio API not available: ${response.status}`)
    }

    const data = await response.json()
    const models: Record<string, EmbeddingModel> = {}

    // Filter models suitable for embeddings (if any)
    const embeddingModels = data.data?.filter((model: any) => 
      model.id.includes('embed') || 
      model.id.includes('embedding')
    ) || []

    for (const model of embeddingModels) {
      const modelId = model.id
      
      try {
        models[modelId] = {
          displayName: `LM Studio: ${modelId}`,
          model: new OpenAIEmbeddings({
            openAIApiKey: 'lm-studio',
            modelName: modelId,
            configuration: {
              baseURL: `${baseUrl}/v1`,
            },
          }),
        }
      } catch (modelError) {
        console.warn(`Failed to load LM Studio embedding model ${modelId}:`, modelError instanceof Error ? modelError.message : String(modelError))
      }
    }

    return models
  } catch (error) {
    console.error('Error loading LM Studio embedding models:', error instanceof Error ? error.message : String(error))
    return {}
  }
}
