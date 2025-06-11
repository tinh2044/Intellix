// Importing the Embeddings and BaseChatModel from LangChain
import { Embeddings } from '@langchain/core/embeddings';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import {
  loadOpenAIChatModels,
  loadOpenAIEmbeddingModels,
  PROVIDER_INFO as OpenAIInfo,
  PROVIDER_INFO,
} from './openai';
import {
  getCustomOpenaiApiKey,
  getCustomOpenaiApiUrl,
  getCustomOpenaiModelName,
} from '~/server/utils/config';
import { ChatOpenAI } from '@langchain/openai';
import {
  loadOllamaChatModels,
  loadOllamaEmbeddingModels,
  PROVIDER_INFO as OllamaInfo,
} from './ollama';
import { loadGroqChatModels, PROVIDER_INFO as GroqInfo } from './groq';
import {
  loadAnthropicChatModels,
  PROVIDER_INFO as AnthropicInfo,
} from './anthropic';
import {
  loadGeminiChatModels,
  loadGeminiEmbeddingModels,
  PROVIDER_INFO as GeminiInfo,
} from './gemini';
import {
  loadTransformersEmbeddingsModels,
  PROVIDER_INFO as TransformersInfo,
} from './transformers';
import {
  loadDeepseekChatModels,
  PROVIDER_INFO as DeepseekInfo,
} from './deepseek';
import {
  loadLMStudioChatModels,
  loadLMStudioEmbeddingsModels,
  PROVIDER_INFO as LMStudioInfo,
} from './lmstudio';

export const PROVIDER_METADATA = {
  openai: OpenAIInfo,
  ollama: OllamaInfo,
  groq: GroqInfo,
  anthropic: AnthropicInfo,
  gemini: GeminiInfo,
  transformers: TransformersInfo,
  deepseek: DeepseekInfo,
  lmstudio: LMStudioInfo,
  custom_openai: {
    key: 'custom_openai',
    displayName: 'Custom OpenAI',
  },
};

// Provider interfaces
export interface ChatModel {
  displayName: string;
  model: BaseChatModel;
}

export interface EmbeddingModel {
  displayName: string;
  model: Embeddings;
}

// Provider registry
export const chatModelProviders: Record<
  string,
  () => Promise<Record<string, ChatModel>>
> = {
  openai: () => import('./openai').then(m => m.loadOpenAIChatModels()),
  anthropic: () => import('./anthropic').then(m => m.loadAnthropicChatModels()),
  groq: () => import('./groq').then(m => m.loadGroqChatModels()),
  gemini: () => import('./gemini').then(m => m.loadGeminiChatModels()),
  deepseek: () => import('./deepseek').then(m => m.loadDeepseekChatModels()),
  ollama: () => import('./ollama').then(m => m.loadOllamaChatModels()),
  lmstudio: () => import('./lmstudio').then(m => m.loadLMStudioChatModels()),
};

export const embeddingModelProviders: Record<
  string,
  () => Promise<Record<string, EmbeddingModel>>
> = {
  openai: () => import('./openai').then(m => m.loadOpenAIEmbeddingModels()),
  gemini: () => import('./gemini').then(m => m.loadGeminiEmbeddingModels()),
  ollama: () => import('./ollama').then(m => m.loadOllamaEmbeddingModels()),
  lmstudio: () => import('./lmstudio').then(m => m.loadLMStudioEmbeddingModels()),
  transformers: () => import('./transformers').then(m => m.loadTransformersEmbeddingModels()),
};

// Provider cache
const providerCache = new Map<string, any>();
const cacheExpiry = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get available chat model providers
export const getAvailableChatModelProviders = async (): Promise<Record<string, Record<string, ChatModel>>> => {
  const cacheKey = 'chat_providers';
  
  // Check cache
  if (providerCache.has(cacheKey) && cacheExpiry.get(cacheKey)! > Date.now()) {
    return providerCache.get(cacheKey);
  }

  const models: Record<string, Record<string, ChatModel>> = {};

  // Load each provider
  await Promise.allSettled(
    Object.entries(chatModelProviders).map(async ([providerName, loader]) => {
      try {
        const providerModels = await loader();
        if (Object.keys(providerModels).length > 0) {
          models[providerName] = providerModels;
        }
      } catch (error) {
        console.warn(`Failed to load chat models for provider ${providerName}:`, error instanceof Error ? error.message : String(error));
      }
    })
  );

  // Handle custom OpenAI
  try {
    const customOpenAiModels = await loadCustomOpenAiChatModels();
    if (Object.keys(customOpenAiModels).length > 0) {
      models['custom_openai'] = customOpenAiModels;
    }
  } catch (error) {
    console.warn('Failed to load custom OpenAI models:', error instanceof Error ? error.message : String(error));
  }

  // Cache results
  providerCache.set(cacheKey, models);
  cacheExpiry.set(cacheKey, Date.now() + CACHE_DURATION);

  return models;
};

// Get available embedding model providers
export const getAvailableEmbeddingModelProviders = async (): Promise<Record<string, Record<string, EmbeddingModel>>> => {
  const cacheKey = 'embedding_providers';
  
  // Check cache
  if (providerCache.has(cacheKey) && cacheExpiry.get(cacheKey)! > Date.now()) {
    return providerCache.get(cacheKey);
  }

  const models: Record<string, Record<string, EmbeddingModel>> = {};

  // Load each provider
  await Promise.allSettled(
    Object.entries(embeddingModelProviders).map(async ([providerName, loader]) => {
      try {
        const providerModels = await loader();
        if (Object.keys(providerModels).length > 0) {
          models[providerName] = providerModels;
        }
      } catch (error) {
        console.warn(`Failed to load embedding models for provider ${providerName}:`, error instanceof Error ? error.message : String(error));
      }
    })
  );

  // Cache results
  providerCache.set(cacheKey, models);
  cacheExpiry.set(cacheKey, Date.now() + CACHE_DURATION);

  return models;
};

// Custom OpenAI implementation
async function loadCustomOpenAiChatModels(): Promise<Record<string, ChatModel>> {
  const { getCustomOpenaiApiKey, getCustomOpenaiApiEndpoint, getCustomOpenaiModelName } = await import('~/server/utils/config');
  
  const apiKey = getCustomOpenaiApiKey();
  const apiUrl = getCustomOpenaiApiEndpoint();
  const modelName = getCustomOpenaiModelName();

  if (!apiKey || !apiUrl || !modelName) {
    return {};
  }

  try {
    const { ChatOpenAI } = await import('@langchain/openai');
    
    const model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: modelName,
      temperature: 0.7,
      configuration: {
        baseURL: apiUrl,
      },
    });

    // Test connection with a simple message
    await model.invoke('test');

    return {
      [modelName]: {
        displayName: `Custom: ${modelName}`,
        model: model as BaseChatModel,
      }
    };
  } catch (error) {
    console.warn('Custom OpenAI model validation failed:', error instanceof Error ? error.message : String(error));
    return {};
  }
}

// Cache management
export const clearCache = async (): Promise<void> => {
  providerCache.clear();
  cacheExpiry.clear();
  console.log('Provider cache cleared');
};

export const getCacheStatus = (): Record<string, any> => {
  const status: Record<string, any> = {};
  
  for (const [key, expiry] of cacheExpiry.entries()) {
    status[key] = {
      cached: providerCache.has(key),
      expires: new Date(expiry).toISOString(),
      expired: expiry <= Date.now()
    };
  }
  
  return status;
};
