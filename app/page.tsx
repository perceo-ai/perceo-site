import Navbar from "./components/Navbar";
import SwarmingVectors from "./components/SwarmingVectors";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#312F2F] grid-lines relative">
      <div className="dot-pattern dot-pattern-fade z-0" aria-hidden="true" />
      <SwarmingVectors />

      <Navbar />

      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
