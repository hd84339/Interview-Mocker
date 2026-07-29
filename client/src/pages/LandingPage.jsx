import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import InteractivePreview from "../components/landing/InteractivePreview";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import StatsAndTestimonials from "../components/landing/StatsAndTestimonials";
import Faq from "../components/landing/Faq";
import Footer from "../components/landing/Footer";

function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <Navbar />
      <main className="w-full">
        <Hero />
        <InteractivePreview />
        <Features />
        <HowItWorks />
        <StatsAndTestimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
