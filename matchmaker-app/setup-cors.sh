#!/bin/bash

# Firebase Storage CORS Setup Script
# This script helps configure CORS for your Firebase Storage bucket

echo "🔥 Firebase Storage CORS Setup"
echo "==============================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI installed"
fi

# Check if gsutil is installed (part of Google Cloud SDK)
if ! command -v gsutil &> /dev/null; then
    echo "❌ gsutil not found. Please install Google Cloud SDK:"
    echo "   https://cloud.google.com/sdk/docs/install"
    echo "   Then run: gcloud auth login"
    exit 1
fi

# Read the Firebase project ID from .env.local
if [ -f ".env.local" ]; then
    PROJECT_ID=$(grep "NEXT_PUBLIC_FIREBASE_PROJECT_ID" .env.local | cut -d '=' -f2)
    STORAGE_BUCKET=$(grep "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" .env.local | cut -d '=' -f2)
    
    if [ -z "$PROJECT_ID" ] || [ -z "$STORAGE_BUCKET" ]; then
        echo "❌ Could not find Firebase project ID or storage bucket in .env.local"
        echo "Please make sure your .env.local file contains:"
        echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id"
        echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com"
        exit 1
    fi
else
    echo "❌ .env.local file not found"
    echo "Please create .env.local with your Firebase configuration"
    exit 1
fi

echo "📋 Project ID: $PROJECT_ID"
echo "🪣 Storage Bucket: $STORAGE_BUCKET"

# Login to Firebase
echo "🔐 Logging into Firebase..."
firebase login

# Set the project
echo "🎯 Setting Firebase project..."
firebase use "$PROJECT_ID"

# Apply CORS configuration
echo "🌐 Applying CORS configuration..."
if [ -f "cors.json" ]; then
    gsutil cors set cors.json "gs://$STORAGE_BUCKET"
    echo "✅ CORS configuration applied successfully!"
    
    # Verify CORS configuration
    echo "🔍 Verifying CORS configuration..."
    gsutil cors get "gs://$STORAGE_BUCKET"
    
    echo ""
    echo "🎉 Setup complete!"
    echo "You can now upload files from your Next.js application."
    echo ""
    echo "If you still have issues, check:"
    echo "1. Firebase Storage rules are configured correctly"
    echo "2. User authentication is working"
    echo "3. Environment variables are set correctly"
    
else
    echo "❌ cors.json file not found"
    echo "Please make sure cors.json exists in the current directory"
    exit 1
fi