# Deploy Firestore Rules to Fix Admin Login

## 🚨 Current Issue
Your admin login shows "insufficient permissions" because Firestore security rules are blocking access to the `settings/adminAuth` collection.

## ✅ Solution
Deploy the new Firestore security rules that allow reading the admin password for authentication.

## 📋 Steps to Deploy Rules

### Option 1: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**:
```bash
firebase login
```

3. **Initialize Firebase** (if not already done):
```bash
cd /Users/kseniia/Desktop/marpro
firebase init
```
- Select "Firestore" when prompted
- Choose existing project: `marpro-f492a`
- Accept default file names (firestore.rules)

4. **Deploy Firestore Rules**:
```bash
firebase deploy --only firestore:rules
```

5. **Verify Deployment**:
```bash
firebase firestore:rules:get
```

### Option 2: Using Firebase Console (Manual)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `marpro-f492a`
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the contents from `/firestore.rules` file
5. Paste into the rules editor
6. Click **Publish**

## 📝 What the Rules Do

### Admin Authentication
```javascript
match /settings/adminAuth {
  allow read: if true;  // ✅ Allows login validation
  allow write: if false; // 🔒 Prevents password tampering
}
```

### Orders & Applications
```javascript
match /orders/{orderId} {
  allow read: if true;   // Admin can view orders
  allow create: if true; // Customers can place orders
  allow update: if true; // Admin can update status
  allow delete: if true; // Admin can delete orders
}
```

### Equipment & Bookings
- Public can view available equipment
- System can create/update bookings
- Admin can manage inventory

## 🔍 Verify Rules Are Working

After deployment, test the admin login:

1. Go to `/admin`
2. Enter password: `marpro`
3. Should successfully log in ✅

## 🐛 Troubleshooting

### Error: "Insufficient permissions"
- **Cause**: Rules not deployed yet
- **Fix**: Run `firebase deploy --only firestore:rules`

### Error: "Permission denied"
- **Cause**: Firebase CLI not authenticated
- **Fix**: Run `firebase login`

### Error: "Project not found"
- **Cause**: Wrong project selected
- **Fix**: Run `firebase use marpro-f492a`

### Rules not updating
- **Cause**: Cache issue
- **Fix**: Wait 1-2 minutes, clear browser cache, try again

## 🔐 Security Notes

### Why allow read access to admin password?
- Password validation happens client-side
- Actual admin routes protected by AuthContext
- Password stored in Firestore, not in code
- Can only be changed via Firebase Console (write: false)

### Production Considerations
For production, consider:
- Moving to Firebase Authentication instead of password-only
- Adding rate limiting for login attempts
- Implementing session expiration
- Adding audit logging

## ✅ Quick Deploy Command

```bash
cd /Users/kseniia/Desktop/marpro && firebase deploy --only firestore:rules
```

After running this command, your admin login will work immediately!
