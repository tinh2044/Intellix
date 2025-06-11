import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages'
import { ChatOpenAI } from '@langchain/openai'

interface ChatModel {
  provider: string
  model: string
}

interface ImageSearchBody {
  query: string
  chatHistory: any[]
  chatModel?: ChatModel
}

export default defineEventHandler(async (event) => {
  try {
    // Validate method
    assertMethod(event, 'POST')
    
    // Read request body
    const body = await readBody(event) as ImageSearchBody

    // Convert chat history to LangChain messages
    const chatHistory = body.chatHistory
      .map((msg: any) => {
        if (msg.role === 'user') {
          return new HumanMessage(msg.content)
        } else if (msg.role === 'assistant') {
          return new AIMessage(msg.content)
        }
        return undefined
      })
      .filter((msg) => msg !== undefined) as BaseMessage[]

    // Import utilities
    const { getAvailableChatModelProviders } = await import('~/utils/providers')
    const config = await import('~/server/utils/config')
    const handleImageSearch = await import('~/utils/chains/imageSearchAgent')

    // Get chat model providers
    const chatModelProviders = await getAvailableChatModelProviders()

    // Select chat model
    const chatModelProvider =
      chatModelProviders[
        body.chatModel?.provider || Object.keys(chatModelProviders)[0]
      ]
    const chatModel =
      chatModelProvider[
        body.chatModel?.model || Object.keys(chatModelProvider)[0]
      ]

    let llm: BaseChatModel | undefined

    // Handle custom OpenAI provider
    if (body.chatModel?.provider === 'custom_openai') {
      llm = new ChatOpenAI({
        openAIApiKey: config.getCustomOpenaiApiKey(),
        modelName: config.getCustomOpenaiModelName(),
        temperature: 0.7,
        configuration: {
          baseURL: config.getCustomOpenaiApiEndpoint(),
        },
      }) as unknown as BaseChatModel
    } else if (chatModelProvider && chatModel) {
      llm = chatModel.model
    }

    if (!llm) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid chat model'
      })
    }

    // Perform image search
    const images = await handleImageSearch.default(
      {
        chat_history: chatHistory,
        query: body.query,
      },
      llm,
    )

    return { images }
    
  } catch (error) {
    console.error('An error occurred while searching images:', error)
    
    // Re-throw createError instances
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while searching images'
    })
  }
}) 