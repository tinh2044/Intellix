import { ChatGroq } from '@langchain/groq'
import type { ChatModel } from './index'

export const PROVIDER_INFO = {
  key: 'groq',
  displayName: 'Groq',
  description: 'Fast Groq inference models',
  website: 'https://groq.com'
}

export const loadGroqChatModels = async (): Promise<Record<string, ChatModel>> => {
  const { getGroqApiKey } = await import('~/server/utils/config')
  const apiKey = getGroqApiKey()

  if (!apiKey) {
    console.warn('Groq API key not found')
    return {}
  }

  try {
    // Test API key validity
    const testModel = new ChatGroq({
      apiKey: apiKey,
      model: 'llama3-8b-8192',
      temperature: 0,
      maxTokens: 1,
    })

    await testModel.invoke('test')

    return {
      'llama3-8b-8192': {
        displayName: 'Llama 3 8B',
        model: new ChatGroq({
          apiKey: apiKey,
          model: 'llama3-8b-8192',
          temperature: 0.7,
        }),
      },
      'llama3-70b-8192': {
        displayName: 'Llama 3 70B',
        model: new ChatGroq({
          apiKey: apiKey,
          model: 'llama3-70b-8192',
          temperature: 0.7,
        }),
      },
      'mixtral-8x7b-32768': {
        displayName: 'Mixtral 8x7B',
        model: new ChatGroq({
          apiKey: apiKey,
          model: 'mixtral-8x7b-32768',
          temperature: 0.7,
        }),
      },
      'gemma-7b-it': {
        displayName: 'Gemma 7B',
        model: new ChatGroq({
          apiKey: apiKey,
          model: 'gemma-7b-it',
          temperature: 0.7,
        }),
      },
    }
  } catch (error) {
    console.error('Error loading Groq chat models:', error instanceof Error ? error.message : String(error))
    return {}
  }
}
