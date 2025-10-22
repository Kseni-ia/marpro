# Email Notification Setup Guide

## Overview
Your Marpro website now automatically sends confirmation emails to customers when they submit an order. The system uses Resend API for reliable email delivery.

## Files Created

### 1. `/app/email-templates.ts` ⭐ **EDIT THIS FILE TO MODIFY EMAIL CONTENT**
This is the main file where you can easily modify the email messages sent to customers.

**What you can modify:**
- Email subject lines (Czech and English)
- Email HTML content and styling
- Email text content (fallback)
- Company information and branding

**Functions:**
- `getEmailSubject()` - Change the subject line for each service type
- `getOrderConfirmationEmail()` - Modify the HTML email template
- `getOrderConfirmationText()` - Modify the plain text version

### 2. `/lib/email.ts`
Handles the email sending logic using Resend. You generally don't need to modify this file unless you want to change the sender email or add new email types.

### 3. Updated API Endpoints
The following files now send automatic emails after successful bookings:
- `/pages/api/book-container.js`
- `/pages/api/book-excavator.js`
- `/pages/api/book-construction.js`

## Setup Instructions

### Step 1: Add API Key to Environment Variables

1. Copy the example file to create your environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. The `.env.local` file should contain:
   ```
   RESEND_API_KEY=re_hyX2nnNG_LrFbxyQQVwftkMnsmCPSJJJE
   ADMIN_EMAIL=sergeevnakseniia9@gmail.com
   ```

### Step 2: Restart Your Development Server

After adding the environment variables, restart your dev server:
```bash
npm run dev
```

## How It Works

### Order Confirmation (Automatic)
1. **Customer submits order** → Order form on website
2. **Order is created** → Saved to database and Google Calendar
3. **Emails sent automatically** → Two emails:
   - ✅ Confirmation email to customer
   - 📧 Notification email to admin (you)

### Order Completion (Manual/Automatic)
1. **You mark order as completed** → In admin dashboard
2. **Completion email sent** → Green-themed success email
3. **Customer receives confirmation** → Work is done, thank you message

## Customizing Email Content

### Change the Email Subject
Open `/app/email-templates.ts` and find the `getEmailSubject()` function:

```typescript
export function getEmailSubject(serviceType: string): string {
  switch (serviceType) {
    case 'containers':
      return 'Your Custom Subject - Containers'; // Change this
    case 'excavators':
      return 'Your Custom Subject - Excavators'; // Change this
    case 'constructions':
      return 'Your Custom Subject - Constructions'; // Change this
  }
}
```

### Change the Email Content
Find the `getOrderConfirmationEmail()` function in the same file and modify the HTML template:

```typescript
return `
  <!DOCTYPE html>
  <html>
  <body>
    <h1>Your Custom Message Here</h1>
    <p>Dear ${firstName} ${lastName},</p>
    <!-- Modify the content here -->
  </body>
  </html>
`;
```

### Change Email Styling
The email template includes inline CSS that you can modify:
- Colors (currently using red theme: `#dc2626`, `#991b1b`)
- Fonts
- Layout and spacing
- Company branding

## Testing Emails

### Using Resend Development Mode
Resend provides a test mode where emails are sent but not delivered to real inboxes. This is useful for testing.

1. Go to [Resend Dashboard](https://resend.com/emails)
2. View sent emails
3. Check email content and formatting

### Test with Your Own Email
Change the customer email when testing orders to see how emails look in a real inbox.

## Production Setup

### Get Your Own Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Update the `RESEND_API_KEY` in `.env.local`

### Verify Your Domain (Optional but Recommended)
For production, verify your domain with Resend to:
- Use your own email address (e.g., orders@marpro.cz)
- Improve email deliverability
- Remove "via resend.dev" from emails

1. Go to Resend Dashboard → Domains
2. Add your domain
3. Add DNS records to your domain
4. Update the `from` email in `/lib/email.ts`:
   ```typescript
   from: 'Marpro <orders@yourdomain.com>'
   ```

## Email Features

### Customer Confirmation Email Includes:
- ✅ Order confirmation message
- 📋 Full order details
- 📅 Date and time
- 📍 Delivery address
- 💬 Customer's message
- 🏢 Company branding

### Admin Notification Email Includes:
- 🔔 New order alert
- 👤 Customer information
- 📋 Complete order details
- 📧 Customer email for quick reply

## Troubleshooting

### Emails Not Sending?
1. Check that `.env.local` exists and contains the API key
2. Restart your dev server after adding environment variables
3. Check browser console and server logs for errors
4. Verify API key is correct in Resend dashboard

### Email Goes to Spam?
- Verify your domain with Resend
- Use a professional email address
- Avoid spam trigger words in subject/content

### Want to Change the Sender Email?
Edit `/lib/email.ts` and change the `from` field:
```typescript
from: 'Your Company <your-email@yourdomain.com>'
```

## Order Completion Emails

### Sending Completion Emails

When you mark an order as "completed" in your admin dashboard, you can send a completion email to the customer.

**API Endpoint:** `/api/send-completion-email`

**Example Usage:**
```javascript
// Call from admin dashboard when marking order complete
const response = await fetch('/api/send-completion-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderId: 'ORDER_ID_HERE' })
});

const data = await response.json();
if (data.success) {
  console.log('✅ Completion email sent!');
}
```

**Completion Email Features:**
- Green success theme (vs red confirmation)
- "Order Completed" message
- Thanks customer for using services
- Includes all order details
- Professional finish to customer experience

**To customize completion email:**
- Edit `getOrderCompletionEmail()` in `/app/email-templates.ts`
- Change colors, text, or layout as needed

## Troubleshooting

### Customer Not Receiving Emails?

See detailed troubleshooting guide: `/EMAIL_TROUBLESHOOTING.md`

**Quick checks:**
1. ✅ Check terminal logs for error messages
2. ✅ Verify `.env.local` exists with API key
3. ✅ Check spam/junk folder
4. ✅ Visit Resend dashboard to see sent emails
5. ✅ Restart server after adding environment variables

**Better Logging:**
Your booking endpoints now show detailed logs:
```
📧 Attempting to send emails...
Customer email: customer@example.com
✅ Customer confirmation email sent successfully
✅ Admin notification email sent successfully
```

If you see ❌ errors, check the error message for details.

## Support

For Resend API documentation and support:
- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)

**Email Troubleshooting:**
- See `/EMAIL_TROUBLESHOOTING.md` for detailed debugging steps
- Check Resend dashboard: https://resend.com/emails
- Watch terminal logs for email sending status

## Summary

🎉 **Email notifications are now live!** 

### What's Included:
✅ **Order Confirmation Emails** - Automatic when order is submitted
- Sent to customer
- Sent to admin (you)

✅ **Order Completion Emails** - Send when work is done
- API endpoint ready: `/api/send-completion-email`
- Green success theme
- Thanks customer for their business

### Quick Reference:
📝 **Modify email content:** `/app/email-templates.ts`
🔑 **API Key location:** `.env.local` file
🐛 **Debugging help:** `/EMAIL_TROUBLESHOOTING.md`
📧 **Check sent emails:** https://resend.com/emails

### Email Types:
1. **Confirmation** (Red theme) - "Order received, we'll contact you"
2. **Admin Alert** - "New order notification"
3. **Completion** (Green theme) - "Order completed, thank you"

All emails are in Czech and fully customizable!
