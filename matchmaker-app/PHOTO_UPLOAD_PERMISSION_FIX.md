# Photo Upload Permission Fix

## 🚨 Problem Description

When employers try to upload photos during registration, they encounter this error:

```
Saving metadata to Firebase...
[2025-08-04T03:26:05.228Z]  @firebase/firestore: Firestore (11.10.0): GrpcConnection RPC 'Write' stream 0x405af78a error. Code: 7 Message: 7 PERMISSION_DENIED: Missing or insufficient permissions.
❌ Upload API error: [Error [FirebaseError]: 7 PERMISSION_DENIED: Missing or insufficient permissions.] {
  code: 'permission-denied',
  customData: undefined,
  toString: [Function (anonymous)]
}
```

## 🔍 Root Cause Analysis

The issue was caused by **two separate problems**:

### 1. Missing Firestore Security Rules

The `user_photos` collection was not defined in the Firestore security rules. The upload API was trying to write photo metadata to this collection, but Firebase was denying the request due to no applicable security rules.

### 2. Incorrect Firebase SDK Usage in API Route

The upload API route (`/api/upload-photo/route.js`) was using the **client-side Firebase SDK** (`firebase/firestore`) instead of the **Firebase Admin SDK** (`firebase-admin/firestore`). 

**Why this matters:**
- Client-side SDK requires user authentication context
- In server-side API routes, this context is not automatically available
- Admin SDK has elevated privileges and doesn't require user authentication

## ✅ Solutions Applied

### Fix 1: Added User Photos Security Rules

**File Updated:** `firestore-security-rules-FIXED.txt`

Added the following rules for the `user_photos` collection:

```javascript
// User Photos collection - for photo upload metadata
match /user_photos/{photoId} {
  // Users can read their own photo metadata
  allow read: if request.auth != null && request.auth.uid == resource.data.userId;
  
  // Users can create photo metadata for their own photos
  allow create: if request.auth != null && 
    request.auth.uid == request.resource.data.userId &&
    request.resource.data.keys().hasAll(['userId', 'photoType', 'fileName']) &&
    request.resource.data.userId is string &&
    request.resource.data.photoType is string &&
    request.resource.data.fileName is string;
  
  // Users can update their own photo metadata
  allow update: if request.auth != null && 
    request.auth.uid == resource.data.userId &&
    request.auth.uid == request.resource.data.userId;
  
  // Users can delete their own photo metadata
  allow delete: if request.auth != null && 
    request.auth.uid == resource.data.userId;
}
```

### Fix 2: Updated API Route to Use Admin SDK

**File Updated:** `src/app/api/upload-photo/route.js`

**Changes Made:**

1. **Import Changes:**
   ```javascript
   // Before
   import { db } from '../../../lib/firebase.js';
   import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
   
   // After
   import { adminDb } from '../../../lib/firebase-admin.js';
   import { FieldValue } from 'firebase-admin/firestore';
   ```

2. **Database Operation Changes:**
   ```javascript
   // Before
   const docRef = await addDoc(collection(db, 'user_photos'), photoMetadata);
   
   // After
   const docRef = await adminDb.collection('user_photos').add(photoMetadata);
   ```

3. **Timestamp Changes:**
   ```javascript
   // Before
   uploadedAt: serverTimestamp(),
   
   // After
   uploadedAt: FieldValue.serverTimestamp(),
   ```

## 🚀 How to Apply the Fix

### Step 1: Update Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Copy the updated rules from `firestore-security-rules-FIXED.txt`
5. Paste them into the rules editor
6. Click **"Publish"**

### Step 2: Deploy Code Changes

The code changes have already been applied to:
- `src/app/api/upload-photo/route.js`

Simply deploy your application with these changes.

## 🧪 Testing the Fix

To verify the fix works:

1. **Test Photo Upload:**
   - Navigate to employer registration
   - Try uploading a profile photo
   - Should work without permission errors

2. **Verify Security:**
   - Users should only be able to access their own photo metadata
   - Unauthenticated users should not be able to write to `user_photos`

## 📊 Why This Fix Works

### Admin SDK Benefits:
- ✅ **Elevated Privileges:** Bypasses client-side authentication requirements
- ✅ **Server-Side Security:** Runs with service account credentials
- ✅ **No Authentication Context:** Doesn't require user session in API routes

### Security Rules Benefits:
- ✅ **User Ownership:** Users can only manage their own photos
- ✅ **Data Validation:** Ensures required fields are present
- ✅ **Type Safety:** Validates data types for security

## 🔒 Security Considerations

1. **Admin SDK in API Routes:** The admin SDK should only be used in server-side code (API routes, not client components)

2. **User ID Validation:** Always validate that the `userId` in the request matches the authenticated user

3. **Input Sanitization:** The API already validates file types and sizes

4. **Environment Variables:** Ensure Firebase admin credentials are properly configured in environment variables

## 📝 Additional Notes

- The fix maintains backward compatibility with existing functionality
- No changes are needed to the client-side photo upload flow
- The hybrid photo system continues to work as designed
- Both Supabase (storage) and Firebase (metadata) components remain intact

## 🚨 Troubleshooting

If you still encounter permission errors:

1. **Check Environment Variables:**
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

2. **Verify Rules Deployment:**
   - Check Firebase Console → Firestore → Rules
   - Ensure the updated rules are published

3. **Check Admin SDK Initialization:**
   - Look for initialization logs in the server console
   - Verify no mock implementations are being used

---

**Status:** ✅ Fixed and Ready for Testing  
**Last Updated:** 2025-01-08  
**Priority:** High - Critical for user registration flow