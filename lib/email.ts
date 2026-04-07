// Email utility functions using Resend
import { Resend } from 'resend';
import { 
  getEmailSubject, 
  getOrderConfirmationEmail, 
  getOrderConfirmationText,
  getCompletionEmailSubject,
  getOrderCompletionEmail,
  getOrderCompletionText
} from '@/app/email-templates';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable');
  }

  return new Resend(apiKey);
}

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL || 'Marpro <noreply@marpro-stav.cz>';
}

function getAdminFromAddress() {
  return process.env.RESEND_ADMIN_FROM_EMAIL || 'Marpro Orders <orders@marpro-stav.cz>';
}

interface SendOrderConfirmationParams {
  customerEmail: string;
  customerName: string;
  firstName: string;
  lastName: string;
  serviceType: string;
  orderDate: string;
  startTime?: string;
  endTime?: string;
  containerSize?: string;
  excavatorType?: string;
  constructionType?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  message?: string;
}

/**
 * Send order confirmation email to customer
 * @param params Customer and order details
 * @returns Promise with email send result
 */
export async function sendOrderConfirmationEmail(params: SendOrderConfirmationParams) {
  try {
    const resend = getResendClient();
    const emailData = {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.customerEmail,
      serviceType: params.serviceType,
      orderDate: params.orderDate,
      startTime: params.startTime,
      endTime: params.endTime,
      containerSize: params.containerSize,
      excavatorType: params.excavatorType,
      constructionType: params.constructionType,
      address: params.address,
      city: params.city,
      zipCode: params.zipCode,
      message: params.message,
    };

    const subject = getEmailSubject(params.serviceType);
    const htmlContent = getOrderConfirmationEmail(emailData);
    const textContent = getOrderConfirmationText(emailData);

    console.log(`Sending confirmation email to: ${params.customerEmail}`);

    const result = await resend.emails.send({
      from: getFromAddress(),
      to: params.customerEmail,
      subject: subject,
      html: htmlContent,
      text: textContent,
    });

    // Check if Resend returned an error
    if (result.error) {
      console.error('❌ Resend API Error:', result.error);
      return { success: false, error: result.error };
    }

    console.log('✅ Email sent successfully:', result.data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    // Don't throw error - we don't want email failure to break order creation
    return { success: false, error: error };
  }
}

/**
 * Send notification email to admin about new order
 * @param params Order details
 * @returns Promise with email send result
 */
export async function sendAdminNotificationEmail(params: SendOrderConfirmationParams) {
  try {
    const resend = getResendClient();
    const adminEmail = process.env.ADMIN_EMAIL || 'marprostav@outlook.cz';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #dc2626; color: white; padding: 20px; }
          .content { padding: 20px; }
          .details { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔔 Nová objednávka!</h1>
        </div>
        <div class="content">
          <h2>Detaily objednávky:</h2>
          <div class="details">
            <p><strong>Zákazník:</strong> ${params.firstName} ${params.lastName}</p>
            <p><strong>Email:</strong> ${params.customerEmail}</p>
            <p><strong>Služba:</strong> ${params.serviceType}</p>
            <p><strong>Datum:</strong> ${params.orderDate}</p>
            ${params.startTime ? `<p><strong>Čas:</strong> ${params.startTime} - ${params.endTime}</p>` : ''}
            ${params.containerSize ? `<p><strong>Kontejner:</strong> ${params.containerSize}</p>` : ''}
            ${params.excavatorType ? `<p><strong>Bagr:</strong> ${params.excavatorType}</p>` : ''}
            ${params.address ? `<p><strong>Adresa:</strong> ${params.address}, ${params.city} ${params.zipCode}</p>` : ''}
            ${params.message ? `<p><strong>Zpráva:</strong> ${params.message}</p>` : ''}
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: getAdminFromAddress(),
      to: adminEmail,
      subject: `Nová objednávka - ${params.serviceType}`,
      html: htmlContent,
    });

    // Check if Resend returned an error
    if (result.error) {
      console.error('❌ Resend API Error:', result.error);
      return { success: false, error: result.error };
    }

    console.log('✅ Admin notification sent successfully:', result.data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return { success: false, error: error };
  }
}

/**
 * Send order completion email to customer
 * Call this function when marking an order as completed in admin dashboard
 * @param params Customer and order details
 * @returns Promise with email send result
 */
export async function sendOrderCompletionEmail(params: SendOrderConfirmationParams) {
  try {
    const resend = getResendClient();
    const emailData = {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.customerEmail,
      serviceType: params.serviceType,
      orderDate: params.orderDate,
      startTime: params.startTime,
      endTime: params.endTime,
      containerSize: params.containerSize,
      excavatorType: params.excavatorType,
      constructionType: params.constructionType,
      address: params.address,
      city: params.city,
      zipCode: params.zipCode,
      message: params.message,
    };

    const subject = getCompletionEmailSubject(params.serviceType);
    const htmlContent = getOrderCompletionEmail(emailData);
    const textContent = getOrderCompletionText(emailData);

    console.log(`Sending completion email to: ${params.customerEmail}`);

    const result = await resend.emails.send({
      from: getFromAddress(),
      to: params.customerEmail,
      subject: subject,
      html: htmlContent,
      text: textContent,
    });

    // Check if Resend returned an error
    if (result.error) {
      console.error('❌ Resend API Error:', result.error);
      return { success: false, error: result.error };
    }

    console.log('✅ Completion email sent successfully:', result.data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send completion email:', error);
    return { success: false, error: error };
  }
}
