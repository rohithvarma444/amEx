'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CardItemProps {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  userName: string;
  timeAgo: string;
  href: string;
}

export default function CardItem({
  id,
  title,
  description,
  price,
  image,
  userName,
  timeAgo,
  href
}: CardItemProps) {
  return (
    <Link href={href} className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-500">{userName}</span>
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
        
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <p className="font-bold">{price}</p>
      </div>
    </Link>
  );
}