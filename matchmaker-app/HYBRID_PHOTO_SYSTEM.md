# Hybrid Photo System Documentation

## Overview

The hybrid photo system combines the best of both Firebase and Supabase:

- **Photos**: Stored in Supabase (cost-effective storage)
- **Metadata**: Stored in Firebase Firestore (familiar database)
- **User Data**: Continues to be stored in Firebase

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Photo File    │───▶│   Supabase      │    │   Firebase      │
│   (Image)       │    │   Storage       │    │   Firestore     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                              │                 │
                                              │   Photo         │
                                              │   Metadata      │
                                              │   - URL         │
                                              │   - Path        │
                                              │   - User ID     │
                                              │   - Upload Date │
                                              │   - File Info   │
                                              └─────────────────┘
```

## Usage

### 1. PhotoUpload Component

The `PhotoUpload` component automatically handles the hybrid upload process:

```jsx
import PhotoUpload from '../components/PhotoUpload';

function MyComponent() {
  const [photos, setPhotos] = useState([]);

  return (
    <PhotoUpload
      label="Profile Pictures"
      description="Upload your profile photo"
      maxFiles={1}
      photos={photos}
      onChange={setPhotos}
      uploadPath="profile-pictures"
    />
  );
}
```

### 2. Hybrid Photo Service

Direct access to the photo service:

```javascript
import { HybridPhotoService } from '../lib/hybrid-photo-service';

// Upload a photo
const photoData = await HybridPhotoService.uploadPhoto(
  file,           // File object
  userId,         // User ID
  'profile',      // Photo type
  {},             // Additional metadata
  (progress) => console.log(`Progress: ${progress}%`)
);

// Get user photos
const photos = await HybridPhotoService.getUserPhotos(userId, 'profile');

// Delete a photo
await HybridPhotoService.deletePhoto(photoId, supabasePath, bucket);
```

### 3. useUserPhotos Hook

React hook for fetching and managing user photos:

```jsx
import { useUserPhotos } from '../hooks/useUserPhotos';

function PhotoGallery() {
  const { photos, loading, error, refetch } = useUserPhotos('profile');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {photos.map(photo => (
        <img key={photo.id} src={photo.url} alt={photo.originalName} />
      ))}
    </div>
  );
}
```

### 4. UserPhotoGallery Component

Pre-built component for displaying user photos:

```jsx
import UserPhotoGallery from '../components/UserPhotoGallery';

function UserProfile() {
  return (
    <div>
      <UserPhotoGallery photoType="profile" title="Profile Photos" />
      <UserPhotoGallery photoType="portfolio" title="Portfolio" />
    </div>
  );
}
```

## Data Structure

### Photo Metadata (stored in Firebase)

```javascript
{
  id: "firebase_document_id",
  userId: "user_uid",
  photoType: "profile|portfolio|certificates|etc",
  fileName: "1234567890_photo.jpg",
  originalName: "photo.jpg",
  fileSize: 1024000,
  mimeType: "image/jpeg",
  supabasePath: "user_uid/profile/1234567890_photo.jpg",
  supabaseUrl: "https://project.supabase.co/storage/v1/object/public/bucket/path",
  bucket: "profile-images",
  uploadedAt: "2024-01-15T10:30:00Z",
  // ... any additional metadata
}
```

## Benefits

1. **Cost Savings**: Supabase storage is more cost-effective for large files
2. **Familiar Database**: Continue using Firebase Firestore for metadata
3. **Seamless Integration**: Existing Firebase user system continues to work
4. **Flexibility**: Easy to query and filter photos by user, type, date, etc.
5. **Consistency**: Single source of truth for photo metadata

## Setup Requirements

1. **Supabase Project**: Create buckets for different photo types
2. **Environment Variables**: Add Supabase credentials to `.env.local`
3. **Firebase Collections**: `user_photos` collection is created automatically

## Photo Types

- `profile`: Profile pictures
- `portfolio`: Portfolio/work photos
- `certificates`: Certificates and training documents
- `experience-proof`: Work experience proof
- `identity-documents`: ID documents

## Error Handling

The system includes comprehensive error handling:

- File validation (size, type)
- Network error handling
- Automatic retry logic
- User-friendly error messages

## Security

- Photos are organized by user ID in Supabase
- Firebase rules control metadata access
- Supabase RLS (Row Level Security) can be configured for additional protection

## Migration

If you need to migrate existing Firebase photos to the hybrid system:

1. Download photos from Firebase Storage
2. Upload to Supabase using `HybridPhotoService`
3. Update any hardcoded Firebase URLs to use the new metadata system