import { db, chats } from '~/utils/db/index'

export default defineEventHandler(async (event) => {
  try {
    // Test database connection
    const result = await db.select().from(chats).limit(1)
    
    return {
      status: 'success',
      message: 'Database connection working',
      data: result
    }
  } catch (error) {
    return {
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}) 