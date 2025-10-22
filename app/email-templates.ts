// Email templates for customer notifications
// You can easily modify the email content here

interface OrderEmailData {
  firstName: string;
  lastName: string;
  email: string;
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
 * Get the email subject line based on service type
 */
export function getEmailSubject(serviceType: string): string {
  switch (serviceType) {
    case 'containers':
      return 'Potvrzení objednávky kontejneru - Marpro';
    case 'excavators':
      return 'Potvrzení objednávky bagru - Marpro';
    case 'constructions':
      return 'Potvrzení objednávky stavebních prací - Marpro';
    default:
      return 'Potvrzení objednávky - Marpro';
  }
}

/**
 * Get the completion email subject line based on service type
 */
export function getCompletionEmailSubject(serviceType: string): string {
  switch (serviceType) {
    case 'containers':
      return 'Objednávka kontejneru dokončena - Marpro';
    case 'excavators':
      return 'Objednávka bagru dokončena - Marpro';
    case 'constructions':
      return 'Stavební práce dokončeny - Marpro';
    default:
      return 'Objednávka dokončena - Marpro';
  }
}

/**
 * Get the HTML email template for order confirmation
 * Modify this function to change the email content
 */
export function getOrderConfirmationEmail(data: OrderEmailData): string {
  const { 
    firstName, 
    lastName, 
    serviceType, 
    orderDate, 
    startTime, 
    endTime,
    containerSize,
    excavatorType,
    constructionType,
    address,
    city,
    zipCode,
    message 
  } = data;

  // Service-specific details
  let serviceDetails = '';
  if (serviceType === 'containers' && containerSize) {
    serviceDetails = `<p><strong>Velikost kontejneru:</strong> ${containerSize}</p>`;
  } else if (serviceType === 'excavators' && excavatorType) {
    serviceDetails = `<p><strong>Typ bagru:</strong> ${excavatorType}</p>`;
  } else if (serviceType === 'constructions' && constructionType) {
    serviceDetails = `<p><strong>Typ práce:</strong> ${constructionType}</p>`;
  }

  // Location details
  let locationDetails = '';
  if (address || city || zipCode) {
    locationDetails = `
      <p><strong>Místo dodání:</strong></p>
      <p>${address || ''}</p>
      <p>${city || ''} ${zipCode || ''}</p>
    `;
  }

  // Customer message
  let customerMessage = '';
  if (message) {
    customerMessage = `
      <p><strong>Vaše zpráva:</strong></p>
      <p style="color: #666;">${message}</p>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-top: none;
        }
        .footer {
          background: #f9fafb;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 10px 10px;
          color: #6b7280;
          font-size: 14px;
        }
        .details-box {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .details-box p {
          margin: 10px 0;
        }
        .highlight {
          color: #dc2626;
          font-weight: bold;
        }
        h1 {
          margin: 0;
          font-size: 28px;
        }
        h2 {
          color: #dc2626;
          font-size: 20px;
          margin-top: 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ Děkujeme za Vaši objednávku!</h1>
      </div>
      
      <div class="content">
        <h2>Vážený/á ${firstName} ${lastName},</h2>
        
        <p>Vaše objednávka byla úspěšně přijata a je v procesu zpracování.</p>
        
        <div class="details-box">
          <h3 style="margin-top: 0;">📋 Detaily objednávky:</h3>
          
          <p><strong>Datum:</strong> ${orderDate}</p>
          ${startTime && endTime ? `<p><strong>Čas:</strong> ${startTime} - ${endTime}</p>` : ''}
          
          ${serviceDetails}
          ${locationDetails}
          ${customerMessage}
        </div>
        
        <p>Brzy Vás budeme kontaktovat pro potvrzení všech detailů.</p>
        
        <p>Pokud máte jakékoliv dotazy, neváhejte nás kontaktovat.</p>
        
        <p style="margin-top: 30px;">
          S pozdravem,<br>
          <strong class="highlight">Tým Marpro</strong>
        </p>
      </div>
      
      <div class="footer">
        <p>Tento email byl odeslán automaticky. Prosím neodpovídejte na tuto zprávu.</p>
        <p>© ${new Date().getFullYear()} Marpro. Všechna práva vyhrazena.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Get plain text version of the email (fallback)
 */
export function getOrderConfirmationText(data: OrderEmailData): string {
  const { 
    firstName, 
    lastName, 
    serviceType, 
    orderDate, 
    startTime, 
    endTime,
    containerSize,
    excavatorType,
    constructionType,
  } = data;

  let serviceDetails = '';
  if (serviceType === 'containers' && containerSize) {
    serviceDetails = `Velikost kontejneru: ${containerSize}\n`;
  } else if (serviceType === 'excavators' && excavatorType) {
    serviceDetails = `Typ bagru: ${excavatorType}\n`;
  } else if (serviceType === 'constructions' && constructionType) {
    serviceDetails = `Typ práce: ${constructionType}\n`;
  }

  return `
Děkujeme za Vaši objednávku!

Vážený/á ${firstName} ${lastName},

Vaše objednávka byla úspěšně přijata a je v procesu zpracování.

Detaily objednávky:
Datum: ${orderDate}
${startTime && endTime ? `Čas: ${startTime} - ${endTime}` : ''}
${serviceDetails}

Brzy Vás budeme kontaktovat pro potvrzení všech detailů.

S pozdravem,
Tým Marpro
  `.trim();
}

/**
 * Get the HTML email template for order completion
 * This email is sent when an order is marked as completed
 */
export function getOrderCompletionEmail(data: OrderEmailData): string {
  const { 
    firstName, 
    lastName, 
    serviceType, 
    orderDate, 
    startTime, 
    endTime,
    containerSize,
    excavatorType,
    constructionType,
    address,
    city,
    zipCode,
  } = data;

  // Service-specific details
  let serviceDetails = '';
  if (serviceType === 'containers' && containerSize) {
    serviceDetails = `<p><strong>Velikost kontejneru:</strong> ${containerSize}</p>`;
  } else if (serviceType === 'excavators' && excavatorType) {
    serviceDetails = `<p><strong>Typ bagru:</strong> ${excavatorType}</p>`;
  } else if (serviceType === 'constructions' && constructionType) {
    serviceDetails = `<p><strong>Typ práce:</strong> ${constructionType}</p>`;
  }

  // Location details
  let locationDetails = '';
  if (address || city || zipCode) {
    locationDetails = `
      <p><strong>Místo dodání:</strong></p>
      <p>${address || ''}</p>
      <p>${city || ''} ${zipCode || ''}</p>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-top: none;
        }
        .footer {
          background: #f9fafb;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 10px 10px;
          color: #6b7280;
          font-size: 14px;
        }
        .details-box {
          background: #f0fdf4;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #16a34a;
        }
        .details-box p {
          margin: 10px 0;
        }
        .highlight {
          color: #16a34a;
          font-weight: bold;
        }
        h1 {
          margin: 0;
          font-size: 28px;
        }
        h2 {
          color: #16a34a;
          font-size: 20px;
          margin-top: 0;
        }
        .success-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="success-icon">✅</div>
        <h1>Objednávka dokončena!</h1>
      </div>
      
      <div class="content">
        <h2>Vážený/á ${firstName} ${lastName},</h2>
        
        <p>Rádi bychom Vás informovali, že Vaše objednávka byla <strong class="highlight">úspěšně dokončena</strong>.</p>
        
        <div class="details-box">
          <h3 style="margin-top: 0; color: #16a34a;">📋 Dokončená objednávka:</h3>
          
          <p><strong>Datum:</strong> ${orderDate}</p>
          ${startTime && endTime ? `<p><strong>Čas:</strong> ${startTime} - ${endTime}</p>` : ''}
          
          ${serviceDetails}
          ${locationDetails}
        </div>
        
        <p>Děkujeme, že jste využili naše služby. Doufáme, že jste byli spokojeni s naší prací.</p>
        
        <p>Pokud máte jakékoliv dotazy nebo připomínky, neváhejte nás kontaktovat.</p>
        
        <p style="margin-top: 30px;">
          S pozdravem,<br>
          <strong class="highlight">Tým Marpro</strong>
        </p>
      </div>
      
      <div class="footer">
        <p>Těšíme se na další spolupráci!</p>
        <p>© ${new Date().getFullYear()} Marpro. Všechna práva vyhrazena.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Get plain text version of the completion email (fallback)
 */
export function getOrderCompletionText(data: OrderEmailData): string {
  const { 
    firstName, 
    lastName, 
    orderDate, 
    startTime, 
    endTime,
    containerSize,
    excavatorType,
    constructionType,
  } = data;

  let serviceDetails = '';
  if (containerSize) {
    serviceDetails = `Velikost kontejneru: ${containerSize}\n`;
  } else if (excavatorType) {
    serviceDetails = `Typ bagru: ${excavatorType}\n`;
  } else if (constructionType) {
    serviceDetails = `Typ práce: ${constructionType}\n`;
  }

  return `
Objednávka dokončena!

Vážený/á ${firstName} ${lastName},

Rádi bychom Vás informovali, že Vaše objednávka byla úspěšně dokončena.

Dokončená objednávka:
Datum: ${orderDate}
${startTime && endTime ? `Čas: ${startTime} - ${endTime}` : ''}
${serviceDetails}

Děkujeme, že jste využili naše služby. Doufáme, že jste byli spokojeni s naší prací.

S pozdravem,
Tým Marpro
  `.trim();
}
