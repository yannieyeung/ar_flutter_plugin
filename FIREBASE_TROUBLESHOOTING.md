# 🔥 Firebase Storage CORS & Upload Issues - Troubleshooting Guide

## 🚨 **Current Issues**

1. **CORS Policy Error**: `Access to XMLHttpRequest blocked by CORS policy`
2. **Upload Failure**: `POST net::ERR_FAILED` when uploading images
3. **Authentication Issues**: Storage rules blocking uploads

---

## ✅ **Step-by-Step Fix**

### **1. Update Firebase Storage Rules**

Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → Storage → Rules

Replace the current rules with:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Users can upload and read their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Profile pictures - authenticated users can read others' profile pics
    match /users/{userId}/profile-pictures/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Portfolio photos - authenticated users can read others' portfolio
    match /users/{userId}/portfolio-photos/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Helper photos - authenticated users can read
    match /users/{userId}/helper-photos/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### **2. Verify Firebase Configuration**

Check your `.env.local` file has all required variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

**Get these from**: Firebase Console → Project Settings → General → Your apps

### **3. Enable Firebase Storage**

1. Go to Firebase Console → Storage
2. Click "Get started"
3. Choose "Start in production mode" (we'll set custom rules)
4. Select a storage location (closest to your users)

### **4. Configure CORS for Storage Bucket**

**Option A: Using Firebase CLI (Recommended)**

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Create `cors.json` in your project root:

```json
[
  {
    "origin": ["http://localhost:3000", "https://your-domain.com"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

4. Apply CORS: `gsutil cors set cors.json gs://your-project.appspot.com`

**Option B: Using Google Cloud Console**

1. Go to [Google Cloud Storage](https://console.cloud.google.com/storage)
2. Find your Firebase Storage bucket
3. Click on the bucket → Permissions → Add members
4. Add `allUsers` with role "Storage Object Viewer" (if you want public read)

### **5. Test Authentication Flow**

Open browser developer tools and check:

```javascript
// In browser console
console.log('User:', firebase.auth().currentUser);
console.log('Auth state:', firebase.auth().currentUser?.uid);
```

---

## 🔍 **Debugging Steps**

### **Check 1: Firebase Project Status**

```bash
# In your project directory
cd matchmaker-app
npm run dev
```

Open browser console and look for:
- ✅ "Firebase initialized successfully"
- ❌ "Missing Firebase environment variables"

### **Check 2: Authentication Status**

In the browser console:
```javascript
// Check if user is authenticated
console.log('Auth user:', auth.currentUser);
```

### **Check 3: Storage Bucket Permissions**

1. Go to Firebase Console → Storage
2. Try uploading a file manually
3. If it works manually but not in app, it's a code issue
4. If it doesn't work manually, it's a Firebase setup issue

### **Check 4: Network Tab Analysis**

1. Open Developer Tools → Network
2. Try uploading a file
3. Look for failed requests:
   - **401 Unauthorized**: Authentication issue
   - **403 Forbidden**: Storage rules issue
   - **CORS error**: CORS configuration issue

---

## 🛠️ **Common Fixes**

### **Fix 1: Environment Variables**

Make sure `.env.local` is in the correct location (`matchmaker-app/.env.local`) and all values are correct.

### **Fix 2: Authentication Flow**

Ensure user is logged in before uploading:

```javascript
// Check in PhotoUpload component
if (!user || !user.uid) {
  console.error('User not authenticated');
  return;
}
```

### **Fix 3: Storage Rules**

The most common issue is incorrect storage rules. Use the rules provided above.

### **Fix 4: CORS Configuration**

If CORS errors persist, try adding localhost to allowed origins in Firebase settings.

---

## 📱 **Testing Checklist**

- [ ] Firebase project created and configured
- [ ] Storage enabled in Firebase Console
- [ ] Storage rules updated
- [ ] Environment variables set correctly
- [ ] User can sign in/sign up
- [ ] User authentication persists on page reload
- [ ] File validation works (file type, size)
- [ ] Upload progress shows correctly
- [ ] Success/error messages display

---

## 🚑 **Emergency Quick Fix**

If you need a temporary fix to test other features:

1. **Temporarily open Storage rules**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **Warning**: This allows any authenticated user to access any file. Only use for testing!

---

## 📞 **Still Having Issues?**

1. Check the browser console for detailed error messages
2. Verify your Firebase project billing status
3. Ensure your Firebase project has Storage enabled
4. Try creating a new test file upload in Firebase Console manually

**Firebase Project URL Format**: 
`https://console.firebase.google.com/project/YOUR_PROJECT_ID/storage`