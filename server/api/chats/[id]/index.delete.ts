export default defineEventHandler(async (event) => {
  try {
    // Validate method
    assertMethod(event, 'DELETE')
    
    // Get chat ID from route params
    const chatId = getRouterParam(event, 'id')
    
    if (!chatId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Chat ID is required'
      })
    }

    // Import database utilities
    const { db } = await import('~/utils/db')
    const { chats, messages } = await import('~/utils/db/schema')
    const { eq } = await import('drizzle-orm')

    // Check if chat exists
    const chatExists = await db.query.chats.findFirst({
      where: eq(chats.id, chatId),
    })

    if (!chatExists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Chat not found'
      })
    }

    // Delete chat and its messages
    await db.delete(chats).where(eq(chats.id, chatId)).execute()
    await db.delete(messages).where(eq(messages.chatId, chatId)).execute()

    return {
      message: 'Chat deleted successfully'
    }
    
  } catch (error) {
    console.error('Error in deleting chat by id:', error)
    
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