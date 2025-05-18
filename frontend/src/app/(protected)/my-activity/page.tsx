'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import generateQR from "@omkarbhosale/upiqr";

// Update the Deal interface to include userId in the post object
interface Deal {
  id: string;
  status: 'PENDING' | 'ACTIVE' | 'DECLINED' | 'COMPLETED';
  createdAt: string;
  completedAt?: string;
  otpCode?: string;
  otpUsed: boolean;
  paymentStatus: 'PENDING' | 'RECEIVED';
  post: {
    id: string;
    title: string;
    description?: string;
    price: number;
    priceUnit: string;
    imageUrl: string[];
    type: 'LISTING' | 'REQUEST';
    userId: string;  // Add this field
    category: {
      name: string;
    };
  };
  selectedUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    upiId?: string
  };
}

export default function MyActivity() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myDeals, setMyDeals] = useState<Deal[]>([]);
  const [selectedForDeals, setSelectedForDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'myDeals' | 'selectedForDeals'>('myDeals');
  const [otpInput, setOtpInput] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    
    fetchDeals();
  }, [user, isLoaded]);

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/get-user-deals');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch deals');
      }
      
      setMyDeals(data.data.myDeals || []);
      setSelectedForDeals(data.data.selectedForDeals || []);
    } catch (err) {
      console.error('Error fetching deals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch deals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDealDialog = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDealDialog(true);
    // Load user's UPI ID if available
    if (user?.publicMetadata?.upiId) {
      setUpiId(user.publicMetadata.upiId as string);
    }
  };

  const handleStartChat = (deal: Deal) => {
    // Navigate to chat with the other user
    const chatPartnerId = deal.selectedUser.id;
    window.location.href = `/chat/${deal.post.id}?partner=${chatPartnerId}`;
  };

  const handleVerifyOtp = async (deal: Deal) => {
    try {
        console.log('OTP:', otpInput);
        console.log(deal.id); // Log the OTP input
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: deal.id, otpCode: otpInput })
      });
  
      const data = await response.json();
      console.log(data);
  
      if (data.success) {
        setOtpInput('');
        // Refresh deals to get updated status
        fetchDeals();
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Failed to verify OTP');
    }
  };
  
  const generatePaymentQR = async (deal: Deal) => {
    try {
      const qrData = await generateQR({
        UPI_ID: upiId || selectedDeal?.selectedUser.upiId || '',
        AMOUNT: deal.post.price
      });
      setQrCode(qrData);
    } catch (error) {
      console.error('Error generating QR:', error);
      alert('Failed to generate QR code');
    }
  };


  console.log(selectedDeal);
  const handleConfirmPayment = async (deal: Deal) => {
    try {
      const response = await fetch('/api/complete-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: deal.id })
      });
  
      const data = await response.json();
  
      if (data.success) {
        setShowDealDialog(false);
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        alert(data.message || 'Failed to complete payment');
      }
    } catch (error) {
      console.error('Error completing payment:', error);
      alert('Failed to complete payment');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">{error}</p>
        <Link href="/" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Activity</h1>
          
          {/* Regular Tab Buttons */}
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'myDeals' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('myDeals')}
            >
              My Deals
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'selectedForDeals' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('selectedForDeals')}
            >
              Selected For
            </button>
          </div>
        </div>
        
        {/* Deals on my posts */}
        {activeTab === 'myDeals' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Deals on My Posts</h2>
            {myDeals.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <p className="text-gray-500">You don't have any active deals on your posts yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myDeals.map((deal) => (
                  <div 
                    key={deal.id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleOpenDealDialog(deal)}
                  >
                    <div className="relative h-48">
                      <Image 
                        src={deal.post.imageUrl[0] || '/img1.png'} 
                        alt={deal.post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                          {deal.status}
                        </span>
                        {deal.otpUsed && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            OTP Verified
                          </span>
                        )}
                        {deal.paymentStatus === 'RECEIVED' && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Paid
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 truncate">{deal.post.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{deal.post.category.name}</p>
                      <div className="flex justify-between items-center">
                        <p className="font-medium">₹{deal.post.price}/{deal.post.priceUnit}</p>
                        <p className="text-sm text-gray-500">
                          with {deal.selectedUser.firstName} {deal.selectedUser.lastName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Deals I'm selected for */}
        {activeTab === 'selectedForDeals' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Deals I'm Selected For</h2>
            {selectedForDeals.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <p className="text-gray-500">You haven't been selected for any deals yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedForDeals.map((deal) => (
                  <div 
                    key={deal.id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleOpenDealDialog(deal)}
                  >
                    <div className="relative h-48">
                      <Image 
                        src={deal.post.imageUrl[0] || '/img1.png'} 
                        alt={deal.post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                        {deal.status}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 truncate">{deal.post.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{deal.post.category.name}</p>
                      <div className="flex justify-between items-center">
                        <p className="font-medium">₹{deal.post.price}/{deal.post.priceUnit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deal Dialog */}
      {showDealDialog && selectedDeal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center sm:items-center p-4">
            <div className="fixed inset-0 bg-gray-500/80 backdrop-blur-sm transition-opacity" onClick={() => setShowDealDialog(false)} />
            <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedDeal.post.title}</h3>
                <button 
                  onClick={() => setShowDealDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image 
                    src={selectedDeal.post.imageUrl[0] || '/img1.png'} 
                    alt={selectedDeal.post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-block px-2 py-1 bg-black text-white text-xs rounded-full">
                      {selectedDeal.status}
                    </span>
                    {selectedDeal.paymentStatus && (
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        selectedDeal.paymentStatus === 'RECEIVED' 
                          ? 'bg-green-500 text-white'
                          : 'bg-yellow-500 text-white'
                      }`}>
                        Payment: {selectedDeal.paymentStatus}
                      </span>
                    )}
                    {selectedDeal.otpUsed && (
                      <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        OTP Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Price</p>
                    <p className="font-medium">₹{selectedDeal.post.price}/{selectedDeal.post.priceUnit}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Category</p>
                    <p className="font-medium">{selectedDeal.post.category.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {selectedDeal.selectedUser.id === user?.id ? 'Post Owner' : 'Selected User'}
                    </p>
                    <p className="font-medium">
                      {selectedDeal.selectedUser.firstName} {selectedDeal.selectedUser.lastName}
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedDeal.post.description && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700">{selectedDeal.post.description}</p>
                </div>
              )}
              
              {selectedDeal.post.userId === user?.id && selectedDeal.otpCode && !selectedDeal.otpUsed && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm font-medium mb-2">Share this OTP with the selected user to complete the deal:</p>
                  <p className="text-2xl font-mono bg-gray-100 p-3 rounded text-center mb-2">{selectedDeal.otpCode}</p>
                  <p className="text-sm text-gray-500">
                    Status: <span className="font-medium text-blue-600">Waiting for verification</span>
                  </p>
                </div>
              )}
              
              {/* Show OTP input for selected users */}
              {selectedDeal.selectedUser.id === user?.id && !selectedDeal.otpUsed && (
                <div className="mb-6">
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter OTP"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      onClick={() => handleVerifyOtp(selectedDeal)}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              )}

              {/* UPI Payment section - only show when OTP has been used */}
              {selectedDeal.selectedUser.id === user?.id && selectedDeal.otpUsed && selectedDeal.paymentStatus === 'PENDING' && (
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-4">Payment Details</p>
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="text"
                        value={upiId || selectedDeal.selectedUser.upiId || ''}
                        onChange={(e) => setUpiId(e.target.value)}
                        disabled={!isEditingUpi}
                        placeholder="Enter UPI ID"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <button
                        onClick={() => setIsEditingUpi(!isEditingUpi)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        {isEditingUpi ? 'Save' : 'Edit'}
                      </button>
                    </div>
              
                    <div className="flex gap-2">
                      <button
                        onClick={() => generatePaymentQR(selectedDeal)}
                        className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Generate QR Code
                      </button>
                      <button
                        onClick={() => handleConfirmPayment(selectedDeal)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Confirm Payment Received
                      </button>
                    </div>
              
                    {qrCode && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="relative h-64 w-64 mx-auto">
                          <Image
                            src={qrCode}
                            alt="Payment QR Code"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-2">
                          Scan this QR code to pay ₹{selectedDeal.post.price}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDealDialog(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleStartChat(selectedDeal)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Chat with {selectedDeal.post.userId === user?.id ? 'Selected User' : 'Post Owner'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}