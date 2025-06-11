import { getChatCount, getMessageCount } from ''

export default defineEventHandler(async (event) => {
  try {
    const [chatCount, messageCount] = await Promise.all([
      getChatCount(),
      getMessageCount()
    ])
    
    return {
      status: 'success',
      data: {
        chats: chatCount,
        messages: messageCount,
        database: 'SQLite',
        orm: 'Drizzle',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch database statistics',
      data: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}) 