import { useState, useEffect } from 'react';
import { ClientPhotoService } from '../lib/client-photo-service';
import { useAuth } from '../contexts/AuthContext';

export const useUserPhotos = (photoType = null) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchPhotos = async () => {
    if (!user) {
      setPhotos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userPhotos = await ClientPhotoService.getUserPhotos(user.uid, photoType);
      setPhotos(userPhotos);
      setError(null);
    } catch (err) {
      console.error('Error fetching user photos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [user, photoType]);

  const addPhoto = (newPhoto) => {
    setPhotos(prev => [newPhoto, ...prev]);
  };

  const updatePhoto = (photoId, updates) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === photoId ? { ...photo, ...updates } : photo
      )
    );
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  return {
    photos,
    loading,
    error,
    refetch: fetchPhotos,
    addPhoto,
    updatePhoto,
    removePhoto
  };
};