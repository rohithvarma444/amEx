"use client";

import { useState, useEffect } from 'react';
import PostGrid, { PostItem } from '@/components/PostGrid';
import { getAllListings } from '@/lib/dummyData';

export default function ListingsPage() {
  const [listings, setListings] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with a delay
    const fetchListings = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      // const response = await fetch('/api/listings');
      // const data = await response.json();
      
      // Using dummy data for now
      setTimeout(() => {
        setListings(getAllListings());
        setIsLoading(false);
      }, 800); // Simulate network delay
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <PostGrid
        posts={listings}
        title="All Listings"
        emptyMessage="No listings found. Check back later!"
        isLoading={isLoading}
      />
    </div>
  );
}