// pages/api/book-with-calendar.js - API endpoint for booking with calendar integration
import { checkAvailability, createBooking } from '../../lib/calendar';
import { createOrder } from '../../lib/orders';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerData, dateTime, durationHours = 1 } = req.body;
    
    // Log the incoming data for debugging
    console.log('Received booking request:', {
      customerData: customerData ? { ...customerData, message: customerData.message ? '...' : undefined } : null,
      dateTime,
      durationHours
    });

    // Validate required fields
    if (!customerData?.firstName || !customerData?.lastName || !customerData?.email || !dateTime) {
      return res.status(400).json({ 
        error: 'Customer first name, last name, email, and date/time are required' 
      });
    }

    // Check availability first
    const isAvailable = await checkAvailability(dateTime, durationHours, customerData.serviceType);
    
    if (!isAvailable) {
      return res.status(409).json({ 
        error: 'This time slot is already booked. Please choose another time.' 
      });
    }

    // Create the calendar booking
    let calendarBooking = null;
    let calendarError = null;

    try {
      calendarBooking = await createBooking(customerData, dateTime, durationHours);
    } catch (error) {
      console.error('Calendar booking error:', error);
      calendarError = error.message;
      // Continue with order creation even if calendar fails
    }

    // Create the order in Firestore
    let orderId = null;
    try {
      // Convert dateTime string to Date object for orderDate
      const orderDate = new Date(dateTime);
      const formattedCustomerData = {
        ...customerData,
        orderDate: orderDate,
        calendarEventId: calendarBooking?.eventId,
        calendarEventLink: calendarBooking?.eventLink
      };
      
      console.log('Creating order with data:', {
        ...formattedCustomerData,
        message: formattedCustomerData.message ? '...' : undefined
      });

      orderId = await createOrder(formattedCustomerData);
    } catch (error) {
      console.error('Order creation error:', error);
      console.error('Error details:', error.stack);
      
      // If order creation fails but calendar was created, try to delete the calendar event
      if (calendarBooking?.eventId) {
        try {
          const { deleteBooking } = await import('../../lib/calendar');
          await deleteBooking(calendarBooking.eventId, customerData.serviceType);
        } catch (deleteError) {
          console.error('Failed to rollback calendar event:', deleteError);
        }
      }

      return res.status(500).json({ 
        error: 'Failed to create order',
        details: error.message 
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Booking created successfully!',
      orderId: orderId,
      booking: calendarBooking,
      calendarWarning: calendarError ? `Order created but calendar sync failed: ${calendarError}` : null
    });

  } catch (error) {
    console.error('Booking API error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to process booking',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
