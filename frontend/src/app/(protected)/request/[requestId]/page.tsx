"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation'; 

// Interface for a Request
interface RequestItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  priceOrBudget: string; // e.g., "₹40/pack", "Budget: ₹500"
  category: string; 
  tags: string[];
  imageUrls: string[]; 
  requester: { // Changed from author to requester
    name: string;
    avatarUrl?: string;
  };
  // Add other fields as per your request schema
}

// Dummy function to simulate API call for fetching a request
const fetchRequestById = async (requestId: string): Promise<RequestItem | null> => {
  console.log(`Fetching request with ID: ${requestId}`);
  // Replace with actual API call:
  // const response = await fetch(`/api/requests/${requestId}`);
  // const data = await response.json(); return data.request;
  
  // Dummy data for now, matching the image:
  if (requestId === "456") { // Example requestId
    return {
      id: "456",
      title: "Maggi Cooked to Order",
      shortDescription: "Perfect for midnight munchies. Only in Nila hostel.",
      fullDescription: "Looking for someone who can cook and deliver Maggi to Nila hostel, preferably late night. Pre-fill dropdown with 5-6 common units based on categories (time, quantity, event). Use smart defaults based on category (e.g., food: “packet”, service: “hour”). Validate custom unit to avoid weird inputs like emojis or paragraphs. Let the field auto-hide or collapse if they don’t want to use it for a cleaner look.",
      priceOrBudget: "₹40/pack",
      category: "Food",
      tags: ["Food", "Hostel", "Skills"],
      imageUrls: [ 
        "/img1.png", // Assuming this is the Maggi image from your screenshot
        "/placeholder-image-2.png", 
        "/placeholder-image-3.png"
      ], 
      requester: {
        name: "Requester Name", // Placeholder
      },
    };
  }
  return null;
};

export default function RequestPage() {
  const params = useParams();
  const router = useRouter(); 
  const requestId = params.requestId as string; // Changed from postId

  const [requestItem, setRequestItem] = useState<RequestItem | null>(null); // Changed from post
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [offerMessage, setOfferMessage] = useState(''); // Changed from interestMessage
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (requestId) {
      const loadRequest = async () => {
        setIsLoading(true);
        const fetchedRequest = await fetchRequestById(requestId);
        setRequestItem(fetchedRequest);
        setCurrentImageIndex(0); 
        setIsLoading(false);
      };
      loadRequest();
    }
  }, [requestId]);

  const handleShowOfferModal = () => { // Renamed
    setShowConfirmModal(true);
  };

  const handleConfirmOffer = async () => { // Renamed
    setShowConfirmModal(false);
    console.log("Submitting offer for request:", requestId, "with message:", offerMessage);
    // Dummy submission logic
    // Replace with actual API POST request to your endpoint for offers
    // try {
    //   const response = await fetch('/api/offers', { // Example endpoint
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ requestId, message: offerMessage, userId: 'current_user_id' }), // Get current_user_id from Clerk
    //   });
    //   if (response.ok) {
    //     setShowSubmittedModal(true);
    //   } else {
    //     alert('Failed to submit offer.');
    //   }
    // } catch (error) {
    //   console.error('Error submitting offer:', error);
    //   alert('An error occurred.');
    // }
    setShowSubmittedModal(true); 
    setOfferMessage(''); 
  };

  const nextImage = () => {
    if (requestItem && requestItem.imageUrls) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % requestItem.imageUrls.length);
    }
  };

  const prevImage = () => {
    if (requestItem && requestItem.imageUrls) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + requestItem.imageUrls.length) % requestItem.imageUrls.length);
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-[#f5efea]">Loading request...</div>;
  }

  if (!requestItem) {
    return <div className="flex justify-center items-center h-screen bg-[#f5efea]">Request not found.</div>;
  }

  return (
    <div className="min-h-screen  p-4 md:p-8"> {/* Adjusted background color */}
      <div className="w-full max-w-6xl mx-auto"> {/* Added max-width and centering for content area */}
        <button 
          onClick={() => router.back()} 
          className="text-sm text-gray-700 hover:text-black mb-6 inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-transparent md:flex md:gap-8"> {/* Transparent background for content, added gap */}
          {/* Image Section */}
          <div className="md:w-1/2">
            <div className="relative w-full h-80 md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden mb-3 group shadow-md">
              {requestItem.imageUrls && requestItem.imageUrls.length > 0 && (
                <Image 
                  src={requestItem.imageUrls[currentImageIndex]} 
                  alt={`${requestItem.title} - image ${currentImageIndex + 1}`}
                  layout="fill" 
                  objectFit="cover" 
                  priority={currentImageIndex === 0} 
                />
              )}
              {requestItem.imageUrls && requestItem.imageUrls.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    aria-label="Previous image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    aria-label="Next image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>
            
            {requestItem.imageUrls && requestItem.imageUrls.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {requestItem.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden border-2 focus:outline-none shadow
                                ${currentImageIndex === index ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image src={url} alt={`thumbnail ${index + 1}`} layout="fill" objectFit="cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 mt-6 md:mt-0">
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-1">{requestItem.title}</h1>
            <p className="text-gray-700 mb-3 text-sm">{requestItem.shortDescription}</p>
            <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-5">{requestItem.priceOrBudget}</p>
            
            <div className="mb-5">
              {/* <h3 className="text-md font-semibold text-gray-800 mb-1">Full Description</h3> */}
              <p className="text-gray-600 text-sm leading-relaxed">{requestItem.fullDescription}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {requestItem.tags.map((tag, index) => (
                  <span key={tag} className="text-xs text-gray-600">
                    {tag}{index < requestItem.tags.length - 1 && <span className="mx-1">•</span>}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={handleShowOfferModal}
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition duration-150 mt-6"
            >
              Offer to Fulfill
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Offer Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Confirm Offer</h2>
            <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1.5">
              <li>You're offering to fulfill this request.</li>
              <li>The poster will see your offer and may choose to accept or decline.</li>
              <li>You'll be notified once you're accepted.</li>
            </ul>
            <div className="mb-5">
              <label htmlFor="offerMessage" className="block text-sm font-medium text-gray-700 mb-1">Add a message (optional)</label>
              <textarea 
                id="offerMessage"
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                rows={3}
                placeholder="Eg. I'm ready to do this even for 40 rupees"
                className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-black focus:border-black"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmOffer}
                className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"
              >
                Submit Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Submitted Modal */}
      {showSubmittedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-2xl w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">Offer Submitted!</h2> {/* Changed title */}
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