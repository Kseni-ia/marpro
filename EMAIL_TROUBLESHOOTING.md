# Email System Troubleshooting & Usage Guide

## 🔍 Problem: Customers Not Receiving Emails

### Why Admin Emails Work But Customer Emails Don't

There are several possible reasons:

### 1. **Check Server Logs**
When you test an order, watch your terminal/console for these messages:

✅ **Good signs:**
```
📧 Attempting to send emails...
Customer email: customer@example.com
✅ Customer confirmation email sent successfully
✅ Admin notification email sent successfully
```

❌ **Bad signs:**
```
❌ Failed to send customer email: [error message]
```

### 2. **Common Issues**

#### Issue A: Email Goes to Spam
**Solution:**
- Customer should check their spam/junk folder
- In Resend, verify your domain to improve deliverability
- Use a professional sender email (not `onboarding@resend.dev`)

#### Issue B: Invalid Email Address
**Check:**
- Customer entered correct email in the form
- No typos in email address
- Email format is valid (has @ and domain)

#### Issue C: API Key Issues
**Check your `.env.local` file:**
```bash
RESEND_API_KEY=re_hyX2nnNG_LrFbxyQQVwftkMnsmCPSJJJE
```

If this file doesn't exist, create it:
```bash
cd /Users/kseniia/Desktop/marpro
cp .env.local.example .env.local
```

Then restart your server:
```bash
npm run dev
```

#### Issue D: Resend Account Limits
- Free Resend accounts have sending limits
- Check your Resend dashboard: https://resend.com/emails
- Verify you haven't hit daily/monthly limits

### 3. **How to Debug**

**Step 1: Check the logs**
When customer submits order, watch terminal for:
```
📧 Attempting to send emails...
Customer email: [email address]
```

**Step 2: Check Resend Dashboard**
1. Go to https://resend.com/emails
2. Check if emails were sent
3. Look for any failed sends or errors

**Step 3: Test with Your Own Email**
Submit a test order using your own email address to verify delivery.

### 4. **Improved Logging**

I've added detailed logging to all booking endpoints. You'll now see:
- 📧 When email sending starts
- ✅ When emails succeed
- ❌ When emails fail (with error details)
- Customer email address being used

This will help identify the exact problem.

---

## ✅ Order Completion Emails

### What Are Completion Emails?

When you mark an order as "completed" in the admin dashboard, you can send a completion email to the customer. This email:
- Has a green theme (vs red for confirmation)
- Thanks the customer for using your services
- Confirms the work is done
- Encourages future business

### How to Send Completion Emails

#### Option 1: From Admin Dashboard (Manual)

You need to add a "Send Completion Email" button to your admin dashboard. Here's how:

1. **Find the order status update section** in your admin dashboard
2. **Add a button** that calls the API endpoint
3. **Example code:**

```javascript
// In your admin dashboard component
const sendCompletionEmail = async (orderId) => {
  try {
    const response = await fetch('/api/send-completion-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    });

    const data = await response.json();
    
    if (data.success) {
      alert('✅ Completion email sent to customer!');
    } else {
      alert('❌ Failed to send email: ' + data.error);
    }
  } catch (error) {
    alert('❌ Error: ' + error.message);
  }
};

// Add button in your order details:
<button onClick={() => sendCompletionEmail(orderId)}>
  📧 Send Completion Email
</button>
```

#### Option 2: Automatic (When Status Changes to Completed)

You can modify your admin dashboard to automatically send the email when you mark an order as "completed".

**Find your order status update function** and add this:

```javascript
// After updating order status to 'completed'
if (newStatus === 'completed') {
  await fetch('/api/send-completion-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId })
  });
}
```

### Completion Email Template Location

**To modify the completion email content:**
- Open `/app/email-templates.ts`
- Find the `getOrderCompletionEmail()` function
- Edit the HTML template as needed

**Current template features:**
- ✅ Green success theme
- ✅ Big checkmark icon
- ✅ "Order completed" message
- ✅ Order details
- ✅ Thank you message
- ✅ Professional footer

---

## 🧪 Testing Email System

### Test 1: Confirmation Email
1. Submit a test order on your website
2. Watch terminal logs for email sending messages
3. Check your email inbox (including spam)
4. Check Resend dashboard for sent emails

### Test 2: Completion Email
**Using curl:**
```bash
curl -X POST http://localhost:3002/api/send-completion-email \
  -H "Content-Type: application/json" \
  -d '{"orderId": "YOUR_ORDER_ID"}'
```

**Or using browser console:**
```javascript
fetch('/api/send-completion-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderId: 'YOUR_ORDER_ID' })
})
.then(res => res.json())
.then(data => console.log(data));
```

Replace `YOUR_ORDER_ID` with an actual order ID from your database.

---

## 📋 Checklist

Before contacting support, verify:

- [ ] `.env.local` file exists with `RESEND_API_KEY`
- [ ] Server has been restarted after adding `.env.local`
- [ ] Checked spam/junk folder
- [ ] Terminal shows email sending logs
- [ ] Resend dashboard shows sent emails
- [ ] Customer email address is valid
- [ ] Not hitting Resend rate limits
- [ ] Tested with your own email address

---

## 🔧 Quick Fixes

### Fix 1: Restart Server
```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Fix 2: Verify Environment Variables
```bash
cat .env.local
# Should show RESEND_API_KEY=re_hyX2nnNG_LrFbxyQQVwftkMnsmCPSJJJE
```

### Fix 3: Check Resend Status
Visit https://resend.com/emails and check:
- Recent emails sent
- Failed sends
- Account status

### Fix 4: Test Email Delivery
Submit order with your own email to test.

---

## 📞 Still Having Issues?

1. **Check the terminal logs** - Look for specific error messages
2. **Check Resend dashboard** - See if emails are being sent
3. **Share error logs** - Copy the exact error message from terminal

Common error messages and solutions:

| Error | Solution |
|-------|----------|
| "Invalid API key" | Check `.env.local` has correct key |
| "Rate limit exceeded" | Wait or upgrade Resend plan |
| "Invalid recipient" | Check email address format |
| "Email sent successfully" | Check spam folder |

---

## 📧 Email Types Summary

### 1. **Order Confirmation** (Automatic)
- **When:** Customer submits order
- **To:** Customer
- **Theme:** Red
- **Content:** Order details, "We'll contact you soon"

### 2. **Admin Notification** (Automatic)
- **When:** Customer submits order
- **To:** Admin (you)
- **Content:** New order alert with details

### 3. **Order Completion** (Manual/Automatic)
- **When:** You mark order as completed
- **To:** Customer
- **Theme:** Green
- **Content:** Thank you, work is done

All emails are in Czech language and can be customized in `/app/email-templates.ts`.
