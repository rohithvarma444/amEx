'use client';

import React from 'react';
import Link from 'next/link';
import CardItem from './card-item';

interface CardGridProps {
  title: string;
  items: any[];
  viewAllHref: string;
  type: 'listings' | 'requests';
}

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
        {items.map((item) => {
          // Extract the key property and pass the rest to CardItem
          const { id, title, caption, description, price, priceUnit, category, imageUrl, user, createdAt, urgency, status } = item;
          
          return (
            <CardItem
              key={id} // React key prop (not passed to component)
              id={id}
              title={title}
              caption={caption}
              description={description}
              price={price}
              priceUnit={priceUnit}
              category={category}
              imageUrl={imageUrl}
              user={user}
              createdAt={createdAt}
              type={type === 'listings' ? 'LISTING' : 'REQUEST'}
              urgency={urgency}
              status={status}
            />
          );
        })}
      </div>
    </div>
  );
}