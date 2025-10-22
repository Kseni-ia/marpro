# 📧 Quick Guide: How to Modify Email Messages

## Where to Edit Email Content

**Main File:** `/app/email-templates.ts` ⭐

This file contains all the email messages sent to customers. You can easily modify:
- Email subject lines
- Email content (text and HTML)
- Colors and styling
- Company information

## Quick Edit Examples

### 1. Change Email Subject

Find this section in `/app/email-templates.ts`:

```typescript
export function getEmailSubject(serviceType: string): string {
  switch (serviceType) {
    case 'containers':
      return 'Potvrzení objednávky kontejneru - Marpro'; // ← Edit this
    case 'excavators':
      return 'Potvrzení objednávky bagru - Marpro'; // ← Edit this
    case 'constructions':
      return 'Potvrzení objednávky stavebních prací - Marpro'; // ← Edit this
  }
}
```

### 2. Change Email Header

Find this section in the `getOrderConfirmationEmail()` function:

```typescript
<div class="header">
  <h1>✅ Děkujeme za Vaši objednávku!</h1> // ← Edit this
</div>
```

### 3. Change Greeting Message

```typescript
<h2>Vážený/á ${firstName} ${lastName},</h2> // ← Edit this

<p>Vaše objednávka byla úspěšně přijata a je v procesu zpracování.</p> // ← Edit this
```

### 4. Change Colors

Find the `<style>` section and modify colors:

```typescript
.header {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); // ← Red colors
  color: white;
}

.highlight {
  color: #dc2626; // ← Accent color
}
```

**Color Examples:**
- Blue: `#2563eb` and `#1e40af`
- Green: `#16a34a` and `#15803d`
- Orange: `#ea580c` and `#c2410c`

### 5. Change Footer Text

```typescript
<div class="footer">
  <p>Tento email byl odeslán automaticky. Prosím neodpovídejte na tuto zprávu.</p> // ← Edit this
  <p>© ${new Date().getFullYear()} Marpro. Všechna práva vyhrazena.</p> // ← Edit this
</div>
```

### 6. Add Your Logo

You can add an image to the email header:

```typescript
<div class="header">
  <img src="https://yourdomain.com/logo.png" alt="Marpro Logo" style="height: 50px; margin-bottom: 10px;">
  <h1>✅ Děkujeme za Vaši objednávku!</h1>
</div>
```

## Structure of Email Template

The email is organized into sections:

1. **Header** - Company branding and title
2. **Greeting** - Personal message to customer
3. **Details Box** - Order information (date, time, service)
4. **Message** - Confirmation text
5. **Footer** - Legal text and copyright

## What Information is Included

The email automatically includes:
- ✅ Customer name (`firstName`, `lastName`)
- 📅 Order date (`orderDate`)
- ⏰ Time slot (`startTime`, `endTime`)
- 📦 Service details (container size, excavator type, etc.)
- 📍 Delivery address (`address`, `city`, `zipCode`)
- 💬 Customer message if provided

## Tips for Editing

1. **Keep it simple** - Emails should be easy to read on mobile
2. **Test your changes** - Submit a test order to see how it looks
3. **Use inline CSS** - Email clients don't support external stylesheets
4. **Backup before major changes** - Copy the original template first

## After Making Changes

1. Save the file
2. The changes take effect immediately (no restart needed for content changes)
3. Submit a test order to see the new email

## Example: Complete Custom Email

Here's a minimal custom example you can use:

```typescript
export function getOrderConfirmationEmail(data: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
      
      <div style="background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 10px;">
        <h1 style="margin: 0;">🎉 Order Confirmed!</h1>
      </div>
      
      <div style="padding: 30px; background: #f9fafb; margin-top: 20px; border-radius: 10px;">
        <h2>Hello ${data.firstName}!</h2>
        
        <p>Thank you for your order. Here are the details:</p>
        
        <ul>
          <li><strong>Date:</strong> ${data.orderDate}</li>
          <li><strong>Time:</strong> ${data.startTime} - ${data.endTime}</li>
          <li><strong>Service:</strong> ${data.serviceType}</li>
        </ul>
        
        <p>We'll contact you soon to confirm everything!</p>
      </div>
      
      <div style="text-align: center; color: #666; padding: 20px; font-size: 14px;">
        <p>© 2025 Marpro - All rights reserved</p>
      </div>
      
    </body>
    </html>
  `;
}
```

Just replace the content in the `getOrderConfirmationEmail()` function with your custom version!

## Need Help?

See the full setup guide in `/EMAIL_SETUP.md` for more details about:
- Setting up the API key
- Testing emails
- Production deployment
- Troubleshooting
