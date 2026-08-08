import type { MetadataRoute } from 'next'
import { projects } from '@/lib/projects'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${siteUrl}/trabalhos/${p.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: siteUrl, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/contato`, changeFrequency: 'yearly', priority: 0.8 },
    ...projectUrls,
  ]
}
