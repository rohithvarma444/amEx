'use client'
// components/TestimonialsSection.tsx
import { useState } from 'react';

const TestimonialsSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const testimonials = [
    {
      name: "Siddharth Menon",
      content: "Love having some quick cash on hand. I absolutely adore how easily I can find others to buy my test prep and policy courses. No longer too broke to eat out anymore."
    },
    {
      name: "Harmanth Krishnakumar",
      content: "Fixed my social life for me. It's really difficult out here for us weeks to find meaningful connections where we can talk about our favourite anime. amEx hooked me right up."
    },
    {
      name: "Ibrahim",
      content: "Finding a buddy to redeem lunch deals. I love coming to EE @ campus at Banzai Shop since they have awesome deals for students to buddy up with."
    }
  ];

  return (
    <div className="bg-black text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Hear it from our 100% legitimate users
        </h2>
        
        <div className="relative">
          <div className="max-w-3xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`transition-opacity duration-300 ${
                  activeSlide === index ? 'block opacity-100' : 'hidden opacity-0'
                }`}
              >
                <div className="text-center">
                  <p className="font-medium text-lg mb-4">{testimonial.name}</p>
                  <p className="text-gray-300 mb-4">{testimonial.content}</p>
                  <div className="flex items-center justify-center">
                    <span className="text-yellow-400">★★★★★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-2 h-2 rounded-full ${
                  activeSlide === index ? 'bg-white' : 'bg-gray-600'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-8">Built by students, for students.</h2>
        </div>
      </div>
      
      <footer className="mt-16 border-t border-gray-800 pt-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">amEx</h3>
              <div className="flex space-x-4 mt-4">
                <a href="#" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="#" aria-label="YouTube">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
            
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <h3 className="font-bold text-lg mb-4">Topic</h3>
                <ul className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <li key={j}>
                      <a href="#" className="text-gray-400 hover:text-white">Page</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TestimonialsSection;