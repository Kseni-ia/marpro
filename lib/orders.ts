import { collection, addDoc, getDocs, getDoc, doc, updateDoc, query, orderBy, where } from 'firebase/firestore'
import { db } from './firebase'
import { Order, OrderFormData } from '@/types/order'
import { createEquipmentBooking, checkEquipmentAvailability } from './equipment'

const ORDERS_COLLECTION = 'orders'

export async function createOrder(orderData: OrderFormData): Promise<string> {
  try {
    // Check equipment availability before creating order
    // Calculate default end time (1 hour after start)
    const [hours, minutes] = orderData.time.split(':').map(Number)
    const defaultEndTime = `${(hours + 1).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    if (orderData.serviceType === 'containers' && orderData.containerType) {
      const isAvailable = await checkEquipmentAvailability(
        'containers',
        orderData.containerType,
        orderData.orderDate,
        orderData.time,
        defaultEndTime
      )
      if (!isAvailable) {
        throw new Error('This time slot is already taken. Please choose a different time.')
      }
    }

    if (orderData.serviceType === 'excavators' && orderData.excavatorType) {
      const isAvailable = await checkEquipmentAvailability(
        'excavators',
        orderData.excavatorType,
        orderData.orderDate,
        orderData.time,
        defaultEndTime
      )
      if (!isAvailable) {
        throw new Error('This time slot is already taken. Please choose a different time.')
      }
    }

    // Remove undefined fields as Firebase doesn't accept them
    const cleanedData = Object.entries(orderData).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {} as any)

    // Ensure street field is populated if empty but address exists
    if (cleanedData.address && !cleanedData.street) {
      cleanedData.street = cleanedData.address
    }

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...cleanedData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Create equipment booking for containers and excavators
    if (orderData.serviceType === 'containers' && orderData.containerType) {
      await createEquipmentBooking(
        'containers',
        orderData.containerType,
        docRef.id,
        orderData.orderDate,
        orderData.time,
        defaultEndTime,
        undefined,
        'time'
      )
    }

    if (orderData.serviceType === 'excavators' && orderData.excavatorType) {
      await createEquipmentBooking(
        'excavators',
        orderData.excavatorType,
        docRef.id,
        orderData.orderDate,
        orderData.time,
        defaultEndTime,
        undefined,
        'time'
      )
    }

    return docRef.id
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        orderDate: data.orderDate?.toDate ? data.orderDate.toDate() : new Date(data.orderDate),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
      } as Order
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

export async function updateOrderStatus(
  orderId: string, 
  status: Order['status'], 
  endTime?: string,
  endDate?: Date,
  reservationType?: 'time' | 'days' | 'weeks' | 'months',
  notes?: string
): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId)
    const updateData: any = {
      status,
      updatedAt: new Date(),
      ...(notes && { notes })
    }

    // Add time-based fields when processing to in_progress
    if (status === 'in_progress') {
      if (endTime) updateData.endTime = endTime
      if (endDate) updateData.endDate = endDate
      if (reservationType) updateData.reservationType = reservationType

      // Get the order details to create equipment booking
      const orderRef = doc(db, ORDERS_COLLECTION, orderId)
      const orderDoc = await getDoc(orderRef)
      
      if (orderDoc.exists()) {
        const orderData = orderDoc.data() as Order
        
        // Create equipment booking when processing order
        if (orderData.serviceType === 'containers' && orderData.containerType) {
          await createEquipmentBooking(
            'containers',
            orderData.containerType,
            orderId,
            orderData.orderDate,
            orderData.time,
            endTime,
            endDate,
            reservationType
          )
        }
        
        if (orderData.serviceType === 'excavators' && orderData.excavatorType) {
          await createEquipmentBooking(
            'excavators',
            orderData.excavatorType,
            orderId,
            orderData.orderDate,
            orderData.time,
            endTime,
            endDate,
            reservationType
          )
        }
      }
    }

    await updateDoc(orderRef, updateData)
  } catch (error) {
    console.error('Error updating order:', error)
    throw error
  }
}

export async function getOrdersByStatus(status: Order['status']): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        orderDate: data.orderDate?.toDate ? data.orderDate.toDate() : new Date(data.orderDate),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
      } as Order
    })
  } catch (error) {
    console.error('Error fetching orders by status:', error)
    throw error
  }
}
