import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/home/hero-section';
import FeaturedListings from '@/components/home/featured-listings';
import RecommendedProperties from '@/components/home/recommended-properties';
import HowItWorks from '@/components/home/how-it-works';
import ListPropertyCTA from '@/components/home/list-property-cta';
import PropertyCategories from '@/components/home/property-categories';
import FeaturedAgents from '@/components/home/featured-agents';
import TopCompanies from '@/components/home/top-companies';
import Testimonials from '@/components/home/testimonials';
import MobileApp from '@/components/home/mobile-app';
import CTASection from '@/components/home/cta-section';
import ServicesSection from '@/components/home/services-section';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedListings />
        <ServicesSection />
        <RecommendedProperties />
        <HowItWorks />
        <FeaturedAgents />
        <ListPropertyCTA />
        <PropertyCategories />
        <TopCompanies />
        <Testimonials />
        <MobileApp />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
