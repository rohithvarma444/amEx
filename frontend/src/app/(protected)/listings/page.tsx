'use client';

import { useEffect, useState } from 'react';
import CardItem from '@/components/card-item';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: string;
  category: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  status: string;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/get-listings');
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch listings');
        }

        setListings(data.listings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

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
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">No listings found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <CardItem
            key={listing.id}
            href={`/listing/${listing.id}`}
            title={listing.title}
            description={listing.description}
            imageUrl={listing.category.imageUrl}
            price={listing.price}
            priceUnit={listing.priceUnit}
            category={listing.category}
            user={listing.user}
            createdAt={listing.createdAt}
            interestsCount={0} // You might want to add interests to your API response
          />
        ))}
      </div>
    </div>
  );
}