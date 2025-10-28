# Google Ads / Google Analytics Setup

This document explains how Google Ads tracking has been integrated into the Marpro website.

## Implementation Details

### 1. Google Tag ID
Your Google Tag ID: **G-7ZSNC2QFYH**

This ID is used to track:
- Page views
- User interactions
- Conversions
- Ad campaign performance

### 2. Files Modified

#### `/components/GoogleAnalytics.tsx`
- New component that loads Google Tag Manager scripts
- Uses Next.js `Script` component for optimal loading
- Implements the gtag.js tracking code

#### `/app/layout.tsx`
- Added GoogleAnalytics component to root layout
- Tracking code loads on every page automatically
- Placed in `<body>` tag for proper initialization

#### `.env.local.example`
- Added `NEXT_PUBLIC_GA_ID` environment variable
- Documents the tracking ID for reference

## How It Works

1. **Script Loading**: The Google Tag Manager script loads after the page becomes interactive (`strategy="afterInteractive"`)
2. **Data Layer**: Creates `window.dataLayer` array to queue tracking events
3. **Configuration**: Initializes gtag with your tracking ID
4. **Automatic Tracking**: Tracks page views automatically on every page

## Verification

To verify the implementation is working:

1. **Open your website** in a browser
2. **Open Developer Tools** (F12 or right-click → Inspect)
3. **Go to Console tab**
4. **Type**: `dataLayer`
5. **You should see**: An array with tracking data

Alternatively:
1. Install **Google Tag Assistant** Chrome extension
2. Visit your website
3. Click the extension icon
4. You should see your tag (G-7ZSNC2QFYH) listed as "Working"

## Google Ads Dashboard

To view tracking data:
1. Go to [Google Ads](https://ads.google.com)
2. Navigate to your campaign
3. Check "Conversions" or "Reports" section
4. Data may take 24-48 hours to appear initially

## What Gets Tracked

✅ **Automatic Tracking:**
- Page views
- Session duration
- Bounce rate
- User location
- Device type
- Traffic sources

✅ **Available for Custom Tracking:**
- Button clicks (Order buttons)
- Form submissions
- Scroll depth
- Video plays
- Custom events

## Adding Custom Events (Optional)

If you want to track specific actions (like order form submissions), you can add:

```typescript
// Example: Track order button click
const handleOrderClick = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'order_button_click', {
      service_type: 'containers',
      value: 1
    });
  }
  // ... rest of your code
};
```

## Environment Variables

For production deployment (Netlify), make sure to add:
```
NEXT_PUBLIC_GA_ID=G-7ZSNC2QFYH
```

Note: The tracking ID is currently hardcoded in the layout. If you want to use environment variables instead, update `/app/layout.tsx`:

```tsx
<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || 'G-7ZSNC2QFYH'} />
```

## Privacy Compliance

⚠️ **Important**: Depending on your target audience, you may need to:
- Add a cookie consent banner
- Update your privacy policy
- Implement GDPR compliance (for EU users)
- Add opt-out functionality

## Troubleshooting

**Tag not working?**
1. Check browser console for errors
2. Verify the tracking ID is correct
3. Ensure ad blockers are disabled during testing
4. Wait 24-48 hours for data to appear in Google Ads

**Need help?**
- [Google Ads Help Center](https://support.google.com/google-ads)
- [Google Analytics Documentation](https://developers.google.com/analytics)

## Status

✅ Google Tag implemented
✅ Tracking code active on all pages
✅ Ready for production deployment
