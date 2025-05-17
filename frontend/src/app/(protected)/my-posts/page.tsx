'use client';

import { useEffect, useState } from 'react';
import CardItem from '@/components/card-item';

interface Post {
  id: string;
  title: string;
  caption: string;
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

export default function MyPosts() {
  const [activeTab, setActiveTab] = useState<'LISTING' | 'REQUEST'>('LISTING');
  const [posts, setPosts] = useState<{
    listings: Post[];
    requests: Post[];
  }>({ listings: [], requests: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/get-myPosts');
        console.log('API Response:', response);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch posts');
        }

        console.log('API Response:', data);
        
        // Process the array of posts into listings and requests
        const allPosts = Array.isArray(data.data) ? data.data : [];
        const listings = allPosts.filter(post => post.type === 'LISTING');
        const requests = allPosts.filter(post => post.type === 'REQUEST');
        
        console.log('Processed Listings:', listings);
        console.log('Processed Requests:', requests);
        
        setPosts({
          listings,
          requests
        });
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const activePosts = activeTab === 'LISTING' ? posts?.listings || [] : posts?.requests || [];
  
  console.log('Active Posts:', activePosts);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('LISTING')}
            className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'LISTING' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
          >
            Listings
          </button>
          <button
            onClick={() => setActiveTab('REQUEST')}
            className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'REQUEST' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
          >
            Requests
          </button>
        </div>
      </div>

      {(activePosts && activePosts.length === 0) ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No {activeTab.toLowerCase()}s found. Create your first {activeTab.toLowerCase()}!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activePosts.map((post) => {
            console.log('Post being rendered:', post);
            console.log('Image URL:', post.imageUrl);
            return (
              <CardItem
                key={post.id}
                href={`/my-posts/${post.id}`}
                title={post.title}
                description={post.description}
                imageUrl={post.imageUrl?.[0] || '/img1.png'}
                price={post.price}
                priceUnit={post.priceUnit}
                category={post.category}
                user={post.user}
                createdAt={post.createdAt}
                interestsCount={post.interests.length}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}