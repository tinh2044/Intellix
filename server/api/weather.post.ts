export default defineEventHandler(async (event) => {
  try {
    // Validate method
    assertMethod(event, 'POST')
    
    // Read request body
    const body = await readBody(event) as { lat: number; lng: number }

    if (!body.lat || !body.lng) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request. Latitude and longitude are required.'
      })
    }

    // Fetch weather data from Open-Meteo API
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${body.lat}&longitude=${body.lng}&current=weather_code,temperature_2m,is_day,relative_humidity_2m,wind_speed_10m&timezone=auto`,
    )

    const data = await res.json()

    if (data.error) {
      console.error(`Error fetching weather data: ${data.reason}`)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch weather data'
      })
    }

    // Initialize weather object
    const weather: {
      temperature: number
      condition: string
      humidity: number
      windSpeed: number
      icon: string
    } = {
      temperature: data.current.temperature_2m,
      condition: '',
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      icon: '',
    }

    const code = data.current.weather_code
    const isDay = data.current.is_day === 1
    const dayOrNight = isDay ? 'day' : 'night'

    // Map weather codes to conditions and icons
    switch (code) {
      case 0:
        weather.icon = `clear-${dayOrNight}`
        weather.condition = 'Clear'
        break

      case 1:
        weather.condition = 'Mainly Clear'
      case 2:
        weather.condition = 'Partly Cloudy'
      case 3:
        weather.icon = `cloudy-1-${dayOrNight}`
        weather.condition = 'Cloudy'
        break

      case 45:
        weather.condition = 'Fog'
      case 48:
        weather.icon = `fog-${dayOrNight}`
        weather.condition = 'Fog'
        break

      case 51:
        weather.condition = 'Light Drizzle'
      case 53:
        weather.condition = 'Moderate Drizzle'
      case 55:
        weather.icon = `rainy-1-${dayOrNight}`
        weather.condition = 'Dense Drizzle'
        break

      case 56:
        weather.condition = 'Light Freezing Drizzle'
      case 57:
        weather.icon = `frost-${dayOrNight}`
        weather.condition = 'Dense Freezing Drizzle'
        break

      case 61:
        weather.condition = 'Slight Rain'
      case 63:
        weather.condition = 'Moderate Rain'
      case 65:
        weather.condition = 'Heavy Rain'
        weather.icon = `rainy-2-${dayOrNight}`
        break

      case 66:
        weather.condition = 'Light Freezing Rain'
      case 67:
        weather.condition = 'Heavy Freezing Rain'
        weather.icon = 'rain-and-sleet-mix'
        break

      case 71:
        weather.condition = 'Slight Snow Fall'
      case 73:
        weather.condition = 'Moderate Snow Fall'
      case 75:
        weather.condition = 'Heavy Snow Fall'
        weather.icon = `snowy-2-${dayOrNight}`
        break

      case 77:
        weather.condition = 'Snow'
        weather.icon = `snowy-1-${dayOrNight}`
        break

      case 80:
        weather.condition = 'Slight Rain Showers'
      case 81:
        weather.condition = 'Moderate Rain Showers'
      case 82:
        weather.condition = 'Heavy Rain Showers'
        weather.icon = `rainy-3-${dayOrNight}`
        break

      case 85:
        weather.condition = 'Slight Snow Showers'
      case 86:
        weather.condition = 'Moderate Snow Showers'
      case 87:
        weather.condition = 'Heavy Snow Showers'
        weather.icon = `snowy-3-${dayOrNight}`
        break

      case 95:
        weather.condition = 'Thunderstorm'
        weather.icon = `scattered-thunderstorms-${dayOrNight}`
        break

      case 96:
        weather.condition = 'Thunderstorm with Slight Hail'
      case 99:
        weather.condition = 'Thunderstorm with Heavy Hail'
        weather.icon = 'severe-thunderstorm'
        break

      default:
        weather.icon = `clear-${dayOrNight}`
        weather.condition = 'Clear'
        break
    }

    return weather
    
  } catch (error) {
    console.error('An error occurred while getting weather data:', error)
    
    // Re-throw createError instances
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error has occurred while fetching weather data'
    })
  }
}) 