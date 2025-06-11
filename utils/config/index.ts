// Client-side configuration utilities for Nuxt.js
export const getAppConfig = () => {
  if (process.client) {
    const config = useRuntimeConfig()
    return config.public
  }
  return {}
}

export const getApiEndpoint = (endpoint: string) => {
  if (process.client) {
    return `/api/${endpoint}`
  }
  return `/api/${endpoint}`
}

// Re-export server config functions for compatibility
export * from '~/server/utils/config' 