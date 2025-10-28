// pages/api/book-container.ts - API endpoint for container bookings
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAvailability, createBooking } from '../../lib/calendar';
import { createOrder } from '../../lib/orders';
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from '../../lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerData, dateTime, durationHours = 1 } = req.body;
    
    // Log the incoming data for debugging
    console.log('Received container booking request:', {
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

    // Ensure service type is set to containers
    customerData.serviceType = 'containers';

    // Check availability first
    const isAvailable = await checkAvailability(dateTime, durationHours, 'containers');
    
    if (!isAvailable) {
      return res.status(409).json({ 
        error: 'This time slot is already booked. Please choose another time.' 
      });
    }

    // Create the calendar booking
    let calendarBooking: any = null;
    let calendarError: string | null = null;

    try {
      calendarBooking = await createBooking(customerData, dateTime, durationHours);
    } catch (error: any) {
      console.error('Calendar booking error:', error);
      calendarError = error.message;
      // Continue with order creation even if calendar fails
    }

    // Create the order in Firestore
    let orderId: string | null = null;
    try {
      // Convert dateTime string to Date object for orderDate
      const orderDate = new Date(dateTime);
      const formattedCustomerData = {
        ...customerData,
        orderDate: orderDate,
        calendarEventId: calendarBooking?.eventId,
        calendarEventLink: calendarBooking?.eventLink
      };
      
      console.log('Creating container order with data:', {
        ...formattedCustomerData,
        message: formattedCustomerData.message ? '...' : undefined
      });

      orderId = await createOrder(formattedCustomerData);
    } catch (error: any) {
      console.error('Container order creation error:', error);
      console.error('Error details:', error.stack);
      
      // If order creation fails but calendar was created, try to delete the calendar event
      if (calendarBooking?.eventId) {
        try {
          const { deleteBooking } = await import('../../lib/calendar');
          await deleteBooking(calendarBooking.eventId, 'containers');
        } catch (deleteError: any) {
          console.error('Failed to rollback calendar event:', deleteError);
        }
      }

      return res.status(500).json({ 
        error: 'Failed to create container order',
        details: error.message 
      });
    }

    // Send confirmation email to customer
    const emailParams = {
      customerEmail: customerData.email,
      customerName: `${customerData.firstName} ${customerData.lastName}`,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      serviceType: 'containers',
      orderDate: new Date(dateTime).toLocaleDateString('cs-CZ'),
      startTime: customerData.startTime,
      endTime: customerData.endTime,
      containerSize: customerData.containerSize,
      address: customerData.address,
      city: customerData.city,
      zipCode: customerData.zipCode,
      message: customerData.message,
    };

    // Send emails with detailed logging
    console.log('📧 Attempting to send emails...');
    console.log('Customer email:', emailParams.customerEmail);
    
    const customerEmailResult = await sendOrderConfirmationEmail(emailParams);
    if (customerEmailResult.success) {
      console.log('✅ Customer confirmation email sent successfully');
    } else {
      console.error('❌ Failed to send customer email:', customerEmailResult.error);
    }
    
    const adminEmailResult = await sendAdminNotificationEmail(emailParams);
    if (adminEmailResult.success) {
      console.log('✅ Admin notification email sent successfully');
    } else {
      console.error('❌ Failed to send admin email:', adminEmailResult.error);
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Container booking created successfully!',
      orderId: orderId,
      booking: calendarBooking,
      calendarWarning: calendarError ? `Order created but calendar sync failed: ${calendarError}` : null
    });

  } catch (error: any) {
    console.error('Container booking API error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to process container booking',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
