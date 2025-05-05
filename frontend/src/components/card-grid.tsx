'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface CardItem {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  user: User;
  createdAt: string;
  href: string;
}

interface CardGridProps {
  title: string;
  items: CardItem[];
  viewAllHref: string;
  type: 'listings' | 'requests';
}

const formatTimeAgo = (dateString: string) => {
  // Simple implementation - in a real app, use a library like date-fns
  return '5 min ago';
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
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">{item.user.name}</span>
                <span className="text-xs text-gray-400">{formatTimeAgo(item.createdAt)}</span>
              </div>
              
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="font-bold">{item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}