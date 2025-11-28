import { db } from './firebase'
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'

// Price entry for a specific container volume
export interface VolumePricing {
  volume: number // e.g., 3, 5, 10, 15
  price: number // price in CZK
  weightLimit: number // max weight in tons
}

// Waste type with pricing for different container sizes
export interface WasteType {
  id: string
  name: {
    en: string
    cs: string
    ru: string
  }
  pricing: VolumePricing[]
  isActive: boolean
  order: number // display order
  createdAt: Date
}

// Surcharge configuration
export interface Surcharge {
  id: string
  name: {
    en: string
    cs: string
    ru: string
  }
  note?: {
    en: string
    cs: string
    ru: string
  }
  price: number // price in CZK, 0 means "individual/contact us"
  isPercentage: boolean // if true, price is a percentage
  isActive: boolean
  order: number
}

const WASTE_TYPES_COLLECTION = 'wasteTypesList'
const SURCHARGES_COLLECTION = 'surchargesList'

// ==================== WASTE TYPES ====================

// Get all waste types
export const getAllWasteTypes = async (): Promise<WasteType[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, WASTE_TYPES_COLLECTION))
    const wasteTypes: WasteType[] = []
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data()
      wasteTypes.push({
        id: docSnap.id,
        name: data.name || { en: '', cs: '', ru: '' },
        pricing: data.pricing || [],
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
        createdAt: data.createdAt?.toDate() || new Date()
      })
    })
    
    return wasteTypes.sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Error fetching waste types:', error)
    return []
  }
}

// Get only active waste types
export const getActiveWasteTypes = async (): Promise<WasteType[]> => {
  const wasteTypes = await getAllWasteTypes()
  return wasteTypes.filter(wt => wt.isActive)
}

// Add new waste type
export const addWasteType = async (wasteTypeData: Omit<WasteType, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, WASTE_TYPES_COLLECTION), {
      ...wasteTypeData,
      createdAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding waste type:', error)
    throw error
  }
}

// Update waste type
export const updateWasteType = async (wasteTypeId: string, wasteTypeData: Partial<WasteType>): Promise<void> => {
  try {
    const wasteTypeRef = doc(db, WASTE_TYPES_COLLECTION, wasteTypeId)
    await updateDoc(wasteTypeRef, wasteTypeData)
  } catch (error) {
    console.error('Error updating waste type:', error)
    throw error
  }
}

// Delete waste type
export const deleteWasteType = async (wasteTypeId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, WASTE_TYPES_COLLECTION, wasteTypeId))
  } catch (error) {
    console.error('Error deleting waste type:', error)
    throw error
  }
}

// Toggle waste type active status
export const toggleWasteTypeStatus = async (wasteTypeId: string, isActive: boolean): Promise<void> => {
  try {
    const wasteTypeRef = doc(db, WASTE_TYPES_COLLECTION, wasteTypeId)
    await updateDoc(wasteTypeRef, { isActive })
  } catch (error) {
    console.error('Error toggling waste type status:', error)
    throw error
  }
}

// ==================== SURCHARGES ====================

// Get all surcharges
export const getAllSurcharges = async (): Promise<Surcharge[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, SURCHARGES_COLLECTION))
    const surcharges: Surcharge[] = []
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data()
      surcharges.push({
        id: docSnap.id,
        name: data.name || { en: '', cs: '', ru: '' },
        note: data.note,
        price: data.price ?? 0,
        isPercentage: data.isPercentage ?? false,
        isActive: data.isActive ?? true,
        order: data.order ?? 0
      })
    })
    
    return surcharges.sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Error fetching surcharges:', error)
    return []
  }
}

// Get only active surcharges
export const getActiveSurcharges = async (): Promise<Surcharge[]> => {
  const surcharges = await getAllSurcharges()
  return surcharges.filter(s => s.isActive)
}

// Add new surcharge
export const addSurcharge = async (surchargeData: Omit<Surcharge, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, SURCHARGES_COLLECTION), surchargeData)
    return docRef.id
  } catch (error) {
    console.error('Error adding surcharge:', error)
    throw error
  }
}

// Update surcharge
export const updateSurcharge = async (surchargeId: string, surchargeData: Partial<Surcharge>): Promise<void> => {
  try {
    const surchargeRef = doc(db, SURCHARGES_COLLECTION, surchargeId)
    await updateDoc(surchargeRef, surchargeData)
  } catch (error) {
    console.error('Error updating surcharge:', error)
    throw error
  }
}

// Delete surcharge
export const deleteSurcharge = async (surchargeId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, SURCHARGES_COLLECTION, surchargeId))
  } catch (error) {
    console.error('Error deleting surcharge:', error)
    throw error
  }
}

// ==================== HELPER FUNCTIONS ====================

// Get price for a specific waste type and container volume
export const getPrice = (wasteType: WasteType, volume: number): number | null => {
  const pricing = wasteType.pricing.find(p => p.volume === volume)
  return pricing ? pricing.price : null
}

