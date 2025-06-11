import { db, chats, messages } from './index';
import { eq, desc, and } from 'drizzle-orm';

// Chat operations
export const createChat = async (chatData: {
  id: string;
  title: string;
  focusMode: string;
  files?: any[];
}) => {
  try {
    const result = await db.insert(chats).values({
      ...chatData,
      createdAt: new Date().toISOString(),
      files: chatData.files || []
    }).returning();
    
    return result[0];
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const getChatById = async (chatId: string) => {
  try {
    const result = await db
      .select()
      .from(chats)
      .where(eq(chats.id, chatId))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
};

export const getAllChats = async () => {
  try {
    const result = await db
      .select()
      .from(chats)
      .orderBy(desc(chats.createdAt));
    
    return result;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};

export const updateChat = async (chatId: string, updates: Partial<{
  title: string;
  focusMode: string;
  files: any[];
}>) => {
  try {
    const result = await db
      .update(chats)
      .set(updates)
      .where(eq(chats.id, chatId))
      .returning();
    
    return result[0];
  } catch (error) {
    console.error('Error updating chat:', error);
    throw error;
  }
};

export const deleteChat = async (chatId: string) => {
  try {
    // Delete messages first (foreign key relationship)
    await db.delete(messages).where(eq(messages.chatId, chatId));
    
    // Delete chat
    const result = await db.delete(chats).where(eq(chats.id, chatId)).returning();
    
    return result[0];
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
};

// Message operations
export const createMessage = async (messageData: {
  content: string;
  chatId: string;
  messageId: string;
  role: 'assistant' | 'user';
  metadata?: any;
}) => {
  try {
    const result = await db.insert(messages).values(messageData).returning();
    
    return result[0];
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

export const getMessagesByChatId = async (chatId: string) => {
  try {
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.id);
    
    return result;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const deleteMessagesByChatId = async (chatId: string) => {
  try {
    const result = await db
      .delete(messages)
      .where(eq(messages.chatId, chatId))
      .returning();
    
    return result;
  } catch (error) {
    console.error('Error deleting messages:', error);
    throw error;
  }
};

export const deleteMessage = async (messageId: string) => {
  try {
    const result = await db
      .delete(messages)
      .where(eq(messages.messageId, messageId))
      .returning();
    
    return result[0];
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

// Analytics operations
export const getChatCount = async () => {
  try {
    const result = await db.select().from(chats);
    return result.length;
  } catch (error) {
    console.error('Error getting chat count:', error);
    throw error;
  }
};

export const getMessageCount = async () => {
  try {
    const result = await db.select().from(messages);
    return result.length;
  } catch (error) {
    console.error('Error getting message count:', error);
    throw error;
  }
}; 