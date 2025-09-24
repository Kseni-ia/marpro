import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, where, deleteDoc } from 'firebase/firestore'
import { db } from './firebase'
import { EquipmentBooking, EquipmentAvailability } from '@/types/order'

const EQUIPMENT_BOOKINGS_COLLECTION = 'equipmentBookings'

// Helper function to calculate end time (kept for backward compatibility)
const calculateEndTime = (startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number)
  const startMinutes = hours * 60 + minutes
  const endMinutes = startMinutes + (duration * 60)
  const endHours = Math.floor(endMinutes / 60)
  const endMins = endMinutes % 60
  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`
}

// Helper function to check if two time ranges overlap
const timeRangesOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
  
  const start1Min = toMinutes(start1)
  const end1Min = toMinutes(end1)
  const start2Min = toMinutes(start2)
  const end2Min = toMinutes(end2)
  
  return start1Min < end2Min && start2Min < end1Min
}

export async function createEquipmentBooking(
  equipmentType: 'containers' | 'excavators',
  equipmentId: string,
  orderId: string,
  date: Date,
  startTime: string,
  endTime?: string,
  endDate?: Date,
  reservationType?: 'time' | 'days' | 'weeks' | 'months'
): Promise<string> {
  try {
    let finalEndTime: string
    let finalEndDate: Date | undefined

    if (reservationType === 'time') {
      finalEndTime = endTime || calculateEndTime(startTime, 1)
      finalEndDate = undefined
    } else {
      finalEndTime = '23:59'
      const multiplier = reservationType === 'days' ? 1 : reservationType === 'weeks' ? 7 : 30
      const endDateCalc = new Date(date)
      endDateCalc.setDate(endDateCalc.getDate() + multiplier)
      finalEndDate = endDateCalc
    }
    
    const bookingData: any = {
      equipmentType,
      equipmentId,
      orderId,
      date,
      startTime,
      endTime: finalEndTime,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Only add optional fields if they have values
    if (finalEndDate) {
      bookingData.endDate = finalEndDate
    }
    if (reservationType) {
      bookingData.reservationType = reservationType
    }

    const docRef = await addDoc(collection(db, EQUIPMENT_BOOKINGS_COLLECTION), bookingData)
    return docRef.id
  } catch (error) {
    console.error('Error creating equipment booking:', error)
    throw error
  }
}

export async function checkEquipmentAvailability(
  equipmentType: 'containers' | 'excavators',
  equipmentId: string,
  date: Date,
  startTime: string,
  endTime: string
): Promise<boolean> {
  try {
    const dateStr = date.toISOString().split('T')[0]
    
    // Check both equipment bookings and orders collections
    // First check equipment bookings
    const bookingsQuery = query(
      collection(db, EQUIPMENT_BOOKINGS_COLLECTION),
      where('equipmentType', '==', equipmentType),
      where('equipmentId', '==', equipmentId),
      where('status', '==', 'active')
    )
    
    const bookingsSnapshot = await getDocs(bookingsQuery)
    const bookings = bookingsSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date)
      } as EquipmentBooking
    })
    
    // Filter bookings for the same date
    const sameDateBookings = bookings.filter(booking => {
      const bookingDateStr = booking.date.toISOString().split('T')[0]
      return bookingDateStr === dateStr
    })
    
    // Check for time conflicts in bookings
    for (const booking of sameDateBookings) {
      if (timeRangesOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
        return false // Time slot is not available
      }
    }
    
    // Also check orders collection for pending/in_progress orders
    const ordersQuery = query(
      collection(db, 'orders'),
      where('serviceType', '==', equipmentType),
      where(equipmentType === 'containers' ? 'containerType' : 'excavatorType', '==', equipmentId)
    )
    
    const ordersSnapshot = await getDocs(ordersQuery)
    const orders = ordersSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        orderDate: data.orderDate?.toDate ? data.orderDate.toDate() : new Date(data.orderDate),
        status: data.status as string,
        time: data.time as string
      }
    })
    
    // Filter orders for the same date and active status
    const activeOrders = orders.filter(order => {
      const orderDateStr = order.orderDate.toISOString().split('T')[0]
      return orderDateStr === dateStr && (order.status === 'pending' || order.status === 'in_progress')
    })
    
    // Check for time conflicts in orders (assume 1 hour duration for existing orders)
    for (const order of activeOrders) {
      const orderEndTime = calculateEndTime(order.time, 1) // Default 1 hour
      if (timeRangesOverlap(startTime, endTime, order.time, orderEndTime)) {
        return false // Time slot is not available
      }
    }
    
    return true // Time slot is available
  } catch (error) {
    console.error('Error checking equipment availability:', error)
    throw error
  }
}

export async function getEquipmentAvailability(
  equipmentType: 'containers' | 'excavators',
  equipmentId: string,
  date: Date
): Promise<EquipmentAvailability> {
  try {
    const dateStr = date.toISOString().split('T')[0]
    
    // Query existing bookings for the same equipment and date
    const q = query(
      collection(db, EQUIPMENT_BOOKINGS_COLLECTION),
      where('equipmentType', '==', equipmentType),
      where('equipmentId', '==', equipmentId),
      where('status', '==', 'active')
    )
    
    const querySnapshot = await getDocs(q)
    const bookings = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date)
      } as EquipmentBooking
    })
    
    // Filter bookings for the same date and create unavailable slots
    const unavailableSlots = bookings
      .filter(booking => {
        const bookingDateStr = booking.date.toISOString().split('T')[0]
        return bookingDateStr === dateStr
      })
      .map(booking => ({
        startTime: booking.startTime,
        endTime: booking.endTime,
        orderId: booking.orderId,
        reason: `Booked until ${booking.endTime}`
      }))
    
    return {
      equipmentType,
      equipmentId,
      date: dateStr,
      unavailableSlots
    }
  } catch (error) {
    console.error('Error getting equipment availability:', error)
    throw error
  }
}

export async function updateEquipmentBookingStatus(
  bookingId: string,
  status: EquipmentBooking['status']
): Promise<void> {
  try {
    const bookingRef = doc(db, EQUIPMENT_BOOKINGS_COLLECTION, bookingId)
    await updateDoc(bookingRef, {
      status,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating equipment booking status:', error)
    throw error
  }
}

export async function getEquipmentBookings(
  equipmentType?: 'containers' | 'excavators',
  equipmentId?: string,
  date?: Date
): Promise<EquipmentBooking[]> {
  try {
    let q = query(collection(db, EQUIPMENT_BOOKINGS_COLLECTION), orderBy('date', 'desc'))
    
    if (equipmentType) {
      q = query(q, where('equipmentType', '==', equipmentType))
    }
    
    if (equipmentId) {
      q = query(q, where('equipmentId', '==', equipmentId))
    }
    
    const querySnapshot = await getDocs(q)
    let bookings = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
      } as EquipmentBooking
    })
    
    // Filter by date if specified
    if (date) {
      const dateStr = date.toISOString().split('T')[0]
      bookings = bookings.filter(booking => {
        const bookingDateStr = booking.date.toISOString().split('T')[0]
        return bookingDateStr === dateStr
      })
    }
    
    return bookings
  } catch (error) {
    console.error('Error getting equipment bookings:', error)
    throw error
  }
}

export async function deleteEquipmentBooking(bookingId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, EQUIPMENT_BOOKINGS_COLLECTION, bookingId))
  } catch (error) {
    console.error('Error deleting equipment booking:', error)
    throw error
  }
}

// Helper function to get available time slots for a specific equipment and date
export async function getAvailableTimeSlots(
  equipmentType: 'containers' | 'excavators',
  equipmentId: string,
  date: Date
): Promise<string[]> {
  try {
    const availability = await getEquipmentAvailability(equipmentType, equipmentId, date)
    const allTimeSlots = [
      '06:00', '06:15', '06:30', '06:45',
      '07:00', '07:15', '07:30', '07:45',
      '08:00', '08:15', '08:30', '08:45',
      '09:00', '09:15', '09:30', '09:45',
      '10:00', '10:15', '10:30', '10:45',
      '11:00', '11:15', '11:30', '11:45',
      '12:00', '12:15', '12:30', '12:45',
      '13:00', '13:15', '13:30', '13:45',
      '14:00', '14:15', '14:30', '14:45',
      '15:00', '15:15', '15:30', '15:45',
      '16:00', '16:15', '16:30', '16:45',
      '17:00', '17:15', '17:30', '17:45',
      '18:00'
    ]
    
    const availableSlots: string[] = []
    
    for (const slot of allTimeSlots) {
      const endTime = calculateEndTime(slot, 1) // Default 1 hour slots
      let isAvailable = true
      
      // Check if this slot conflicts with any unavailable slots
      for (const unavailableSlot of availability.unavailableSlots) {
        if (timeRangesOverlap(slot, endTime, unavailableSlot.startTime, unavailableSlot.endTime)) {
          isAvailable = false
          break
        }
      }
      
      if (isAvailable) {
        availableSlots.push(slot)
      }
    }
    
    return availableSlots
  } catch (error) {
    console.error('Error getting available time slots:', error)
    throw error
  }
}
