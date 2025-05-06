"use client";

import { useState, useEffect } from 'react'; // Added useEffect
import Image from 'next/image';
import Link from 'next/link';
import { useSignIn, useUser } from '@clerk/nextjs'; // Added useUser
import { useRouter } from 'next/navigation'; 
import bg from "../../../../public/bg.png";

export default function CustomSignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn, user } = useUser(); // Get user's signed-in status
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if user is already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard'); // This handles redirect after successful login
      } else {
        console.log(JSON.stringify(result, null, 2));
        setError('Sign in failed. Please check your credentials or try again.'); 
      }
    } catch (err: any) {
      console.error('Error:', JSON.stringify(err, null, 2));
      setError(err.errors ? err.errors[0].longMessage : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is signed in, you can optionally render nothing or a loading indicator
  // while the redirect happens to prevent a flash of the sign-in form.
  if (isSignedIn) {
    return null; // Or a loading spinner
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image 
          src={bg}
          alt="Amrita Campus" 
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Sign In to Your Account</h1>
        <p className="text-gray-500 text-center mb-6">Use your registered Amrita student email to log in</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="email" 
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="rollnumber@am.students.amrita.edu" 
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password" 
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button 
            type="submit" 
            className="w-full bg-black text-white p-3 rounded-md hover:bg-gray-800 disabled:opacity-50"
            disabled={isLoading || !isLoaded}
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        
        {/* You can also add Social Login buttons here if configured in Clerk */}
        {/* Example for Google (requires setup in Clerk dashboard and useSignIn hook) */}
        {/* 
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 mb-2">Or</p>
          <button 
            onClick={async () => {
              if (!isLoaded) return;
              try {
                await signIn.authenticateWithRedirect({
                  strategy: 'oauth_google',
                  redirectUrl: '/sso-callback', // Must match your Clerk instance config
                  redirectUrlComplete: '/dashboard',
                });
              } catch (err) {
                console.error('OAuth error', err);
                setError('Failed to sign in with Google.');
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
            disabled={isLoading || !isLoaded}
          >
            <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </button>
        </div>
        */}

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