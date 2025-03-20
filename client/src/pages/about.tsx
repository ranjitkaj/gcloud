import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Percent,
  ArrowRight,
  Users,
  Building,
  Home,
  BarChart,
  Award,
  CheckCircle,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Our Real Estate Platform
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                We're transforming how people buy, sell, and rent properties
                across India by leveraging technology to create a seamless and
                transparent experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/properties">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Browse Properties
                  </Button>
                </Link>
                <Link to="/post-property-free">
                  <Button size="lg" variant="outline">
                    List Your Property
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  Established in 2025, UrgentSales.in is India's fastest-growing and most trusted online real estate platform, dedicated to simplifying property transactions across the nation. Our vision is to create a seamless and transparent real estate experience, connecting millions of buyers, sellers, and brokers through an innovative, easy-to-use platform featuring verified property listings spanning in Andrapradesh & Telengana.
                </p>
                <p className="text-gray-600 mb-4">
                  At UrgentSales.in, we go far beyond simply providing property listings. We offer comprehensive real estate services, including personalized property recommendations, expert advisory services, and professional property management solutions. Powered by cutting-edge technology such as Virtual Reality (VR) and Artificial Intelligence (AI), we ensure an immersive, intelligent, and highly personalized property search experience.
                </p>
                <p className="text-gray-600 mb-4">
                  Our unique brokerage-free approach is designed to empower you. By providing real-time market insights, transparent pricing, and thoroughly verified listings, we help you make informed decisions with confidence and ease. It’s  a STARTUP company and UrgentSales.in has grown rapidly to become more than just a property portal—we've created a dynamic real estate ecosystem trusted by millions.
                </p>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Core Values</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>
                        <span className="font-medium">
                          Trust & Transparency:
                        </span>{" "}
                        Clear information, verified listings, and honest pricing
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>
                        <span className="font-medium">Innovation:</span>{" "}
                        Constant improvement through AI, data analytics, and
                        user feedback
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>
                        <span className="font-medium">Accessibility:</span>{" "}
                        Making property ownership achievable for more Indians
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Our office space"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Urgency Sales Information */}
        <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Clock className="h-4 w-4" />
                <span>Urgent Sales Program</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                About Our Urgency Sales Initiative
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our unique Urgency Sales program helps property owners who need
                quick results with exclusive 25% discounts for buyers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Urgency Sale Property"
                  className="rounded-xl shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  How Urgency Sales Works
                </h3>
                <p className="text-gray-600 mb-6">
                  For property owners who need to sell quickly due to
                  relocations, financial needs, or other priorities, our Urgency
                  Sales program offers a fast-track solution with enhanced
                  visibility and support.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="bg-white p-4 rounded-lg shadow-sm flex items-start">
                    <Badge className="bg-red-600 text-white mr-3 mt-1">
                      <Percent className="h-3 w-3 mr-1" /> 25%
                    </Badge>
                    <div>
                      <h4 className="font-medium">Discounted Price</h4>
                      <p className="text-gray-500 text-sm">
                        Properties are listed at 25% below market value to
                        attract immediate interest
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm flex items-start">
                    <Badge className="bg-orange-600 text-white mr-3 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                    </Badge>
                    <div>
                      <h4 className="font-medium">Time-Limited</h4>
                      <p className="text-gray-500 text-sm">
                        Listings run for just 7 days, creating a sense of
                        urgency for serious buyers
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm flex items-start">
                    <Badge className="bg-green-600 text-white mr-3 mt-1">
                      <Building className="h-3 w-3 mr-1" />
                    </Badge>
                    <div>
                      <h4 className="font-medium">Verified Properties</h4>
                      <p className="text-gray-500 text-sm">
                        All properties undergo rigorous verification for
                        assurance and peace of mind
                      </p>
                    </div>
                  </div>
                </div>

                <Link to="/properties?tag=urgent">
                  <Button className="bg-red-600 hover:bg-red-700 text-white group">
                    View Urgent Sales
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're proud of the positive change we're bringing to the Indian
                real estate market.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">12K+</div>
                <div className="text-gray-500">Properties Listed</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">45K+</div>
                <div className="text-gray-500">Happy Users</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">28+</div>
                <div className="text-gray-500">Cities Covered</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">₹860Cr+</div>
                <div className="text-gray-500">Transaction Value</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Meet the passionate professionals driving our mission forward.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm group">
                <div className="h-64 overflow-hidden">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="CEO"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">Rajiv Sharma</h3>
                  <p className="text-primary font-medium mb-3">
                    CEO & Co-Founder
                  </p>
                  <p className="text-gray-600 text-sm">
                    Former SVP at Housing.com with 15+ years in real estate
                    tech, passionate about reimagining property transactions for
                    the digital age.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm group">
                <div className="h-64 overflow-hidden">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="CTO"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">Priya Malhotra</h3>
                  <p className="text-primary font-medium mb-3">
                    CTO & Co-Founder
                  </p>
                  <p className="text-gray-600 text-sm">
                    AI and ML expert with experience at Google and Amazon,
                    leading our tech innovations in property matching and market
                    analysis.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm group">
                <div className="h-64 overflow-hidden">
                  <img
                    src="https://randomuser.me/api/portraits/men/22.jpg"
                    alt="COO"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">Arjun Kapoor</h3>
                  <p className="text-primary font-medium mb-3">COO</p>
                  <p className="text-gray-600 text-sm">
                    Real estate veteran with background in property development
                    and operations across major Indian metros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Find Your Perfect Property?
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Join thousands of satisfied users who've found their dream
                homes, lucrative investments, or perfect rental properties
                through our platform.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/properties">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    Search Properties
                  </Button>
                </Link>
                <Link to="/post-property-free">
                  <Button
                    size="lg"
                    className="bg-primary-foreground text-white border border-white hover:bg-white hover:text-primary"
                  >
                    List Your Property
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
