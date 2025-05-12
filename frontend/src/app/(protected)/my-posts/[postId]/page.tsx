'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  imageUrl: string[];
  type: 'LISTING' | 'REQUEST';
  category: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  interests: Array<{
    id: string;
    createdAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  createdAt: string;
}

export default function PostDetail({ params }: { params: { postId: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInterests, setShowInterests] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/get-myPostById/${params.postId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch post');
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/delete-post?postId=${params.postId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete post');
      }

      router.push('/my-posts');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post');
    }
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <span className="mr-2">←</span> Back
        </button>
      </div>
      
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Post Image - Left Side */}
          <div className="md:w-1/2 relative h-[400px] md:h-auto bg-gray-100">
            <Image
              src={post.imageUrl[0] || '/img1.png'}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Post Details - Right Side */}
          <div className="md:w-1/2 p-8 flex flex-col">
            <div className="flex-grow">
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              
              <p className="text-gray-600 mb-4">
                {post.category.name}. Only in {post.user.firstName}'s hostel
              </p>

              <div className="space-y-6">
                <p className="text-gray-700">{post.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="text-2xl font-semibold">₹{post.price}/{post.priceUnit}</span>
                </div>

                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-gray-500">Tags</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">{post.category.name}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">Hostel</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons at the bottom */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setShowInterests(true)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 active:bg-gray-900 transform transition-all duration-200 hover:-translate-y-0.5"
              >
                View Interests ({post.interests.length})
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 active:bg-gray-800 transform transition-all duration-200 hover:-translate-y-0.5"
              >
                Mark as fulfilled
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interests Dialog with Blur Effect */}
      {showInterests && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowInterests(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Interested Users</h2>
                  <button
                    onClick={() => setShowInterests(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {post.interests.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No interests yet</p>
                ) : (
                  <div className="space-y-4">
                    {post.interests.map((interest) => (
                      <div
                        key={interest.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {interest.user.firstName} {interest.user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{interest.user.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            Accept
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            Reject
                          </button>
                          <button className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                            Chat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}