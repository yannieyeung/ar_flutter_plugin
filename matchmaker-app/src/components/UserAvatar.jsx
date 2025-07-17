import React from 'react';
import { useUserPhotos } from '@/hooks/useUserPhotos';

const UserAvatar = ({ 
  size = 'md', 
  user, 
  className = '', 
  showName = false,
  clickable = false 
}) => {
  const { photos } = useUserPhotos('profile-pictures');
  
  // Size mappings
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
    '2xl': 'h-32 w-32'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
    '2xl': 'h-16 w-16'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl'
  };

  const profilePhoto = photos.find(photo => photo.photoType === 'profile-pictures');

  const avatarContent = (
    <div className={`relative ${className}`}>
      {/* Avatar Image */}
      <div className={`
        ${sizeClasses[size]} 
        rounded-full overflow-hidden bg-gray-100 
        ${clickable ? 'cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2' : ''}
        transition-all duration-200
      `}>
        {profilePhoto ? (
          <img
            src={profilePhoto.url}
            alt={user?.fullName || 'Profile'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Name (if showName is true) */}
      {showName && (
        <div className="mt-2 text-center">
          <p className={`font-medium text-gray-900 ${textSizes[size]}`}>
            {user?.fullName || 'User'}
          </p>
          <p className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'} capitalize`}>
            {user?.userType || 'User'}
          </p>
        </div>
      )}
    </div>
  );

  return clickable ? (
    <button className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full">
      {avatarContent}
    </button>
  ) : (
    avatarContent
  );
};

export default UserAvatar;