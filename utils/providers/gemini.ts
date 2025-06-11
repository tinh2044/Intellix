import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai';
import type { ChatModel, EmbeddingModel } from './index';

export const PROVIDER_INFO = {
  key: 'gemini',
  displayName: 'Google Gemini',
  description: 'Google Gemini models',
  website: 'https://ai.google.dev'
};

const geminiChatModels: Record<string, string>[] = [
  {
    displayName: 'Gemini 2.5 Pro Experimental',
    key: 'gemini-2.5-pro-exp-03-25',
  },
  {
    displayName: 'Gemini 2.0 Flash',
    key: 'gemini-2.0-flash',
  },
  {
    displayName: 'Gemini 2.0 Flash-Lite',
    key: 'gemini-2.0-flash-lite',
  },
  {
    displayName: 'Gemini 2.0 Flash Thinking Experimental',
    key: 'gemini-2.0-flash-thinking-exp-01-21',
  },
  {
    displayName: 'Gemini 1.5 Flash',
    key: 'gemini-1.5-flash',
  },
  {
    displayName: 'Gemini 1.5 Flash-8B',
    key: 'gemini-1.5-flash-8b',
  },
  {
    displayName: 'Gemini 1.5 Pro',
    key: 'gemini-1.5-pro',
  },
];

const geminiEmbeddingModels: Record<string, string>[] = [
  {
    displayName: 'Text Embedding 004',
    key: 'models/text-embedding-004',
  },
  {
    displayName: 'Embedding 001',
    key: 'models/embedding-001',
  },
];

export const loadGeminiChatModels = async (): Promise<Record<string, ChatModel>> => {
  const { getGeminiApiKey } = await import('~/server/utils/config');
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn('Gemini API key not found');
    return {};
  }

  try {
    // Test API key validity
    const testModel = new ChatGoogleGenerativeAI({
      apiKey: apiKey,
      model: 'gemini-1.5-flash',
      temperature: 0,
      maxOutputTokens: 1,
    });

    await testModel.invoke('test');

    return {
      'gemini-1.5-flash': {
        displayName: 'Gemini 1.5 Flash',
        model: new ChatGoogleGenerativeAI({
          apiKey: apiKey,
          model: 'gemini-1.5-flash',
          temperature: 0.7,
        }),
      },
      'gemini-1.5-pro': {
        displayName: 'Gemini 1.5 Pro',
        model: new ChatGoogleGenerativeAI({
          apiKey: apiKey,
          model: 'gemini-1.5-pro',
          temperature: 0.7,
        }),
      },
      'gemini-pro': {
        displayName: 'Gemini Pro',
        model: new ChatGoogleGenerativeAI({
          apiKey: apiKey,
          model: 'gemini-pro',
          temperature: 0.7,
        }),
      },
    };
  } catch (error) {
    console.error('Error loading Gemini chat models:', error instanceof Error ? error.message : String(error));
    return {};
  }
};

export const loadGeminiEmbeddingModels = async (): Promise<Record<string, EmbeddingModel>> => {
  const { getGeminiApiKey } = await import('~/server/utils/config');
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return {};
  }

  try {
    return {
      'text-embedding-004': {
        displayName: 'Text Embedding 004',
        model: new GoogleGenerativeAIEmbeddings({
          apiKey: apiKey,
          modelName: 'text-embedding-004',
        }),
      },
    };
  } catch (error) {
    console.error('Error loading Gemini embedding models:', error instanceof Error ? error.message : String(error));
    return {};
  }
};
