# Admin social media settings

Visit `/admin/settings` (Nastavení in the desktop sidebar or mobile menu). Edit the profile URLs and click **Uložit odkazy**. The save button writes directly to Firestore, and the website footer subscribes to the document to show changes immediately, including in other open tabs. No additional password, session, server credentials, rebuild, or website deployment is required when changing links.

A blank URL hides its icon. The existing TikTok link remains the default until the first save. The first save creates `settings/socialLinks` automatically. Failed saves show an error; success is shown only after Firestore acknowledges the write.

## Initial release

Deploy `firestore.rules` to project `marpro-f492a` using `firebase deploy --only firestore:rules --project marpro-f492a`, then publish the website code through its normal Git deployment. Do not deploy Firebase Hosting.

The new rule permits only the five social-link fields, validates URL format and length, and denies deletion. This uses the existing application's client-managed admin authorization model: the page requires admin login, but Firestore writes are not restricted to an authenticated admin identity, just as with the existing price list and equipment collections. A future migration to Firebase Authentication should enforce admin identity for all of those writes together.

## Verification

- Open Nastavení on desktop and mobile.
- On first visit, verify the existing TikTok URL is loaded.
- Save a profile URL and verify the footer updates in another open tab and after reload.
- Clear a URL, save, and verify its icon disappears.
- Invalid URLs must not save changes.
- A load failure disables saving and offers a retry button.
