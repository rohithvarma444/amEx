"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Common interface for both listings and requests
export interface PostItem {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  tags: string[];
  imageUrls: string[];
  author: {
    name: string;
    avatarUrl?: string;
  };
  authorId: string;
  type: 'listing' | 'request'; // To differentiate between listings and requests
  createdAt: string;
}

interface PostGridProps {
  posts: PostItem[];
  title: string;
  emptyMessage: string;
  isLoading?: boolean;
}

export default function PostGrid({ posts, title, emptyMessage, isLoading = false }: PostGridProps) {
  // Filter state and functionality removed
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="relative h-48 w-full">
                  <Image
                    src={post.imageUrls[0] || '/placeholder-image.png'}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {post.type === 'listing' ? 'Listing' : 'Request'}
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{post.title}</h2>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.description}</p>
                  <p className="text-lg font-bold text-gray-900 mb-2">{post.price}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 mr-2">
                      {post.author.name.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-600">{post.author.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}