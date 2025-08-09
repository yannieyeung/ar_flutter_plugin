#!/bin/bash

echo "🔒 Deploying Firestore Rules - Fix User Photos Permissions"
echo "========================================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo "🔐 Logging in to Firebase..."
firebase login

echo "🚀 Deploying Firestore rules..."
firebase deploy --only firestore:rules

echo "📋 Deploying Firestore indexes..."
firebase deploy --only firestore:indexes

echo "✅ Deployment complete!"
echo ""
echo "🧪 Testing the fix:"
echo "1. Go to your helper profile page"
echo "2. Check if photos load without permission errors"
echo "3. Try uploading a new photo"
echo ""
echo "If you still see errors, please check the Firebase Console:"
echo "https://console.firebase.google.com/"