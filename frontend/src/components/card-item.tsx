'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CardItemProps {
  href: string;
  title: string;
  description: string;
  imageUrl: string;
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
  interestsCount: number;
}

export default function CardItem({
  href,
  title,
  description,
  imageUrl,
  price,
  priceUnit,
  category,
  user,
  createdAt,
  interestsCount
}: CardItemProps) {
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

  return (
    <Link href={href} className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={imageUrl || '/img1.png'} // Add fallback image
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-500">{`${user.firstName} ${user.lastName}`}</span>
          <span className="text-xs text-gray-400">{formatTimeAgo(createdAt)}</span>
        </div>
        
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <div className="flex items-center justify-between">
          <p className="font-bold">{`₹${price}/${priceUnit}`}</p>
          <span className="text-sm text-gray-500">{`${interestsCount} interests`}</span>
        </div>
      </div>
    </Link>
  );
}