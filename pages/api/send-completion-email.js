// pages/api/send-completion-email.js - API endpoint to send order completion emails
import { sendOrderCompletionEmail } from '../../lib/email';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body;

    console.log('📧 Sending completion email for order:', orderId);

    if (!orderId) {
      return res.status(400).json({ 
        error: 'Order ID is required' 
      });
    }

    // Fetch order details from Firestore
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return res.status(404).json({ 
        error: 'Order not found' 
      });
    }

    const orderData = orderDoc.data();
    console.log('Found order:', { 
      id: orderId, 
      customer: `${orderData.firstName} ${orderData.lastName}`,
      email: orderData.email 
    });

    // Prepare email parameters
    const emailParams = {
      customerEmail: orderData.email,
      customerName: `${orderData.firstName} ${orderData.lastName}`,
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      serviceType: orderData.serviceType,
      orderDate: orderData.orderDate?.toDate ? 
        orderData.orderDate.toDate().toLocaleDateString('cs-CZ') : 
        new Date(orderData.orderDate).toLocaleDateString('cs-CZ'),
      startTime: orderData.startTime,
      endTime: orderData.endTime,
      containerSize: orderData.containerSize,
      excavatorType: orderData.excavatorType,
      constructionType: orderData.constructionType,
      address: orderData.address,
      city: orderData.city,
      zipCode: orderData.zipCode,
      message: orderData.message,
    };

    // Send completion email
    console.log('📧 Sending email to:', emailParams.customerEmail);
    const result = await sendOrderCompletionEmail(emailParams);

    if (result.success) {
      console.log('✅ Completion email sent successfully');
      return res.status(200).json({
        success: true,
        message: 'Completion email sent successfully',
        data: result.data
      });
    } else {
      console.error('❌ Failed to send completion email:', result.error);
      return res.status(500).json({
        success: false,
        error: 'Failed to send completion email',
        details: result.error?.message || 'Unknown error'
      });
    }

  } catch (error) {
    console.error('❌ Error in completion email API:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: 'Failed to send completion email',
      details: error.message 
    });
  }
}
