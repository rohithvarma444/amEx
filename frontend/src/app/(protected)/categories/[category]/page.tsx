"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PostGrid, { PostItem } from '@/components/PostGrid';
import { getAllListings, getAllRequests } from '@/lib/dummyData';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState<'listings' | 'requests'>('listings');

  useEffect(() => {
    // Simulate API call with a delay
    const fetchCategoryPosts = async () => {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      // const response = await fetch(`/api/${viewType}?category=${category}`);
      // const data = await response.json();
      
      // Using dummy data for now
      setTimeout(() => {
        const allPosts = viewType === 'listings' ? getAllListings() : getAllRequests();
        // Filter by category (case insensitive)
        const filteredPosts = allPosts.filter(
          post => post.category.toLowerCase() === category.toLowerCase()
        );
        setPosts(filteredPosts);
        setIsLoading(false);
      }, 800); // Simulate network delay
    };

    if (category) {
      fetchCategoryPosts();
    }
  }, [category, viewType]);

  const toggleViewType = () => {
    setViewType(prev => prev === 'listings' ? 'requests' : 'listings');
  };

  if (!category) {
    return <div className="text-center py-12">Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            {category} {viewType === 'listings' ? 'Listings' : 'Requests'}
          </h1>
          
          <button 
            onClick={toggleViewType}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
          >
            Switch to {viewType === 'listings' ? 'Requests' : 'Listings'}
          </button>
        </div>
      </div>
      
      <PostGrid
        posts={posts}
        title={`${category} ${viewType === 'listings' ? 'Listings' : 'Requests'}`}
        emptyMessage={`No ${viewType} found in this category.`}
        isLoading={isLoading}
      />
    </div>
  );
}