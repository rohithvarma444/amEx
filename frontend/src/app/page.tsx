// app/page.tsx
import HeroSection from '../components/hero-section';
import FeaturesSection from '../components/features-section';
import HowItWorksSection from '../components/works-section';
import TestimonialsSection from '../components/testimonal-section';
import Footer from '@/components/footer';
import Link from 'next/link';
export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Background image */}
      <div 
        className="absolute inset-0 z-[-1] opacity-20" 
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      

      
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}