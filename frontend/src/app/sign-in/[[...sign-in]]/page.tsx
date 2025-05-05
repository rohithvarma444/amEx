"use client";
import Image from 'next/image';
import { SignIn } from "@clerk/nextjs";
import Link from 'next/link';
import bg from "../../../../public/bg.png";

export default function SignInPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image 
          src={bg}
          alt="Amrita Campus" 
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      
      {/* Content overlay - centered sign-in form */}
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Sign In to Your Account</h1>
        <p className="text-gray-500 text-center mb-6">Use your registered Amrita student email to log in</p>
        
        {/* Replace custom form with Clerk's SignIn component */}
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard" 
          appearance={{
            elements: {
              formButtonPrimary: "bg-black hover:bg-gray-800",
              card: "shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "border border-gray-300",
              formFieldInput: "border border-gray-300 rounded-md p-3",
            }
          }}
        />
        
        <div className="mt-6 text-center">
          <span className="text-gray-500">New to amEx? </span>
          <Link href="/sign-up" className="text-gray-500 hover:underline">Create an Account</Link>
        </div>
        
        <div className="mt-6 flex justify-center items-center gap-2 text-gray-500 text-sm">
          <span>Secured by</span>
          <span className="font-medium flex items-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill="currentColor" />
              <path d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor" />
            </svg>
            clerk
          </span>
        </div>
      </div>
    </div>
  );
}