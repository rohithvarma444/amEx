"use client";

import { useState, useEffect } from 'react';
import PostGrid, { PostItem } from '@/components/PostGrid';
//import { getAllRequests } from '@/lib/dummyData';

export default function RequestsPage() {
  const [requests, setRequests] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with a delay
    const fetchRequests = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      // const response = await fetch('/api/requests');
      // const data = await response.json();
      
      // Using dummy data for now
      setTimeout(() => {
        setRequests(getAllRequests());
        setIsLoading(false);
      }, 800); // Simulate network delay
    };

    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <PostGrid
        posts={requests}
        title="All Requests"
        emptyMessage="No requests found. Check back later!"
        isLoading={isLoading}
      />
    </div>
  );
}