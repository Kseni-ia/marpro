# Netlify Environment Variables Setup

## Issue
The excavator booking system (and all services) are failing with 500 errors because Google Calendar credentials are not configured in Netlify.

## Error Messages
```
/api/available-slots-excavators?date=2025-10-29: Failed to load resource: the server responded with a status of 500
/api/book-excavator: Failed to load resource: the server responded with a status of 500
```

## Root Cause
Environment variables from `.env.local` are **NOT** automatically deployed to Netlify. They must be manually configured in Netlify's dashboard.

## Solution: Add Environment Variables to Netlify

### Step 1: Access Netlify Environment Variables
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your **marpro** site
3. Navigate to **Site configuration** > **Environment variables**
4. Click **Add a variable** or **Add variables**

### Step 2: Add Required Variables

You need to copy these variables from your `.env.local` file:

#### Google Calendar Service Account
```
Variable name: GOOGLE_SERVICE_ACCOUNT_EMAIL
Value: calendar-service@marpro-f492a.iam.gserviceaccount.com
```

#### Google Private Key
```
Variable name: GOOGLE_PRIVATE_KEY
Value: [Your full private key from .env.local]
```
⚠️ **Important**: Copy the ENTIRE private key including:
- `-----BEGIN PRIVATE KEY-----`
- All the key content
- `-----END PRIVATE KEY-----`

Make sure to preserve the `\n` characters or actual line breaks.

#### Container Calendar ID
```
Variable name: GOOGLE_CALENDAR_ID_CONTAINERS
Value: a2a168a263e40dc9cdd860bbc50fef6710688d415f52646adad31f96aec0a0ab@group.calendar.google.com
```

#### Excavator Calendar ID
```
Variable name: GOOGLE_CALENDAR_ID_EXCAVATORS
Value: 2a455ddd1451cf37d00a81cf5f2f66443218ad7af01a56157cd329575dbe3139@group.calendar.google.com
```

#### Construction Calendar ID
```
Variable name: GOOGLE_CALENDAR_ID_CONSTRUCTIONS
Value: 2c5b7162a4fc76a598480627c7277cd5fae3d88878217eb201e666a804842c92@group.calendar.google.com
```

#### Fallback Calendar ID
```
Variable name: GOOGLE_CALENDAR_ID
Value: bd7f11dcc8ae4a8eeefa8bb2ae3622d9a133b164909160f4a99b1b7055e832b7@group.calendar.google.com
```

#### Timezone
```
Variable name: GOOGLE_TIME_ZONE
Value: Europe/Prague
```

#### Email Configuration (Resend API)
```
Variable name: RESEND_API_KEY
Value: [Your Resend API key from https://resend.com/api-keys]
```

```
Variable name: ADMIN_EMAIL
Value: sergeevnakseniia9@gmail.com
```

### Step 3: Set Variable Scopes
For each variable, you can choose:
- **All deploys** (recommended) - applies to production, deploy previews, and branch deploys
- **Production** only - only applies to your main site
- **Deploy previews** - only for preview deployments

**Recommendation**: Use "All deploys" for all variables.

### Step 4: Redeploy Your Site
After adding all variables:
1. Click **Save** or **Update variables**
2. Go to **Deploys** tab
3. Click **Trigger deploy** > **Deploy site**
4. Wait for the new deployment to complete

## Verification

### Check Deployment Logs
1. Click on the latest deploy
2. Check the **Function logs** section
3. Look for any errors related to missing environment variables

### Test the Booking System
1. Open your deployed site
2. Try to book an excavator/container/construction
3. Check browser console for errors
4. The API should now work without 500 errors

### Expected Behavior
- ✅ Available time slots load correctly
- ✅ Bookings are created successfully
- ✅ Calendar events are created in Google Calendar
- ✅ Confirmation emails are sent

## Troubleshooting

### If Still Getting 500 Errors

1. **Check Netlify Function Logs**:
   - Site configuration > Functions > View function logs
   - Look for specific error messages

2. **Verify Private Key Format**:
   - Make sure `\n` characters are preserved
   - Or use actual line breaks in the Netlify UI

3. **Check Calendar Permissions**:
   - Verify service account has access to all three calendars
   - Calendar sharing: `calendar-service@marpro-f492a.iam.gserviceaccount.com`
   - Permission level: "Make changes to events"

4. **Test in Development**:
   ```bash
   npm run dev
   ```
   If it works locally but not in production, the issue is with Netlify environment variables.

## Security Notes

- ⚠️ Never commit `.env.local` to Git
- ⚠️ Never share your private key publicly
- ✅ Environment variables in Netlify are encrypted
- ✅ Only accessible to your site's functions
- ✅ Not visible in client-side JavaScript

## Common Mistakes to Avoid

1. ❌ Forgetting to click "Save" after adding variables
2. ❌ Not redeploying after adding variables
3. ❌ Copying incomplete private key
4. ❌ Using wrong calendar IDs
5. ❌ Mixing up production/development variables

## Additional Resources

- [Netlify Environment Variables Documentation](https://docs.netlify.com/configure-builds/environment-variables/)
- [Google Service Account Setup](https://cloud.google.com/iam/docs/service-accounts)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
