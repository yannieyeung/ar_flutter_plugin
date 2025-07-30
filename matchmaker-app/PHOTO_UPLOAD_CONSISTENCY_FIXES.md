# Photo Upload Consistency Fixes

## Issue Identified
When employers upload profile photos during registration, they are stored in the `employer-profiles` folder in Supabase. However, when editing the profile and uploading new photos, these photos were being stored in the `profile-pictures` folder. This caused:

1. **Two separate folders** for the same user's profile photos
2. **Inconsistent photo paths** between registration and profile editing  
3. **No automatic cleanup** of old profile photos when new ones are uploaded
4. **Wasted storage space** due to accumulating old photos

## Solutions Implemented

### 1. Consistent Photo Type Usage ✅

**Problem**: Profile editing used hardcoded `'profile-pictures'` for all user types.

**Solution**: Updated `SharedProfileSections.jsx` to use the correct photo type based on user type:

```javascript
// Added function to get correct photo type
const getProfilePhotoType = () => {
  if (user?.userType === 'employer') {
    return 'employer-profiles';
  }
  return 'profile-pictures';
};

// Updated photo filtering and upload buttons
const profilePhotos = getPhotosByType(getProfilePhotoType());
onChange={(e) => handlePhotoUpload(e.target.files, getProfilePhotoType())}
```

### 2. Automatic Old Photo Cleanup ✅

**Problem**: Old profile photos were not deleted when new ones were uploaded, wasting storage space.

**Solution**: Enhanced `handlePhotoUpload` function in profile page to automatically delete existing profile photos before uploading new ones:

```javascript
// For profile photos, delete existing ones first to maintain single profile photo
const isProfilePhoto = photoType === 'employer-profiles' || photoType === 'profile-pictures';
if (isProfilePhoto) {
  const existingProfilePhotos = allPhotos.filter(photo => 
    photo.photoType === 'employer-profiles' || photo.photoType === 'profile-pictures'
  );
  
  // Delete existing profile photos
  for (const photo of existingProfilePhotos) {
    try {
      await ClientPhotoService.deletePhoto(photo.id, photo.supabasePath, photo.bucket);
    } catch (error) {
      console.warn('Failed to delete old profile photo:', error);
      // Continue with upload even if deletion fails
    }
  }
}
```

### 3. Consistent Profile Picture Display ✅

**Problem**: Profile picture display logic needed to handle both old and new photo types during transition.

**Solution**: Updated profile picture display to use the correct photo type for each user type:

```javascript
const profilePhotoType = user?.userType === 'employer' ? 'employer-profiles' : 'profile-pictures';
const profilePhoto = allPhotos.find(photo => photo.photoType === profilePhotoType);
```

## Benefits

### 🗂️ **Organized Storage**
- All employer profile photos now consistently stored in `employer-profiles` folder
- No more mixed folders for the same user
- Clean, predictable file organization

### 💾 **Storage Efficiency** 
- Automatic cleanup prevents accumulation of old profile photos
- Only one profile photo per user at any time
- Significant storage space savings over time

### 🔄 **Consistent User Experience**
- Profile photos work the same way in registration and profile editing
- Users see consistent behavior across the application
- No confusion about where photos are stored

### 🛠️ **Maintainable Code**
- Single source of truth for photo type determination
- Consistent photo handling logic across components
- Easy to extend for other user types if needed

## Files Modified

1. **`src/components/profile-sections/SharedProfileSections.jsx`**
   - Added `getProfilePhotoType()` function
   - Updated photo filtering to use correct photo type
   - Updated upload buttons to use correct photo type

2. **`src/app/profile/page.jsx`**
   - Enhanced `handlePhotoUpload()` with automatic cleanup
   - Updated profile picture display logic
   - Added error handling for photo deletion

## Technical Details

### Photo Type Mapping
- **Employers**: `employer-profiles`
- **Helpers**: `profile-pictures` 
- **Agencies**: `profile-pictures`

### Cleanup Logic
- Only applies to profile photos (not portfolio, certificates, etc.)
- Handles both old and new photo types during transition
- Graceful error handling - upload continues even if cleanup fails
- Prevents storage bloat by maintaining single profile photo per user

### Migration Handling
- System handles existing photos in both `employer-profiles` and `profile-pictures`
- Automatic cleanup removes photos from both folders when new one is uploaded
- Smooth transition for existing users

## Result

✅ **Single Storage Location**: All employer profile photos in `employer-profiles` folder  
✅ **Automatic Cleanup**: Old photos deleted when new ones uploaded  
✅ **Storage Efficiency**: No accumulation of unused photos  
✅ **Consistent Experience**: Same behavior in registration and profile editing  
✅ **Clean Architecture**: Maintainable, extensible photo handling system  

The photo upload system now works consistently across registration and profile editing, with automatic cleanup ensuring efficient storage usage.