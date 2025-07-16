# 🪣 Supabase Storage Buckets Setup Guide

## 🚨 **Error: "Bucket not found"**

This error occurs because the required storage buckets don't exist in your Supabase project yet. Here's how to fix it:

---

## 🚀 **Option 1: Automatic Setup (Recommended)**

### **Step 1: Set up Supabase credentials**

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (name it `matchmaker-storage`)
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **Step 2: Update your .env.local**

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Step 3: Run the bucket creation script**

```bash
node create-supabase-buckets.js
```

**Expected output:**
```
🪣 Creating Supabase Storage Buckets
=====================================

🔍 Testing Supabase connection...
✅ Connection successful!
📦 Current project: https://your-project.supabase.co

🔍 Checking existing buckets...
📦 Found 0 existing buckets
🔄 Creating bucket: profile-pictures
✅ profile-pictures: Created successfully
🔄 Creating bucket: portfolio-photos
✅ portfolio-photos: Created successfully
🔄 Creating bucket: certificates
✅ certificates: Created successfully
🔄 Creating bucket: identity-documents
✅ identity-documents: Created successfully
🔄 Creating bucket: experience-proof
✅ experience-proof: Created successfully

🎉 Bucket setup complete!
```

---

## 🛠️ **Option 2: Manual Setup (If script fails)**

### **Step 1: Go to Supabase Console**

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Storage** in the left sidebar

### **Step 2: Create Required Buckets**

Click **"New bucket"** and create these 5 buckets:

| Bucket Name | Public | Description |
|-------------|--------|-------------|
| `profile-pictures` | ✅ Yes | User profile photos |
| `portfolio-photos` | ✅ Yes | Portfolio and work samples |
| `certificates` | ❌ No | Certificates and qualifications |
| `identity-documents` | ❌ No | Identity verification documents |
| `experience-proof` | ❌ No | Work experience documentation |

### **Step 3: Configure Bucket Settings**

For each bucket, set:
- **File size limit**: 10MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`

---

## 🧪 **Test Your Setup**

After creating the buckets, test that everything works:

```bash
# Test the hybrid setup
node test-hybrid-setup.js

# Start your app
npm run dev

# Try uploading an image
```

**Expected result:**
- ✅ No "Bucket not found" error
- ✅ Images upload successfully to Supabase
- ✅ URLs saved to Firestore
- ✅ Cost savings displayed

---

## 🔍 **Troubleshooting**

### **Issue: "Connection failed"**

**Solution:**
1. Check your `.env.local` file has correct values
2. Verify your Supabase project is active (not paused)
3. Regenerate your anon key in Supabase Settings → API

### **Issue: "Bucket creation failed"**

**Solution:**
1. Create buckets manually in Supabase console
2. Make sure bucket names match exactly (no spaces, hyphens only)
3. Check your project permissions

### **Issue: "Upload still fails"**

**Solution:**
1. Restart your dev server: `npm run dev`
2. Clear browser cache
3. Check browser console for specific error messages

---

## 📋 **Bucket Purposes**

| Bucket | Used For | Public Access |
|--------|----------|---------------|
| `profile-pictures` | User profile photos shown to employers | ✅ Yes |
| `portfolio-photos` | Work samples and portfolio images | ✅ Yes |
| `certificates` | Training certificates and qualifications | ❌ No |
| `identity-documents` | ID verification documents | ❌ No |
| `experience-proof` | Work experience documentation | ❌ No |

---

## 🎯 **After Setup**

Once buckets are created, your app will:

1. **Upload images** to the appropriate Supabase bucket
2. **Optimize images** (60-80% size reduction)
3. **Save URLs** to Firestore with metadata
4. **Display images** from Supabase in your app

**Cost savings:** ~90% cheaper than Firebase Storage! 💰

---

## 📞 **Still Having Issues?**

If you're still getting "Bucket not found" errors:

1. Double-check bucket names match exactly
2. Verify your Supabase project is active
3. Make sure your .env.local has the correct credentials
4. Try creating buckets manually in the console

The bucket creation is a one-time setup - once they're created, your image uploads will work smoothly!