"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation'; 

// Updated Post interface for multiple images
interface Post {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string; 
  tags: string[];
  imageUrls: string[]; // Changed from imageUrl to imageUrls array
  author: {
    name: string;
    avatarUrl?: string;
  };
}

// Dummy function to simulate API call
const fetchPostById = async (postId: string): Promise<Post | null> => {
  console.log(`Fetching post with ID: ${postId}`);
  // Replace with actual API call
  
  if (postId === "123") { 
    return {
      id: "123",
      title: "Maggi Cooked to Order",
      description: "Perfect for midnight munchies. Only in Nila hostel. Pre-fill dropdown with 5-6 common units based on categories (time, quantity, event). Use smart defaults based on category (e.g., food: “packet”, service: “hour”). Validate custom unit to avoid weird inputs like emojis or paragraphs. Let the field auto-hide or collapse if they don’t want to use it for a cleaner look.",
      price: "₹40/pack",
      category: "Food",
      tags: ["Food", "Hostel", "Skills"],
      imageUrls: [ // Array of image URLs
        "/img1.png", 
        "/placeholder-image-2.png", // Add more dummy image paths
        "/placeholder-image-3.png"
      ], 
      author: {
        name: "Seller Name",
      },
    };
  }
  return null;
};

export default function PostPage() {
  const params = useParams();
  const router = useRouter(); 
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for active image

  useEffect(() => {
    if (postId) {
      const loadPost = async () => {
        setIsLoading(true);
        const fetchedPost = await fetchPostById(postId);
        setPost(fetchedPost);
        setCurrentImageIndex(0); // Reset image index when post loads
        setIsLoading(false);
      };
      loadPost();
    }
  }, [postId]);

  const handleShowInterest = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmInterest = async () => {
    setShowConfirmModal(false);
    console.log("Submitting interest for post:", postId, "with message:", interestMessage);
    setShowSubmittedModal(true); 
    setInterestMessage(''); 
  };

  const nextImage = () => {
    if (post && post.imageUrls) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % post.imageUrls.length);
    }
  };

  const prevImage = () => {
    if (post && post.imageUrls) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + post.imageUrls.length) % post.imageUrls.length);
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading post...</div>;
  }

  if (!post) {
    return <div className="flex justify-center items-center h-screen">Post not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-full">
        <button 
          onClick={() => router.back()} 
          className="text-sm text-gray-600 hover:text-gray-800 mb-6 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white md:flex">
          <div className="md:w-1/2 p-2 md:p-4">
            {/* Main Image with Slider Controls */}
            <div className="relative w-full h-80 md:h-[500px] rounded-md overflow-hidden mb-4 group">
              {post.imageUrls && post.imageUrls.length > 0 && (
                <Image 
                  src={post.imageUrls[currentImageIndex]} 
                  alt={`${post.title} - image ${currentImageIndex + 1}`}
                  layout="fill" 
                  objectFit="cover" 
                  priority={currentImageIndex === 0} // Prioritize loading the first image
                />
              )}
              {post.imageUrls && post.imageUrls.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    aria-label="Previous image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    aria-label="Next image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail images */}
            {post.imageUrls && post.imageUrls.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {post.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`relative w-20 h-20 rounded overflow-hidden border-2 focus:outline-none
                                ${currentImageIndex === index ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image src={url} alt={`thumbnail ${index + 1}`} layout="fill" objectFit="cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          {/* Adjusted padding for wider layout */}
          <div className="md:w-1/2 p-4 md:p-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{post.title}</h1>
            <p className="text-gray-600 mb-4 text-sm md:text-base">{post.description.split('. ')[0]}.</p>
            <p className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-6">{post.price}</p>
            
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-700 mb-2">Full Description</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">{post.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-700 mb-1">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            <button 
              onClick={handleShowInterest}
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition duration-150 mt-4"
            >
              I'm interested
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Interest Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Confirm Interest</h2>
            <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
              <li>You're requesting to purchase or participate in this listing.</li>
              <li>The poster will see your interest and may choose to accept or decline.</li>
              <li>You'll be notified once you're accepted.</li>
            </ul>
            <div className="mb-4">
              <label htmlFor="interestMessage" className="block text-sm font-medium text-gray-700 mb-1">Add a message (optional)</label>
              <textarea 
                id="interestMessage"
                value={interestMessage}
                onChange={(e) => setInterestMessage(e.target.value)}
                rows={3}
                placeholder="Eg. I'm happy to pay ₹50 for this"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmInterest}
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
              >
                Submit interest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interest Submitted Modal */}
      {showSubmittedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-xl w-full max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-3">Interest Submitted!</h2>
            <p className="text-sm text-gray-600 mb-4">
              The poster will review all responses and get back to you. You will be notified if you're accepted.
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Note: You can view or cancel your responses from the "My Activity" tab.
            </p>
            <button 
              onClick={() => setShowSubmittedModal(false)}
              className="w-full max-w-xs mx-auto bg-black text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-gray-800 transition duration-150"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}