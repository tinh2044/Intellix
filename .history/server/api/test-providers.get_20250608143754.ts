export default defineEventHandler(async (event) => {
  try {
    const { getAvailableChatModelProviders, getAvailableEmbeddingModelProviders, getCacheStatus } = await import('~/utils/providers')
    
    console.log('🔍 Testing AI providers...')
    
    // Test configuration
    const { validateConfig } = await import('~/server/utils/config')
    const configValidation = validateConfig()
    
    // Load chat providers
    const chatProviders = await getAvailableChatModelProviders()
    const embeddingProviders = await getAvailableEmbeddingModelProviders()
    
    // Get cache status
    const cacheStatus = getCacheStatus()
    
    // Count available models
    const chatModelCount = Object.values(chatProviders).reduce((sum, provider) => sum + Object.keys(provider).length, 0)
    const embeddingModelCount = Object.values(embeddingProviders).reduce((sum, provider) => sum + Object.keys(provider).length, 0)
    
    const result = {
      status: 'success',
      timestamp: new Date().toISOString(),
      configuration: {
        valid: configValidation.valid,
        warnings: configValidation.warnings,
      },
      providers: {
        chat: {
          providersLoaded: Object.keys(chatProviders).length,
          totalModels: chatModelCount,
          providers: Object.fromEntries(
            Object.entries(chatProviders).map(([name, models]) => [
              name, 
              { 
                modelCount: Object.keys(models).length,
                models: Object.keys(models)
              }
            ])
          )
        },
        embedding: {
          providersLoaded: Object.keys(embeddingProviders).length,
          totalModels: embeddingModelCount,
          providers: Object.fromEntries(
            Object.entries(embeddingProviders).map(([name, models]) => [
              name,
              {
                modelCount: Object.keys(models).length,
                models: Object.keys(models)
              }
            ])
          )
        }
      },
      cache: cacheStatus,
      summary: {
        totalChatProviders: Object.keys(chatProviders).length,
        totalChatModels: chatModelCount,
        totalEmbeddingProviders: Object.keys(embeddingProviders).length,
        totalEmbeddingModels: embeddingModelCount,
        configurationValid: configValidation.valid,
        cacheActive: Object.keys(cacheStatus).length > 0
      }
    }
    
    console.log('✅ Providers test completed:', {
      chatProviders: Object.keys(chatProviders).length,
      chatModels: chatModelCount,
      embeddingProviders: Object.keys(embeddingProviders).length,
      embeddingModels: embeddingModelCount
    })
    
    return result
    
  } catch (error) {
    console.error('❌ Providers test failed:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to test providers',
      data: {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    })
  }
}) 