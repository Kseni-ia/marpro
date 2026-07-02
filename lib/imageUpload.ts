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
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024
const MAX_MEDIA_FILES = 10
const TARGET_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024
const MAX_IMAGE_DIMENSION = 2200
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v']
const RESIZABLE_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const IMAGE_QUALITY_STEPS = [0.82, 0.74, 0.66, 0.58]

export const isVideoFile = (file: File): boolean => file.type.startsWith('video/')

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

export const uploadMedia = async (
  file: File,
  folder: string = 'references',
  onProgress?: (percent: number) => void
): Promise<string> => {
  try {
    const validation = validateMediaFile(file)
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid media file')
    }

    const isVideo = isVideoFile(file)
    // Videos are uploaded as-is; only images go through client-side optimization.
    const preparedFile = isVideo ? file : await prepareImageForUpload(file)
    const resourceType = isVideo ? 'video' : 'image'
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

    // XMLHttpRequest instead of fetch so we can report real upload progress.
    return await new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/${resourceType}/upload`
      )

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100))
        }
      }

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText)

          if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
            onProgress?.(100)
            resolve(data.secure_url as string)
            return
          }

          reject(new Error(data?.error?.message || data?.error || 'Cloudinary upload failed'))
        } catch {
          reject(new Error('Cloudinary upload failed'))
        }
      }

      xhr.onerror = () => reject(new Error('Network error during upload'))
      xhr.send(formData)
    })
  } catch (error) {
    console.error('Error uploading media:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to upload media'
    )
  }
}

export const uploadMultipleMedia = async (
  files: File[],
  folder: string = 'references',
  onProgress?: (index: number, percent: number) => void
): Promise<string[]> => {
  const uploadPromises = files.map((file, index) =>
    uploadMedia(file, folder, (percent) => onProgress?.(index, percent))
  )
  return Promise.all(uploadPromises)
}

export function validateMediaFile(file: File): { isValid: boolean; error?: string } {
  if (isVideoFile(file)) {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Nepodporovaný formát videa. Povolené formáty: MP4, WebM, MOV.'
      }
    }

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      return {
        isValid: false,
        error: 'Video je příliš velké. Maximální velikost videa je 100 MB.'
      }
    }

    return { isValid: true }
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Nepodporovaný formát souboru. Povolené formáty: JPEG, PNG, GIF, WebP nebo video MP4, WebM, MOV.'
    }
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'Soubor je příliš velký. Maximální velikost fotografie je 10 MB.'
    }
  }

  return { isValid: true }
}

export const validateMultipleMedia = (files: FileList): { isValid: boolean; error?: string } => {
  if (files.length > MAX_MEDIA_FILES) {
    return {
      isValid: false,
      error: `Maximální počet souborů je ${MAX_MEDIA_FILES}`
    }
  }

  if (files.length === 0) {
    return {
      isValid: false,
      error: 'Prosím vyberte alespoň jeden soubor'
    }
  }

  for (let i = 0; i < files.length; i++) {
    const validation = validateMediaFile(files[i])
    if (!validation.isValid) {
      return validation
    }
  }

  return { isValid: true }
}

// Backwards-compatible aliases (media = images + videos).
export const uploadImage = uploadMedia
export const uploadMultipleImages = uploadMultipleMedia
export const validateImageFile = validateMediaFile
export const validateMultipleImages = validateMultipleMedia
