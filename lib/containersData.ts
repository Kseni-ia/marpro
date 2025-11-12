export interface ContainerData {
  id: string
  volume: number
  dims: string
  description: {
    en: string
    cs: string
    ru: string
  }
  price: number // in CZK per hour
  isActive: boolean
}

// This is the centralized container data
// Changes here will reflect on both the main website and admin panel
export const containersData: ContainerData[] = [
  {
    id: 'container-3m3',
    volume: 3,
    dims: '2 x 0.5 x 3.8 m',
    description: {
      en: 'Perfect for small renovations and household waste',
      cs: 'Ideální pro malé rekonstrukce a domovní odpad',
      ru: 'Идеально подходит для небольших ремонтов и бытовых отходов'
    },
    price: 386,
    isActive: true
  },
  {
    id: 'container-5m3',
    volume: 5,
    dims: '3 x 1.5 x 2 m',
    description: {
      en: 'Ideal for medium-sized projects and garden waste',
      cs: 'Ideální pro středně velké projekty a zahradní odpad',
      ru: 'Идеально подходит для проектов среднего размера и садовых отходов'
    },
    price: 454,
    isActive: true
  },
  {
    id: 'container-7m3',
    volume: 7,
    dims: '3.5 x 1.5 x 2 m',
    description: {
      en: 'Great for larger renovations and construction debris',
      cs: 'Skvělé pro větší rekonstrukce a stavební suť',
      ru: 'Отлично подходит для крупных ремонтов и строительного мусора'
    },
    price: 541,
    isActive: true
  },
  {
    id: 'container-9m3',
    volume: 9,
    dims: '3.5 x 1.8 x 2.2 m',
    description: {
      en: 'Perfect for large-scale projects and heavy materials',
      cs: 'Perfektní pro rozsáhlé projekty a těžké materiály',
      ru: 'Идеально подходит для крупномасштабных проектов и тяжелых материалов'
    },
    price: 750,
    isActive: true
  }
]

// Helper function to get active containers only
export const getActiveContainers = (): ContainerData[] => {
  return containersData.filter(container => container.isActive)
}

// Helper function to get container by ID
export const getContainerById = (id: string): ContainerData | undefined => {
  return containersData.find(container => container.id === id)
}
