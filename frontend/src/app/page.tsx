// app/page.tsx
import HeroSection from './hero-section';
import FeaturesSection from './features-section';
import HowItWorksSection from './works-section';
import TestimonialsSection from './testimonal-section';

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
    </main>
  );
}