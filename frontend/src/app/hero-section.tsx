// components/HeroSection.tsx
import Image from 'next/image';
import Link from 'next/link';
import bg from '../../public/bg.png';

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image as entire component bg */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={bg} 
          alt="University Campus" 
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Navigation */}

        {/* Content overlay */}
<div className="flex flex-1 items-start justify-start p-[10px] ml-20">
  <div className="bg-transparent p-4 max-w-xl text-black">
    <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md ">
      Campus exchanges, <br />reimagined.
    </h1>
    <p className="mb-6 drop-shadow-sm">
      Connect with your fellow students to offer, buy, or request anything you need, right within your university.
    </p>
    <div>
      <Link 
        href="/signup" 
        className="bg-black text-white px-6 py-3 rounded-md inline-block hover:bg-gray-800"
      >
        Create an Account
      </Link>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default HeroSection;