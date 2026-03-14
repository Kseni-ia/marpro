import crypto from 'crypto'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const DEFAULT_REFERENCE_FOLDER = 'references'
const DEFAULT_TAGS = 'references'
const SAFE_FOLDER_PATTERN = /^[a-zA-Z0-9/_-]+$/

const sanitizeFolder = (folder: unknown): string => {
  if (typeof folder !== 'string') {
    return process.env.CLOUDINARY_REFERENCE_FOLDER || DEFAULT_REFERENCE_FOLDER
  }

  const normalizedFolder = folder.trim().replace(/^\/+|\/+$/g, '')
  if (!normalizedFolder || !SAFE_FOLDER_PATTERN.test(normalizedFolder)) {
    return process.env.CLOUDINARY_REFERENCE_FOLDER || DEFAULT_REFERENCE_FOLDER
  }

  return normalizedFolder
}

const signUploadParams = (params: Record<string, string | number>, apiSecret: string) => {
  const paramsToSign = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return crypto
    .createHash('sha1')
    .update(`${paramsToSign}${apiSecret}`)
    .digest('hex')
}

export async function POST(request: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary environment variables are missing.' },
        { status: 500 }
      )
    }

    let requestedFolder: unknown
    try {
      const body = await request.json()
      requestedFolder = body?.folder
    } catch {
      requestedFolder = undefined
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const folder = sanitizeFolder(requestedFolder)
    const uploadParams = {
      folder,
      tags: DEFAULT_TAGS,
      timestamp,
      unique_filename: 'true',
      use_filename: 'true'
    }

    const signature = signUploadParams(uploadParams, apiSecret)

    return NextResponse.json({
      apiKey,
      cloudName,
      folder,
      signature,
      tags: uploadParams.tags,
      timestamp,
      uniqueFilename: uploadParams.unique_filename,
      useFilename: uploadParams.use_filename
    })
  } catch (error) {
    console.error('Error generating Cloudinary upload signature:', error)

    return NextResponse.json(
      { error: 'Failed to initialize Cloudinary upload.' },
      { status: 500 }
    )
  }
}
