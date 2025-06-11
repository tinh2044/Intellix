import { db } from './utils/db/index.js';
import { chats, messages } from './utils/db/schema.js';

console.log('🔍 Testing database connection...');

try {
  // Test basic connection
  const chatResult = db.select().from(chats).all();
  const messageResult = db.select().from(messages).all();
  
  console.log('✅ Database connection successful!');
  console.log(`📊 Found ${chatResult.length} chats and ${messageResult.length} messages`);
  
  if (chatResult.length > 0) {
    console.log('📝 Sample chat:', chatResult[0]);
  }
  
  if (messageResult.length > 0) {
    console.log('💬 Sample message:', messageResult[0]);
  }
  
} catch (error) {
  console.error('❌ Database error:', error.message);
  console.error('Stack:', error.stack);
} 