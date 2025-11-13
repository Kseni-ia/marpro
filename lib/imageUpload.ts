import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export const uploadImage = async (file: File, folder: string = 'references'): Promise<string> => {
  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now()
    const filename = `${timestamp}_${file.name}`
    
    // Create storage reference
    const storageRef = ref(storage, `${folder}/${filename}`)
    
    // Upload file
    await uploadBytes(storageRef, file)
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image')
  }
}

export const uploadMultipleImages = async (files: File[], folder: string = 'references'): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImage(file, folder))
  return Promise.all(uploadPromises)
}

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Nepodporovaný formát souboru. Povolené formáty: JPEG, PNG, GIF, WebP.'
    }
  }

  // Check file size (500KB limit)
  const maxSize = 500 * 1024 // 500KB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Soubor je příliš velký. Maximální velikost souboru je 500 KB. Prosím, nahrajte menší obrázek.'
    }
  }

  return { isValid: true }
}

export const validateMultipleImages = (files: FileList): { isValid: boolean; error?: string } => {
  // Check maximum number of files (10)
  if (files.length > 10) {
    return {
      isValid: false,
      error: 'Maximální počet fotografií je 10'
    }
  }
  
  if (files.length === 0) {
    return {
      isValid: false,
      error: 'Prosím vyberte alespoň jednu fotografii'
    }
  }
  
  // Check each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      return validation
    }
  }
  
  return { isValid: true }
}
