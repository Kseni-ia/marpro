const CLOUDINARY_UPLOAD_SEGMENT = '/image/upload/'
const VERSION_SEGMENT_PATTERN = /^v\d+\//
const DEFAULT_WATERMARK_GRAVITY = 'south_east'
const DEFAULT_WATERMARK_OFFSET = 24
const DEFAULT_WATERMARK_OPACITY = 45
const DEFAULT_WATERMARK_WIDTH_RATIO = 0.18
const ALLOWED_GRAVITIES = new Set([
  'north',
  'north_east',
  'north_west',
  'south',
  'south_east',
  'south_west',
  'east',
  'west',
  'center'
])

const sanitizeOverlayPublicId = (publicId: string) =>
  publicId.trim().replace(/^\/+|\/+$/g, '').replace(/\//g, ':')

const getIntegerEnv = (value: string | undefined, fallback: number) => {
  const parsedValue = Number.parseInt(value || '', 10)
  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

const getWidthRatio = () => {
  const rawRatio = Number.parseFloat(process.env.NEXT_PUBLIC_CLOUDINARY_WATERMARK_WIDTH_RATIO || '')

  if (!Number.isFinite(rawRatio) || rawRatio <= 0 || rawRatio >= 1) {
    return DEFAULT_WATERMARK_WIDTH_RATIO.toString()
  }

  return rawRatio.toString()
}

const getGravity = () => {
  const gravity = process.env.NEXT_PUBLIC_CLOUDINARY_WATERMARK_GRAVITY || DEFAULT_WATERMARK_GRAVITY
  return ALLOWED_GRAVITIES.has(gravity) ? gravity : DEFAULT_WATERMARK_GRAVITY
}

const buildReferenceTransformations = () => {
  const baseTransformations = ['f_auto', 'q_auto', 'e_auto_enhance']
  const watermarkPublicId = process.env.NEXT_PUBLIC_CLOUDINARY_WATERMARK_PUBLIC_ID?.trim()

  if (!watermarkPublicId) {
    return baseTransformations.join(',')
  }

  const overlayTransforms = [
    `l_${sanitizeOverlayPublicId(watermarkPublicId)}`,
    `c_scale,w_${getWidthRatio()},fl_relative,o_${getIntegerEnv(process.env.NEXT_PUBLIC_CLOUDINARY_WATERMARK_OPACITY, DEFAULT_WATERMARK_OPACITY)}`,
    `fl_layer_apply,g_${getGravity()},x_${getIntegerEnv(process.env.NEXT_PUBLIC_CLOUDINARY_WATERMARK_OFFSET_X, DEFAULT_WATERMARK_OFFSET)},y_${getIntegerEnv(process.env.NEXT_PUBLIC_CLOUDINARY_WATERMARK_OFFSET_Y, DEFAULT_WATERMARK_OFFSET)}`
  ]

  return `${baseTransformations.join(',')}/${overlayTransforms.join('/')}`
}

export const getReferenceImageUrl = (sourceUrl?: string | null) => {
  if (!sourceUrl || !sourceUrl.includes('res.cloudinary.com') || !sourceUrl.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return sourceUrl || '/placeholder-image.jpg'
  }

  const [prefix, suffix] = sourceUrl.split(CLOUDINARY_UPLOAD_SEGMENT)
  if (!suffix) {
    return sourceUrl
  }

  const [pathPart, queryString] = suffix.split('?')
  const normalizedPath = pathPart.replace(/^\/+/, '')

  if (!VERSION_SEGMENT_PATTERN.test(normalizedPath)) {
    return sourceUrl
  }

  const transformedUrl = `${prefix}${CLOUDINARY_UPLOAD_SEGMENT}${buildReferenceTransformations()}/${normalizedPath}`

  return queryString ? `${transformedUrl}?${queryString}` : transformedUrl
}
