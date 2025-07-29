# Agency Profile Photo Fix

## Issue Identified
Agency profile photos were not displaying in the avatar on the profile page, while employer and helper profile photos worked correctly.

## Root Cause Analysis
The issue was caused by **incorrect photo type mapping** for agencies:

### **Photo Type Mapping Problem**
Different user types use different photo type identifiers:
- **Employers**: `'employer-profiles'` 
- **Agencies**: `'agency-profile-photos'` ← **This was missing**
- **Helpers**: `'profile-pictures'`

### **Affected Components**
1. **Main Profile Page** (`src/app/profile/page.jsx`)
   - Avatar display logic only checked for employers vs. non-employers
   - Agencies were defaulting to `'profile-pictures'` instead of `'agency-profile-photos'`

2. **SharedProfileSections** (`src/components/profile-sections/SharedProfileSections.jsx`)
   - Upload button logic had the same issue
   - Photo filtering logic was incorrect for agencies

3. **Photo Upload Logic**
   - Cleanup process didn't include agency profile photos
   - Could leave orphaned photos when agencies updated their profile pictures

## Solutions Implemented

### 1. Fixed Avatar Display Logic ✅

**Before:**
```javascript
const profilePhotoType = user?.userType === 'employer' ? 'employer-profiles' : 'profile-pictures';
```

**After:**
```javascript
// Get the correct profile photo type based on user type
let profilePhotoType;
if (user?.userType === 'employer') {
  profilePhotoType = 'employer-profiles';
} else if (user?.userType === 'agency') {
  profilePhotoType = 'agency-profile-photos';
} else {
  profilePhotoType = 'profile-pictures';
}
```

### 2. Updated SharedProfileSections ✅

**Before:**
```javascript
const getProfilePhotoType = () => {
  if (user?.userType === 'employer') {
    return 'employer-profiles';
  }
  return 'profile-pictures';
};
```

**After:**
```javascript
const getProfilePhotoType = () => {
  if (user?.userType === 'employer') {
    return 'employer-profiles';
  } else if (user?.userType === 'agency') {
    return 'agency-profile-photos';
  }
  return 'profile-pictures';
};
```

### 3. Enhanced Photo Cleanup Logic ✅

**Before:**
```javascript
const isProfilePhoto = photoType === 'employer-profiles' || photoType === 'profile-pictures';
const existingProfilePhotos = allPhotos.filter(photo => 
  photo.photoType === 'employer-profiles' || photo.photoType === 'profile-pictures'
);
```

**After:**
```javascript
const isProfilePhoto = photoType === 'employer-profiles' || photoType === 'profile-pictures' || photoType === 'agency-profile-photos';
const existingProfilePhotos = allPhotos.filter(photo => 
  photo.photoType === 'employer-profiles' || photo.photoType === 'profile-pictures' || photo.photoType === 'agency-profile-photos'
);
```

## Photo Type Reference

### **Complete Photo Type Mapping**
```javascript
// Profile Photos (avatars)
'employer-profiles'      // For employers
'agency-profile-photos'  // For agencies  
'profile-pictures'       // For helpers

// Additional Photo Types
'portfolio-photos'       // Helper portfolios
'certificates'           // Helper certificates
'experience-proof'       // Helper experience documents
'identity-documents'     // Helper ID documents
'agency-business-photos' // Agency business photos
```

### **Storage Mapping**
From the API route configuration:
```javascript
'agency-profile-photos': 'profile-images'  // Supabase bucket path
```

## Files Modified

1. **`src/app/profile/page.jsx`**
   - Updated avatar display logic to handle all three user types
   - Enhanced photo cleanup process to include agency photos
   - Added proper photo type detection

2. **`src/components/profile-sections/SharedProfileSections.jsx`**
   - Updated `getProfilePhotoType()` function
   - Fixed photo filtering for upload buttons
   - Ensured consistent behavior across components

## Benefits

### 🖼️ **Consistent Avatar Display**
- All user types now show their profile pictures correctly
- Agencies see their uploaded profile photos in the avatar
- No more broken or missing profile pictures

### 🔄 **Proper Photo Management**
- Photo upload and replacement works correctly for agencies
- Cleanup process removes old agency profile photos
- No orphaned photos left in storage

### 🎯 **User Type Consistency**
- Each user type has its own dedicated photo type
- Clear separation of photo categories
- Consistent behavior across the application

### 🛠️ **Maintainable Code**
- Clear photo type mapping for all user types
- Consistent logic across components
- Easy to extend for future user types

## Testing Scenarios

✅ **Employer Profile Photos**: Continue to work correctly  
✅ **Agency Profile Photos**: Now display in avatar correctly  
✅ **Helper Profile Photos**: Continue to work correctly  
✅ **Photo Upload**: Works for all user types  
✅ **Photo Replacement**: Cleans up old photos for all user types  
✅ **Photo Display**: Consistent across all components  

## Technical Details

### **Photo Type Detection Logic**
```javascript
function getProfilePhotoType(userType) {
  switch(userType) {
    case 'employer':
      return 'employer-profiles';
    case 'agency':
      return 'agency-profile-photos';
    case 'individual_helper':
    default:
      return 'profile-pictures';
  }
}
```

### **Photo Cleanup Process**
- Identifies all profile photo types before upload
- Deletes existing profile photos for the user
- Refreshes photo state to ensure clean UI
- Uploads new profile photo
- Forces UI refresh to display new photo

## Result

✅ **Agency profile photos now display correctly in the avatar**  
✅ **All user types have consistent photo handling**  
✅ **Photo upload and replacement works for agencies**  
✅ **No more broken profile picture displays**  
✅ **Clean photo management with proper cleanup**  

Agencies can now upload profile photos and see them displayed correctly in their avatar, just like employers and helpers. The photo management system now handles all user types consistently and reliably.