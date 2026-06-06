export type ContainerImageOption = {
  id: string
  path: string
  name: string
  previewVolume: number
}

export const DEFAULT_ADMIN_CONTAINER_IMAGE = '/containerA.png'

export const CONTAINER_IMAGE_OPTIONS: ContainerImageOption[] = [
  { id: 'container-a', path: '/containerA.png', name: 'Container A', previewVolume: 5 },
  { id: 'container-small', path: '/container-small.jpeg', name: 'Small (3m³)', previewVolume: 3 },
  { id: 'container-medium', path: '/container-medium.jpeg', name: 'Medium (5m³)', previewVolume: 5 },
  { id: 'container-large', path: '/container-large.jpeg', name: 'Large (7m³)', previewVolume: 7 }
]

export const resolveContainerImage = (image?: string) => {
  if (!image) return DEFAULT_ADMIN_CONTAINER_IMAGE

  // Translate old SVG paths or options to JPEG paths
  if (image === '/container-small.svg' || image === 'container-small') {
    return '/container-small.jpeg'
  }
  if (image === '/container-medium.svg' || image === 'container-medium') {
    return '/container-medium.jpeg'
  }
  if (image === '/container-large.svg' || image === 'container-large') {
    return '/container-large.jpeg'
  }

  // General fallback for absolute paths that might still have .svg extension
  if (image.startsWith('/') && image.endsWith('.svg')) {
    return image.replace('.svg', '.jpeg')
  }

  return image.startsWith('/') ? image : DEFAULT_ADMIN_CONTAINER_IMAGE
}

export const isFramedContainerImage = (image?: string) => resolveContainerImage(image) === DEFAULT_ADMIN_CONTAINER_IMAGE
