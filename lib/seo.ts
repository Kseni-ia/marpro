import type { Metadata } from 'next'

type OpeningHours = {
  dayOfWeek: string[]
  opens: string
  closes: string
}

type GeoCoordinates = {
  latitude: number
  longitude: number
}

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
  vatId: 'CZ08959439',
  taxId: '08959439',
  address: {
    streetAddress: 'Kolovratská 58/1',
    addressLocality: 'Praha 10 - Strašnice',
    postalCode: '100 00',
    addressCountry: 'CZ',
  },
  // Photos of the business/work, used for the LocalBusiness `image` property.
  // Google wants raster images here, not the SVG logo.
  photos: ['/home_default_bg.jpeg', '/containers_bg.jpeg', '/excavators_bg.jpeg'],
  sameAs: ['https://www.tiktok.com/@marpro_s.r.o'],
  areaServed: ['Praha', 'Středočeský kraj'],
  openingHours: [
    {
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      opens: '07:00',
      closes: '18:00',
    },
  ] as OpeningHours[] | undefined,
  // TODO: copy the exact coordinates from the Google Business Profile / Maps pin.
  geo: undefined as GeoCoordinates | undefined,
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

const services = [
  {
    name: 'Přistavení a pronájem kontejnerů',
    description:
      'Přistavení, pronájem a odvoz kontejnerů na stavební suť a odpad v Praze a okolí.',
    path: '/Container',
  },
  {
    name: 'Pronájem bagrů a výkopové práce',
    description:
      'Pronájem minibagrů a bagrů s obsluhou, výkopové a zemní práce v Praze a okolí.',
    path: '/Excavator',
  },
  {
    name: 'Stavební práce',
    description: 'Stavební, bourací a dokončovací práce pro domy i byty.',
    path: '/Construction',
  },
  {
    name: 'Instalační práce (TZB)',
    description:
      'Instalatérské a topenářské práce, rozvody vody, kanalizace a vytápění.',
    path: '/Installation',
  },
] as const

export const localBusinessStructuredData = {
  '@context': 'https://schema.org',
  // GeneralContractor and HVACBusiness are both LocalBusiness subtypes; listing
  // LocalBusiness explicitly keeps the markup readable for parsers that don't
  // walk the schema.org hierarchy.
  '@type': ['LocalBusiness', 'GeneralContractor', 'HVACBusiness'],
  '@id': `${siteConfig.url}/#organization`,
  name: siteConfig.legalName,
  alternateName: ['TZB MARPRO', 'TZB-MARPRO', 'tzb-marpro', 'MARPRO'],
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}${siteConfig.logoPath}`,
  image: siteConfig.photos.map((photo) => `${siteConfig.url}${photo}`),
  email: siteConfig.email,
  telephone: siteConfig.phone,
  vatID: siteConfig.vatId,
  taxID: siteConfig.taxId,
  priceRange: '$$',
  currenciesAccepted: 'CZK',
  address: {
    '@type': 'PostalAddress',
    ...siteConfig.address,
  },
  ...(siteConfig.geo
    ? {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: siteConfig.geo.latitude,
          longitude: siteConfig.geo.longitude,
        },
      }
    : {}),
  ...(siteConfig.openingHours
    ? {
        openingHoursSpecification: siteConfig.openingHours.map((hours) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: hours.dayOfWeek,
          opens: hours.opens,
          closes: hours.closes,
        })),
      }
    : {}),
  areaServed: siteConfig.areaServed.map((area) => ({
    '@type': 'AdministrativeArea',
    name: area,
  })),
  sameAs: [...siteConfig.sameAs],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Služby TZB MARPRO',
    itemListElement: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        url: `${siteConfig.url}${service.path}`,
        provider: { '@id': `${siteConfig.url}/#organization` },
      },
    })),
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
