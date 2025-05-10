'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface CardItemProps {
  id: string;
  title: string;
  caption?: string;
  description: string;
  price: number;
  priceUnit?: string;
  category: string;
  imageUrl?: string[];
  user: User;
  createdAt: string;
  type: 'LISTING' | 'REQUEST';
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: string;
}

export default function CardItem({
  id,
  title,
  caption,
  description,
  price,
  priceUnit,
  category,
  imageUrl = [],
  user,
  createdAt,
  type,
  urgency,
  status
}: CardItemProps) {
  // Format the price with the unit
  const formattedPrice = `₹${price}${priceUnit ? `/${priceUnit}` : ''}`;
  
  // Format the date
  const formattedDate = new Date(createdAt).toLocaleDateString();
  
  // Get the user's full name
  const userName = `${user.firstName} ${user.lastName}`;
  
  // Determine the link based on the type
  const href = type === 'LISTING' ? `/post/${id}` : `/request/${id}`;
  
  // Get urgency color
  const getUrgencyColor = () => {
    if (!urgency) return '';
    switch (urgency) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Link href={href} className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="relative h-48 w-full bg-gray-100">
        {imageUrl && imageUrl.length > 0 ? (
          <Image
            src={imageUrl[0]}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-200">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        {/* Type badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {type === 'LISTING' ? 'Listing' : 'Request'}
        </div>
        
        {/* Urgency badge for requests */}
        {type === 'REQUEST' && urgency && (
          <div className={`absolute top-2 left-2 ${getUrgencyColor()} text-white text-xs px-2 py-1 rounded`}>
            {urgency}
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-500">{userName}</span>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>
        
        <h3 className="font-bold mb-1 text-lg line-clamp-1">{title}</h3>
        
        {caption && (
          <p className="text-sm text-gray-600 mb-1 line-clamp-1">{caption}</p>
        )}
        
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <p className="font-bold text-lg">{formattedPrice}</p>
          
          {/* Category badge */}
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>
    </Link>
  );
}