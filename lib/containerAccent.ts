export type ContainerAccent = {
  primary: string
  text: string
  tint: string
  tintStrong: string
  border: string
  borderStrong: string
}

const GLASS: ContainerAccent = {
  primary: '#ffffff',
  text: '#ffffff', // Keeping white for text
  tint: 'rgba(255, 255, 255, 0.03)', // Subtle transparent white for glass background
  tintStrong: 'rgba(255, 255, 255, 0.08)', // Thicker glass tint
  border: 'rgba(255, 255, 255, 0.1)', // Border for glassmorphism
  borderStrong: 'rgba(255, 255, 255, 0.2)', // Stronger border on hover or active
}

export const getContainerAccent = (volume: number): ContainerAccent => {
  return GLASS
}
