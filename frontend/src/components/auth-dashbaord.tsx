'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  createdAt: string;
}

function AuthDashboard() {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch user data from our API
        const response = await fetch('/api/get-user');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [user, isLoaded]);

  const handleSignOut = async () => {
    await clerk.signOut();
    window.location.href = '/';
  };

  if (!isLoaded || loading) {
    return (
      <div className="bg-transparent text-black p-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="font-bold text-xl">amEx</div>
          <div className="flex space-x-6">
            <Link href="/listings" className="text-black hover:text-gray-600 font-bold">Listings</Link>
            <Link href="/requests" className="text-black hover:text-gray-600 font-bold">Requests</Link>
          </div>
        </div>
        <div className="animate-pulse bg-gray-300 h-10 w-10 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-transparent text-black p-4 flex items-center justify-between">
        <div className="flex items-center space-x-8 flex-1">
          <div className="font-bold text-xl">amEx</div>
          <div className="flex space-x-6">
            <Link href="/listings" className="text-black hover:text-gray-600 font-bold">Listings</Link>
            <Link href="/requests" className="text-black hover:text-gray-600 font-bold">Requests</Link>
          </div>
          <div className="relative flex-1 mx-4">
            <input 
              type="text" 
              placeholder="Search for items, services, categories, and more..." 
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <svg 
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <Link href="/sign-in" className="bg-black text-white px-4 py-2 rounded-md text-sm font-bold">
          Sign In
        </Link>
      </div>
    );
  }

  // Use userData if available, otherwise fall back to Clerk user data
  const displayName = userData?.firstName || user.firstName || 'User';
  const fullName = `${userData?.firstName || user.firstName || ''} ${userData?.lastName || user.lastName || ''}`;
  const profileImage = userData?.imageUrl || user.imageUrl;
  const firstInitial = (userData?.firstName || user.firstName || 'U').charAt(0);
  const email = userData?.email || user.emailAddresses[0]?.emailAddress || '';

  return (
    <div className="bg-transparent text-black p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8 flex-1">
          <div className="font-bold text-xl">amEx</div>
          <div className="flex space-x-6">
            <Link href="/listings" className="text-black hover:text-gray-600 font-bold">Listings</Link>
            <Link href="/requests" className="text-black hover:text-gray-600 font-bold">Requests</Link>
          </div>
          <div className="relative flex-1 mx-4">
            <input 
              type="text" 
              placeholder="Search for items, services, categories, and more..." 
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <svg 
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/create-post" className="bg-black text-white px-4 py-2 rounded-md text-sm font-bold">
            Create a Post
          </Link>
          
          <div 
            className="relative" 
            ref={dropdownRef}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
                {firstInitial}
              </div>
            </div>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white text-black rounded-md shadow-lg z-10">
                <div className="p-3 border-b border-gray-200">
                  <p className="font-bold">{fullName}</p>
                  <p className="text-sm text-gray-500 truncate" title={email}>{email}</p>
                </div>
                <div className="p-2">
                  <Link href="/profile" className="block px-3 py-2 rounded-md hover:bg-gray-100 w-full text-left font-medium">
                    Profile
                  </Link>
                  <Link href="/settings" className="block px-3 py-2 rounded-md hover:bg-gray-100 w-full text-left font-medium">
                    Settings
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="block px-3 py-2 rounded-md hover:bg-gray-100 w-full text-left text-red-600 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthDashboard;