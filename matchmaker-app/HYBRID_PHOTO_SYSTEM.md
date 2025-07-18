# Hybrid Photo System Documentation

## Overview

The hybrid photo system combines the best of both Firebase and Supabase:

- **Photos**: Stored in Supabase (cost-effective storage)
- **Metadata**: Stored in Firebase Firestore (familiar database)
- **User Data**: Continues to be stored in Firebase

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │───▶│   API Route     │───▶│   Supabase      │    │   Firebase      │
│   PhotoUpload   │    │   /api/upload   │    │   Storage       │    │   Firestore     │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
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

**Flow**: Client → Server API → Supabase Storage + Firebase Metadata

## Security Benefits

- **Service Role Key**: Only used server-side in API routes (never exposed to browser)
- **Client Safety**: Browser code only has access to public keys
- **API Validation**: Server validates all uploads before processing
- **Type Safety**: File type and size validation on server

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

### 2. Client Photo Service

Direct access to the photo service:

```javascript
import { ClientPhotoService } from '../lib/client-photo-service';

// Upload a photo (uses server API)
const photoData = await ClientPhotoService.uploadPhoto(
  file,           // File object
  userId,         // User ID
  'profile',      // Photo type
  {},             // Additional metadata
  (progress) => console.log(`Progress: ${progress}%`)
);

// Get user photos
const photos = await ClientPhotoService.getUserPhotos(userId, 'profile');

// Delete a photo
await ClientPhotoService.deletePhoto(photoId, supabasePath, bucket);
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
4. **RLS Policies**: Configure Row Level Security policies (see below)

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
- **Current Setup**: Uses Supabase service role key to bypass RLS (secure but requires careful handling)
- **Future Enhancement**: Can be upgraded to use proper RLS policies with user authentication

### RLS Policy Setup (Optional)

If you want to set up proper RLS policies instead of using the service role key:

1. **Go to Supabase Dashboard** → Your Project → Authentication → Policies
2. **Add policies for storage.objects table**:

```sql
-- Allow users to upload to their own folder
CREATE POLICY "Allow users to upload to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own files
CREATE POLICY "Allow users to read their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access for public buckets
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');
```

3. **Repeat for each bucket** (profile-images, documents, company-logos)
4. **Update the hybrid photo service** to use regular Supabase client instead of service role

## Migration

If you need to migrate existing Firebase photos to the hybrid system:

1. Download photos from Firebase Storage
2. Upload to Supabase using `HybridPhotoService`
3. Update any hardcoded Firebase URLs to use the new metadata system