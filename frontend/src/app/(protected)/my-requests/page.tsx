"use client";

import { useState, useEffect } from 'react';
import PostGrid, { PostItem } from '@/components/PostGrid';
import { getMyRequests } from '@/lib/dummyData';

export default function MyRequestsPage() {
  const [myRequests, setMyRequests] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with a delay
    const fetchMyRequests = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call with auth
      // const response = await fetch('/api/my-requests', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // Using dummy data for now
      setTimeout(() => {
        setMyRequests(getMyRequests());
        setIsLoading(false);
      }, 800); // Simulate network delay
    };

    fetchMyRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Create request button removed */}
      
      <PostGrid
        posts={myRequests}
        title="My Requests"
        emptyMessage="You haven't created any requests yet."
        isLoading={isLoading}
      />
    </div>
  );
}