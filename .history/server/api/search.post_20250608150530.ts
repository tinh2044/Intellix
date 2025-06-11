import type { BaseChatModel } from '@langchain/core/language_models/chat_models'
import type { Embeddings } from '@langchain/core/embeddings'
import { ChatOpenAI } from '@langchain/openai'
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages'
import type { MetaSearchAgentType } from '~/utils/search/metaSearchAgent'

interface ChatModel {
  provider: string
  name: string
  customOpenAIKey?: string
  customOpenAIBaseURL?: string
}

interface EmbeddingModel {
  provider: string
  name: string
}

interface ChatRequestBody {
  optimizationMode: 'speed' | 'balanced'
  focusMode: string
  chatModel?: ChatModel
  embeddingModel?: EmbeddingModel
  query: string
  history: Array<[string, string]>
  stream?: boolean
  systemInstructions?: string
}

export default defineEventHandler(async (event) => {
  try {
    // Validate method
    assertMethod(event, 'POST')
    
    // Read request body
    const body = await readBody(event) as ChatRequestBody

    if (!body.focusMode || !body.query) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing focus mode or query'
      })
    }

    // Set defaults
    body.history = body.history || []
    body.optimizationMode = body.optimizationMode || 'balanced'
    body.stream = body.stream || false

    // Convert history to LangChain messages
    const history: BaseMessage[] = body.history.map((msg) => {
      return msg[0] === 'human'
        ? new HumanMessage({ content: msg[1] })
        : new AIMessage({ content: msg[1] })
    })

    // Import utilities
    const { getAvailableChatModelProviders, getAvailableEmbeddingModelProviders } = 
      await import('~/utils/providers')
    const config = await import('~/server/utils/config')
    const { searchHandlers } = await import('~/utils/search')

    // Get available providers
    const [chatModelProviders, embeddingModelProviders] = await Promise.all([
      getAvailableChatModelProviders(),
      getAvailableEmbeddingModelProviders(),
    ])

    // Select models
    const chatModelProvider =
      body.chatModel?.provider || Object.keys(chatModelProviders)[0]
    const chatModel =
      body.chatModel?.name ||
      Object.keys(chatModelProviders[chatModelProvider])[0]

    const embeddingModelProvider =
      body.embeddingModel?.provider || Object.keys(embeddingModelProviders)[0]
    const embeddingModel =
      body.embeddingModel?.name ||
      Object.keys(embeddingModelProviders[embeddingModelProvider])[0]

    let llm: BaseChatModel | undefined
    let embeddings: Embeddings | undefined

    // Handle custom OpenAI provider
    if (body.chatModel?.provider === 'custom_openai') {
      llm = new ChatOpenAI({
        modelName: body.chatModel?.name || config.getCustomOpenaiModelName(),
        openAIApiKey:
          body.chatModel?.customOpenAIKey || config.getCustomOpenaiApiKey(),
        temperature: 0.7,
        configuration: {
          baseURL:
            body.chatModel?.customOpenAIBaseURL || config.getCustomOpenaiApiEndpoint(),
        },
      }) as unknown as BaseChatModel
    } else if (
      chatModelProviders[chatModelProvider] &&
      chatModelProviders[chatModelProvider][chatModel]
    ) {
      llm = chatModelProviders[chatModelProvider][chatModel]
        .model as unknown as BaseChatModel | undefined
    }

    if (
      embeddingModelProviders[embeddingModelProvider] &&
      embeddingModelProviders[embeddingModelProvider][embeddingModel]
    ) {
      embeddings = embeddingModelProviders[embeddingModelProvider][
        embeddingModel
      ].model as Embeddings | undefined
    }

    if (!llm || !embeddings) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid model selected'
      })
    }

    // Get search handler
    const searchHandler: MetaSearchAgentType = searchHandlers[body.focusMode]

    if (!searchHandler) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid focus mode'
      })
    }

    // Start search and answer process
    const emitter = await searchHandler.searchAndAnswer(
      body.query,
      history,
      llm,
      embeddings,
      body.optimizationMode,
      [],
      body.systemInstructions || '',
    )

    // Non-streaming response
    if (!body.stream) {
      return new Promise(
        (
          resolve: (value: any) => void,
          reject: (value: any) => void,
        ) => {
          let message = ''
          let sources: any[] = []

          emitter.on('data', (data: string) => {
            try {
              const parsedData = JSON.parse(data)
              if (parsedData.type === 'response') {
                message += parsedData.data
              } else if (parsedData.type === 'sources') {
                sources = parsedData.data
              }
            } catch (error) {
              reject(createError({
                statusCode: 500,
                statusMessage: 'Error parsing data'
              }))
            }
          })

          emitter.on('end', () => {
            resolve({ message, sources })
          })

          emitter.on('error', (error: any) => {
            reject(createError({
              statusCode: 500,
              statusMessage: 'Search error',
              data: error
            }))
          })
        },
      )
    }

    // Streaming response
    const encoder = new TextEncoder()
    const abortController = new AbortController()
    const { signal } = abortController

    const stream = new ReadableStream({
      start(controller) {
        let sources: any[] = []

        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: 'init',
              data: 'Stream connected',
            }) + '\n',
          ),
        )

        signal.addEventListener('abort', () => {
          emitter.removeAllListeners()

          try {
            controller.close()
          } catch (error) {}
        })

        emitter.on('data', (data: string) => {
          if (signal.aborted) return

          try {
            const parsedData = JSON.parse(data)

            if (parsedData.type === 'response') {
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: 'response',
                    data: parsedData.data,
                  }) + '\n',
                ),
              )
            } else if (parsedData.type === 'sources') {
              sources = parsedData.data
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: 'sources',
                    data: sources,
                  }) + '\n',
                ),
              )
            }
          } catch (error) {
            controller.error(error)
          }
        })

        emitter.on('end', () => {
          if (signal.aborted) return

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: 'done',
              }) + '\n',
            ),
          )
          controller.close()
        })

        emitter.on('error', (error: any) => {
          if (signal.aborted) return

          controller.error(error)
        })
      },
      cancel() {
        abortController.abort()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
    
  } catch (error) {
    console.error('Error in getting search results:', error)
    
    // Re-throw createError instances
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error has occurred.'
    })
  }
}) 