import { ChatOllama } from '@langchain/community/chat_models/ollama'
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama'
import type { ChatModel, EmbeddingModel } from './index'

export const PROVIDER_INFO = {
  key: 'ollama',
  displayName: 'Ollama',
  description: 'Local Ollama models',
  website: 'https://ollama.ai'
}

export const loadOllamaChatModels = async (): Promise<Record<string, ChatModel>> => {
  const { getOllamaApiEndpoint } = await import('~/server/utils/config')
  const baseUrl = getOllamaApiEndpoint()

  try {
    // Get available models from Ollama
    const response = await fetch(`${baseUrl}/api/tags`)
    if (!response.ok) {
      throw new Error(`Ollama API not available: ${response.status}`)
    }

    const data = await response.json()
    const models: Record<string, ChatModel> = {}

    for (const model of data.models || []) {
      const modelName = model.name
      
      try {
        models[modelName] = {
          displayName: `Ollama: ${modelName}`,
          model: new ChatOllama({
            baseUrl: baseUrl,
            model: modelName,
            temperature: 0.7,
          }),
        }
      } catch (modelError) {
        console.warn(`Failed to load Ollama model ${modelName}:`, modelError instanceof Error ? modelError.message : String(modelError))
      }
    }

    return models
  } catch (error) {
    console.error('Error loading Ollama chat models:', error instanceof Error ? error.message : String(error))
    return {}
  }
}

export const loadOllamaEmbeddingModels = async (): Promise<Record<string, EmbeddingModel>> => {
  const { getOllamaApiEndpoint } = await import('~/server/utils/config')
  const baseUrl = getOllamaApiEndpoint()

  try {
    // Get available models
    const response = await fetch(`${baseUrl}/api/tags`)
    if (!response.ok) {
      throw new Error(`Ollama API not available: ${response.status}`)
    }

    const data = await response.json()
    const models: Record<string, EmbeddingModel> = {}

    // Filter models suitable for embeddings
    const embeddingModels = data.models?.filter((model: any) => 
      model.name.includes('embed') || 
      model.name.includes('nomic') ||
      model.name.includes('mxbai')
    ) || []

    for (const model of embeddingModels) {
      const modelName = model.name
      
      try {
        models[modelName] = {
          displayName: `Ollama: ${modelName}`,
          model: new OllamaEmbeddings({
            baseUrl: baseUrl,
            model: modelName,
          }),
        }
      } catch (modelError) {
        console.warn(`Failed to load Ollama embedding model ${modelName}:`, modelError instanceof Error ? modelError.message : String(modelError))
      }
    }

    return models
  } catch (error) {
    console.error('Error loading Ollama embedding models:', error instanceof Error ? error.message : String(error))
    return {}
  }
}
