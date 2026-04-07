export type ContainerImageOption = {
  id: string
  path: string
  name: string
  previewVolume: number
}

export const DEFAULT_ADMIN_CONTAINER_IMAGE = '/containerA.png'

export const CONTAINER_IMAGE_OPTIONS: ContainerImageOption[] = [
  { id: 'container-a', path: '/containerA.png', name: 'Container A', previewVolume: 5 },
  { id: 'container-small', path: '/container-small.svg', name: 'Small (3m³)', previewVolume: 3 },
  { id: 'container-medium', path: '/container-medium.svg', name: 'Medium (5m³)', previewVolume: 5 },
  { id: 'container-large', path: '/container-large.svg', name: 'Large (7m³)', previewVolume: 7 }
]

export const resolveContainerImage = (image?: string) => (
  image && image.startsWith('/') ? image : DEFAULT_ADMIN_CONTAINER_IMAGE
)

export const isFramedContainerImage = (image?: string) => resolveContainerImage(image) === DEFAULT_ADMIN_CONTAINER_IMAGE
