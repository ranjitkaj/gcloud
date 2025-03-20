// components/home/property-owner-cta.js
import React from 'react';

function PropertyOwnerCTA() {
  return (
    <section className="property-owner-cta">
      <h2>Become a Property Owner</h2>
      <p>List your property and reach thousands of potential buyers.</p>
      <button>Learn More</button>
    </section>
  );
}

export default PropertyOwnerCTA;


// pages/index.js (or wherever your homepage is)
import HeroSection from "@/components/home/hero-section";
import PropertyOwnerCTA from "@/components/home/property-owner-cta";
import NewlyListedProperties from "@/components/home/newly-listed-properties";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PropertyOwnerCTA />
      <NewlyListedProperties />
    </main>
  );
}