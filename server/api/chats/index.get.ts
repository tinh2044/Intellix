export default defineEventHandler(async (event) => {
  try {
    // Import database utilities
    const { db } = await import('~/utils/db')
    
    // Get all chats and reverse order (newest first)
    let chats = await db.query.chats.findMany()
    chats = chats.reverse()
    
    return { chats }
  } catch (error) {
    console.error('Error in getting chats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'An error has occurred.'
    })
  }
}) 