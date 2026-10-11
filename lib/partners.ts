import { normalizeSocialUrl } from './socialLinks'

export const MAX_PARTNERS = 50
export const MAX_PARTNER_NAME_LENGTH = 100

export type Partner = { name: string; url: string }

export function validatePartners(value: unknown): Partner[] {
  if (!Array.isArray(value)) throw new Error('Neplatný seznam firem.')
  const partners = value.filter((item) => !(item && typeof item === 'object' && !String(item.name ?? '').trim() && !String(item.url ?? '').trim()))
  if (partners.length > MAX_PARTNERS) throw new Error(`Lze uložit nejvýše ${MAX_PARTNERS} firem.`)
  return partners.map((item, index) => {
    const position = `Firma č. ${index + 1}`
    if (!item || typeof item !== 'object') throw new Error(`${position}: neplatný záznam.`)
    if (typeof item.name !== 'string' || !item.name.trim()) throw new Error(`${position}: vyplňte název firmy.`)
    const name = item.name.trim().replace(/\s+/g, ' ')
    if (name.length > MAX_PARTNER_NAME_LENGTH) throw new Error(`${position}: název je příliš dlouhý.`)
    try { return { name, url: normalizeSocialUrl(item.url ?? '') } }
    catch (error) { throw new Error(`${name}: ${(error as Error).message}`) }
  })
}

// Drops malformed entries instead of failing, so one bad record never hides the whole list.
export function readPartners(data?: Record<string, unknown>): Partner[] {
  const companies = data?.companies
  if (!Array.isArray(companies)) return []
  return companies.slice(0, MAX_PARTNERS).flatMap((item) => {
    try { return validatePartners([item]) }
    catch { return [] }
  })
}
