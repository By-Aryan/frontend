// utils/imageHelpers.js

// Normalize the base URL by removing trailing /api/v1 or similar
const backendBaseUrl = process.env.NEXT_PUBLIC_ASSETS_BASE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'https://localhost:8000');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Return preview URL if it's a File or Blob
  if (imagePath instanceof File || imagePath instanceof Blob) {
    return URL.createObjectURL(imagePath);
  }

  // Return as-is if it's already a blob or data URL
  if (typeof imagePath === 'string' &&
    (imagePath.startsWith('blob:') || imagePath.startsWith('data:'))) {
    return imagePath;
  }

  // Return full URL if already absolute
  if (typeof imagePath === 'string' &&
    (imagePath.startsWith('https://') || imagePath.startsWith('https://'))) {
    return imagePath;
  }

  // Handle relative paths that start with /uploads
  if (typeof imagePath === 'string' && imagePath.startsWith('/uploads')) {
    return `${backendBaseUrl}${imagePath}`;
  }

  // Handle relative paths that start with uploads (missing leading slash)
  if (typeof imagePath === 'string' && imagePath.startsWith('uploads/')) {
    return `${backendBaseUrl}/${imagePath}`;
  }

  // Fallback to returning as-is
  return imagePath;
};

// Function to handle user profile images with proper fallback
export const getUserImageUrl = (user) => {
  if (!user || !user.profile_photo) {
    return null;
  }

  return getImageUrl(user.profile_photo);
};

// JSX fallback component for user images
// This is returned as a string to be used as a reference for implementing in components
export const USER_IMAGE_FALLBACK = `<div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
  <span className="fas fa-user text-muted" style={{ fontSize: '48px' }} />
</div>`;
