'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import PostGrid, { PostItem } from '@/components/PostGrid';

export default function CategoryPage() {
  const rawParams = useParams();
  const searchParams = useSearchParams();

  // Safely extract the dynamic [category] param
  const categoryName = Array.isArray(rawParams.category)
    ? rawParams.category[0]
    : rawParams.category;

  const categoryId = searchParams.get('id');

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState<'listings' | 'requests'>('listings');

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      if (!categoryId) return;

      setIsLoading(true);
      try {
        const res = await fetch(
          viewType === 'listings' ? '/api/get-listings' : '/api/get-requests'
        );
        const data = await res.json();
        console.log("Raw data from API:", JSON.stringify(data, null, 2));
        const allPosts: PostItem[] = (data?.listings || data?.requests || []).map((post: any) => ({
          id: post.id,
          title: post.title,
          description: post.description,
          price: post.price.toString(),
          category: post.category.id, // flattening here
          tags: [],
          imageUrls: post.imageUrl || [],
          author: {
            name: `${post.user.firstName} ${post.user.lastName}`,
          },
          authorId: post.user.id,
          type: viewType === "listings" ? "listing" : "request",
          createdAt: post.createdAt,
        }));

        console.log("Example post:", allPosts);

        // Filter posts using only categoryId (no need to match name too)
        const filteredPosts = allPosts.filter(
          (post) => post.category === categoryId
        );

        setPosts(filteredPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryPosts();
    }
  }, [categoryId, viewType]);

  const toggleViewType = () => {
    setViewType((prev) => (prev === 'listings' ? 'requests' : 'listings'));
  };
  
  console.log("categoryId:", categoryId, "categoryName:", categoryName);

  if (!categoryName || !categoryId) {
    return <div className="text-center py-12">Category not found</div>;
  }
 console.log("control reached here"); 
  console.log(posts);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            {categoryName} {viewType === 'listings' ? 'Listings' : 'Requests'}
          </h1>
          <button
            onClick={toggleViewType}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
          >
            Switch to {viewType === 'listings' ? 'Requests' : 'Listings'}
          </button>
        </div>
      </div>

      <PostGrid
        posts={posts}
        title={`${categoryName} ${viewType === 'listings' ? 'Listings' : 'Requests'}`}
        emptyMessage={`No ${viewType} found in this category.`}
        isLoading={isLoading}
      />
    </div>
  );
}