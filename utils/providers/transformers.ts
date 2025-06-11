import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers'
import type { EmbeddingModel } from './index'

export const PROVIDER_INFO = {
  key: 'transformers',
  displayName: 'HuggingFace Transformers',
  description: 'Local HuggingFace Transformers embedding models',
  website: 'https://huggingface.co'
}

export const loadTransformersEmbeddingModels = async (): Promise<Record<string, EmbeddingModel>> => {
  try {
    return {
      'all-MiniLM-L6-v2': {
        displayName: 'All MiniLM L6 v2',
        model: new HuggingFaceTransformersEmbeddings({
          modelName: 'Xenova/all-MiniLM-L6-v2',
        }),
      },
      'all-mpnet-base-v2': {
        displayName: 'All MPNet Base v2',
        model: new HuggingFaceTransformersEmbeddings({
          modelName: 'Xenova/all-mpnet-base-v2',
        }),
      },
      'bge-small-en-v1.5': {
        displayName: 'BGE Small EN v1.5',
        model: new HuggingFaceTransformersEmbeddings({
          modelName: 'Xenova/bge-small-en-v1.5',
        }),
      },
      'gte-small': {
        displayName: 'GTE Small',
        model: new HuggingFaceTransformersEmbeddings({
          modelName: 'Xenova/gte-small',
        }),
      },
    }
  } catch (error) {
    console.error('Error loading Transformers embedding models:', error instanceof Error ? error.message : String(error))
    return {}
  }
}
