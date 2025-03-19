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
  propertyType: z.enum(["apartment", "villa", "house", "plot", "commercial", "office"]),
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
  const queryClient = useQueryClient();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [propertyImages, setPropertyImages] = useState<FileWithPreview[]>([]);
  
  // Set up the mutation for submitting property data
  const createPropertyMutation = useMutation({
    mutationFn: (propertyData: any) => {
      return apiRequest('POST', '/api/properties', propertyData);
    },
    onSuccess: () => {
      // Invalidate queries to refresh property lists
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties/featured'] });
      
      // Show success toast
      toast({
        title: "Property Listed Successfully",
        description: "Your property has been posted for free. It will be visible once approved.",
        variant: "default",
      });
      
      // Navigate to dashboard after success
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      console.error("Error submitting property:", error);
      toast({
        title: "Error",
        description: `Failed to submit property: ${error.message}`,
        variant: "destructive",
      });
      setFormSubmitted(false);
    }
  });
  
  // Form setup with validation
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      propertyType: "apartment",
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
      title: data.title,
      description: data.description,
      propertyType: data.propertyType,
      rentOrSale: data.forSaleOrRent.toLowerCase(),
      price: parseInt(data.price),
      location: data.location,
      city: data.location.split(',').pop()?.trim() || '',
      address: data.location, // Using location as address too
      pincode: data.pincode,
      bedrooms: data.bedrooms ? parseInt(data.bedrooms) : undefined,
      bathrooms: data.bathrooms ? parseInt(data.bathrooms) : undefined,
      area: parseInt(data.area),
      imageUrls: propertyImages.map(img => img.preview || ''),
      videoUrls: [], // Empty array for now
      amenities: [], // Empty array for now
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      subscriptionLevel: 'free',
      status: 'available', // Setting initial status
      approvalStatus: 'pending',
      userId: user?.id // Required field
    };
    
    console.log("Property data submitted:", propertyData);
    setFormSubmitted(true);
    
    // Submit to the backend
    createPropertyMutation.mutate(propertyData);
  };

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Raj Sharma",
      role: "Property Owner",
      location: "Mumbai",
      content: "I sold my apartment within just 3 weeks of listing it here. The process was extremely smooth and I got a great price without paying any broker fees!",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      name: "Priya Mehta",
      role: "Real Estate Dealer",
      location: "Delhi",
      content: "As a dealer, this platform has helped me connect with serious buyers directly. The listing process is straightforward and the support team is very responsive.",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      name: "Vikram Singh",
      role: "Property Owner",
      location: "Bangalore",
      content: "Listed my commercial property and received multiple inquiries within days. The verification process adds credibility to my listing.",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 4,
      name: "Aisha Patel",
      role: "Property Owner",
      location: "Pune",
      content: "As a first-time seller, I found the platform extremely user-friendly. The step-by-step listing process guided me perfectly, and I received multiple inquiries within days.",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
      id: 5,
      name: "Rahul Khanna",
      role: "Real Estate Agent",
      location: "Chennai",
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
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="house">House</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                  <option value="office">Office</option>
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
                disabled={formSubmitted || createPropertyMutation.isPending}
              >
                {createPropertyMutation.isPending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Property Listing"
                )}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
        <div className="bg-primary/5 py-12 border-b border-gray-100">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
                  Sell or Rent your Property online <span className="text-green-600">faster</span>
                </h1>
                <p className="text-gray-700 text-lg mb-6">
                  Post your property for free and connect with potential buyers directly. 
                  No middleman, no commissions, just fast and transparent property deals.
                </p>
                
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">1</div>
                      <div>
                        <p className="font-medium">Visibility to verified buyers</p>
                        <p className="text-sm text-gray-500">Maximum exposure to genuine buyers</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">2</div>
                      <div>
                        <p className="font-medium">Direct property inquiries</p>
                        <p className="text-sm text-gray-500">Receive inquiries on your listings</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">3</div>
                      <div>
                        <p className="font-medium">0% brokerage</p>
                        <p className="text-sm text-gray-500">Absolutely no hidden or brokerage fees</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mt-6">
                  <div className="w-16 h-16 flex items-center justify-center mr-4">
                    <img src="https://placehold.co/100x100?text=Verify" alt="Verified badge" className="w-full h-full" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Properties are verified by our team</p>
                    <p className="text-xs text-gray-500">All listings are thoroughly verified for quality</p>
                  </div>
                </div>
              </div>
              
              {/* Form Section */}
              <div ref={formTopRef}>
                <Card className="shadow-md border border-gray-200">
                  <CardHeader className="bg-primary/5 border-b border-gray-100">
                    <CardTitle className="text-2xl">Start Posting Your Property</CardTitle>
                    <CardDescription>Fill in the details to list your property for free</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {user ? (
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {renderFormByStep()}
                      </form>
                    ) : (
                      <div className="text-center space-y-4">
                        <p className="text-gray-600 mb-4">You need to login before posting a property</p>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium" 
                          size="lg"
                          onClick={handleLoginClick}
                        >
                          Login to Post Your Property
                        </Button>
                        <p className="text-sm text-gray-500 mt-4">100% free listing, no hidden charges</p>
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
              <h2 className="text-3xl font-bold mb-4">Post Your Property in <span className="text-green-600">3 Simple Steps</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Listing your property has never been easier. Follow these simple steps to get your property in front of thousands of potential buyers.
              </p>
            </div>
            
            <div className="relative mt-16">
              {/* Progress Line */}
              <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gray-200 z-0">
                <div className="h-full bg-green-500 w-full" style={{ width: '100%' }}></div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-white shadow-lg flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold">1</div>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">Add Property Details</h3>
                  <p className="text-gray-600 text-center text-sm">Fill in all essential information about your property</p>
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-white shadow-lg flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold">2</div>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">Upload Photos & Videos</h3>
                  <p className="text-gray-600 text-center text-sm">Add high-quality visuals to attract buyers</p>
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-white shadow-lg flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold">3</div>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">Pricing & Ownership</h3>
                  <p className="text-gray-600 text-center text-sm">Set your price and confirm ownership details</p>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-md text-lg font-medium shadow-md"
                onClick={scrollToForm}
              >
                Begin to Post Your Property
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">100% secure, free listing without hidden charges</p>
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
            <div className="rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 p-10 shadow-sm border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold">
                  With over <span className="text-green-600">7 million</span> unique visitors monthly,<br />
                  your property gets maximum visibility
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
                <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center border border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-4xl font-bold text-green-600 mb-1">1M+</p>
                  <p className="text-gray-600 text-sm">Monthly Active Visitors</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center border border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <Building className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-4xl font-bold text-blue-600 mb-1">5.5M+</p>
                  <p className="text-gray-600 text-sm">Property Views Per Month</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center border border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                    <BadgeCheck className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-4xl font-bold text-purple-600 mb-1">200K+</p>
                  <p className="text-gray-600 text-sm">Happy Customers</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-500 text-sm">Results based on platform analytics from the last quarter</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                <div className="w-full md:w-1/3">
                  <h2 className="text-3xl font-bold mb-4">This is what other Owners & Dealers have to say...</h2>
                  <p className="text-gray-600">Real experiences from our users who have successfully connected with buyers through our platform</p>
                  
                  <div className="mt-8 hidden md:flex justify-center gap-2">
                    <button 
                      onClick={prevTestimonial}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button 
                      onClick={nextTestimonial}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 relative">
                  <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col h-full">
                      <div className="mb-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                      
                      <p className="text-lg text-gray-700 mb-6 flex-grow">
                        "{testimonials[currentTestimonialIndex].content}"
                      </p>
                      
                      <div className="flex items-center">
                        <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-primary/20">
                          <img 
                            src={testimonials[currentTestimonialIndex].avatar} 
                            alt={testimonials[currentTestimonialIndex].name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{testimonials[currentTestimonialIndex].name}</h4>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-600 text-sm">{testimonials[currentTestimonialIndex].role}</p>
                            <span className="text-gray-300">•</span>
                            <p className="text-gray-600 text-sm">{testimonials[currentTestimonialIndex].location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Background decoration element */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-lg bg-primary/5 -z-10"></div>
                </div>
              </div>
              
              {/* Mobile navigation */}
              <div className="flex justify-center gap-2 md:hidden">
                <button 
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                
                {/* Testimonial navigation dots */}
                <div className="flex justify-center items-center gap-1 mx-2">
                  {testimonials.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentTestimonialIndex(index)}
                      className={`h-2 w-2 rounded-full mx-1 ${
                        currentTestimonialIndex === index ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <div className="text-center mt-8">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white px-6"
                  onClick={scrollToForm}
                >
                  Post Your Property Now
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-3 inline-block">FAQs</span>
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Get answers to common questions about posting your property on our platform
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b px-6">
                    <AccordionTrigger className="py-5 text-lg font-medium hover:no-underline">
                      What types of property can I post on your site?
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-gray-600">
                      You can post all types of properties including residential apartments, villas, plots, commercial spaces, office buildings, and more. Our platform caters to all property types.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2" className="border-b px-6">
                    <AccordionTrigger className="py-5 text-lg font-medium hover:no-underline">
                      Is posting a property completely free?
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-gray-600">
                      Yes, posting a basic property listing is completely free. We also offer premium listing options with additional features for increased visibility at a nominal cost.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3" className="border-b px-6">
                    <AccordionTrigger className="py-5 text-lg font-medium hover:no-underline">
                      How long will my property listing remain active?
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-gray-600">
                      Free listings remain active for 60 days. Premium listings can stay active for up to 120 days. You can always renew your listing if needed.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4" className="border-b px-6">
                    <AccordionTrigger className="py-5 text-lg font-medium hover:no-underline">
                      Can I edit my property details after posting?
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-gray-600">
                      Yes, you can edit your property details anytime from your dashboard. Updates will reflect immediately on your listing.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5" className="border-b px-6">
                    <AccordionTrigger className="py-5 text-lg font-medium hover:no-underline">
                      How do I communicate with potential buyers?
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-gray-600">
                      When a buyer shows interest, you'll receive a notification. You can then communicate directly through our secure messaging system or share contact details if comfortable.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6" className="border-b px-6">
                    <AccordionTrigger className="py-5 text-lg font-medium hover:no-underline">
                      Is there a verification process for listings?
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-gray-600">
                      Yes, we verify basic property information to maintain quality listings. Premium listings undergo a more thorough verification process for increased credibility.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-7" className="border-b px-6">
                    <AccordionTrigger className="py-5 text-lg font-medium hover:no-underline">
                      How can I increase visibility for my property?
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-gray-600">
                      You can opt for our premium listing options that provide more visibility through featured placements, social media promotions, and email campaigns to targeted buyers.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-8" className="px-6">
                    <AccordionTrigger className="py-5 text-lg font-medium hover:no-underline">
                      What happens after I submit my property listing?
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-gray-600">
                      After submission, your listing will undergo a quick verification process. Once approved, it will be live on our platform and visible to potential buyers. You'll receive a confirmation email with your listing details.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-6">Ready to list your property? It takes less than 10 minutes to create a listing!</p>
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-medium rounded-md shadow-md"
                  onClick={scrollToForm}
                >
                  Post Your Property Now
                </Button>
              </div>
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