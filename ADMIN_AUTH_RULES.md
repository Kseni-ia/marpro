# Admin Authentication Rules & Setup

## Overview
The Marpro admin system uses Firebase-based password authentication with secure session management.

## Authentication Flow

### 1. Access Point
- **URL**: `/admin` (hidden from main navigation)
- **Method**: Direct URL access only
- **Security**: No visible links to admin area

### 2. Password Validation
- **Storage**: Firebase Firestore at `settings/adminAuth/password`
- **Current Password**: `marpro`
- **Validation Function**: `validateAdminPassword()` in `/lib/adminAuth.ts`
- **Security**: Password comparison done server-side

### 3. Session Management
- **Method**: localStorage persistence
- **Key**: `adminAuthenticated`
- **Value**: `"true"` when authenticated
- **Auto-logout**: Manual logout button clears session

## File Structure & Responsibilities

### Core Authentication Files
```
/lib/adminAuth.ts          # Password validation logic
/contexts/AuthContext.tsx  # Global auth state management
/app/admin/page.tsx       # Login page UI
/app/admin/dashboard/     # Protected admin area
```

### Key Components

#### `/lib/adminAuth.ts`
- `validateAdminPassword(password: string): Promise<boolean>`
- Connects to Firebase Firestore
- Retrieves stored password from `settings/adminAuth` collection
- Returns boolean validation result

#### `/contexts/AuthContext.tsx`
- Provides global authentication state
- Manages `isAuthenticated` and `loading` states
- Handles localStorage persistence
- Exposes `login()`, `logout()` functions

#### `/app/admin/page.tsx`
- Login form UI with password input
- Error handling for invalid credentials
- Loading states during authentication
- Redirects to `/admin/dashboard` on success

## Security Rules

### Access Control
1. **Authentication Required**: All admin routes require valid session
2. **Session Validation**: Checks localStorage on page load
3. **Auto-redirect**: Unauthenticated users redirected to login

### Password Management
1. **Firebase Storage**: Password stored in Firestore, not in code
2. **Environment Independent**: Works across dev/staging/prod
3. **Easy Updates**: Password can be changed via Firebase Console

### Session Security
1. **Client-side Storage**: Uses localStorage for session persistence
2. **Manual Logout**: Clear session data on logout
3. **No Auto-expire**: Sessions persist until manual logout

## Setup Instructions

### 1. Firebase Configuration
Ensure Firebase is configured in `/lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  // Your Firebase config
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
```

### 2. Set Admin Password in Firebase
1. Go to Firebase Console → Firestore Database
2. Create collection: `settings`
3. Create document: `adminAuth`
4. Set field: `password: "marpro"`

### 3. Environment Variables
No special environment variables needed for admin authentication.
Uses existing Firebase configuration.

## Usage

### Admin Login
1. Navigate to `/admin`
2. Enter password: `marpro`
3. Click "Sign In"
4. Redirected to admin dashboard

### Admin Logout
1. Click logout button in admin dashboard
2. Session cleared from localStorage
3. Redirected to main website

## Password Change Instructions

### Method 1: Firebase Console (Recommended)
1. Open Firebase Console
2. Go to Firestore Database
3. Navigate to `settings` → `adminAuth`
4. Update the `password` field
5. New password takes effect immediately

### Method 2: Admin Interface (Future Enhancement)
Could add password management to admin dashboard for easier updates.

## Security Considerations

### Current Implementation
- ✅ Password not hardcoded in source code
- ✅ Uses Firebase for secure data storage
- ✅ Session persistence with localStorage
- ✅ Hidden admin access point

### Potential Improvements
- Add password complexity requirements
- Implement session expiration
- Add two-factor authentication
- Rate limiting for login attempts
- Audit logging for admin actions

## Integration Points

### With Language System
- Admin login uses translation system
- Error messages support multiple languages
- Consistent UI with main website

### With Main App
- AuthProvider wraps entire app in layout
- Admin routes protected by authentication
- Shared styling and components

## Testing

### Test Cases
1. Valid password login → Success
2. Invalid password login → Error message
3. Session persistence → Stay logged in after refresh
4. Logout → Session cleared, redirected
5. Direct access to admin routes → Redirect to login

### Debug Commands
```bash
# Check localStorage for auth status
localStorage.getItem('adminAuthenticated')

# Clear auth session manually
localStorage.removeItem('adminAuthenticated')
```

## Troubleshooting

### Common Issues
1. **Login not working**: Check Firebase configuration
2. **Password not accepted**: Verify Firestore document exists
3. **Session not persisting**: Check localStorage permissions
4. **Redirect loops**: Ensure AuthProvider wraps app properly

### Error Messages
- "Invalid password" → Password doesn't match Firestore
- Network errors → Firebase connection issues
- Redirect issues → Router configuration problems
