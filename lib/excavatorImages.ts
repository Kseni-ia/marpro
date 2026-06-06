export type ExcavatorImageOption = {
  path: string
  name: string
  type: string
}

export const DEFAULT_ADMIN_EXCAVATOR_IMAGE = '/tb145.jpeg'

export const EXCAVATOR_IMAGE_OPTIONS: ExcavatorImageOption[] = [
  { path: '/tb145.jpeg', name: 'TB145', type: 'mini' },
  { path: '/tb210r.jpeg', name: 'TB210R (Micro)', type: 'mini' },
  { path: '/tb290-1.jpeg', name: 'TB290-1', type: 'standard' },
  { path: '/tb290-2.jpeg', name: 'TB290-2', type: 'standard' },
  { path: '/tb370.jpeg', name: 'TB370 (Large)', type: 'large' },
]

export const resolveExcavatorImage = (path?: string) => {
  if (!path) return DEFAULT_ADMIN_EXCAVATOR_IMAGE

  // Translate legacy SVG paths to the new optimized JPEGs
  if (path === '/TB145.svg' || path === '/tb145.svg') {
    return '/tb145.jpeg'
  }
  if (path === '/TB290-1.svg' || path === '/tb290-1.svg') {
    return '/tb290-1.jpeg'
  }
  if (path === '/TB290-2.svg.svg' || path === '/TB290-2.svg' || path === '/tb290-2.svg') {
    return '/tb290-2.jpeg'
  }

  // General fallback for absolute paths that might still have .svg extension
  if (path.startsWith('/') && path.endsWith('.svg')) {
    return path.replace('.svg', '.jpeg')
  }

  return path.startsWith('/') ? path : DEFAULT_ADMIN_EXCAVATOR_IMAGE
}
