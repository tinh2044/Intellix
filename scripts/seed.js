import { createChat, createMessage } from '../utils/db/operations.js';

const seedData = async () => {
  try {
    console.log('🌱 Seeding database...');
    
    // Create sample chat
    const sampleChat = await createChat({
      id: 'sample-chat-1',
      title: 'Welcome to Intellix',
      focusMode: 'webSearch',
      files: []
    });
    
    console.log('✅ Created sample chat:', sampleChat.title);
    
    // Create sample messages
    const messages = [
      {
        content: 'Hello! How can I help you today?',
        chatId: 'sample-chat-1',
        messageId: 'msg-1',
        role: 'assistant',
        metadata: { 
          timestamp: new Date().toISOString(),
          provider: 'openai',
          model: 'gpt-4'
        }
      },
      {
        content: 'I want to learn about AI and how it works',
        chatId: 'sample-chat-1',
        messageId: 'msg-2',
        role: 'user',
        metadata: { 
          timestamp: new Date().toISOString() 
        }
      },
      {
        content: 'AI (Artificial Intelligence) is a fascinating field that involves creating computer systems capable of performing tasks that typically require human intelligence. Here are the key areas:\n\n1. **Machine Learning**: Algorithms that learn from data\n2. **Neural Networks**: Systems inspired by the human brain\n3. **Natural Language Processing**: Understanding and generating human language\n4. **Computer Vision**: Analyzing and understanding images\n\nWould you like me to explain any specific aspect in more detail?',
        chatId: 'sample-chat-1',
        messageId: 'msg-3',
        role: 'assistant',
        metadata: { 
          timestamp: new Date().toISOString(),
          provider: 'openai',
          model: 'gpt-4',
          searchResults: [
            {
              title: 'Introduction to AI',
              url: 'https://example.com/ai-intro',
              snippet: 'Comprehensive guide to artificial intelligence'
            }
          ]
        }
      }
    ];
    
    for (const messageData of messages) {
      await createMessage(messageData);
      console.log(`✅ Created message: ${messageData.messageId}`);
    }
    
    // Create another chat for demo
    const demoChat = await createChat({
      id: 'demo-chat-1',
      title: 'Search Demo',
      focusMode: 'academicSearch',
      files: []
    });
    
    console.log('✅ Created demo chat:', demoChat.title);
    
    await createMessage({
      content: 'What are the latest developments in quantum computing?',
      chatId: 'demo-chat-1',
      messageId: 'demo-msg-1',
      role: 'user',
      metadata: { timestamp: new Date().toISOString() }
    });
    
    console.log('✅ Created demo message');
    
    console.log('🎉 Database seeded successfully!');
    console.log('📊 Summary:');
    console.log('   - 2 sample chats created');
    console.log('   - 4 sample messages created');
    console.log('   - Different focus modes demonstrated');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
seedData().catch(console.error); 