"use client"; // Required for Clerk components and hooks

import React from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6  border-gray-200 bg-white bg-opacity-90 sticky top-0 z-50">
      <div className="font-bold text-2xl">
        <Link href="/">amEx</Link>
      </div>
      <div className="flex gap-6 items-center">
        <Link href="/about" className="text-gray-800 hover:text-gray-600">
          About
        </Link>

        {/* Shows content when the user is signed out */}
        <SignedOut>
          <Link href="/sign-in" className="text-gray-800 hover:text-gray-600">
            Log In
          </Link>
          <Link 
            href="/sign-up" 
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Sign Up
          </Link>
        </SignedOut>

        {/* Shows content when the user is signed in */}
        <SignedIn>
          <Link 
            href="/dashboard" 
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800" // Added button styling
          >
            Dashboard
          </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navbar;