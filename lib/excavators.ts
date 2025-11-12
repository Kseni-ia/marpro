import { db } from './firebase'
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'

export interface Excavator {
  id: string
  model: string
  type: string // mini, standard, large
  description: {
    en: string
    cs: string
    ru: string
  }
  price: number // in CZK per hour
  specs: {
    weight: string
    bucketCapacity: string
    maxReach: string
  }
  isActive: boolean
  svgPath?: string // excavator image path (legacy)
  imageUrl?: string // uploaded image URL from Firebase Storage
  createdAt: Date
}

const COLLECTION_NAME = 'excavatorsList'

// Get all excavators from Firebase
export const getAllExcavators = async (): Promise<Excavator[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    const excavators: Excavator[] = []
    
    querySnapshot.forEach((doc) => {
      excavators.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      } as Excavator)
    })
    
    return excavators.sort((a, b) => a.price - b.price)
  } catch (error) {
    console.error('Error fetching excavators:', error)
    return []
  }
}

// Get only active excavators
export const getActiveExcavators = async (): Promise<Excavator[]> => {
  const excavators = await getAllExcavators()
  return excavators.filter(excavator => excavator.isActive)
}

// Add new excavator
export const addExcavator = async (excavatorData: Omit<Excavator, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...excavatorData,
      createdAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding excavator:', error)
    throw error
  }
}

// Delete excavator
export const deleteExcavator = async (excavatorId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, excavatorId))
  } catch (error) {
    console.error('Error deleting excavator:', error)
    throw error
  }
}

// Update excavator
export const updateExcavator = async (excavatorId: string, excavatorData: Partial<Excavator>): Promise<void> => {
  try {
    const excavatorRef = doc(db, COLLECTION_NAME, excavatorId)
    await updateDoc(excavatorRef, excavatorData)
  } catch (error) {
    console.error('Error updating excavator:', error)
    throw error
  }
}

// Toggle excavator active status
export const toggleExcavatorStatus = async (excavatorId: string, isActive: boolean): Promise<void> => {
  try {
    const excavatorRef = doc(db, COLLECTION_NAME, excavatorId)
    await updateDoc(excavatorRef, { isActive })
  } catch (error) {
    console.error('Error toggling excavator status:', error)
    throw error
  }
}
