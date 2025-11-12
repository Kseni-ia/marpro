#!/bin/bash

# Firestore Rules Deployment Script
# Fixes admin login "insufficient permissions" error

echo "🔥 Deploying Firestore Security Rules"
echo "====================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found!"
    echo ""
    echo "Please install it first:"
    echo "  npm install -g firebase-tools"
    echo ""
    echo "Then run:"
    echo "  firebase login"
    exit 1
fi

# Check if logged in
echo "Checking Firebase authentication..."
firebase projects:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Not logged in to Firebase"
    echo ""
    echo "Please run:"
    echo "  firebase login"
    exit 1
fi

echo "✅ Firebase CLI authenticated"
echo ""

# Set the correct project
echo "Setting Firebase project to marpro-f492a..."
firebase use marpro-f492a

if [ $? -ne 0 ]; then
    echo "❌ Failed to set project"
    echo ""
    echo "Please run:"
    echo "  firebase use --add"
    echo "  Select: marpro-f492a"
    exit 1
fi

echo "✅ Project set to marpro-f492a"
echo ""

# Deploy Firestore rules
echo "Deploying Firestore security rules..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Firestore rules deployed successfully!"
    echo ""
    echo "📝 What was deployed:"
    echo "   - Admin authentication rules (allows login)"
    echo "   - Orders collection rules"
    echo "   - Work applications rules"
    echo "   - Equipment and bookings rules"
    echo ""
    echo "🔐 Security:"
    echo "   - settings/adminAuth: read allowed, write blocked"
    echo "   - Password can only be changed via Firebase Console"
    echo ""
    echo "✅ Admin login should now work!"
    echo "   - URL: /admin"
    echo "   - Password: marpro"
    echo ""
    echo "🧪 Test it now:"
    echo "   1. Go to your website/admin"
    echo "   2. Enter password: marpro"
    echo "   3. Should successfully log in"
else
    echo ""
    echo "❌ Deployment failed!"
    echo ""
    echo "Troubleshooting:"
    echo "   1. Check your internet connection"
    echo "   2. Verify Firebase project access"
    echo "   3. Check firestore.rules file exists"
    echo ""
    echo "Manual deployment:"
    echo "   1. Go to Firebase Console"
    echo "   2. Firestore Database → Rules"
    echo "   3. Copy contents from firestore.rules"
    echo "   4. Paste and Publish"
fi
