# Firebase Storage Setup for Image Upload

## Issue
You're getting CORS errors when trying to upload images to Firebase Storage. This happens because the storage security rules haven't been deployed yet.

## Solution

### Option 1: Quick Fix (Recommended for Development)
1. Install Firebase CLI if not already installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Deploy storage rules:
   ```bash
   firebase deploy --only storage
   ```

### Option 2: Manual Setup in Firebase Console
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `marpro-f492a`
3. Go to Storage → Rules
4. Replace the existing rules with:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Allow read access to all files
       match /{allPaths=**} {
         allow read: if true;
       }
       
       // Allow write access to excavators folder
       match /excavators/{allPaths=**} {
         allow write: if true;
       }
     }
   }
   ```
5. Click "Publish"

### Option 3: Firebase Project Initialization (if not set up)
If this is the first time deploying to Firebase:
1. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
2. Select your project: `marpro-f492a`
3. Choose "Storage" when asked about features
4. Deploy:
   ```bash
   firebase deploy --only storage
   ```

## After Setup
Once the storage rules are deployed, the image upload functionality should work properly. The CORS errors will be resolved and you'll be able to upload excavator images from the admin panel.

## Files Created
- `storage.rules` - Firebase Storage security rules
- `firebase.json` - Firebase configuration file

These files are already created in your project and ready for deployment.
