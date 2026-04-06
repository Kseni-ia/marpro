interface CloudinarySignaturePayload {
  apiKey: string
  cloudName: string
  folder: string
  signature: string
  tags: string
  timestamp: number
  uniqueFilename: string
  useFilename: string
}

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const TARGET_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024
const MAX_IMAGE_DIMENSION = 2200
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const RESIZABLE_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const IMAGE_QUALITY_STEPS = [0.82, 0.74, 0.66, 0.58]

const getSignaturePayload = async (folder: string): Promise<CloudinarySignaturePayload> => {
  const response = await fetch('/api/cloudinary/reference-signature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ folder })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to initialize Cloudinary upload')
  }

  return data as CloudinarySignaturePayload
}

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> =>
  new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })

const getOptimizedFileName = (originalName: string, mimeType: string) => {
  const extension = mimeType === 'image/jpeg' ? '.jpg' : '.webp'
  const sanitizedName = originalName.replace(/\.[^.]+$/, '') || 'reference-image'

  return `${sanitizedName}${extension}`
}

const loadImageElement = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new window.Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image for upload optimization'))
    }

    image.src = objectUrl
  })

const prepareImageForUpload = async (file: File): Promise<File> => {
  if (typeof window === 'undefined' || !RESIZABLE_IMAGE_TYPES.has(file.type)) {
    return file
  }

  try {
    const image = await loadImageElement(file)
    const longestSide = Math.max(image.naturalWidth, image.naturalHeight)
    const resizeRatio = longestSide > MAX_IMAGE_DIMENSION ? MAX_IMAGE_DIMENSION / longestSide : 1

    if (resizeRatio === 1 && file.size <= TARGET_UPLOAD_SIZE_BYTES) {
      return file
    }

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.naturalWidth * resizeRatio))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * resizeRatio))

    const context = canvas.getContext('2d')
    if (!context) {
      return file
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    let optimizedBlob: Blob | null = null

    for (const mimeType of ['image/webp', 'image/jpeg']) {
      for (const quality of IMAGE_QUALITY_STEPS) {
        const candidateBlob = await canvasToBlob(canvas, mimeType, quality)
        if (!candidateBlob) {
          continue
        }

        optimizedBlob = candidateBlob

        if (candidateBlob.size <= TARGET_UPLOAD_SIZE_BYTES) {
          break
        }
      }

      if (optimizedBlob && optimizedBlob.size <= TARGET_UPLOAD_SIZE_BYTES) {
        break
      }
    }

    if (!optimizedBlob) {
      return file
    }

    const resizedDimensions = resizeRatio < 1
    if (!resizedDimensions && optimizedBlob.size >= file.size) {
      return file
    }

    return new File(
      [optimizedBlob],
      getOptimizedFileName(file.name, optimizedBlob.type),
      {
        type: optimizedBlob.type,
        lastModified: file.lastModified,
      }
    )
  } catch (error) {
    console.warn('Failed to optimize image before upload, using original file instead.', error)
    return file
  }
}

export const uploadImage = async (file: File, folder: string = 'references'): Promise<string> => {
  try {
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid image file')
    }

    const preparedFile = await prepareImageForUpload(file)
    const signaturePayload = await getSignaturePayload(folder)
    const formData = new FormData()

    formData.append('file', preparedFile)
    formData.append('api_key', signaturePayload.apiKey)
    formData.append('folder', signaturePayload.folder)
    formData.append('signature', signaturePayload.signature)
    formData.append('tags', signaturePayload.tags)
    formData.append('timestamp', signaturePayload.timestamp.toString())
    formData.append('unique_filename', signaturePayload.uniqueFilename)
    formData.append('use_filename', signaturePayload.useFilename)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.error?.message || data?.error || 'Cloudinary upload failed')
    }

    if (!data.secure_url) {
      throw new Error('Cloudinary did not return an image URL')
    }

    return data.secure_url as string
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to upload image'
    )
  }
}

export const uploadMultipleImages = async (files: File[], folder: string = 'references'): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImage(file, folder))
  return Promise.all(uploadPromises)
}

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Nepodporovaný formát souboru. Povolené formáty: JPEG, PNG, GIF, WebP.'
    }
  }

  // Check file size (10MB limit)
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'Soubor je příliš velký. Maximální velikost souboru je 10 MB.'
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
