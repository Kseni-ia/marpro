import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

export async function validateAdminPassword(password: string): Promise<boolean> {
  try {
    const settingsRef = doc(db, 'settings', 'adminAuth')
    const settingsSnap = await getDoc(settingsRef)
    
    if (settingsSnap.exists()) {
      const data = settingsSnap.data()
      return data.password === password
    }
    
    return false
  } catch (error) {
    console.error('Error validating admin password:', error)
    return false
  }
}
