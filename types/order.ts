export interface Order {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  street?: string
  city?: string
  zip?: string
  country?: string
  lat?: number
  lng?: number
  serviceType: 'containers' | 'excavators' | 'constructions'
  containerType?: string // e.g., '3m³', '5m³'
  excavatorType?: string
  constructionType?: string
  orderDate: Date
  time: string
  endTime?: string // End time for time-based reservations
  endDate?: Date // End date for multi-day reservations
  reservationType?: 'time' | 'days' | 'weeks' | 'months'
  message?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  notes?: string
}

export interface OrderFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  street?: string
  city?: string
  zip?: string
  country?: string
  lat?: number
  lng?: number
  serviceType: 'containers' | 'excavators' | 'constructions'
  containerType?: string
  excavatorType?: string
  constructionType?: string
  orderDate: Date
  time: string
  endTime?: string
  message?: string
}

export interface EquipmentBooking {
  id: string
  equipmentType: 'containers' | 'excavators'
  equipmentId: string // e.g., '3m³', '5m³', 'TB145', 'TB290'
  orderId: string
  date: Date
  startTime: string // e.g., '09:00'
  endTime: string // actual end time
  endDate?: Date // for multi-day reservations
  reservationType?: 'time' | 'days' | 'weeks' | 'months'
  status: 'active' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  notes?: string
}

export interface EquipmentAvailability {
  equipmentType: 'containers' | 'excavators'
  equipmentId: string
  date: string // YYYY-MM-DD format
  unavailableSlots: {
    startTime: string
    endTime: string
    orderId: string
    reason?: string
  }[]
}
