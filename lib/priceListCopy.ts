type SupportedLanguage = 'en' | 'cs' | 'ru'

const priceListCopy = {
  en: {
    navLabel: 'Service Price List',
    title: 'Service Price List',
    subtitle: 'Overview of services and indicative prices',
    serviceLabel: 'Service',
    priceLabel: 'Price',
    loading: 'Loading service price list...',
    emptyState: 'The service price list will be added soon.',
  },
  cs: {
    navLabel: 'Ceník služeb',
    title: 'Ceník služeb',
    subtitle: 'Přehled služeb a orientačních cen',
    serviceLabel: 'Služba',
    priceLabel: 'Cena',
    loading: 'Načítání ceníku služeb...',
    emptyState: 'Ceník služeb bude brzy doplněn.',
  },
  ru: {
    navLabel: 'Прайс-лист',
    title: 'Прайс-лист',
    subtitle: 'Обзор услуг и ориентировочных цен',
    serviceLabel: 'Услуга',
    priceLabel: 'Цена',
    loading: 'Загрузка прайс-листа...',
    emptyState: 'Прайс-лист скоро будет добавлен.',
  },
} as const

export function getPriceListCopy(language: SupportedLanguage) {
  return priceListCopy[language] ?? priceListCopy.cs
}
