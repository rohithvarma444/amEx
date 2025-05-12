'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoriesSlider from '../../../components/categories-slider';
import CardGrid from '../../../components/card-grid';
import Link from 'next/link';

// Types for our data
interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface Post {
  id: string;
  title: string;
  caption: string;
  description: string;
  price: string;
  priceUnit: string;
  category: string;
  imageUrl: string;
  createdAt: string;
  user: User;
  urgency?: string;
}

interface DashboardData {
  listings: Post[];
  requests: Post[];
  urgentRequests: Post[];
}

function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({ 
    listings: [], 
    requests: [], 
    urgentRequests: [] 
  });

  console.log(dashboardData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get('/api/dashboard');
        console.log('Dashboard Data:', response.data);

        if (response.data.success) {
          setDashboardData({
            listings: response.data.listings.map((item: Post) => ({
              ...item,
              href: `/post/${item.id}`,
              image: item.imageUrl,
              user: {
                ...item.user,
                name: `${item.user.firstName} ${item.user.lastName}`
              }
            })),
            requests: response.data.requests.map((item: Post) => ({
              ...item,
              href: `/post/${item.id}`,
              image: item.imageUrl,
              user: {
                ...item.user,
                name: `${item.user.firstName} ${item.user.lastName}`
              }
            })),
            urgentRequests: response.data.urgentRequests.map((item: Post) => ({
              ...item,
              href: `/post/${item.id}`,
              image: item.imageUrl,
              user: {
                ...item.user,
                name: `${item.user.firstName} ${item.user.lastName}`
              }
            }))
          });
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-black text-white px-6 py-3 rounded-md font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <CategoriesSlider />
      
      <CardGrid 
        title="Recent Requests" 
        items={dashboardData.urgentRequests} 
        viewAllHref="/requests" 
        type="requests" 
      />
      
      <CardGrid 
        title="Browse Listings" 
        items={dashboardData.listings} 
        viewAllHref="/listings" 
        type="listings" 
      />
      
      <CardGrid 
        title="Browse Requests" 
        items={dashboardData.requests} 
        viewAllHref="/requests" 
        type="requests" 
      />
      
      <div className="w-full border-t border-gray-200 mt-12 pt-12 pb-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Haven't found what you're looking for?</h2>
        <Link 
          href="/create-post" 
          className="inline-block bg-black text-white px-6 py-3 rounded-md font-bold"
        >
          Create a Post
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;