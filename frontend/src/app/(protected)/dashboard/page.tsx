import React from 'react';
import CategoriesSlider from '../../../components/categories-slider';
import CardGrid from '../../../components/card-grid';
import Link from 'next/link';

// Sample data - in a real app, this would come from an API
const recentRequests = [
  {
    id: '1',
    title: 'Maggi Cooked to Order',
    description: 'Perfect for midnight munchies. Only in Nila hostel',
    price: '₹40/pack',
    image: '/img1.png',
    user: { id: 'user1', name: 'Louis Lara J' },
    createdAt: new Date().toISOString(),
    href: '/requests/1'
  },
  {
    id: '2',
    title: 'Lenovo C-type Charger',
    description: 'Perfect for midnight munchies. Only in Nila hostel',
    price: '₹40/pack',
    image: '/img2.png',
    user: { id: 'user1', name: 'Louis Lara J' },
    createdAt: new Date().toISOString(),
    href: '/requests/2'
  },
  {
    id: '3',
    title: 'Maggi Cooked to Order',
    description: 'Perfect for midnight munchies. Only in Nila hostel',
    price: '₹40/pack',
    image: '/img3.png',
    user: { id: 'user1', name: 'Louis Lara J' },
    createdAt: new Date().toISOString(),
    href: '/requests/3'
  },
  {
    id: '4',
    title: 'Maggi Cooked to Order',
    description: 'Perfect for midnight munchies. Only in Nila hostel',
    price: '₹40/pack',
    image: '/img4.png',
    user: { id: 'user1', name: 'Louis Lara J' },
    createdAt: new Date().toISOString(),
    href: '/requests/4'
  },
];

const listings = [
  // Same structure as recentRequests but with different IDs and hrefs
  {
    id: '5',
    title: 'Maggi Cooked to Order',
    description: 'Perfect for midnight munchies. Only in Nila hostel',
    price: '₹40/pack',
    image: '/img5.jpeg',
    user: { id: 'user1', name: 'Louis Lara J' },
    createdAt: new Date().toISOString(),
    href: '/listings/5'
  },
  {
    id: '6',
    title: 'Maggi Cooked to Order',
    description: 'Perfect for midnight munchies. Only in Nila hostel',
    price: '₹40/pack',
    image: '/img6.jpg',
    user: { id: 'user1', name: 'Louis Lara J' },
    createdAt: new Date().toISOString(),
    href: '/listings/6'
  },
  {
    id: '7',
    title: 'Maggi Cooked to Order',
    description: 'Perfect for midnight munchies. Only in Nila hostel',
    price: '₹40/pack',
    image: '/img7.jpg',
    user: { id: 'user1', name: 'Louis Lara J' },
    createdAt: new Date().toISOString(),
    href: '/listings/7'
  },
  {
    id: '8',
    title: 'Maggi Cooked to Order',
    description: 'Perfect for midnight munchies. Only in Nila hostel',
    price: '₹40/pack',
    image: '/img1.png',
    user: { id: 'user1', name: 'Louis Lara J' },
    createdAt: new Date().toISOString(),
    href: '/listings/8'
  },
];

// Browse requests data
const browseRequests = [
  {
    id: '9',
    title: 'Maggi Cooked to Order',
    description: 'Perfect for midnight munchies. Only in Nila hostel',
    price: '₹40/pack',
    image: '/img2.png',
    user: { id: 'user1', name: 'Louis Lara J' },
    createdAt: new Date().toISOString(),
    href: '/requests/9'
  },
  {
    id: '10',
    title: 'Maggi Cooked to Order',
    description: 'Perfect for midnight munchies. Only in Nila hostel',
    price: '₹40/pack',
    image: '/img3.png',
    user: { id: 'user1', name: 'Louis Lara J' },
    createdAt: new Date().toISOString(),
    href: '/requests/10'
  },
  {
    id: '11',
    title: 'Maggi Cooked to Order',
    description: 'Perfect for midnight munchies. Only in Nila hostel',
    price: '₹40/pack',
    image: '/img4.png',
    user: { id: 'user1', name: 'Louis Lara J' },
    createdAt: new Date().toISOString(),
    href: '/requests/11'
  },
  {
    id: '12',
    title: 'Maggi Cooked to Order',
    description: 'Perfect for midnight munchies. Only in Nila hostel',
    price: '₹40/pack',
    image: '/img5.jpeg',
    user: { id: 'user1', name: 'Louis Lara J' },
    createdAt: new Date().toISOString(),
    href: '/requests/12'
  },
];

function Dashboard() {
  return (
    <div className="container mx-auto py-8 px-4">
      <CategoriesSlider />
      
      <CardGrid 
        title="Recent Requests" 
        items={recentRequests} 
        viewAllHref="/requests" 
        type="requests" 
      />
      
      <CardGrid 
        title="Browse Listings" 
        items={listings} 
        viewAllHref="/listings" 
        type="listings" 
      />
      
      <CardGrid 
        title="Browse Requests" 
        items={browseRequests} 
        viewAllHref="/requests" 
        type="requests" 
      />
      
      {/* Haven't found what you're looking for section */}
      <div className="w-full border-t border-gray-200 mt-12 pt-12 pb-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Haven't found what you're looking for?</h2>
        <Link 
          href="/create-post" 
          className="inline-block bg-black text-white px-6 py-3 rounded-md font-bold"
        >
          Create a Post
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;