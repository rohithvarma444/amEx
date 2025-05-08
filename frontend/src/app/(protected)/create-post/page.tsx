'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import Link from 'next/link';
import { uploadImages } from '@/lib/uploadImage';

type PostType = 'listing' | 'request';

interface FormData {
  type: PostType | null;
  title: string;
  caption: string;
  description: string;
  images: File[];
  previewImages: string[];
  categories: string[];
  price: string;
  priceUnit: string;
}

const categories = [
  { id: 'food', name: 'Food', icon: '/img1.png' },
  { id: 'errands', name: 'Errands', icon: '/img2.png' },
  { id: 'electronics', name: 'Electronics', icon: '/img3.png' },
  { id: 'study-aids', name: 'Study Aids', icon: '/img4.png' },
  { id: 'mutual-benefit', name: 'Mutual Benefit', icon: '/img5.jpeg' },
  { id: 'skills', name: 'Skills', icon: '/img6.jpg' },
  { id: 'travel', name: 'Travel', icon: '/img7.jpg' },
  { id: 'hostel', name: 'Hostel', icon: '/img1.png' },
  { id: 'stationery', name: 'Stationery', icon: '/img2.png' },
  { id: 'games', name: 'Games', icon: '/img3.png' },
  { id: 'art', name: 'Art', icon: '/img4.png' },
];

const priceUnits = ['minute', 'hour', 'day', 'week', 'month', 'unit', 'kg'];

