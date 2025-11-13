import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export interface Reference {
  id: string
  title: string
  description: string
  imageUrls: string[] // Array of image URLs (up to 10)
  isActive: boolean
  createdAt: any
  updatedAt: any
}

const COLLECTION_NAME = 'constructionsReferences'

export const createReference = async (referenceData: Omit<Reference, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...referenceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating reference:', error)
    throw new Error('Failed to create reference')
  }
}

export const getAllReferences = async (): Promise<Reference[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Reference))
  } catch (error) {
    console.error('Error fetching references:', error)
    throw new Error('Failed to fetch references')
  }
}

export const updateReference = async (referenceId: string, updateData: Partial<Reference>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, referenceId)
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating reference:', error)
    throw new Error('Failed to update reference')
  }
}

export const toggleReferenceStatus = async (referenceId: string, currentStatus: boolean): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, referenceId)
    await updateDoc(docRef, {
      isActive: !currentStatus,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error toggling reference status:', error)
    throw new Error('Failed to toggle reference status')
  }
}

export const deleteReference = async (referenceId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, referenceId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting reference:', error)
    throw new Error('Failed to delete reference')
  }
}
