import React from 'react'
import Link from 'next/link'

function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 border-blue-200 bg-white bg-opacity-90">
    <div className="font-bold text-2xl">amEx</div>
    <div className="flex gap-6 items-center">
      <Link href="/about" className="text-gray-800 hover:text-gray-600">
        About
      </Link>
      <Link href="/login" className="text-gray-800 hover:text-gray-600">
        Log In
      </Link>
      <Link 
        href="/signup" 
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
      >
        Sign Up
      </Link>
    </div>
  </nav>
  )
}

export default Navbar