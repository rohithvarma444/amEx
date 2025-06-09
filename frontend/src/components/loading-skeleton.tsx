import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="container mx-auto py-8 px-4 animate-pulse">
      {/* Categories Slider Skeleton */}
      <div className="mb-8">
        <div className="h-12 bg-gray-200 rounded-md w-3/4 mb-4"></div>
        <div className="flex gap-4 overflow-x-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Card Grid Skeletons */}
      {[1, 2, 3].map((section) => (
        <div key={section} className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((card) => (
              <div key={card} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Bottom CTA Skeleton */}
      <div className="w-full border-t border-gray-200 mt-12 pt-12 pb-8 text-center">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
        <div className="h-12 bg-gray-200 rounded w-48 mx-auto"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton; 