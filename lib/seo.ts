import type { Metadata } from 'next'

export const siteConfig = {
  name: 'TZB MARPRO',
  legalName: 'MARPRO s.r.o.',
  url: 'https://tzb-marpro.cz',
  defaultTitle: 'TZB MARPRO | Kontejnery, bagry a stavební práce v Praze',
  description:
    'TZB MARPRO (MARPRO s.r.o.) zajišťuje přistavení kontejnerů, pronájem bagrů a stavební a instalační práce v Praze a okolí.',
  email: 'marprostav@outlook.cz',
  phone: '+420607428667',
  logoPath: '/logoDF.svg',
  address: {
    streetAddress: 'Kolovratska 58/1',
    addressLocality: 'Praha 10 - Strasnice',
    postalCode: '100 00',
    addressCountry: 'CZ',
  },
} as const

type PageMetadataOptions = {
  title: string
  description: string
  path: string
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  keywords: [
    'TZB MARPRO',
    'TZB-MARPRO',
    'tzb-marpro',
    'tzb-marpro.cz',
    'MARPRO',
    'MARPRO s.r.o.',
    'kontejnery Praha',
    'pronajem bagru Praha',
    'stavebni prace Praha',
    'instalacni prace Praha',
  ],
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.defaultTitle} | ${siteConfig.name}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: siteConfig.logoPath,
    shortcut: siteConfig.logoPath,
  },
}

export function buildPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const canonicalPath = path === '/' ? '/' : path
  const absoluteUrl =
    canonicalPath === '/' ? siteConfig.url : `${siteConfig.url}${canonicalPath}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'website',
      locale: 'cs_CZ',
      url: absoluteUrl,
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  }
}

export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteConfig.url}/#organization`,
  name: siteConfig.legalName,
  alternateName: ['TZB MARPRO', 'TZB-MARPRO', 'tzb-marpro', 'MARPRO'],
  url: siteConfig.url,
  logo: `${siteConfig.url}${siteConfig.logoPath}`,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: {
    '@type': 'PostalAddress',
    ...siteConfig.address,
  },
}

export const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  alternateName: ['TZB-MARPRO', 'tzb-marpro', 'MARPRO s.r.o.'],
  inLanguage: 'cs-CZ',
  publisher: {
    '@id': `${siteConfig.url}/#organization`,
  },
}
