const articleWebsites = [
  'yahoo.com',
  'www.exchangewire.com',
  'businessinsider.com',
  /* 'wired.com',
  'mashable.com',
  'theverge.com',
  'gizmodo.com',
  'cnet.com',
  'venturebeat.com', */
]

const topics = ['AI', 'tech'] 

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const mode: 'normal' | 'preview' = (query.mode as 'normal' | 'preview') || 'normal'
    
    // Import search utilities
    
    let data = []

    if (mode === 'normal') {
      // Fetch articles from all combinations of websites and topics
      data = (
        await Promise.all([
          ...new Array(articleWebsites.length * topics.length)
            .fill(0)
            .map(async (_, i) => {
              return (
                await searchSearxng(
                  `site:${articleWebsites[i % articleWebsites.length]} ${
                    topics[i % topics.length]
                  }`,
                  {
                    engines: ['bing news'],
                    pageno: 1,
                  },
                )
              ).results
            }),
        ])
      )
        .map((result) => result)
        .flat()
        .sort(() => Math.random() - 0.5) // Shuffle results
    } else {
      // Preview mode - fetch from a random website and topic
      data = (
        await searchSearxng(
          `site:${articleWebsites[Math.floor(Math.random() * articleWebsites.length)]} ${
            topics[Math.floor(Math.random() * topics.length)]
          }`,
          { engines: ['bing news'], pageno: 1 },
        )
      ).results
    }

    return {
      blogs: data,
    }
    
  } catch (error) {
    console.error('An error occurred in discover route:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'An error has occurred while discovering content'
    })
  }
}) 