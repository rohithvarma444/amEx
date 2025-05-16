"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs";

interface Post {
  id: string;
  title: string;
  description: string;
  price: string;
  priceUnit: string;
  location?: string;
  urgency?: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  imageUrl: string[];
  status: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const fetchPostById = async (postId: string): Promise<Post | null> => {
  try {
    const response = await fetch(`/api/get-postById?postId=${encodeURIComponent(postId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

export default function PostPage({ params }: { params: { postId: string } }) {
  const router = useRouter(); 
  const { user } = useUser(); 
  const { postId } = params;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmInterestModal, setShowConfirmInterestModal] = useState(false);
  const [showInterestSubmittedModal, setShowInterestSubmittedModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isAuthor = user && post && user.id === post.user.id;

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      const fetchedPost = await fetchPostById(postId);
      setPost(fetchedPost);
      setCurrentImageIndex(0); 
      setIsLoading(false);
    };
    loadPost();
  }, [postId]);

  const handleConfirmInterest = async () => {
    try {
      const response = await fetch('/api/register-intrest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          postId,
          message: interestMessage 
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to submit interest');
      }

      setShowConfirmInterestModal(false);
      setShowInterestSubmittedModal(true);
      setInterestMessage('');
    } catch (error) {
      console.error('Error submitting interest:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit interest');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading post...</div>;
  }

  if (!post) {
    return <div className="flex justify-center items-center h-screen">Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-sm mb-6"
      >
        <span>← Back</span>
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              {post.imageUrl && post.imageUrl.length > 0 && (
                <Image
                  src={post.imageUrl[currentImageIndex]}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            {post.imageUrl && post.imageUrl.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {post.imageUrl.map((url, index) => (
                  <button
                    key={url}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${index === currentImageIndex ? 'ring-2 ring-black' : ''}`}
                  >
                    <Image
                      src={url}
                      alt={`${post.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold">{post.title}</h1>
              <p className="text-gray-600 mt-1">{post.description}</p>
            </div>

            <div>
              <div className="text-2xl font-semibold">₹{post.price}/{post.priceUnit}</div>
              {post.location && (
                <p className="text-sm text-gray-500 mt-1">{post.location}</p>
              )}
            </div>

            {!isAuthor && (
              <button
                onClick={() => setShowConfirmInterestModal(true)}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition-colors"
              >
                I'm interested
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Interest Modal */}
      {showConfirmInterestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Interest</h2>
            <ul className="mb-4 text-sm space-y-2">
              <li>• You're requesting to purchase or participate in this listing.</li>
              <li>• The poster will see your interest and may choose to accept or decline.</li>
              <li>• You'll be notified once you're accepted.</li>
            </ul>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Add a message (optional)</label>
              <input
                type="text"
                placeholder="E.g. I'm happy to pay 50 for this"
                className="w-full p-2 border rounded-md"
                value={interestMessage}
                onChange={(e) => setInterestMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-gray-600"
                onClick={() => setShowConfirmInterestModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded-md"
                onClick={handleConfirmInterest}
              >
                Submit Interest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interest Submitted Modal */}
      {showInterestSubmittedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Interest Submitted!</h2>
            <p className="mb-4">The poster will review all responses and get back to you. You will be notified if you're accepted.</p>
            <p className="text-sm text-gray-500 mb-4">Note: You can view or cancel your responses from the "My Activity" tab.</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-black text-white rounded-md"
                onClick={() => setShowInterestSubmittedModal(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}