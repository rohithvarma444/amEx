'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { BsChatDots } from 'react-icons/bs';

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

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="bg-transparent text-black p-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard">
            <div className="font-bold text-xl">amEx</div>
          </Link>
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
          <Link href="/dashboard">
            <div className="font-bold text-xl">amEx</div>
          </Link>
          <div className="flex space-x-6">
            <Link href="/listings" className="text-black hover:text-gray-600 font-bold">Listings</Link>
            <Link href="/requests" className="text-black hover:text-gray-600 font-bold">Requests</Link>
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
          <Link href="/dashboard" className="font-bold text-xl hover:text-gray-600 transition-colors">
            amEx
          </Link>
          <div className="flex space-x-6">
            <Link href="/listings" className="text-black hover:text-gray-600 font-bold">Listings</Link>
            <Link href="/requests" className="text-black hover:text-gray-600 font-bold">Requests</Link>
            <Link href="/my-posts" className="text-black hover:text-gray-600 font-bold">My Posts</Link>
            <Link href="/my-activity" className="text-black hover:text-gray-600 font-bold">My Activity</Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/create-post" className="bg-black text-white px-4 py-2 rounded-md text-sm font-bold">
            Create a Post
          </Link>

          <Link 
            href="/chat" 
            className="text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Chat"
          >
            <BsChatDots className="w-6 h-6" />
          </Link>
          
          <div 
            className="relative" 
            ref={dropdownRef}
            onKeyDown={handleKeyDown}
          >
            <button
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
            >
              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium">
                {firstInitial}
              </div>
            </button>
            
            {isDropdownOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-64 bg-white text-black rounded-md shadow-lg z-10"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="p-3 border-b border-gray-200">
                  <p className="font-bold">{fullName}</p>
                  <p className="text-sm text-gray-500 truncate" title={email}>{email}</p>
                </div>
                <div className="p-2">
                
                  <Link 
                    href="/settings" 
                    className="block px-3 py-2 rounded-md hover:bg-gray-100 w-full text-left font-medium"
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="block px-3 py-2 rounded-md hover:bg-gray-100 w-full text-left text-red-600 font-medium"
                    role="menuitem"
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