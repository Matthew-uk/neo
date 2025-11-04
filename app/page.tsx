'use client';
import Automate from '@/components/others/automate';
import HeroSection from '@/components/others/hero';
import Transform from '@/components/others/transform';

const Home = () => {
  return (
    <div className="font-urbanist min-h-screen">
      <HeroSection />
      <Transform />
      <Automate />
    </div>
  );
};

export default Home;
