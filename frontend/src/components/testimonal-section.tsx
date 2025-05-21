'use client'
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Content } from 'next/font/google';

const TestimonialsSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const testimonials = [
    {
      name: "Siddharth Menon",
      content: "Love having some quick cash on hand. I absolutely adore how easily I can find others to buy my test prep and policy courses. No longer too broke to eat out anymore."
    },
    {
      name: "Hemanth Krishnakumar",
      content: "Fixed my social life for me. It's really difficult out here for us weeks to find meaningful connections where we can talk about our favourite anime. amEx hooked me right up."
    },
    {
      name: "Ibrahim",
      content: "Finding a buddy to redeem lunch deals. I love coming to EE @ campus at Banzai Shop since they have awesome deals for students to buddy up with."
    },
    {
      name: "Haridev A V",
      content : "Bought a scooty through this website. Now I can leave hostel at 8:55 without facing any consequences. amEx for the win."
    },
    {
      name : "Sidharth Mohan",
      content : "The experience is peak. I love the ui"
    }
  ];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-black text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Hear it from our 100% legitimate users
        </h2>

        <div className="relative">
          {/* Arrow Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-10 h-10 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-10 h-10 text-white" />
          </button>

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

          {/* Dots */}
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
    </div>
  );
};

export default TestimonialsSection;
