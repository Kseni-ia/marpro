export const SOCIAL_NETWORKS = [
  { key: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/marpro' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/marpro' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://www.tiktok.com/@marpro_s.r.o' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/@marpro' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/company/marpro' },
] as const

export type SocialNetwork = typeof SOCIAL_NETWORKS[number]['key']
export type SocialLinks = Record<SocialNetwork, string>
export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebook: '', instagram: '', youtube: '', linkedin: '',
  tiktok: 'https://www.tiktok.com/@marpro_s.r.o?_r=1&_t=ZN-91m9xvxrfPy',
}

export function normalizeSocialUrl(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Odkaz musí být text.')
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.length > 2048) throw new Error('Odkaz je příliš dlouhý.')
  let url: URL
  try { url = new URL(trimmed) } catch { throw new Error('Zadejte úplnou adresu začínající https:// nebo http://.') }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('Použijte veřejný odkaz začínající https:// nebo http:// bez přihlašovacích údajů.')
  }
  return url.href
}

export function validateSocialLinks(value: unknown): SocialLinks {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Neplatné odkazy.')
  const data = value as Record<string, unknown>
  return Object.fromEntries(SOCIAL_NETWORKS.map(({ key, label }) => {
    try { return [key, normalizeSocialUrl(data[key])] }
    catch (error) { throw new Error(`${label}: ${(error as Error).message}`) }
  })) as SocialLinks
}

// A missing document preserves the current website link; saved blank fields stay hidden.
export function readSocialLinks(data?: Record<string, unknown>): SocialLinks {
  if (!data) return { ...DEFAULT_SOCIAL_LINKS }
  return Object.fromEntries(SOCIAL_NETWORKS.map(({ key }) => {
    try { return [key, normalizeSocialUrl(data[key] ?? '')] }
    catch { return [key, ''] }
  })) as SocialLinks
}
