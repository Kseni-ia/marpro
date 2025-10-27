import { db } from './firebase'
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'

export interface Container {
  id: string
  volume: number
  dims: string
  description: {
    en: string
    cs: string
    ru: string
  }
  price: number // in CZK
  isActive: boolean
  image?: string // container image ID
  createdAt: Date
}

const COLLECTION_NAME = 'containersList'

// Get all containers from Firebase
export const getAllContainers = async (): Promise<Container[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    const containers: Container[] = []
    
    querySnapshot.forEach((doc) => {
      containers.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      } as Container)
    })
    
    return containers.sort((a, b) => a.volume - b.volume)
  } catch (error) {
    console.error('Error fetching containers:', error)
    return []
  }
}

// Get only active containers
export const getActiveContainers = async (): Promise<Container[]> => {
  const containers = await getAllContainers()
  return containers.filter(container => container.isActive)
}

// Add new container
export const addContainer = async (containerData: Omit<Container, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...containerData,
      createdAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding container:', error)
    throw error
  }
}

// Delete container
export const deleteContainer = async (containerId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, containerId))
  } catch (error) {
    console.error('Error deleting container:', error)
    throw error
  }
}

// Update container
export const updateContainer = async (containerId: string, containerData: Partial<Container>): Promise<void> => {
  try {
    const containerRef = doc(db, COLLECTION_NAME, containerId)
    await updateDoc(containerRef, containerData)
  } catch (error) {
    console.error('Error updating container:', error)
    throw error
  }
}

// Toggle container active status
export const toggleContainerStatus = async (containerId: string, isActive: boolean): Promise<void> => {
  try {
    const containerRef = doc(db, COLLECTION_NAME, containerId)
    await updateDoc(containerRef, { isActive })
  } catch (error) {
    console.error('Error toggling container status:', error)
    throw error
  }
}
