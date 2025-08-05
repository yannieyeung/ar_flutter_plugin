# 🔥 Firebase Admin SDK Setup Guide

## Problem
You're getting this error when calling the `/api/jobs` endpoint:
```json
{
    "success": false,
    "message": "Database service not available"
}
```

This happens because the Firebase Admin SDK environment variables are not configured.

## Solution Steps

### 1. 🔑 Get Firebase Admin Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **Settings gear** ⚙️ > **Project settings**
4. Go to the **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file (keep it secure!)

### 2. 📝 Extract Values from JSON

Your downloaded JSON file will look like this:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### 3. 🔧 Update `.env.local`

Open the `.env.local` file I created and replace the placeholder values:

```env
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-actual-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----"
```

### 4. 🚨 Important Notes

#### Private Key Formatting
- Keep the quotes around the private key
- Keep the `\n` characters in the private key
- Don't remove the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts

#### Example of correct private key format:
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n...more key content...\n-----END PRIVATE KEY-----"
```

### 5. 🔄 Restart Your Development Server

After updating `.env.local`:
```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

### 6. ✅ Test the API

Try your Postman request again:
```
GET http://localhost:3000/api/jobs?userType=individual_helper&userId=test123
```

You should now see a successful response!

## 🔍 Troubleshooting

### If you still get "Database service not available":

1. **Check the console logs** in your terminal - you'll see Firebase Admin initialization messages
2. **Verify environment variables** are loaded:
   ```bash
   # In your terminal, run:
   node -e "console.log('PROJECT_ID:', process.env.FIREBASE_PROJECT_ID)"
   ```

### Expected Console Output (Success):
```
🔧 Initializing Firebase Admin...
📊 Environment check:
- FIREBASE_PROJECT_ID: ✅ Set
- FIREBASE_CLIENT_EMAIL: ✅ Set
- FIREBASE_PRIVATE_KEY: ✅ Set
🎯 Creating Firebase Admin config...
✅ Firebase Admin config created
✅ Firebase Admin app initialized
✅ Firebase Admin services exported
```

### Console Output (Problem):
```
🔧 Initializing Firebase Admin...
📊 Environment check:
- FIREBASE_PROJECT_ID: ❌ Missing
- FIREBASE_CLIENT_EMAIL: ❌ Missing
- FIREBASE_PRIVATE_KEY: ❌ Missing
⚠️ Firebase Admin not configured - using mock implementations
```

## 🛡️ Security Notes

1. **Never commit `.env.local`** to version control (it's already in `.gitignore`)
2. **Keep your service account JSON file secure**
3. **Don't share your private key** with anyone
4. **Use different service accounts** for development and production

## 📱 Alternative: Environment Variables

Instead of `.env.local`, you can also set these as system environment variables:

### macOS/Linux:
```bash
export FIREBASE_PROJECT_ID="your-project-id"
export FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
export FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----"
```

### Windows:
```cmd
set FIREBASE_PROJECT_ID=your-project-id
set FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----"
```

## ✨ Once Fixed

After setting up the credentials correctly, your API will:
- ✅ Successfully connect to Firebase
- ✅ Return actual job data from your database
- ✅ Support all CRUD operations
- ✅ Work with your existing Firestore security rules

The jobs API endpoint will then return real data instead of the "Database service not available" error! 🎉