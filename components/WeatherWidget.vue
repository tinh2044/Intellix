<template>
  <div class="bg-light-secondary dark:bg-dark-secondary rounded-xl border border-light-200 dark:border-dark-200 shadow-sm p-4 w-full h-24 min-h-[96px] max-h-[96px]">
    <!-- Loading State -->
    <div v-if="loading" class="animate-pulse flex items-center h-full">
      <div class="rounded-full w-12 h-12 bg-light-200 dark:bg-dark-200 mr-4" />
      <div class="flex-1">
        <div class="h-4 w-3/4 rounded bg-light-200 dark:bg-dark-200 mb-2" />
        <div class="h-3 w-1/2 rounded bg-light-200 dark:bg-dark-200" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center h-full text-xs text-red-400">
      Could not load weather data
    </div>

    <!-- Weather Data -->
    <div v-else-if="weatherData" class="flex items-center h-full">
      <!-- Weather Icon -->
      <div class="flex-shrink-0 mr-4">
        <img
          :src="getWeatherIcon(weatherData.weather[0].main)"
          :alt="weatherData.weather[0].description"
          class="w-12 h-12"
        />
      </div>

      <!-- Weather Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline space-x-2">
          <span class="text-2xl font-bold dark:text-white">
            {{ Math.round(weatherData.main.temp) }}°C
          </span>
          <span class="text-sm text-black/70 dark:text-white/70">
            {{ weatherData.weather[0].description }}
          </span>
        </div>
        <div class="text-xs text-black/60 dark:text-white/60 mt-1">
          {{ weatherData.name }}, {{ weatherData.sys.country }}
        </div>
        <div class="text-xs text-black/50 dark:text-white/50">
          Feels like {{ Math.round(weatherData.main.feels_like) }}°C
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface WeatherData {
  name: string
  sys: {
    country: string
  }
  main: {
    temp: number
    feels_like: number
  }
  weather: Array<{
    main: string
    description: string
  }>
}

interface LocationData {
  latitude: number
  longitude: number
  city: string
}

// State
const weatherData = ref<WeatherData | null>(null)
const loading = ref(true)
const error = ref(false)

// Weather icon mapping
const getWeatherIcon = (weather: string) => {
  const iconMap: Record<string, string> = {
    'Clear': '/weather-ico/clear.svg',
    'Clouds': '/weather-ico/clouds.svg',
    'Rain': '/weather-ico/rain.svg',
    'Drizzle': '/weather-ico/drizzle.svg',
    'Thunderstorm': '/weather-ico/thunderstorm.svg',
    'Snow': '/weather-ico/snow.svg',
    'Mist': '/weather-ico/mist.svg',
    'Fog': '/weather-ico/fog.svg',
    'Haze': '/weather-ico/haze.svg',
  }
  
  return iconMap[weather] || '/weather-ico/clear.svg'
}

// Get approximate location using IP
const getApproxLocation = async (): Promise<LocationData> => {
  try {
    const response = await $fetch<{
      latitude: number
      longitude: number
      city: string
    }>('https://ipapi.co/json/')
    
    return {
      latitude: response.latitude,
      longitude: response.longitude,
      city: response.city,
    }
  } catch (error) {
    console.error('Failed to get location:', error)
    // Fallback to default location (e.g., New York)
    return {
      latitude: 40.7128,
      longitude: -74.0060,
      city: 'New York',
    }
  }
}

// Get location with user permission or fallback to IP-based
const getLocation = (callback: (location: LocationData) => void) => {
  if (process.client && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: 'Current Location',
        })
      },
      async () => {
        // Permission denied or error, use IP-based location
        const location = await getApproxLocation()
        callback(location)
      }
    )
  } else {
    // No geolocation support, use IP-based location
    getApproxLocation().then(callback)
  }
}

// Fetch weather data
const fetchWeather = async () => {
  loading.value = true
  error.value = false

  try {
    await new Promise<void>((resolve) => {
      getLocation(async (location) => {
        try {
          const response = await $fetch<WeatherData>('/api/weather', {
            method: 'POST',
            body: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          })

          weatherData.value = response
        } catch (err) {
          console.error('Weather API error:', err)
          error.value = true
        } finally {
          loading.value = false
          resolve()
        }
      })
    })
  } catch (err) {
    console.error('Failed to fetch weather:', err)
    error.value = true
    loading.value = false
  }
}

// Initialize weather data on mount
onMounted(() => {
  fetchWeather()
})
</script>

<style scoped>
/* Additional component-specific styles if needed */
</style> 