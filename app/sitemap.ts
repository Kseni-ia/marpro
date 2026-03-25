import type { MetadataRoute } from 'next'

const baseUrl = 'https://tzb-marpro.cz'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
    },
    {
      url: `${baseUrl}/Container`,
    },
    {
      url: `${baseUrl}/Excavator`,
    },
    {
      url: `${baseUrl}/Construction`,
    },
  ]
}
