export default defineEventHandler(async (event) => {
  try {
    // Import utilities
    const { getAvailableChatModelProviders, getAvailableEmbeddingModelProviders } = 
      await import('~/utils/providers')

    // Get all available models
    const [chatModelProviders, embeddingModelProviders] = await Promise.all([
      getAvailableChatModelProviders(),
      getAvailableEmbeddingModelProviders(),
    ])

    // Remove the actual model instances from response (keep only metadata)
    Object.keys(chatModelProviders).forEach((provider) => {
      Object.keys(chatModelProviders[provider]).forEach((model) => {
        delete (chatModelProviders[provider][model] as { model?: unknown }).model
      })
    })

    Object.keys(embeddingModelProviders).forEach((provider) => {
      Object.keys(embeddingModelProviders[provider]).forEach((model) => {
        delete (embeddingModelProviders[provider][model] as { model?: unknown }).model
      })
    })

    return {
      chatModelProviders,
      embeddingModelProviders
    }
    
  } catch (error) {
    console.error('An error occurred while fetching models:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch available models'
    })
  }
}) 