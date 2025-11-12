#!/bin/bash

# Admin Password Setup Script for Marpro
# This script helps set up the admin password in Firebase Firestore

echo "🔧 Marpro Admin Password Setup"
echo "=============================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "   npm install -g firebase-tools"
    echo "   Then run: firebase login"
    exit 1
fi

# Get the password from user
echo "Please enter the admin password you want to set:"
read -s password
echo ""

if [ -z "$password" ]; then
    echo "❌ Password cannot be empty"
    exit 1
fi

echo "Setting admin password in Firebase Firestore..."
echo ""

# Create the admin auth document in Firestore
firebase firestore:document set settings/adminAuth --data "password: '$password'" --project marpro-f492a

if [ $? -eq 0 ]; then
    echo "✅ Admin password set successfully!"
    echo ""
    echo "📝 Summary:"
    echo "   - Password stored in: settings/adminAuth/password"
    echo "   - Admin URL: /admin"
    echo "   - Default password: $password"
    echo ""
    echo "🔒 Security Notes:"
    echo "   - Password is stored in Firebase Firestore"
    echo "   - Can be changed anytime via Firebase Console"
    echo "   - Admin access is hidden from main navigation"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Test login at /admin"
    echo "   2. Verify access to admin dashboard"
    echo "   3. Update password regularly for security"
else
    echo "❌ Failed to set password. Please check:"
    echo "   - Firebase CLI authentication"
    echo "   - Project ID: marpro-f492a"
    echo "   - Firestore permissions"
fi
