'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ChatButton from '@/components/chat-button';

interface Post {
  id: string;
  title: string;
  description?: string;
  price: number;
  priceUnit: string;
  imageUrl: string[];
  type: 'LISTING' | 'REQUEST';
  status: string;
  category: {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    upiId?: string;
  };
  interests: Array<{
    id: string;
    description: string;
    createdAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  deal?: {
    id: string;
    status: string;
    createdAt: string;
    completedAt?: string;
    selectedUser: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  createdAt: string;
}

export default function PostDetail({ params }: { params: { postId: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInterests, setShowInterests] = useState(false);
  const [expandedInterest, setExpandedInterest] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/get-myPosts?postId=${params.postId}`);
        if (!response.ok) {
          // Check content type to handle non-JSON responses
          const contentType = response.headers.get('content-type');
          if (contentType && !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error(`Server returned non-JSON response: ${response.status}`);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch post');
        }

        setPost(data.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.postId]);

  const handleMarkAsFulfilled = async () => {
    if (!confirm('Are you sure you want to mark this post as fulfilled?')) return;

    try {
      const response = await fetch(`/api/delete-post?postId=${params.postId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to mark post as fulfilled');
      }

      router.push('/my-posts');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to mark post as fulfilled');
    }
  };

  const toggleInterestOptions = (interestId: string) => {
    setExpandedInterest(expandedInterest === interestId ? null : interestId);
  };

  const handleMakeDeal = async (interestId: string, userId: string) => {
    // First confirm with the user
    if (!confirm('Are you sure you want to create a deal with this user?')) {
      return;
    }
    
    try {
      // API call to create a deal
      const response = await fetch('/api/create-deal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: params.postId,
          userId: userId,
          interestId: interestId
        }),
      });
      
      // Check for non-JSON responses
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!data.success) {
        throw new Error(data.message || 'Failed to create deal');
      }
  
      // Show success message
      alert('Deal created successfully!');
      
      // Redirect to my-activity page
      router.push('/my-activity');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create deal');
    }
  };

  const handleChat = () => {
    setAlertMessage('Please chat with the user before confirming the deal. Remember that there can only be one active deal at any point of time for a post.');
    setShowAlert(true);
  };

  const handleAlertConfirm = () => {
    setShowAlert(false);
    // Here we could add logic to navigate to a chat interface if needed
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">{error || 'Post not found'}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="sticky top-0 z-10 backdrop-blur-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 w-full">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="mr-2">←</span> Back
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Image Gallery */}
            <div className="relative h-[400px] lg:h-[600px]">
              <Image
                src={post.imageUrl[0] || '/img1.png'}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Post Details */}
            <div className="p-8 flex flex-col h-full">
              <div className="flex-grow space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                  <p className="text-lg text-gray-600">
                    {post.category.name}
                  </p>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700">
                  {post.description}
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl">
                  <span className="text-3xl font-semibold text-gray-900">
                    ₹{post.price}/{post.priceUnit}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-base font-medium text-gray-700">Category</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-xl text-base font-medium">
                      {post.category.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Now in a row */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setShowInterests(true)}
                  className="flex-1 px-6 py-4 bg-black text-white rounded-xl text-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  View Interests ({post.interests.length})
                </button>
                <button
                  onClick={handleMarkAsFulfilled}
                  className="flex-1 px-6 py-4 bg-black text-white rounded-xl text-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Mark as fulfilled
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interests Modal */}
      {showInterests && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
              onClick={() => setShowInterests(false)}
            />

            <div className="relative bg-white rounded-2xl max-w-2xl w-full mx-auto shadow-xl transform transition-all max-h-[80vh] overflow-hidden">
              <div className="absolute right-4 top-4">
                <button
                  onClick={() => setShowInterests(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Interested Users</h3>

                <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                  {post.interests.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No interests yet</p>
                    </div>
                  ) : (
                    post.interests.map((interest) => (
                      <div
                        key={interest.id}
                        className="bg-gray-50 rounded-xl p-6 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-medium text-gray-900">
                            {interest.user.firstName} {interest.user.lastName}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-500">
                              {new Date(interest.createdAt).toLocaleDateString()}
                            </div>
                            <button 
                              onClick={() => toggleInterestOptions(interest.id)}
                              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                              aria-label="Show options"
                            >
                              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {interest.description && (
                          <p className="text-gray-700 text-base">{interest.description}</p>
                        )}
                        <div className="text-sm text-gray-500">{interest.user.email}</div>
                        
                        {/* Options that appear when > is clicked */}
                        {expandedInterest === interest.id && (
                          <div className="absolute right-6 top-14 bg-white shadow-lg rounded-lg overflow-hidden z-10 border border-gray-200">
                            <button 
                              onClick={() => handleMakeDeal(interest.id, interest.user.id)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Make a Deal
                            </button>
                            <ChatButton
                              postId={params.postId}
                              participantId={interest.user.id}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-sm font-medium flex items-center gap-2"
                              buttonText="Chat"
                            />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Dialog */}
      {showAlert && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
              onClick={() => setShowAlert(false)}
            />

            <div className="relative bg-white rounded-xl max-w-md w-full mx-auto shadow-xl transform transition-all p-6">
              <div className="text-center">
                <svg className="h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chat Before Deal</h3>
                <p className="text-sm text-gray-600 mb-6">{alertMessage}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAlert(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAlertConfirm}
                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    I Understand
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}