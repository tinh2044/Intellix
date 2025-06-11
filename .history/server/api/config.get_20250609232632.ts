export default defineEventHandler(async (event) => {
  try {
    // Import utilities
    const { getAvailableChatModelProviders, getAvailableEmbeddingModelProviders } = 
      await import('~/utils/providers/index')
    const config = await import('~/server/utils/config')

    // Get available providers
    const [chatModelProviders, embeddingModelProviders] = await Promise.all([
      getAvailableChatModelProviders(),
      getAvailableEmbeddingModelProviders(),
    ])

    // Build response config
    const responseConfig: Record<string, any> = {}

    // Format chat model providers
    responseConfig['chatModelProviders'] = {}
    for (const provider in chatModelProviders) {
      responseConfig['chatModelProviders'][provider] = Object.keys(
        chatModelProviders[provider],
      ).map((model) => {
        return {
          name: model,
          displayName: chatModelProviders[provider][model].displayName,
        }
      })
    }

    // Format embedding model providers
    responseConfig['embeddingModelProviders'] = {}
    for (const provider in embeddingModelProviders) {
      responseConfig['embeddingModelProviders'][provider] = Object.keys(
        embeddingModelProviders[provider],
      ).map((model) => {
        return {
          name: model,
          displayName: embeddingModelProviders[provider][model].displayName,
        }
      })
    }

    // Add configuration values (masked for security)
    responseConfig['openaiApiKey'] = config.getOpenaiApiKey() || ''
    responseConfig['ollamaApiUrl'] = config.getOllamaApiEndpoint() || ''
    responseConfig['lmStudioApiUrl'] = config.getLMStudioApiEndpoint() || ''
    responseConfig['anthropicApiKey'] = config.getAnthropicApiKey() || ''
    responseConfig['groqApiKey'] = config.getGroqApiKey() || ''
    responseConfig['geminiApiKey'] = config.getGeminiApiKey() || ''
    responseConfig['deepseekApiKey'] = config.getDeepseekApiKey() || ''
    responseConfig['customOpenaiApiUrl'] = config.getCustomOpenaiApiEndpoint() || ''
    responseConfig['customOpenaiApiKey'] = config.getCustomOpenaiApiKey() || ''
    responseConfig['customOpenaiModelName'] = config.getCustomOpenaiModelName() || ''

    return responseConfig
    
  } catch (error) {
    console.error('An error occurred while getting config:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while getting config'
    })
  }
}) 