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

export type PriceListCurrency = 'Kč' | 'Kč/h'

export type PriceListItemInput = Omit<PriceListItem, 'id' | 'createdAt'>

const PRICE_LIST_COLLECTION = 'priceListItems'

const DEFAULT_PRICE_LIST_CURRENCY: PriceListCurrency = 'Kč'
const PRICE_SUFFIX_PATTERN = /\s*Kč(?:\s*\/\s*(?:h|hod))?\s*$/i
const HOURLY_PRICE_PATTERN = /Kč\s*\/\s*(?:h|hod)|Kč\/h/i
const NUMBER_GROUP_PATTERN = /\d[\d ]*/g

export const PRICE_LIST_PRESETS: PriceListPreset[] = [
  {
    key: 'instalaterske-sluzby',
    name: 'Instalatérské služby',
  },
]

export const PRICE_LIST_CURRENCIES: PriceListCurrency[] = ['Kč', 'Kč/h']

export const normalizePriceListCurrency = (
  price: string,
  currency?: string | null
): PriceListCurrency => {
  if (currency === 'Kč' || currency === 'Kč/h') {
    return currency
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
  const docRef = await addDoc(collection(db, PRICE_LIST_COLLECTION), {
    ...item,
    createdAt: new Date(),
  })

  return docRef.id
}

export const updatePriceListItem = async (
  itemId: string,
  item: Partial<PriceListItemInput>
): Promise<void> => {
  await updateDoc(doc(db, PRICE_LIST_COLLECTION, itemId), item)
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
