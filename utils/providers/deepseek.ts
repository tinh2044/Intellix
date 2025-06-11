import { ChatOpenAI } from '@langchain/openai';
import type { ChatModel } from './index';

export const PROVIDER_INFO = {
  key: 'deepseek',
  displayName: 'DeepSeek',
  description: 'DeepSeek Coder models',
  website: 'https://deepseek.com'
};

export const loadDeepseekChatModels = async (): Promise<Record<string, ChatModel>> => {
  const { getDeepseekApiKey } = await import('~/server/utils/config');
  const apiKey = getDeepseekApiKey();

  if (!apiKey) {
    console.warn('DeepSeek API key not found');
    return {};
  }

  try {
    // Test API key validity
    const testModel = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'deepseek-coder',
      temperature: 0,
      maxTokens: 1,
      configuration: {
        baseURL: 'https://api.deepseek.com',
      },
    });

    await testModel.invoke('test');

    return {
      'deepseek-coder': {
        displayName: 'DeepSeek Coder',
        model: new ChatOpenAI({
          openAIApiKey: apiKey,
          modelName: 'deepseek-coder',
          temperature: 0.7,
          configuration: {
            baseURL: 'https://api.deepseek.com',
          },
        }),
      },
      'deepseek-chat': {
        displayName: 'DeepSeek Chat',
        model: new ChatOpenAI({
          openAIApiKey: apiKey,
          modelName: 'deepseek-chat',
          temperature: 0.7,
          configuration: {
            baseURL: 'https://api.deepseek.com',
          },
        }),
      },
    };
  } catch (error) {
    console.error('Error loading DeepSeek chat models:', error instanceof Error ? error.message : String(error));
    return {};
  }
};
