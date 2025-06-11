import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  
  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false
  },
  
  // Alias configuration
  alias: {
    '~': '.',
    '@': '.',
  },
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/mdc'
  ],

  // Color mode
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: ''
  },
  
  // Auto-imports
  imports: {
    global: true
  },
  
  // CSS
  css: ['~/assets/css/main.css'],
  
  // Runtime Config
  runtimeConfig: {
    // Server-side environment variables
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    groqApiKey: process.env.GROQ_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    ollamaApiUrl: process.env.OLLAMA_API_URL,
    searxngApiUrl: process.env.SEARXNG_API_URL,
    
    // Public environment variables
    public: {
      appName: 'Intellix',
      appVersion: process.env.npm_package_version
    }
  },
  
  // Nitro configuration
  nitro: {
    experimental: {
      wasm: true
    },
    compressPublicAssets: true
  }
})
