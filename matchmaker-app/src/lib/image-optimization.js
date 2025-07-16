// Image Optimization for Cost Savings
// Reduces file sizes before uploading to Firebase Storage

/**
 * Compress and resize image before upload
 * @param {File} file - Original image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Optimized image file
 */
export const optimizeImage = async (file, options = {}) => {
  const {
    maxWidth = 1200,        // Max width in pixels
    maxHeight = 1200,       // Max height in pixels  
    quality = 0.8,          // JPEG quality (0.1 to 1.0)
    format = 'webp'         // Output format: 'webp', 'jpeg', 'png'
  } = options;

  return new Promise((resolve, reject) => {
    // Create canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = calculateDimensions(
        img.width, 
        img.height, 
        maxWidth, 
        maxHeight
      );

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create new file with optimized blob
            const optimizedFile = new File(
              [blob], 
              getOptimizedFileName(file.name, format),
              { type: `image/${format}` }
            );
            
            console.log(`Image optimized: ${file.size} → ${optimizedFile.size} bytes (${Math.round((1 - optimizedFile.size/file.size) * 100)}% reduction)`);
            
            resolve(optimizedFile);
          } else {
            reject(new Error('Failed to optimize image'));
          }
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Calculate new dimensions maintaining aspect ratio
 */
const calculateDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
  let width = originalWidth;
  let height = originalHeight;

  // Scale down if needed
  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return { width: Math.round(width), height: Math.round(height) };
};

/**
 * Generate optimized filename
 */
const getOptimizedFileName = (originalName, format) => {
  const nameWithoutExt = originalName.split('.').slice(0, -1).join('.');
  return `${nameWithoutExt}_optimized.${format}`;
};

/**
 * Predefined optimization presets
 */
export const OPTIMIZATION_PRESETS = {
  THUMBNAIL: {
    maxWidth: 300,
    maxHeight: 300,
    quality: 0.7,
    format: 'webp'
  },
  PROFILE_PICTURE: {
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.8,
    format: 'webp'
  },
  PORTFOLIO_PHOTO: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.85,
    format: 'webp'
  },
  DOCUMENT: {
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 0.9,
    format: 'jpeg'
  }
};

/**
 * Smart optimization based on file type and intended use
 */
export const smartOptimize = async (file, usage = 'general') => {
  // Skip if file is already small
  if (file.size < 100 * 1024) { // Less than 100KB
    console.log('File already small, skipping optimization');
    return file;
  }

  // Choose preset based on usage
  let preset = OPTIMIZATION_PRESETS.PORTFOLIO_PHOTO; // default
  
  switch (usage) {
    case 'thumbnail':
      preset = OPTIMIZATION_PRESETS.THUMBNAIL;
      break;
    case 'profile':
      preset = OPTIMIZATION_PRESETS.PROFILE_PICTURE;
      break;
    case 'portfolio':
      preset = OPTIMIZATION_PRESETS.PORTFOLIO_PHOTO;
      break;
    case 'document':
      preset = OPTIMIZATION_PRESETS.DOCUMENT;
      break;
  }

  return optimizeImage(file, preset);
};