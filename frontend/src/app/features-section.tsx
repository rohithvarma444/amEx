import React from 'react';
import Image from "next/image";
import img1 from "../../public/img1.png";
import img2 from "../../public/img2.png";
import img3 from "../../public/img3.png";
import img4 from "../../public/img4.png";

const CollegeMarketplace = () => (
  <div className="bg-gray-50 w-screen min-h-screen overflow-hidden relative pb-20">
    {/* Heading container with absolute positioning */}
    <div className="absolute top-[40px] left-1/2 transform -translate-x-1/2 text-center">
      <h1 className="text-4xl font-bold mb-8">
        Make a quick buck, or find exactly what you need
      </h1>
    </div>
    {/* Relative container for absolute cards */}
    <div className="relative w-full h-full">
        {/* Card 1 */}
        <div className="animate-fade-in">
          <div className="absolute top-[140px] left-[-60px] w-[350px] h-[400px] overflow-hidden">
            <div className="w-[427px] h-[366px]">
              <Image src={img1} alt="Calculator" className="rounded-md object-cover w-full h-[220px]" />
              <div className="bg-white p-5 rounded-md shadow-lg transition-shadow duration-500 ease-in-out mt-2">
              <h3 className="text-lg font-bold">Math matrix function</h3>
              <p className="text-base text-gray-500">All is Casio FX-991MS</p>
              <p className="text-lg font-bold mt-1">₹25/hour</p>
                
              </div>
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="animate-fade-in">
          <div className="absolute top-[230px] left-[100px] w-[473px] h-[112px] z-100">
            <div className="bg-white p-5 rounded-md shadow-lg transition-shadow duration-500 ease-in-out">
            <h3 className="text-lg font-bold">Draw my pneumatics lab diagrams for me</h3>
                <p className="text-base text-gray-500">I don't have a single artistic bone in my body</p>
                <p className="text-lg font-bold mt-1">₹15/diagram</p>
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="animate-fade-in">
          <div className="absolute top-[510px] left-[120px] w-[473px] h-[112px]">
            <div className="bg-white p-5 rounded-md shadow-lg transition-shadow duration-500 ease-in-out">
              <h3 className="text-lg font-bold">I will stand in a queue for you</h3>
              <p className="text-base text-gray-500">Desperate for chai money</p>
              <p className="text-lg font-bold mt-1">₹5/minute</p>
            </div>
          </div>
        </div>
        {/* Card 4 */}
        <div className="animate-fade-in">
          <div className="absolute top-[190px] left-[450px] w-[400px] h-[200px] z-100">
            <Image
              src={img2}
              alt="Bowl of Maggi noodles"
              className="rounded-md object-cover w-full h-[220px]"
            />
            <div className="bg-white p-5 rounded-md shadow-lg transition-shadow duration-500 ease-in-out mt-2">
              <h3 className="font-bold text-lg">Maggi Cooked to Order</h3>
              <p className="text-base text-gray-500">Perfect for midnight munchies. Only in Nila hostel</p>
              <p className="font-bold text-lg mt-1">₹40/pack</p>
            </div>
          </div>
        </div>
        {/* Card 5 */}
        <div className="animate-fade-in">
          <div className="absolute top-[600px] left-[460px] w-[473px] h-[112px]">
            <div className="bg-white p-5 rounded-md shadow-lg transition-shadow duration-500 ease-in-out">
              <h3 className="text-lg font-bold">Pick up my green bottle from N301</h3>
              <p className="text-base text-gray-500">Will meet you wherever on ground floor</p>
              <p className="text-lg font-bold mt-1">₹10</p>
            </div>
          </div>
        </div>
        {/* Card 6 */}
        <div className="animate-fade-in">
          <div className="absolute top-[420px] left-[800px] w-[350px] h-[150px]">
            <Image
              src={img3}
              alt="Close-up of eye with winged eyeliner"
              className="rounded-md object-cover w-full h-[220px]"
            />
            <div className="bg-white p-5 rounded-md shadow-lg transition-shadow duration-500 ease-in-out mt-2">
              <h3 className="font-bold text-lg">I'll give you the perfect winged eyes</h3>
              <p className="text-base text-gray-500">Bold black liquid eyeliner only – Pencils are for cowards</p>
              <p className="font-bold text-lg mt-1">₹30</p>
            </div>
          </div>
        </div>
        {/* Card 7 */}
        <div className="animate-fade-in">
          <div className="absolute top-[160px] left-[780px] w-[473px] h-[50px] z-150">
            <div className="bg-white p-5 rounded-md shadow-lg transition-shadow duration-500 ease-in-out">
              <h3 className="text-lg font-bold">Need someone to attend Diwali with!</h3>
              <p className="text-base text-gray-500">I'm not a loser, my date's just sick today</p>
              <p className="text-lg font-bold mt-1">₹0</p>
            </div>
          </div>
        </div>
        {/* Card 8 */}
        <div className="animate-fade-in">
          <div className="absolute top-[140px] left-[1150px] w-[400px] h-[200px]">
            <Image
              src={img4}
              alt="Badminton racket and shuttlecock"
              className="rounded-md object-cover w-full h-[220px]"
            />
            <div className="bg-white p-5 rounded-md shadow-lg transition-shadow duration-500 ease-in-out mt-2">
              <h3 className="font-bold text-lg">Rackets for Loan (4 hrs max)</h3>
              <p className="text-base text-gray-500">I've got 3 of them. Shuttlecock not included</p>
              <p className="font-bold text-lg mt-1">₹30/racket</p>
            </div>
          </div>
        </div>
        {/* Card 9 */}
        <div className="animate-fade-in">
          <div className="absolute top-[500px] left-[1110px] w-[473px] h-[112px]">
            <div className="bg-white p-5 rounded-md shadow-lg transition-shadow duration-500 ease-in-out">
              <h3 className="text-lg font-bold">Anyone got a bicycle to loan?</h3>
              <p className="text-base text-gray-500">Need to zoom to Vallikavu and back</p>
              <p className="text-lg font-bold mt-1">₹50/hr</p>
            </div>
          </div>
        </div>
      </div>
  </div>
);

export default CollegeMarketplace;