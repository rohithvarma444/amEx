"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation'; 
import { useUser } from "@clerk/nextjs"; // Import useUser

// Updated Post interface
interface Post {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string; 
  tags: string[];
  imageUrls: string[]; 
  author: {
    name: string;
    avatarUrl?: string;
  };
  authorId: string; // Added authorId
}

// Interface for an Interest
interface Interest {
  id: string;
  userId: string; 
  userName: string;
  userAvatar?: string; 
  message: string;
  timestamp: string; 
}

// Dummy function to simulate API call for fetching a post
// Update the fetchPostById function to use the real API
const fetchPostById = async (postId: string): Promise<Post | null> => {
  try {
    const response = await fetch('/api/get-myPostById', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

// Update the handleConfirmInterest function
const handleConfirmInterest = async () => {
  try {
    const response = await fetch(`/api/posts/${postId}/interest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: interestMessage })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to submit interest');
    }

    setShowConfirmInterestModal(false);
    setShowInterestSubmittedModal(true);
    setInterestMessage('');
  } catch (error) {
    console.error('Error submitting interest:', error);
    alert(error instanceof Error ? error.message : 'Failed to submit interest');
  }
};

// Dummy function to simulate API call for fetching interests
const fetchInterestsByPostId = async (postId: string): Promise<Interest[]> => {
  console.log(`Fetching interests for post ID: ${postId}`);
  // Replace with actual API call:
  // const response = await fetch(`/api/posts/${postId}/interests`);
  // const data = await response.json(); return data.interests;
  return [
    { id: "interest_1", userId: "user_clerk_interested_1", userName: "Rohith", message: "I'm very interested! Can I pick it up today?", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: "interest_2", userId: "user_clerk_interested_2", userName: "Priya", message: "Is the price negotiable?", timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: "interest_3", userId: "user_clerk_interested_3", userName: "Amit", message: "Available tomorrow evening?", timestamp: new Date(Date.now() - 10800000).toISOString() },
  ];
};


export default function PostPage() {
  const params = useParams();
  const router = useRouter(); 
  const { user } = useUser(); 
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmInterestModal, setShowConfirmInterestModal] = useState(false);
  const [showInterestSubmittedModal, setShowInterestSubmittedModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showInterestsListModal, setShowInterestsListModal] = useState(false);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState(false);
  const [showMarkFulfilledModal, setShowMarkFulfilledModal] = useState(false);

  const isAuthor = user && post && user.id === post.authorId;

  useEffect(() => {
    if (postId) {
      const loadPost = async () => {
        setIsLoading(true);
        const fetchedPost = await fetchPostById(postId);
        setPost(fetchedPost);
        setCurrentImageIndex(0); 
        setIsLoading(false);
      };
      loadPost();
    }
  }, [postId]);

  const handleShowInterestModal = () => {
    setShowConfirmInterestModal(true);
  };

  const handleConfirmInterest = async () => {
    setShowConfirmInterestModal(false);
    console.log("Submitting interest for post:", postId, "with message:", interestMessage, "by user:", user?.id);
    setShowInterestSubmittedModal(true); 
    setInterestMessage(''); 
  };

  const handleViewInterests = async () => {
    setShowInterestsListModal(true);
    setIsLoadingInterests(true);
    const fetchedInterests = await fetchInterestsByPostId(postId);
    setInterests(fetchedInterests);
    setIsLoadingInterests(false);
  };

  const handleMarkAsFulfilled = async () => {
    setShowMarkFulfilledModal(true);
    setIsLoading(true);
    setIsLoading(false);
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
                  priority={currentImageIndex === 0} 
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

            {/* CORRECTED PLACEMENT FOR CONDITIONAL BUTTONS */}
            {isAuthor ? (
              <div className="mt-6 space-y-3">
                <button 
                  onClick={handleViewInterests}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-150"
                >
                  View Interests ({interests.length > 0 ? interests.length : (isLoadingInterests ? '...' : '0')})
                </button>
                <button 
                  onClick={() => setShowMarkFulfilledModal(true)}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition duration-150"
                >
                  Mark as Fulfilled
                </button>
              </div>
            ) : (
              <button 
                onClick={handleShowInterestModal}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition duration-150 mt-4"
              >
                I'm interested
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Interest Modal (for non-authors) */}
      {showConfirmInterestModal && (
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
                onClick={() => setShowConfirmInterestModal(false)}
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

      {/* Interest Submitted Modal (for non-authors) */}
      {showInterestSubmittedModal && (
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
              onClick={() => setShowInterestSubmittedModal(false)}
              className="w-full max-w-xs mx-auto bg-black text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-gray-800 transition duration-150"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* View Interests Modal (for author) */}
      {isAuthor && showInterestsListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Interests Received</h2>
              <button onClick={() => setShowInterestsListModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {isLoadingInterests ? (
              <p className="text-center text-gray-600">Loading interests...</p>
            ) : interests.length > 0 ? (
              <div className="overflow-y-auto space-y-4">
                {interests.map(interest => (
                  <div key={interest.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-sm text-gray-600">
                        {interest.userName.substring(0,1)}
                      </div>
                      <h3 className="font-semibold text-gray-800">{interest.userName}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{interest.message}</p>
                    <p className="text-xs text-gray-400">{new Date(interest.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No interests received yet.</p>
            )}
            <button 
              onClick={() => setShowInterestsListModal(false)}
              className="mt-6 w-full bg-gray-200 text-gray-700 py-2.5 px-6 rounded-lg font-semibold hover:bg-gray-300 transition duration-150"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mark as Fulfilled Modal (for author) */}
      {isAuthor && showMarkFulfilledModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Mark Post as Fulfilled?</h2>
            <p className="text-sm text-gray-600 mb-6">
              This will indicate that the item/service is no longer available. This action might be irreversible depending on your setup.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowMarkFulfilledModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleMarkAsFulfilled}
                className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Yes, Mark as Fulfilled
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
