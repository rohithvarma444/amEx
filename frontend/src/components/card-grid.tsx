'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface CardItem {
  id: string;
  title: string;
  caption: string;
  description: string;
  price: number;
  priceUnit: string;
  category: Category;
  imageUrl: string[];
  user: User;
  createdAt: string;
  href: string;
  urgency?: string;
}

interface CardGridProps {
  title: string;
  items: CardItem[];
  viewAllHref: string;
  type: 'listings' | 'requests';
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

const formatPrice = (price: number, priceUnit: string) => {
  return `₹${price}/${priceUnit}`;
};

export default function CardGrid({ title, items, viewAllHref, type }: CardGridProps) {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link href={viewAllHref} className="flex items-center text-sm font-medium">
          Browse {type}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="ml-1"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full bg-gray-100">
              <Image
                src={item.imageUrl[0]?.replace(/[` ]/g, '') || '/img1.png'}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">{item.user.firstName} {item.user.lastName}</span>
                <span className="text-xs text-gray-400">{formatTimeAgo(item.createdAt)}</span>
              </div>
              
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="font-bold">{formatPrice(item.price, item.priceUnit)}</p>
              {item.urgency && (
                <span className={`inline-block px-2 py-1 text-xs rounded ${item.urgency === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {item.urgency} Priority
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}