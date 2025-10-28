import { db } from './firebase'
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore'

export interface WorkApplication {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  serviceType: 'containers' | 'excavators' | 'constructions'
  message?: string
  status: 'new' | 'reviewed' | 'contacted' | 'archived'
  createdAt: Date
  notes?: string
}

const COLLECTION_NAME = 'workApplications'

// Get all work applications
export const getAllWorkApplications = async (): Promise<WorkApplication[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const applications: WorkApplication[] = []

    console.log(`Fetched ${querySnapshot.size} work applications from Firebase`)

    querySnapshot.forEach((doc) => {
      const data: any = doc.data()
      applications.push({
        id: doc.id,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        serviceType: data.serviceType || 'containers',
        message: data.message || '',
        status: data.status || 'new',
        createdAt: data.createdAt?.toDate() || new Date(),
        notes: data.notes || ''
      } as WorkApplication)
    })

    console.log('Processed applications:', applications)
    return applications
  } catch (error) {
    console.error('Error fetching work applications:', error)
    return []
  }
}

// Update application status
export const updateApplicationStatus = async (
  applicationId: string,
  status: WorkApplication['status']
): Promise<void> => {
  try {
    const appRef = doc(db, COLLECTION_NAME, applicationId)
    await updateDoc(appRef, { status })
  } catch (error) {
    console.error('Error updating application status:', error)
    throw error
  }
}

// Update application notes
export const updateApplicationNotes = async (
  applicationId: string,
  notes: string
): Promise<void> => {
  try {
    const appRef = doc(db, COLLECTION_NAME, applicationId)
    await updateDoc(appRef, { notes })
  } catch (error) {
    console.error('Error updating application notes:', error)
    throw error
  }
}

// Delete application
export const deleteWorkApplication = async (applicationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, applicationId))
  } catch (error) {
    console.error('Error deleting application:', error)
    throw error
  }
}