function CreatePost() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    type: null,
    title: '',
    caption: '',
    description: '',
    images: [],
    previewImages: [],
    categories: [],
    price: '',
    priceUnit: 'minute',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleNext = () => {
    // If we're on step 4 (categories) and mutual benefit is selected, skip step 5 (price)
    if (step === 4 && formData.categories.includes('mutual-benefit')) {
      setStep(prev => prev + 2); // Skip to step 6
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSkip = () => {
    setStep(prev => prev + 1);
  };

  const handleTypeSelect = (type: PostType) => {
    setFormData(prev => ({ ...prev, type }));
    handleNext();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => {
      const categories = [...prev.categories];
      if (categories.includes(categoryId)) {
        return { ...prev, categories: categories.filter(id => id !== categoryId) };
      } else {
        return { ...prev, categories: [...categories, categoryId] };
      }
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Create preview URLs for the images
    const previewUrls = acceptedFiles.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...acceptedFiles],
      previewImages: [...prev.previewImages, ...previewUrls]
    }));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 5
  });

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const newPreviewImages = [...prev.previewImages];
      
      // Release the object URL to avoid memory leaks
      URL.revokeObjectURL(newPreviewImages[index]);
      
      newImages.splice(index, 1);
      newPreviewImages.splice(index, 1);
      
      return {
        ...prev,
        images: newImages,
        previewImages: newPreviewImages
      };
    });
  };

  const uploadImagesToCloudinary = async () => {
    if (formData.images.length === 0) {
      return [];
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload all images and get their URLs
      const urls = await uploadImages(formData.images);
      console.log('Uploaded image URLs:', urls);
      return urls;
    } catch (err) {
      console.error('Error uploading images:', err);
      setUploadError('Failed to upload images. Please try again.');
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload images to Cloudinary
      const imageUrls = await uploadImagesToCloudinary();
      
      // Log the image URLs (as requested)
      console.log('Uploaded image URLs in order:', imageUrls);
      
      // Send the form data along with image URLs to your API
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrls,
        }),
      });
      
      // For now, just log the data that would be submitted
      console.log('Form data to be submitted:', {
        ...formData,
        imageUrls,
      });
      
      // Reset form or redirect
      // router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center space-x-2 mb-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index} 
            className={`h-1 rounded-full ${index + 1 <= step ? 'bg-black w-8' : 'bg-gray-300 w-6'}`}
          />
        ))}
        <span className="text-sm text-gray-500 ml-2">{step}/6</span>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-md mx-auto">
            <div className="flex items-center mb-8">
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                1
              </div>
              <h2 className="text-xl font-semibold">Select the type of post</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`border rounded-lg p-4 cursor-pointer hover:border-black ${formData.type === 'listing' ? 'border-black' : 'border-gray-300'}`}
                onClick={() => handleTypeSelect('listing')}
              >
                <h3 className="font-semibold mb-1">Listing</h3>
                <p className="text-sm text-gray-600">I'm selling an item</p>
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer hover:border-black ${formData.type === 'request' ? 'border-black' : 'border-gray-300'}`}
                onClick={() => handleTypeSelect('request')}
              >
                <h3 className="font-semibold mb-1">Request</h3>
                <p className="text-sm text-gray-600">I'm seeking an item or a service</p>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="max-w-md mx-auto">
            <div className="flex items-start mb-8">
              <button 
                onClick={handleBack}
                className="mr-4 mt-1"
                aria-label="Go back"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div>
                <div className="flex items-center mb-2">
                  <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                    2
                  </div>
                  <h2 className="text-xl font-semibold">
                    Enter the details of your {formData.type === 'listing' ? 'listing' : 'request'}
                  </h2>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Title (eg. Help me install Ubuntu on my system)"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              
              <div>
                <input
                  type="text"
                  name="caption"
                  value={formData.caption}
                  onChange={handleInputChange}
                  placeholder="Caption"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              
              <div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={`Describe your ${formData.type === 'listing' ? 'listing' : 'request'} here...`}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              
              <button
                onClick={handleNext}
                className="w-full bg-black text-white py-3 rounded-md font-medium"
              >
                Next
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="max-w-md mx-auto">
            <div className="flex items-start mb-8">
              <button 
                onClick={handleBack}
                className="mr-4 mt-1"
                aria-label="Go back"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                    3
                  </div>
                  <h2 className="text-xl font-semibold">Upload images</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">Posts with images reach a bigger audience.<br />Drag and drop or upload. Preferred aspect ratio is 4:5.</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex flex-wrap gap-4">
                {formData.previewImages.length > 0 && (
                  <div className="relative h-32 w-32 bg-gray-100 rounded-md overflow-hidden">
                    <Image 
                      src={formData.previewImages[0]} 
                      alt="Cover image" 
                      fill 
                      className="object-cover" 
                    />
                    <button 
                      onClick={() => removeImage(0)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1"
                      aria-label="Remove image"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                      Cover Image
                    </div>
                  </div>
                )}
                
                {formData.previewImages.slice(1).map((preview, index) => (
                  <div key={index + 1} className="relative h-32 w-32 bg-gray-100 rounded-md overflow-hidden">
                    <Image 
                      src={preview} 
                      alt={`Additional image ${index + 1}`} 
                      fill 
                      className="object-cover" 
                    />
                    <button 
                      onClick={() => removeImage(index + 1)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1"
                      aria-label="Remove image"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
                
                {formData.previewImages.length < 5 && (
                  <div 
                    {...getRootProps()} 
                    className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400"
                  >
                    <input {...getInputProps()} />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 12H19" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleSkip}
                className="text-gray-600 font-medium"
              >
                Skip
              </button>
              
              <button
                onClick={handleNext}
                className="bg-black text-white px-8 py-3 rounded-md font-medium"
              >
                Next
              </button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="max-w-md mx-auto">
            <div className="flex items-start mb-8">
              <button 
                onClick={handleBack}
                className="mr-4 mt-1"
                aria-label="Go back"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                    4
                  </div>
                  <h2 className="text-xl font-semibold">Select categories</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">Categories help your post show up in more pages.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              {categories.map(category => (
                <div 
                  key={category.id} 
                  className="flex flex-col items-center"
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <div className={`relative w-16 h-16 rounded-full overflow-hidden ${formData.categories.includes(category.id) ? 'ring-2 ring-black' : ''}`}>
                    <Image 
                      src={category.icon} 
                      alt={category.name} 
                      fill 
                      className="object-cover" 
                    />
                    {formData.categories.includes(category.id) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="text-sm mt-1">{category.name}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleSkip}
                className="text-gray-600 font-medium"
              >
                Skip
              </button>
              
              <button
                onClick={handleNext}
                className="bg-black text-white px-8 py-3 rounded-md font-medium"
              >
                Next
              </button>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="max-w-md mx-auto bg-white">
            <div className="flex items-start mb-8">
              <button 
                onClick={handleBack}
                className="mr-4 mt-1"
                aria-label="Go back"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                    5
                  </div>
                  <h2 className="text-xl font-semibold">Set a price</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {formData.type === 'listing' 
                    ? "Tell others how much you're willing to sell this item for. If it's free, simply enter ₹0."
                    : "Tell others how much you're willing to pay for this item or service. If you're open to any price, simply enter ₹0."}
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center space-x-2">
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <span className="px-3 text-gray-500">₹</span>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-24 p-3 border-0 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              
              {formData.price && (
                <div className="mt-4 text-lg">
                  <p className="font-medium text-gray-700">
                    You've set <span className="font-semibold text-black">₹{formData.price}</span> as the price for this {formData.type === 'listing' ? 'listing' : 'request'}.
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleNext}
              className="w-full bg-black text-white py-3 rounded-md font-medium"
            >
              Next
            </button>
          </div>
        );
      
      case 6:
        return (
          <div className="max-w-md mx-auto">
            <div className="flex items-start mb-8">
              <button 
                onClick={handleBack}
                className="mr-4 mt-1"
                aria-label="Go back"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                    6
                  </div>
                  <h2 className="text-xl font-semibold">Preview your post</h2>
                </div>
                <p className="text-sm text-gray-500 mb-4">Here's how your post will look like.</p>
              </div>
            </div>
            
            <div className="border border-gray-300 rounded-lg overflow-hidden mb-8">
              {/* Post Preview */}
              <div className="bg-white p-4">
                {formData.previewImages.length > 0 ? (
                  <div className="relative h-64 w-full mb-4 bg-gray-100 rounded-md overflow-hidden">
                    <Image 
                      src={formData.previewImages[0]} 
                      alt="Cover image" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                ) : (
                  <div className="h-64 w-full mb-4 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                
                <div className="mb-2">
                  <span className="text-sm text-gray-500">You</span>
                  <span className="text-xs text-gray-400 ml-2">Just now</span>
                </div>
                
                <h3 className="text-lg font-semibold mb-1">{formData.title || 'Untitled Post'}</h3>
                
                {formData.caption && <p className="text-sm mb-2">{formData.caption}</p>}
                
                <p className="text-sm text-gray-600 mb-3">{formData.description || 'No description provided.'}</p>
                
                {/* Price display in preview */}
                {formData.price && !formData.categories.includes('mutual-benefit') && (
                  <p className="font-bold">₹{formData.price}</p>
                )}
                
                {formData.categories.includes('mutual-benefit') && (
                  <p className="font-bold text-green-600">Mutual Benefit</p>
                )}
                
                {formData.categories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.categories.map(categoryId => {
                      const category = categories.find(c => c.id === categoryId);
                      return category ? (
                        <span key={categoryId} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {category.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
            
            {uploadError && (
              <div className="text-red-500 mb-4">{uploadError}</div>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className="w-full bg-black text-white py-3 rounded-md font-medium disabled:bg-gray-400"
            >
              {isUploading ? 'Uploading Images...' : 'Create Post'}
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">New Post</h1>
        {renderStepIndicator()}
        {renderStep()}
      </div>
    </div>
  );
}

export default CreatePost;