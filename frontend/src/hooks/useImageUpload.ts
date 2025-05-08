import { useState } from 'react';
import { uploadImages } from '@/lib/uploadImage';

export function useImageUpload(maxImages = 5) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addImages = (newFiles: File[]) => {
    // Create preview URLs for the images
    const previewUrls = newFiles.map((file) => URL.createObjectURL(file));

    const newImages = [...images, ...newFiles];
    const newPreviews = [...previews, ...previewUrls];

    // Limit to maxImages
    const limitedImages = newImages.slice(0, maxImages);
    const limitedPreviews = newPreviews.slice(0, maxImages);

    setImages(limitedImages);
    setPreviews(limitedPreviews);
    return { images: limitedImages, previews: limitedPreviews };
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];

    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index]);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setPreviews(newPreviews);
    return { images: newImages, previews: newPreviews };
  };

  const uploadImagesToCloudinary = async () => {
    if (images.length === 0) {
      return [];
    }

    setIsUploading(true);
    setError(null);

    try {
      // Upload all images and get their URLs
      const urls = await uploadImages(images);
      console.log('Uploaded image URLs:', urls);
      setUploadedUrls(urls);
      return urls;
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images. Please try again.');
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const clearImages = () => {
    // Clean up object URLs to prevent memory leaks
    previews.forEach(URL.revokeObjectURL);
    setImages([]);
    setPreviews([]);
    setUploadedUrls([]);
  };

  return {
    images,
    previews,
    isUploading,
    uploadedUrls,
    error,
    addImages,
    removeImage,
    uploadImagesToCloudinary,
    clearImages,
  };
}