import type { MetadataRoute } from 'next'

const baseUrl = 'https://tzb-marpro.cz'

// /Construction is intentionally absent: it is a legacy URL that redirects to
// /Installation, and sitemaps should list canonical destinations only.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/Container`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/Excavator`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/Installation`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/Cenik`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]
}
