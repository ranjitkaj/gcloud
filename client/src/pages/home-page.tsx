import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/home/hero-section';
import FeaturedListings from '@/components/home/featured-listings';
import HowItWorks from '@/components/home/how-it-works';
import ListPropertyCTA from '@/components/home/list-property-cta';
import PropertyCategories from '@/components/home/property-categories';
import Testimonials from '@/components/home/testimonials';
import MobileApp from '@/components/home/mobile-app';
import CTASection from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedListings />
        <HowItWorks />
        <ListPropertyCTA />
        <PropertyCategories />
        <Testimonials />
        <MobileApp />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
