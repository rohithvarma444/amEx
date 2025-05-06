'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface ImageUploaderProps {
  onImagesChange: (images: File[], previewUrls: string[]) => void;
  maxImages?: number;
  existingPreviews?: string[];
  existingImages?: File[];
}

export default function ImageUploader({
  onImagesChange,
  maxImages = 5,
  existingPreviews = [],
  existingImages = [],
}: ImageUploaderProps) {
  const [images, setImages] = useState<File[]>(existingImages);
  const [previews, setPreviews] = useState<string[]>(existingPreviews);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Create preview URLs for the images
      const previewUrls = acceptedFiles.map((file) => URL.createObjectURL(file));

      const newImages = [...images, ...acceptedFiles];
      const newPreviews = [...previews, ...previewUrls];

      // Limit to maxImages
      const limitedImages = newImages.slice(0, maxImages);
      const limitedPreviews = newPreviews.slice(0, maxImages);

      setImages(limitedImages);
      setPreviews(limitedPreviews);
      onImagesChange(limitedImages, limitedPreviews);
    },
    [images, previews, maxImages, onImagesChange]
  );

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];

    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index]);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages, newPreviews);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    maxFiles: maxImages - images.length,
    disabled: images.length >= maxImages,
  });

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4">
        {previews.map((preview, index) => (
          <div
            key={index}
            className="relative h-32 w-32 bg-gray-100 rounded-md overflow-hidden"
          >
            <Image src={preview} alt={`Image ${index + 1}`} fill className="object-cover" />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-white rounded-full p-1"
              aria-label="Remove image"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {index === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                Cover Image
              </div>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <div
            {...getRootProps()}
            className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400"
          >
            <input {...getInputProps()} />
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19"
                stroke="#CCCCCC"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12H19"
                stroke="#CCCCCC"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
      {images.length > 0 && (
        <p className="text-sm text-gray-500 mt-2">
          {images.length} of {maxImages} images selected
        </p>
      )}
    </div>
  );
}