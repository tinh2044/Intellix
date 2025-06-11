// import { getMessagesByChatId } from '~/utils/db/operations'

export default defineEventHandler(async (event) => {
  try {
    const chatId = getRouterParam(event, 'id')
    
    if (!chatId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Chat ID is required'
      })
    }
    
    const messages = await getMessagesByChatId(chatId)
    
    return {
      status: 'success',
      data: messages,
      count: messages.length,
      chatId
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch messages',
      data: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}) 