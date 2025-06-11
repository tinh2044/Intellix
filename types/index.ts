import type { Document } from '@langchain/core/documents'

export interface Message {
  messageId: string
  chatId: string
  createdAt: Date
  content: string
  role: 'user' | 'assistant'
  suggestions?: string[]
  sources?: Document[]
}

export interface FileType {
  fileName: string
  fileExtension: string
  fileId: string
}

export interface ChatModelProvider {
  name: string
  provider: string
}

export interface EmbeddingModelProvider {
  name: string
  provider: string
}

export interface ChatConfig {
  chatModelProvider: ChatModelProvider
  embeddingModelProvider: EmbeddingModelProvider
  isConfigReady: boolean
  hasError: boolean
}

export interface ChatState {
  chatId?: string
  messages: Message[]
  loading: boolean
  messageAppeared: boolean
  chatHistory: [string, string][]
  files: FileType[]
  fileIds: string[]
  focusMode: string
  optimizationMode: string
  isMessagesLoaded: boolean
  notFound: boolean
  isReady: boolean
  newChatCreated: boolean
} 