// Get weight limit for a specific waste type and container volume
export const getWeightLimit = (wasteType: WasteType, volume: number): number | null => {
  const pricing = wasteType.pricing.find(p => p.volume === volume)
  return pricing ? pricing.weightLimit : null
}

// Default waste types to seed the database
export const DEFAULT_WASTE_TYPES: Omit<WasteType, 'id' | 'createdAt'>[] = [
  {
    name: { en: 'Rubble and Concrete', cs: 'Suť a betony', ru: 'Строительный мусор и бетон' },
    pricing: [
      { volume: 3, price: 3090, weightLimit: 4 },
      { volume: 5, price: 4290, weightLimit: 6 },
      { volume: 10, price: 7490, weightLimit: 14 },
      { volume: 15, price: 9990, weightLimit: 17 }
    ],
    isActive: true,
    order: 1
  },
  {
    name: { en: 'Soil / Earth', cs: 'Zemina', ru: 'Грунт / Земля' },
    pricing: [
      { volume: 3, price: 2990, weightLimit: 4 },
      { volume: 5, price: 4090, weightLimit: 6 },
      { volume: 10, price: 6990, weightLimit: 14 },
      { volume: 15, price: 9490, weightLimit: 17 }
    ],
    isActive: true,
    order: 2
  },
  {
    name: { en: 'Asphalt (without tar)', cs: 'Živice bez dehtu', ru: 'Асфальт (без смолы)' },
    pricing: [
      { volume: 3, price: 3290, weightLimit: 4 },
      { volume: 5, price: 4490, weightLimit: 6 },
      { volume: 10, price: 7990, weightLimit: 14 },
      { volume: 15, price: 10490, weightLimit: 17 }
    ],
    isActive: true,
    order: 3
  },
  {
    name: { en: 'Light Waste (no rubble)', cs: 'Lehké odpady bez suti', ru: 'Легкие отходы (без мусора)' },
    pricing: [
      { volume: 3, price: 2490, weightLimit: 1 },
      { volume: 5, price: 3290, weightLimit: 1.5 },
      { volume: 10, price: 5490, weightLimit: 2 },
      { volume: 15, price: 6990, weightLimit: 3 }
    ],
    isActive: true,
    order: 4
  },
  {
    name: { en: 'Mixed Waste with Rubble', cs: 'Směsný odpad se sutí', ru: 'Смешанные отходы со строймусором' },
    pricing: [
      { volume: 3, price: 3490, weightLimit: 4 },
      { volume: 5, price: 4790, weightLimit: 4.5 },
      { volume: 10, price: 8490, weightLimit: 5 },
      { volume: 15, price: 10990, weightLimit: 5 }
    ],
    isActive: true,
    order: 5
  },
  {
    name: { en: 'Clean Wood', cs: 'Čisté dřevo', ru: 'Чистая древесина' },
    pricing: [
      { volume: 3, price: 2290, weightLimit: 4 },
      { volume: 5, price: 3090, weightLimit: 6 },
      { volume: 10, price: 4990, weightLimit: 6 },
      { volume: 15, price: 6490, weightLimit: 6 }
    ],
    isActive: true,
    order: 6
  }
]

// Default surcharges to seed the database
export const DEFAULT_SURCHARGES: Omit<Surcharge, 'id'>[] = [
  {
    name: { en: 'Extra Day', cs: 'Každý další den', ru: 'Дополнительный день' },
    note: { en: 'More than 4 days', cs: 'Více než 4 dny', ru: 'Более 4 дней' },
    price: 100,
    isPercentage: false,
    isActive: true,
    order: 1
  },
  {
    name: { en: 'Vehicle Waiting', cs: 'Čekání vozidla', ru: 'Ожидание транспорта' },
    note: { en: 'Per 30 minutes', cs: 'Za každých 30 minut', ru: 'За каждые 30 минут' },
    price: 400,
    isPercentage: false,
    isActive: true,
    order: 2
  },
  {
    name: { en: 'Weekends & Holidays', cs: 'Víkendy a svátky', ru: 'Выходные и праздники' },
    note: { en: 'Saturday, Sunday, holidays', cs: 'Sobota, neděle, svátky', ru: 'Суббота, воскресенье, праздники' },
    price: 300,
    isPercentage: false,
    isActive: true,
    order: 3
  },
  {
    name: { en: 'Left Bank / Outside Prague', cs: 'Levý břeh / mimo Prahu', ru: 'Левый берег / за пределами Праги' },
    note: { en: 'Left bank of Vltava or outside Prague', cs: 'Levý břeh Vltavy nebo mimo Prahu', ru: 'Левый берег Влтавы или за пределами Праги' },
    price: 500,
    isPercentage: false,
    isActive: true,
    order: 4
  },
  {
    name: { en: 'Distance Beyond 20km', cs: 'Doprava dál než 20 km', ru: 'Расстояние более 20 км' },
    price: 0, // 0 means individual pricing
    isPercentage: false,
    isActive: true,
    order: 5
  }
]
