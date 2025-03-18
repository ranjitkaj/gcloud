import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { Check, ChevronLeft, ChevronRight, ArrowDown, Phone, Mail, MessageSquare } from 'lucide-react';

export default function PostPropertyFree() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);
  
  // Show login modal if user is not logged in
  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
    }
  }, [user]);

  // Function to scroll to top of form
  const scrollToForm = () => {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle login button click
  const handleLoginClick = () => {
    navigate('/auth');
  };

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Raj Sharma",
      role: "Property Owner",
      content: "I sold my apartment within just 3 weeks of listing it here. The process was extremely smooth and I got a great price without paying any broker fees!",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      name: "Priya Mehta",
      role: "Real Estate Dealer",
      content: "As a dealer, this platform has helped me connect with serious buyers directly. The listing process is straightforward and the support team is very responsive.",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      name: "Vikram Singh",
      role: "Property Owner",
      content: "Listed my commercial property and received multiple inquiries within days. The verification process adds credibility to my listing.",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ];

  // Current testimonial index for carousel
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-primary/10 py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary">
                  Sell or Rent your Property online faster
                </h1>
                <p className="text-gray-700 text-lg mb-6">
                  Post your property for free and connect with potential buyers directly. 
                  No middleman, no commissions, just fast and transparent property deals.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Check className="text-primary mr-2 h-5 w-5" />
                    <p>Advertise to millions of potential buyers</p>
                  </div>
                  <div className="flex items-center">
                    <Check className="text-primary mr-2 h-5 w-5" />
                    <p>Get genuine responses from verified users</p>
                  </div>
                  <div className="flex items-center">
                    <Check className="text-primary mr-2 h-5 w-5" />
                    <p>Shortlist & connect directly with buyers</p>
                  </div>
                  <div className="flex items-center">
                    <Check className="text-primary mr-2 h-5 w-5" />
                    <p>Absolutely no brokerage fees involved</p>
                  </div>
                </div>
              </div>
              
              {/* Form Section */}
              <div ref={formTopRef}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Start Posting Your Property</CardTitle>
                    <CardDescription>Fill in the details below to list your property</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white" 
                        size="lg"
                        onClick={() => navigate('/add-property')}
                      >
                        Continue to Property Form
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white" 
                        size="lg"
                        onClick={handleLoginClick}
                      >
                        Login to Post Your Property
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        {/* Simple Steps Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Post Your Property in 3 Simple Steps</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Listing your property has never been easier. Follow these simple steps to get your property in front of thousands of potential buyers.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="relative text-center p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">1</div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-3">Add details of your property</h3>
                  <p className="text-gray-600">Fill in all the essential information about your property including images, location, and amenities.</p>
                </div>
              </div>
              
              <div className="relative text-center p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">2</div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-3">Upload Photos & Videos</h3>
                  <p className="text-gray-600">Add high-quality photos and videos of your property to attract serious buyers.</p>
                </div>
              </div>
              
              <div className="relative text-center p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">3</div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-3">Add Pricing & Ownership</h3>
                  <p className="text-gray-600">Specify your expected price and provide ownership details to establish trust.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={scrollToForm}
              >
                Begin to Post Your Property
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold">With over 7 million unique visitors monthly, your property gets maximum visibility</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary mb-2">1M+</p>
                <p className="text-gray-600">Monthly Visitors</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">5.5M+</p>
                <p className="text-gray-600">Property Views</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">200K+</p>
                <p className="text-gray-600">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">This is what other Owners & Dealers have to say...</h2>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-lg text-gray-700 mb-6 italic">
                  "{testimonials[currentTestimonialIndex].content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonials[currentTestimonialIndex].avatar} 
                      alt={testimonials[currentTestimonialIndex].name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonials[currentTestimonialIndex].name}</h4>
                    <p className="text-gray-600 text-sm">{testimonials[currentTestimonialIndex].role}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={prevTestimonial}
                className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              
              <button 
                onClick={nextTestimonial}
                className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What types of property can I post on your site?</AccordionTrigger>
                  <AccordionContent>
                    You can post all types of properties including residential apartments, villas, plots, commercial spaces, office buildings, and more. Our platform caters to all property types.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is posting a property completely free?</AccordionTrigger>
                  <AccordionContent>
                    Yes, posting a basic property listing is completely free. We also offer premium listing options with additional features for increased visibility at a nominal cost.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>How long will my property listing remain active?</AccordionTrigger>
                  <AccordionContent>
                    Free listings remain active for 60 days. Premium listings can stay active for up to 120 days. You can always renew your listing if needed.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I edit my property details after posting?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can edit your property details anytime from your dashboard. Updates will reflect immediately on your listing.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I communicate with potential buyers?</AccordionTrigger>
                  <AccordionContent>
                    When a buyer shows interest, you'll receive a notification. You can then communicate directly through our secure messaging system or share contact details if comfortable.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>Is there a verification process for listings?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we verify basic property information to maintain quality listings. Premium listings undergo a more thorough verification process for increased credibility.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={scrollToForm}
              >
                Post Your Property Now
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to login or create an account before posting a property.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 mt-4">
            <Button onClick={handleLoginClick}>
              Login Now
            </Button>
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}