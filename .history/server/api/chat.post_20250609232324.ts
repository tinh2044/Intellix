import { EventEmitter } from 'stream'
import crypto from 'crypto'
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { ChatOpenAI } from '@langchain/openai'

type Message = {
  messageId: string
  chatId: string
  content: string
}

type ChatModel = {
  provider: string
  name: string
}

type EmbeddingModel = {
  provider: string
  name: string
}

type Body = {
  message: Message
  optimizationMode: 'speed' | 'balanced' | 'quality'
  focusMode: string
  history: Array<[string, string]>
  files: Array<string>
  chatModel: ChatModel
  embeddingModel: EmbeddingModel
  systemInstructions: string
}

const handleEmitterEvents = async (
  stream: EventEmitter,
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder,
  aiMessageId: string,
  chatId: string,
) => {
  let receivedMessage = ''
  let sources: any[] = []

  // Import database utilities
  const { db } = await import('~/utils/db/index')
  const { messages: messagesSchema } = await import('~/utils/db/schema')

  stream.on('data', (data) => {
    const parsedData = JSON.parse(data)
    if (parsedData.type === 'response') {
      writer.write(
        encoder.encode(
          JSON.stringify({
            type: 'message',
            data: parsedData.data,
            messageId: aiMessageId,
          }) + '\n',
        ),
      )

      receivedMessage += parsedData.data
    } else if (parsedData.type === 'sources') {
      writer.write(
        encoder.encode(
          JSON.stringify({
            type: 'sources',
            data: parsedData.data,
            messageId: aiMessageId,
          }) + '\n',
        ),
      )

      sources = parsedData.data
    }
  })

  stream.on('end', () => {
    writer.write(
      encoder.encode(
        JSON.stringify({
          type: 'messageEnd',
          messageId: aiMessageId,
        }) + '\n',
      ),
    )
    writer.close()

    // Save AI response to database
    db.insert(messagesSchema)
      .values({
        content: receivedMessage,
        chatId: chatId,
        messageId: aiMessageId,
        role: 'assistant',
        metadata: JSON.stringify({
          createdAt: new Date(),
          ...(sources && sources.length > 0 && { sources }),
        }),
      })
      .execute()
  })

  stream.on('error', (data) => {
    const parsedData = JSON.parse(data)
    writer.write(
      encoder.encode(
        JSON.stringify({
          type: 'error',
          data: parsedData.data,
        }),
      ),
    )
    writer.close()
  })
}

const handleHistorySave = async (
  message: Message,
  humanMessageId: string,
  focusMode: string,
  files: string[],
) => {
  // Import database utilities
  const { db } = await import('~/utils/db/index')
  const { chats, messages: messagesSchema } = await import('~/utils/db/schema')
  const { eq, and, gt } = await import('drizzle-orm')
  const { getFileDetails } = await import('~/utils/utils/files')

  const chat = await db.query.chats.findFirst({
    where: eq(chats.id, message.chatId),
  })

  if (!chat) {
    await db
      .insert(chats)
      .values({
        id: message.chatId,
        title: message.content,
        createdAt: new Date().toString(),
        focusMode: focusMode,
        files: files.map(getFileDetails),
      })
      .execute()
  }

  const messageExists = await db.query.messages.findFirst({
    where: eq(messagesSchema.messageId, humanMessageId),
  })

  if (!messageExists) {
    await db
      .insert(messagesSchema)
      .values({
        content: message.content,
        chatId: message.chatId,
        messageId: humanMessageId,
        role: 'user',
        metadata: JSON.stringify({
          createdAt: new Date(),
        }),
      })
      .execute()
  } else {
    await db
      .delete(messagesSchema)
      .where(
        and(
          gt(messagesSchema.id, messageExists.id),
          eq(messagesSchema.chatId, message.chatId),
        ),
      )
      .execute()
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Validate method
    assertMethod(event, 'POST')
    
    // Read request body
    const body = await readBody(event) as Body
    const { message } = body

    if (message.content === '') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Please provide a message to process'
      })
    }

    // Import utilities
    const { getAvailableChatModelProviders, getAvailableEmbeddingModelProviders } = 
      await import('~/utils/providers/index')
    const config = await import('~/server/utils/config')
    const { searchHandlers } = await import('~/utils/search')

    // Get available providers
    const [chatModelProviders, embeddingModelProviders] = await Promise.all([
      getAvailableChatModelProviders(),
      getAvailableEmbeddingModelProviders(),
    ])

    // Get selected models
    const chatModelProvider =
      chatModelProviders[
        body.chatModel?.provider || Object.keys(chatModelProviders)[0]
      ]
    const chatModel =
      chatModelProvider[
        body.chatModel?.name || Object.keys(chatModelProvider)[0]
      ]

    const embeddingProvider =
      embeddingModelProviders[
        body.embeddingModel?.provider || Object.keys(embeddingModelProviders)[0]
      ]
    const embeddingModel =
      embeddingProvider[
        body.embeddingModel?.name || Object.keys(embeddingProvider)[0]
      ]

    let llm: BaseChatModel | undefined
    let embedding = embeddingModel.model

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

    if (!embedding) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid embedding model'
      })
    }

    // Generate message IDs
    const humanMessageId =
      message.messageId ?? crypto.randomBytes(7).toString('hex')
    const aiMessageId = crypto.randomBytes(7).toString('hex')

    // Convert history to LangChain messages
    const history: BaseMessage[] = body.history.map((msg) => {
      if (msg[0] === 'human') {
        return new HumanMessage({
          content: msg[1],
        })
      } else {
        return new AIMessage({
          content: msg[1],
        })
      }
    })

    // Get search handler
    const handler = searchHandlers[body.focusMode]

    if (!handler) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid focus mode'
      })
    }

    // Start search and answer process
    const stream = await handler.searchAndAnswer(
      message.content,
      history,
      llm,
      embedding,
      body.optimizationMode,
      body.files,
      body.systemInstructions,
    )

    // Create streaming response
    const responseStream = new TransformStream()
    const writer = responseStream.writable.getWriter()
    const encoder = new TextEncoder()

    // Handle events and save history
    handleEmitterEvents(stream, writer, encoder, aiMessageId, message.chatId)
    handleHistorySave(message, humanMessageId, body.focusMode, body.files)

    // Return streaming response
    return new Response(responseStream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache, no-transform',
      },
    })
    
  } catch (error) {
    console.error('An error occurred while processing chat request:', error)
    
    // Re-throw createError instances
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while processing chat request'
    })
  }
}) 