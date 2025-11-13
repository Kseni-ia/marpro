#!/bin/bash

# Firebase Storage Rules Deployment Script
# Fixes image upload CORS and permission errors

echo "🔥 Deploying Firebase Storage Security Rules"
echo "=========================================="
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

# Deploy Storage rules
echo "Deploying Firebase Storage security rules..."
firebase deploy --only storage

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Storage rules deployed successfully!"
    echo ""
    echo "📝 What was deployed:"
    echo "   - Read access to all files (public)"
    echo "   - Write access to references folder"
    echo "   - Write access to excavators folder"
    echo ""
    echo "🔐 Security:"
    echo "   - references/*: write allowed for development"
    echo "   - excavators/*: write allowed for development"
    echo "   - All files: read allowed for public access"
    echo ""
    echo "✅ Image upload should now work!"
    echo "   - CORS issues resolved"
    echo "   - Permission errors fixed"
    echo ""
    echo "🧪 Test it now:"
    echo "   1. Go to your website/admin/newConstructions"
    echo "   2. Click 'Přidat novou referenci'"
    echo "   3. Try uploading an image"
    echo "   4. Should successfully upload and save"
else
    echo ""
    echo "❌ Storage rules deployment failed!"
    echo ""
    echo "Troubleshooting:"
    echo "   1. Check your internet connection"
    echo "   2. Verify Firebase project access"
    echo "   3. Check storage.rules file exists"
    echo "   4. Ensure Storage is enabled in Firebase Console"
    echo ""
    echo "Manual deployment:"
    echo "   1. Go to Firebase Console"
    echo "   2. Storage → Rules"
    echo "   3. Copy contents from storage.rules"
    echo "   4. Paste and Publish"
    echo ""
    echo "Enable Storage (if not already enabled):"
    echo "   1. Go to Firebase Console"
    echo "   2. Storage → Get started"
    echo "   3. Choose security rules: Start in test mode"
    echo "   4. Select location: europe-west1 (or closest)"
    echo "   5. Click 'Done'"
fi
