import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

export interface PriceListItem {
  id: string
  name: string
  price: string
  priceCurrency: PriceListCurrency
  isActive: boolean
  presetKey?: string | null
  createdAt: Date
}

export interface PriceListPreset {
  key: string
  name: string
}

export type PriceListCurrency = 'Kč' | 'Kč/h' | 'Kč/km'

export type PriceListItemInput = Omit<PriceListItem, 'id' | 'createdAt'>

const PRICE_LIST_COLLECTION = 'priceListItems'

const DEFAULT_PRICE_LIST_CURRENCY: PriceListCurrency = 'Kč'
const PRICE_SUFFIX_PATTERN = /\s*Kč(?:\s*\/\s*(?:h|hod|km))?\s*$/i
const HOURLY_PRICE_PATTERN = /Kč\s*\/\s*(?:h|hod)|Kč\/h/i
const DISTANCE_PRICE_PATTERN = /Kč\s*\/\s*km|Kč\/km/i
const NUMBER_GROUP_PATTERN = /\d[\d ]*/g

export const PRICE_LIST_PRESETS: PriceListPreset[] = [
  {
    key: 'instalaterske-sluzby',
    name: 'Instalatérské služby',
  },
]

export const PRICE_LIST_CURRENCIES: PriceListCurrency[] = ['Kč', 'Kč/h', 'Kč/km']

export const normalizePriceListCurrency = (
  price: string,
  currency?: string | null
): PriceListCurrency => {
  if (currency === 'Kč' || currency === 'Kč/h' || currency === 'Kč/km') {
    return currency
  }

  if (DISTANCE_PRICE_PATTERN.test(price)) {
    return 'Kč/km'
  }

  return HOURLY_PRICE_PATTERN.test(price) ? 'Kč/h' : DEFAULT_PRICE_LIST_CURRENCY
}

export const sanitizePriceListAmount = (price: string) =>
  price.replace(PRICE_SUFFIX_PATTERN, '').trim()

const formatDigitGroup = (digitGroup: string) => {
  const normalizedDigits = digitGroup.replace(/\s+/g, '')
  return normalizedDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const formatPriceListAmount = (price: string) =>
  sanitizePriceListAmount(price).replace(NUMBER_GROUP_PATTERN, formatDigitGroup)

export const normalizePriceListItemInput = <T extends Partial<PriceListItemInput>>(
  item: T
): T => {
  const normalizedItem = { ...item } as T

  if (typeof item.name === 'string') {
    normalizedItem.name = item.name.trim() as T['name']
  }

  if (typeof item.price === 'string') {
    normalizedItem.price = formatPriceListAmount(item.price) as T['price']
  }

  if (typeof item.priceCurrency === 'string') {
    normalizedItem.priceCurrency = normalizePriceListCurrency(
      typeof normalizedItem.price === 'string' ? normalizedItem.price : '',
      item.priceCurrency
    ) as T['priceCurrency']
  }

  return normalizedItem
}

export const formatPriceListPrice = ({
  price,
  priceCurrency,
}: Pick<PriceListItem, 'price' | 'priceCurrency'>) => {
  const amount = formatPriceListAmount(price)

  if (!amount) {
    return ''
  }

  return `${amount} ${priceCurrency}`
}

export const getAllPriceListItems = async (): Promise<PriceListItem[]> => {
  try {
    const snapshot = await getDocs(collection(db, PRICE_LIST_COLLECTION))
    const items: PriceListItem[] = []

    snapshot.forEach((docSnap) => {
      const data = docSnap.data()
      const rawPrice = data.price || ''
      items.push({
        id: docSnap.id,
        name: data.name || '',
        price: formatPriceListAmount(rawPrice),
        priceCurrency: normalizePriceListCurrency(rawPrice, data.priceCurrency),
        isActive: data.isActive ?? true,
        presetKey: data.presetKey || null,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      })
    })

    return items.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  } catch (error) {
    console.error('Error fetching price list items:', error)
    return []
  }
}

export const getActivePriceListItems = async (): Promise<PriceListItem[]> => {
  const items = await getAllPriceListItems()
  return items.filter((item) => item.isActive)
}

export const createPriceListItem = async (item: PriceListItemInput): Promise<string> => {
  const normalizedItem = normalizePriceListItemInput(item)

  const docRef = await addDoc(collection(db, PRICE_LIST_COLLECTION), {
    ...normalizedItem,
    createdAt: new Date(),
  })

  return docRef.id
}

export const updatePriceListItem = async (
  itemId: string,
  item: Partial<PriceListItemInput>
): Promise<void> => {
  await updateDoc(doc(db, PRICE_LIST_COLLECTION, itemId), normalizePriceListItemInput(item))
}

export const deletePriceListItem = async (itemId: string): Promise<void> => {
  await deleteDoc(doc(db, PRICE_LIST_COLLECTION, itemId))
}

export const togglePriceListItemStatus = async (
  itemId: string,
  isActive: boolean
): Promise<void> => {
  await updateDoc(doc(db, PRICE_LIST_COLLECTION, itemId), { isActive })
}
