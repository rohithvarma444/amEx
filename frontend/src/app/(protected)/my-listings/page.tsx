"use client";

import { useState, useEffect } from 'react';
import PostGrid, { PostItem } from '@/components/PostGrid';

export default function MyListingsPage() {
  const [myListings, setMyListings] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with a delay
    const fetchMyListings = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call with auth
      // const response = await fetch('/api/my-listings', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // Using dummy data for now
      setTimeout(() => {
        setMyListings(getMyListings());
        setIsLoading(false);
      }, 800); // Simulate network delay
    };

    fetchMyListings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Create listing button removed */}
      
      <PostGrid
        posts={myListings}
        title="My Listings"
        emptyMessage="You haven't created any listings yet."
        isLoading={isLoading}
      />
    </div>
  );
}