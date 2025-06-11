import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { parse } from 'toml'

interface Config {
  SIMILARITY_MEASURE: string;
  KEEP_ALIVE: string;
  OPENAI_API_KEY: string;
  GROQ_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  GEMINI_API_KEY: string;
  DEEPSEEK_API_KEY: string;
  OLLAMA_API_URL: string;
  LM_STUDIO_API_URL: string;
  CUSTOM_OPENAI_API_KEY: string;
  CUSTOM_OPENAI_API_URL: string;
  CUSTOM_OPENAI_MODEL_NAME: string;
  SEARXNG_API_URL: string;
  SEARXNG_API_KEY: string;
}

let configCache: Config | null = null
let configCacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Load configuration from file or environment
const loadConfig = (): Config => {
  const now = Date.now()
  
  // Return cached config if still valid
  if (configCache && (now - configCacheTime) < CACHE_DURATION) {
    return configCache
  }

  const configPath = join(process.cwd(), 'config.toml')
  let config: Partial<Config> = {}

  // Load from TOML file if exists
  if (existsSync(configPath)) {
    try {
      const tomlContent = readFileSync(configPath, 'utf-8')
      config = parse(tomlContent) as Partial<Config>
    } catch (error) {
      console.warn('Failed to parse config.toml:', error instanceof Error ? error.message : String(error))
    }
  }

  // Environment variables take precedence
  const finalConfig: Config = {
    SIMILARITY_MEASURE: process.env.SIMILARITY_MEASURE || config.SIMILARITY_MEASURE || 'cosine',
    KEEP_ALIVE: process.env.KEEP_ALIVE || config.KEEP_ALIVE || '5m',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || config.OPENAI_API_KEY || '',
    GROQ_API_KEY: process.env.GROQ_API_KEY || config.GROQ_API_KEY || '',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || config.ANTHROPIC_API_KEY || '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || config.GEMINI_API_KEY || '',
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || config.DEEPSEEK_API_KEY || '',
    OLLAMA_API_URL: process.env.OLLAMA_API_URL || config.OLLAMA_API_URL || 'http://localhost:11434',
    LM_STUDIO_API_URL: process.env.LM_STUDIO_API_URL || config.LM_STUDIO_API_URL || 'http://localhost:1234',
    CUSTOM_OPENAI_API_KEY: process.env.CUSTOM_OPENAI_API_KEY || config.CUSTOM_OPENAI_API_KEY || '',
    CUSTOM_OPENAI_API_URL: process.env.CUSTOM_OPENAI_API_URL || config.CUSTOM_OPENAI_API_URL || '',
    CUSTOM_OPENAI_MODEL_NAME: process.env.CUSTOM_OPENAI_MODEL_NAME || config.CUSTOM_OPENAI_MODEL_NAME || '',
    SEARXNG_API_URL: process.env.SEARXNG_API_URL || config.SEARXNG_API_URL || 'http://localhost:4000',
    SEARXNG_API_KEY: process.env.SEARXNG_API_KEY || config.SEARXNG_API_KEY || '',
  }

  // Cache the config
  configCache = finalConfig
  configCacheTime = now

  return finalConfig
}

// Configuration getters (compatible with Next.js version)
export const getOpenaiApiKey = () => loadConfig().OPENAI_API_KEY
export const getGroqApiKey = () => loadConfig().GROQ_API_KEY  
export const getAnthropicApiKey = () => loadConfig().ANTHROPIC_API_KEY
export const getGeminiApiKey = () => loadConfig().GEMINI_API_KEY
export const getDeepseekApiKey = () => loadConfig().DEEPSEEK_API_KEY
export const getOllamaApiEndpoint = () => loadConfig().OLLAMA_API_URL
export const getLMStudioApiEndpoint = () => loadConfig().LM_STUDIO_API_URL
export const getCustomOpenaiApiKey = () => loadConfig().CUSTOM_OPENAI_API_KEY
export const getCustomOpenaiApiEndpoint = () => loadConfig().CUSTOM_OPENAI_API_URL
export const getCustomOpenaiModelName = () => loadConfig().CUSTOM_OPENAI_MODEL_NAME
export const getSearxngApiEndpoint = () => loadConfig().SEARXNG_API_URL
export const getSearxngApiKey = () => loadConfig().SEARXNG_API_KEY
export const getSimilarityMeasure = () => loadConfig().SIMILARITY_MEASURE
export const getKeepAlive = () => loadConfig().KEEP_ALIVE

// Update configuration (for API endpoints)
export const updateConfig = (updates: Partial<Config>) => {
  const current = loadConfig()
  const updated = { ...current, ...updates }
  
  // Update cache
  configCache = updated
  configCacheTime = Date.now()
  
  return updated
}

// Get full configuration
export const getConfig = () => loadConfig()

// Clear configuration cache
export const clearConfigCache = () => {
  configCache = null
  configCacheTime = 0
}

// Configuration validation
export const validateConfig = () => {
  const config = loadConfig()
  const warnings: string[] = []
  
  // Check for missing API keys
  if (!config.OPENAI_API_KEY) warnings.push('OpenAI API key not configured')
  if (!config.SEARXNG_API_URL) warnings.push('SearxNG API URL not configured')
  
  // Check URL formats
  try {
    new URL(config.SEARXNG_API_URL)
  } catch {
    warnings.push('Invalid SearxNG API URL format')
  }
  
  if (config.OLLAMA_API_URL) {
    try {
      new URL(config.OLLAMA_API_URL)
    } catch {
      warnings.push('Invalid Ollama API URL format')
    }
  }
  
  return {
    valid: warnings.length === 0,
    warnings,
    config
  }
} 