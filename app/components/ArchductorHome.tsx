import Navbar from "./Navbar";
import SwarmingVectors from "./SwarmingVectors";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import VideoPlaceholderSection from "./VideoPlaceholderSection";
import Footer from "./Footer";

export default function ArchductorHome() {
  return (
    <div className="min-h-screen bg-[#312F2F] grid-lines relative">
      <div className="dot-pattern dot-pattern-fade z-0" aria-hidden="true" />
      <SwarmingVectors />

      <Navbar />

      <HeroSection />
      <FeaturesSection />
      <VideoPlaceholderSection />
      <Footer />
    </div>
  );
}

