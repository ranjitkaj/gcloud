import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { Check, ChevronLeft, ChevronRight, ArrowDown, Phone, Mail, MessageSquare, 
  Home, MapPin, Building, Camera, Upload, Clock, Users, BadgeCheck } from 'lucide-react';
import FileUpload, { FileWithPreview } from '@/components/upload/file-upload';

// Property type schema
const propertySchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  propertyType: z.enum(["Apartment", "Villa", "House", "Plot", "Commercial", "Office"]),
  forSaleOrRent: z.enum(["Sale", "Rent"]),
  price: z.string().min(1, { message: "Price is required" }),
  location: z.string().min(5, { message: "Location must be at least 5 characters" }),
  pincode: z.string().min(5, { message: "Pincode must be at least 5 characters" }),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  area: z.string().min(1, { message: "Area is required" }),
  areaUnit: z.enum(["sqft", "sqm", "acres", "hectares"]),
  contactName: z.string().min(2, { message: "Contact name is required" }),
  contactPhone: z.string().min(10, { message: "Valid phone number is required" }),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function PostPropertyFree() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [propertyImages, setPropertyImages] = useState<FileWithPreview[]>([]);
  
  // Form setup with validation
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      propertyType: "Apartment",
      forSaleOrRent: "Sale",
      price: "",
      location: "",
      pincode: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      areaUnit: "sqft",
      contactName: user?.name || "",
      contactPhone: "",
    }
  });
  
  // Setup login modal
  useEffect(() => {
    if (user) {
      setShowLoginModal(false);
      // Pre-fill user name if available
      form.setValue("contactName", user.name || "");
    }
  }, [user, form]);

  // Function to scroll to top of form
  const scrollToForm = () => {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle login button click
  const handleLoginClick = () => {
    navigate('/auth');
  };
  
  // Handle form submission
  const onSubmit = (data: PropertyFormValues) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    // Check if at least one image is uploaded
    if (propertyImages.length === 0) {
      toast({
        title: "Images Required",
        description: "Please upload at least one image of your property",
        variant: "destructive",
      });
      setCurrentStep(4); // Go back to images step
      return;
    }
    
    // Create a complete property object with form data and images
    const propertyData = {
      ...data,
      images: propertyImages,
      userId: user.id,
      createdAt: new Date(),
    };
    
    console.log("Property data submitted:", propertyData);
    setFormSubmitted(true);
    
    // Show success notification
    toast({
      title: "Property Listed Successfully",
      description: "Your property has been posted successfully.",
      variant: "default",
    });
    
    // In a real app, here we would send data to the backend
    // For demo, we'll simulate success and redirect after 2 seconds
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
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
    },
    {
      id: 4,
      name: "Aisha Patel",
      role: "Property Owner",
      content: "As a first-time seller, I found the platform extremely user-friendly. The step-by-step listing process guided me perfectly, and I received multiple inquiries within days.",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
      id: 5,
      name: "Rahul Khanna",
      role: "Real Estate Agent",
      content: "The analytics and insights provided for my listings help me understand what buyers are looking for. This has dramatically improved my sales conversion rate.",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg"
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
  
  // Form steps - divide property listing form into manageable sections
  const renderFormByStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Basic Property Information</h3>
              <Separator />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">Property Title</label>
                <input
                  id="title"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="3 BHK Apartment in Downtown"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-xs">{form.formState.errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="propertyType" className="block text-sm font-medium">Property Type</label>
                <select
                  id="propertyType"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  {...form.register("propertyType")}
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House</option>
                  <option value="Plot">Plot</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Office">Office</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="forSaleOrRent" className="block text-sm font-medium">For Sale or Rent</label>
                <select
                  id="forSaleOrRent"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  {...form.register("forSaleOrRent")}
                >
                  <option value="Sale">Sale</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium">Price (₹)</label>
                <input
                  id="price"
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="2500000"
                  {...form.register("price")}
                />
                {form.formState.errors.price && (
                  <p className="text-red-500 text-xs">{form.formState.errors.price.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">Property Description</label>
              <textarea
                id="description"
                className="w-full p-2 border border-gray-300 rounded-md h-24"
                placeholder="Describe your property in detail..."
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                type="button" 
                onClick={() => setCurrentStep(2)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Next: Location Details
              </Button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Location Information</h3>
              <Separator />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium">Address</label>
                <input
                  id="location"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="123 Main Street, Area Name"
                  {...form.register("location")}
                />
                {form.formState.errors.location && (
                  <p className="text-red-500 text-xs">{form.formState.errors.location.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="pincode" className="block text-sm font-medium">Pincode</label>
                <input
                  id="pincode"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="400001"
                  {...form.register("pincode")}
                />
                {form.formState.errors.pincode && (
                  <p className="text-red-500 text-xs">{form.formState.errors.pincode.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Previous
              </Button>
              <Button 
                type="button" 
                onClick={() => setCurrentStep(3)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Next: Property Details
              </Button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Property Details</h3>
              <Separator />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="bedrooms" className="block text-sm font-medium">Bedrooms</label>
                <select
                  id="bedrooms"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  {...form.register("bedrooms")}
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="5+">5+</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="bathrooms" className="block text-sm font-medium">Bathrooms</label>
                <select
                  id="bathrooms"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  {...form.register("bathrooms")}
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="4+">4+</option>
                </select>
              </div>
              
              <div className="col-span-1 md:col-span-3 grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <label htmlFor="area" className="block text-sm font-medium">Area</label>
                  <input
                    id="area"
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="1200"
                    {...form.register("area")}
                  />
                  {form.formState.errors.area && (
                    <p className="text-red-500 text-xs">{form.formState.errors.area.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="areaUnit" className="block text-sm font-medium">Unit</label>
                  <select
                    id="areaUnit"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    {...form.register("areaUnit")}
                  >
                    <option value="sqft">sq ft</option>
                    <option value="sqm">sq m</option>
                    <option value="acres">acres</option>
                    <option value="hectares">hectares</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setCurrentStep(2)}
              >
                Previous
              </Button>
              <Button 
                type="button" 
                onClick={() => setCurrentStep(4)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Next: Upload Images
              </Button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Images & Videos</h3>
              <Separator />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Upload Property Images & Videos</label>
                <FileUpload
                  onFilesSelected={setPropertyImages}
                  initialFiles={propertyImages}
                  maxFiles={10}
                  allowMultiple={true}
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
                <div className="flex items-start">
                  <Camera className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-amber-800">
                      <span className="font-medium">Pro Tip:</span> High-quality property images increase interest by up to 60%
                    </p>
                    <ul className="text-xs text-amber-700 list-disc pl-4 mt-1 space-y-1">
                      <li>Include photos of all rooms, exterior, and surrounding areas</li>
                      <li>Ensure good lighting and clear focus</li>
                      <li>A short video walkthrough dramatically increases inquiries</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setCurrentStep(3)}
              >
                Previous
              </Button>
              <Button 
                type="button" 
                onClick={() => setCurrentStep(5)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Next: Contact Information
              </Button>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
              <Separator />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="contactName" className="block text-sm font-medium">Contact Name</label>
                <input
                  id="contactName"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Your Name"
                  {...form.register("contactName")}
                />
                {form.formState.errors.contactName && (
                  <p className="text-red-500 text-xs">{form.formState.errors.contactName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contactPhone" className="block text-sm font-medium">Contact Phone</label>
                <input
                  id="contactPhone"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Your Phone Number"
                  {...form.register("contactPhone")}
                />
                {form.formState.errors.contactPhone && (
                  <p className="text-red-500 text-xs">{form.formState.errors.contactPhone.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setCurrentStep(4)}
              >
                Previous
              </Button>
              <Button 
                type="submit" 
                onClick={form.handleSubmit(onSubmit)}
                className="bg-primary hover:bg-primary/90 text-white"
                disabled={formSubmitted}
              >
                {formSubmitted ? "Submitting..." : "Submit Property Listing"}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to login or create an account to post your property.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-3 py-4">
            <p className="text-sm text-gray-600">Login to access these features:</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <p className="text-sm">Post unlimited properties</p>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <p className="text-sm">Receive direct inquiries from potential buyers</p>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <p className="text-sm">Track property views and statistics</p>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <p className="text-sm">Edit your listings anytime</p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <Button variant="outline" onClick={() => setShowLoginModal(false)}>
              Continue Browsing
            </Button>
            <Button className="sm:w-auto bg-primary hover:bg-primary/90" onClick={handleLoginClick}>
              Login / Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {renderFormByStep()}
                      </form>
                    ) : (
                      <div className="text-center space-y-4">
                        <p className="text-gray-600 mb-4">You need to login before posting a property</p>
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 text-white" 
                          size="lg"
                          onClick={handleLoginClick}
                        >
                          Login to Post Your Property
                        </Button>
                      </div>
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
        
        {/* Featured Property Types */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">List Any Type of Property</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform supports all types of real estate listings to help you reach the right buyers.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
                <Home className="h-12 w-12 text-primary mb-3" />
                <h3 className="font-semibold text-lg">Residential</h3>
                <p className="text-gray-600 text-center text-sm mt-2">Apartments, Villas, Individual Houses</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
                <Building className="h-12 w-12 text-primary mb-3" />
                <h3 className="font-semibold text-lg">Commercial</h3>
                <p className="text-gray-600 text-center text-sm mt-2">Office Spaces, Shops, Showrooms</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
                <MapPin className="h-12 w-12 text-primary mb-3" />
                <h3 className="font-semibold text-lg">Plots & Land</h3>
                <p className="text-gray-600 text-center text-sm mt-2">Residential Plots, Agricultural Land</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold">With over 7 million unique visitors monthly, your property gets maximum visibility</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
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
        <div className="py-16 bg-gray-50">
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
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              
              <button 
                onClick={nextTestimonial}
                className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            
            {/* Testimonial navigation dots */}
            <div className="flex justify-center mt-6">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentTestimonialIndex(index)}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    currentTestimonialIndex === index ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="py-16 bg-white">
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
                
                <AccordionItem value="item-7">
                  <AccordionTrigger>How can I increase visibility for my property?</AccordionTrigger>
                  <AccordionContent>
                    You can opt for our premium listing options that provide more visibility through featured placements, social media promotions, and email campaigns to targeted buyers.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8">
                  <AccordionTrigger>What happens after I submit my property listing?</AccordionTrigger>
                  <AccordionContent>
                    After submission, your listing will undergo a quick verification process. Once approved, it will be live on our platform and visible to potential buyers. You'll receive a confirmation email with your listing details.
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