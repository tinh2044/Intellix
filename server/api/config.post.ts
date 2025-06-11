export default defineEventHandler(async (event) => {
  try {
    // Validate method
    assertMethod(event, 'POST')
    
    // Read request body
    const configUpdate = await readBody(event)
    
    // Import config utilities
    const { updateConfig } = await import('~/server/utils/config')

    // Transform the incoming config to match our internal structure
    const updatedConfig = {
      OPENAI_API_KEY: configUpdate.openaiApiKey,
      GROQ_API_KEY: configUpdate.groqApiKey,
      ANTHROPIC_API_KEY: configUpdate.anthropicApiKey,
      GEMINI_API_KEY: configUpdate.geminiApiKey,
      OLLAMA_API_URL: configUpdate.ollamaApiUrl,
      DEEPSEEK_API_KEY: configUpdate.deepseekApiKey,
      LM_STUDIO_API_URL: configUpdate.lmStudioApiUrl,
      CUSTOM_OPENAI_API_URL: configUpdate.customOpenaiApiUrl,
      CUSTOM_OPENAI_API_KEY: configUpdate.customOpenaiApiKey,
      CUSTOM_OPENAI_MODEL_NAME: configUpdate.customOpenaiModelName,
    }

    // Filter out undefined values
    const filteredConfig: Record<string, string> = {}
    Object.entries(updatedConfig).forEach(([key, value]) => {
      if (value !== undefined) {
        filteredConfig[key] = value
      }
    })

    // Update configuration
    updateConfig(filteredConfig)

    return { message: 'Config updated' }
    
  } catch (error) {
    console.error('An error occurred while updating config:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while updating config'
    })
  }
}) 