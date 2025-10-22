# 📧 Resend Setup: Send Emails to Any Customer

## 🚨 Current Problem

You're seeing this error:
```
You can only send testing emails to your own email address (sergeevnakseniia9@gmail.com)
```

**Why?** Your current API key is in "testing mode" and only works with your own email.

---

## ✅ Solution: Verify Your Resend Account

Follow these steps to send emails to any customer:

### **Step 1: Login to Resend**

1. Go to: **https://resend.com/login**
2. Login with your account credentials

### **Step 2: Verify Your Account**

You have two options:

#### **Option A: Verify Email (Fastest - FREE)**
1. Check your email for verification link from Resend
2. Click the verification link
3. Your account will be verified

#### **Option B: Add Payment Method (Still FREE Plan Available)**
1. Go to: https://resend.com/settings/billing
2. Click "Add Payment Method"
3. Add a card (you won't be charged on free plan)
4. Free plan includes:
   - ✅ 100 emails/day
   - ✅ Send to any email address
   - ✅ 3,000 emails/month

### **Step 3: Create Production API Key**

1. Go to: **https://resend.com/api-keys**
2. Click **"Create API Key"** button
3. Fill in details:
   - **Name:** `Marpro Production` (or any name you want)
   - **Permission:** Select **"Full Access"** or **"Sending access"**
   - **Domain:** Leave default or select "All domains"
4. Click **"Create"**
5. **IMPORTANT:** Copy the API key immediately (you won't see it again!)
   - Format: `re_xxxxxxxxxxxxxxxxxx`

### **Step 4: Update Your Environment File**

1. Open your `.env.local` file:
   ```bash
   nano .env.local
   # or use any text editor
   ```

2. Replace the old API key with your new production key:
   ```bash
   # Before:
   RESEND_API_KEY=re_hyX2nnNG_LrFbxyQQVwftkMnsmCPSJJJE
   
   # After (use YOUR new key):
   RESEND_API_KEY=re_YOUR_NEW_PRODUCTION_KEY_HERE
   ```

3. Save the file

### **Step 5: Restart Your Server**

**CRITICAL:** You must restart for changes to take effect!

```bash
# Stop your server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### **Step 6: Test It!**

1. Submit a test order with a **different email address** (not your admin email)
2. Check that email inbox
3. You should receive the confirmation email! ✅

---

## 🎯 Alternative: Verify Your Own Domain (Professional)

If you want to use your own domain (e.g., `orders@marpro.cz`):

### **Step 1: Verify Domain in Resend**

1. Go to: https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain (e.g., `marpro.cz`)
4. Resend will show DNS records to add

### **Step 2: Add DNS Records**

1. Login to your domain registrar (where you bought the domain)
2. Find "DNS Settings" or "DNS Management"
3. Add these records from Resend:
   - **TXT** record for domain verification
   - **CNAME** record for email sending (DKIM)
   - **TXT** record for SPF
4. Wait 5-30 minutes for DNS to propagate

### **Step 3: Verify in Resend**

1. Go back to Resend domains page
2. Click "Verify" button
3. If successful, domain status shows "Verified" ✅

### **Step 4: Update Email Sender**

Edit `/lib/email.ts` and change the `from` address:

**Before:**
```typescript
from: 'Marpro <onboarding@resend.dev>',
```

**After:**
```typescript
from: 'Marpro <orders@marpro.cz>',  // Use YOUR domain
```

**Do this in 3 places:**
1. `sendOrderConfirmationEmail()` function (line ~63)
2. `sendAdminNotificationEmail()` function (line ~120)
3. `sendOrderCompletionEmail()` function (line ~169)

---

## 📊 Resend Plans Comparison

| Plan | Price | Emails/Day | Emails/Month | Send to Anyone? |
|------|-------|------------|--------------|-----------------|
| **Testing** | Free | Unlimited | Unlimited | ❌ Only your email |
| **Free** | $0/month | 100 | 3,000 | ✅ Yes |
| **Pro** | $20/month | 10,000 | 50,000 | ✅ Yes |

**For your business, the FREE plan is enough to start!**

---

## 🐛 Troubleshooting

### Issue: "Still getting 403 error"

**Solutions:**
1. ✅ Make sure you copied the **new production API key**
2. ✅ Updated `.env.local` file correctly
3. ✅ **Restarted the server** (this is critical!)
4. ✅ Check Resend dashboard shows account as "Verified"

### Issue: "Can't find API keys page"

1. Go to: https://resend.com/api-keys directly
2. Or from dashboard: Settings → API Keys

### Issue: "Don't have payment method"

You can still verify your account by email:
1. Check your email inbox
2. Look for verification email from Resend
3. Click the verification link

### Issue: "Emails going to spam"

**Solutions:**
1. Verify your own domain (professional setup)
2. Ask customers to add your email to contacts
3. Use consistent sender name
4. Avoid spam trigger words in subject

---

## ✅ Quick Checklist

Before testing, make sure:

- [ ] Resend account is verified (check dashboard)
- [ ] Created a new production API key
- [ ] Copied the API key correctly
- [ ] Updated `.env.local` with new key
- [ ] Saved the `.env.local` file
- [ ] Restarted the dev server
- [ ] Tested with a different email address

---

## 🎉 Success!

Once completed, you can:
- ✅ Send emails to any customer email address
- ✅ Send 100 emails per day (3,000/month) for free
- ✅ Receive both confirmation and completion emails
- ✅ Customers receive professional order notifications

---

## 📞 Still Having Issues?

1. **Check Resend Dashboard:**
   - Go to: https://resend.com/emails
   - See recent email attempts
   - Check for error messages

2. **Check Server Logs:**
   - Look for email sending logs
   - Check for API errors
   - Note any error codes

3. **Test API Key:**
   ```bash
   # Test if API key works (in terminal):
   curl -X POST 'https://api.resend.com/emails' \
     -H 'Authorization: Bearer YOUR_API_KEY_HERE' \
     -H 'Content-Type: application/json' \
     -d '{
       "from": "onboarding@resend.dev",
       "to": "your-email@example.com",
       "subject": "Test Email",
       "html": "<p>Test message</p>"
     }'
   ```

---

## 🔗 Useful Links

- **Resend Dashboard:** https://resend.com
- **API Keys:** https://resend.com/api-keys
- **Domains:** https://resend.com/domains
- **Email Logs:** https://resend.com/emails
- **Documentation:** https://resend.com/docs
- **Pricing:** https://resend.com/pricing

---

## 💡 Pro Tips

1. **Keep testing key for development:**
   - Use testing key when developing locally
   - Use production key when testing with real customers

2. **Monitor your usage:**
   - Check https://resend.com/emails regularly
   - Free plan has 100 emails/day limit

3. **Verify domain for production:**
   - More professional
   - Better email deliverability
   - Custom email addresses

4. **Save your API keys securely:**
   - Never commit `.env.local` to git
   - Keep backup of production API key
   - Don't share API keys publicly

---

Good luck! Your email system will work perfectly once you complete these steps. 🚀
