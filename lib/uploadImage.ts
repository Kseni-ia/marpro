import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

/**
 * Upload an image to Firebase Storage
 * @param file - The image file to upload
 * @param folder - The folder path in storage (e.g., 'excavators')
 * @returns The download URL of the uploaded image
 */
export const uploadImage = async (file: File, folder: string = 'excavators'): Promise<string> => {
  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
    const storageRef = ref(storage, `${folder}/${fileName}`)

    // Upload file with metadata to help with CORS
    const metadata = {
      contentType: file.type,
      cacheControl: 'public,max-age=31536000'
    }

    const snapshot = await uploadBytes(storageRef, file, metadata)
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    
    // Check for CORS error
    if (error instanceof Error && error.message.includes('CORS')) {
      throw new Error('CORS error: Firebase Storage security rules need to be configured. Please run: firebase deploy --only storage')
    }
    
    // Check for auth error
    if (error instanceof Error && error.message.includes('unauthorized')) {
      throw new Error('Authentication error: Please check Firebase configuration')
    }
    
    throw new Error('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

/**
 * Delete an image from Firebase Storage using its URL
 * @param imageUrl - The full download URL of the image
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const urlParts = imageUrl.split('/o/')
    if (urlParts.length < 2) {
      throw new Error('Invalid image URL')
    }
    
    const pathWithParams = urlParts[1]
    const path = decodeURIComponent(pathWithParams.split('?')[0])
    
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Error deleting image:', error)
    // Don't throw error - image might already be deleted
  }
}

/**
 * Validate image file
 * @param file - The file to validate
 * @returns true if valid, throws error if invalid
 */
export const validateImageFile = (file: File): boolean => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPG, PNG, or WebP images.')
  }
  
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.')
  }
  
  return true
}
