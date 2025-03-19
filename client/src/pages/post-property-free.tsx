import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ClipboardList, Camera, CheckCircle2, Users2, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Check, ArrowDown, Phone, Mail, MessageSquare, 
  Home, MapPin, Building, Upload, Clock, Users, BadgeCheck } from 'lucide-react';
import FileUpload, { FileWithPreview } from '@/components/upload/file-upload';

// Property type schema
const propertySchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  propertyType: z.enum(["apartment", "villa", "house", "plot", "commercial", "office"]),
  forSaleOrRent: z.enum(["Sale", "Rent"]),
  price: z.string().min(1, { message: "Price is required" }),
  isUrgentSale: z.boolean().default(false),
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
  const [_, navigate] = useLocation();
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
      isUrgentSale: false,
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
  
  // Handle image files selection
  const handleFilesSelected = (files: FileWithPreview[]) => {
    setPropertyImages(files);
  };
  
  // Handle image file removal
  const handleFileRemoved = (fileId: string) => {
    setPropertyImages(prev => prev.filter(file => file.id !== fileId));
  };
  
  // Function to get user's current location for the property address
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Available",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }
    
    // Show loading toast
    toast({
      title: "Getting Location",
      description: "Please wait while we fetch your current location...",
    });
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Get latitude and longitude
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get the address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            
            // Construct a full address from the response
            const road = data.address.road || '';
            const suburb = data.address.suburb || data.address.neighbourhood || '';
            const city = data.address.city || data.address.town || data.address.village || '';
            const state = data.address.state || '';
            const postcode = data.address.postcode || '';
            
            // Format the address
            const address = `${road}, ${suburb}, ${city}, ${state}`.replace(/^, |, $/g, '').replace(/,\s*,/g, ',');
            
            // Update the form fields
            form.setValue("location", address);
            if (postcode) {
              form.setValue("pincode", postcode);
            }
            
            toast({
              title: "Location Retrieved",
              description: "Your current location has been filled in the address field.",
              variant: "default",
            });
          } else {
            throw new Error('Failed to get address from coordinates');
          }
        } catch (error) {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Unable to fetch your location details. Please enter manually.",
            variant: "destructive",
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "Location Error",
          description: "Unable to get your location. Please ensure location services are enabled.",
          variant: "destructive",
        });
      }
    );
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
    const price = parseInt(data.price);
    const propertyData = {
      title: data.title,
      description: data.description,
      propertyType: data.propertyType,
      rentOrSale: data.forSaleOrRent.toLowerCase(),
      price: price,
      // If urgency sale, calculate 25% discount
      discountedPrice: data.isUrgentSale ? Math.round(price * 0.75) : null,
      location: data.location,
      city: data.location.split(',').pop()?.trim() || '',
      address: data.location, // Using location as address too
      pincode: data.pincode,
      bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
      bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
      area: parseInt(data.area),
      imageUrls: propertyImages.map(img => img.preview || ''),
      videoUrls: [], // Empty array for now
      amenities: [], // Empty array for now
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      subscriptionLevel: 'free',
      status: 'available', // Setting initial status
      approvalStatus: 'pending',
      // Set expiry date for urgency listings (7 days from now)
      expiresAt: data.isUrgentSale ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
      userId: user?.id // Required field
    };
    
    console.log("Property data submitted:", propertyData);
    setFormSubmitted(true);
    
    // Submit to the backend
    createPropertyMutation.mutate(propertyData);
  };

  // How it works steps
  const howItWorksSteps = [
    {
      id: 1,
      title: "List Your Property",
      description: "Fill in your property details, add photos, and submit your free listing in just a few minutes.",
      icon: <Home className="h-8 w-8 text-primary" />
    },
    {
      id: 2,
      title: "Get Verified",
      description: "Our team reviews your listing to ensure it meets quality standards for better visibility.",
      icon: <BadgeCheck className="h-8 w-8 text-primary" />
    },
    {
      id: 3,
      title: "Connect with Buyers",
      description: "Receive direct inquiries from interested buyers without any broker interference.",
      icon: <MessageSquare className="h-8 w-8 text-primary" />
    },
    {
      id: 4,
      title: "Finalize Your Deal",
      description: "Meet potential buyers, negotiate directly, and close the deal on your terms.",
      icon: <Check className="h-8 w-8 text-primary" />
    }
  ];

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
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Title</FormLabel>
                    <FormControl>
                      <Input placeholder="3 BHK Apartment in Downtown" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="plot">Plot</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="forSaleOrRent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>For Sale or Rent</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select listing type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sale">Sale</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2500000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-4">
              <FormField
                control={form.control}
                name="isUrgentSale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-red-200 p-4 bg-white">
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="urgent-sale"
                        />
                        <label
                          htmlFor="urgent-sale"
                          className="text-sm font-medium leading-none cursor-pointer flex items-center"
                        >
                          <Clock className="h-4 w-4 text-red-600 mr-1" />
                          <span className="text-red-600 font-semibold">List as Urgency Sale (25% discount)</span>
                        </label>
                      </div>
                    </FormControl>
                    <div className="text-sm text-gray-600 mt-2">
                      Listing as an urgency sale will apply a 25% discount to your property price. 
                      Your property will be featured in the Urgency Sales section for 7 days, 
                      attracting serious buyers looking for time-limited deals.
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your property in detail..." 
                      className="h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end mt-6">
              <Button 
                type="button" 
                onClick={() => setCurrentStep(2)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Next: Location Details
                <ChevronRight className="ml-2 h-4 w-4" />
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
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input placeholder="123 Main Street, Area Name" {...field} className="rounded-r-none" />
                        </FormControl>
                        <Button 
                          type="button"
                          variant="outline" 
                          className="rounded-l-none border-l-0"
                          onClick={getUserLocation}
                        >
                          <MapPin className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                      <FormDescription>
                        Click the location icon to use your current location
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="400001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button 
                type="button" 
                onClick={() => setCurrentStep(3)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Next: Property Details
                <ChevronRight className="ml-2 h-4 w-4" />
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
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Select</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="5+">5+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Select</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="md:col-span-1">
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1200" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="areaUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sqft">sq.ft</SelectItem>
                            <SelectItem value="sqm">sq.m</SelectItem>
                            <SelectItem value="acres">Acres</SelectItem>
                            <SelectItem value="hectares">Hectares</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setCurrentStep(2)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button 
                type="button" 
                onClick={() => setCurrentStep(4)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Next: Upload Images
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Property Images</h3>
              <Separator />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <FileUpload 
                onFilesSelected={handleFilesSelected}
                onFileRemoved={handleFileRemoved}
                initialFiles={propertyImages}
                maxFiles={8}
                allowMultiple={true}
              />
              <p className="text-xs text-gray-500 mt-2">
                Upload up to 8 high-quality images of your property. The first image will be used as the main display image.
              </p>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setCurrentStep(3)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button 
                type="button" 
                onClick={() => setCurrentStep(5)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Next: Contact Details
                <ChevronRight className="ml-2 h-4 w-4" />
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
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <BadgeCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">Privacy Notice</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your contact information will only be shared with interested buyers. We prioritize your privacy and security.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setCurrentStep(4)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button 
                type="button" 
                onClick={() => setCurrentStep(6)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Next: Review & Submit
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Review Your Property Listing</h3>
              <Separator />
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Property Title</h4>
                  <p className="text-base">{form.getValues().title || "N/A"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Property Type</h4>
                  <p className="text-base capitalize">{form.getValues().propertyType || "N/A"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">For Sale/Rent</h4>
                  <p className="text-base">{form.getValues().forSaleOrRent || "N/A"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Price</h4>
                  {form.getValues().isUrgentSale ? (
                    <div>
                      <p className="text-base flex items-center">
                        <span className="line-through text-gray-500 mr-2">₹{parseInt(form.getValues().price || "0").toLocaleString()}</span>
                        <span className="text-red-600 font-semibold">₹{Math.round(parseInt(form.getValues().price || "0") * 0.75).toLocaleString()}</span>
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Urgency Sale
                        </span>
                      </p>
                      <p className="text-xs text-red-600 mt-1">25% discount applied! Limited time offer (7 days)</p>
                    </div>
                  ) : (
                    <p className="text-base">₹{parseInt(form.getValues().price || "0").toLocaleString()}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="text-base">{form.getValues().description || "N/A"}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Location</h4>
                  <p className="text-base">{form.getValues().location || "N/A"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Pincode</h4>
                  <p className="text-base">{form.getValues().pincode || "N/A"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Area</h4>
                  <p className="text-base">{form.getValues().area} {form.getValues().areaUnit}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Bedrooms</h4>
                  <p className="text-base">{form.getValues().bedrooms || "N/A"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Bathrooms</h4>
                  <p className="text-base">{form.getValues().bathrooms || "N/A"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Name</h4>
                  <p className="text-base">{form.getValues().contactName || "N/A"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Phone</h4>
                  <p className="text-base">{form.getValues().contactPhone || "N/A"}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Property Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {propertyImages.length > 0 ? (
                    propertyImages.map((image) => (
                      <div key={image.id} className="relative aspect-video overflow-hidden rounded-md bg-gray-200">
                        <img 
                          src={image.preview} 
                          alt="Property" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-8 border border-dashed border-gray-300 rounded-md">
                      <p className="text-gray-500">No images uploaded</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 bg-yellow-50 p-3 rounded-md">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-800">Approval Process</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your property listing will be reviewed by our team and typically approved within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setCurrentStep(5)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button 
                type="submit" 
                onClick={form.handleSubmit(onSubmit)}
                className="bg-primary hover:bg-primary/90 text-white"
                disabled={formSubmitted || createPropertyMutation.isPending}
              >
                {formSubmitted || createPropertyMutation.isPending ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Submitting...
                  </>
                ) : (
                  <>Submit Property Listing</>
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-primary/90 to-primary text-white pt-12 pb-10 md:pt-20 md:pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">List Your Property for Free</h1>
              <p className="text-lg opacity-90 mb-6">
                Connect directly with millions of potential buyers and tenants across India
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full py-3 px-5">
                  <Check className="h-5 w-5 text-green-300 mr-2" />
                  <span className="text-sm">No broker fees</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full py-3 px-5">
                  <Check className="h-5 w-5 text-green-300 mr-2" />
                  <span className="text-sm">Free listing</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full py-3 px-5">
                  <Check className="h-5 w-5 text-green-300 mr-2" />
                  <span className="text-sm">Verified buyers</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full py-3 px-5">
                  <Check className="h-5 w-5 text-green-300 mr-2" />
                  <span className="text-sm">Simple process</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Process steps */}
        <section className="py-10 -mt-6">
          <div className="container mx-auto px-4">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold">Add Your Property Details</h2>
                </div>
                <div className="text-sm text-gray-600">
                  Step {currentStep} of 6
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 h-2">
                <div 
                  className="h-2 bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                ></div>
              </div>
              
              {/* Step indicators */}
              <div className="hidden md:flex justify-between px-6 pt-4">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div 
                    key={step} 
                    className="flex flex-col items-center"
                    onClick={() => {
                      // Only allow going back to previous steps
                      if (step <= currentStep) {
                        setCurrentStep(step);
                        scrollToForm();
                      }
                    }}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer mb-1 transition-colors
                        ${step < currentStep 
                          ? 'bg-primary text-white' 
                          : step === currentStep 
                          ? 'bg-primary/90 text-white ring-4 ring-primary/20' 
                          : 'bg-gray-100 text-gray-400'}
                      `}
                    >
                      {step < currentStep ? <Check className="h-4 w-4" /> : step}
                    </div>
                    <span 
                      className={`text-xs font-medium ${step <= currentStep ? 'text-primary' : 'text-gray-400'}`}
                    >
                      {step === 1 && "Basic Info"}
                      {step === 2 && "Location"}
                      {step === 3 && "Details"}
                      {step === 4 && "Images"}
                      {step === 5 && "Contact"}
                      {step === 6 && "Review"}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Form */}
              <div ref={formTopRef} className="px-6 py-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    {renderFormByStep()}
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600">
                Listing your property is easy and free. Follow these simple steps to get started.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {howItWorksSteps.map((step) => (
                <div key={step.id} className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-4 rounded-full inline-flex mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">What Property Owners Say</h2>
              <p className="text-gray-600">
                Join thousands of satisfied property owners who have successfully listed and sold their properties through our platform
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-white rounded-xl shadow-lg p-6 md:p-10">
                <div className="flex justify-end space-x-2 absolute right-4 top-4">
                  <button 
                    onClick={prevTestimonial}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={nextTestimonial}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20">
                      <img 
                        src={testimonials[currentTestimonialIndex].avatar} 
                        alt={testimonials[currentTestimonialIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold">{testimonials[currentTestimonialIndex].name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{testimonials[currentTestimonialIndex].role}</span>
                        <span>•</span>
                        <span>{testimonials[currentTestimonialIndex].location}</span>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 italic relative">
                      <div className="absolute -left-4 -top-2 text-primary/10 text-4xl">"</div>
                      <p className="relative z-10">
                        {testimonials[currentTestimonialIndex].content}
                      </p>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600">
                Get answers to common questions about listing your property
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    Is it really free to list my property?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, basic property listings are completely free. We believe in connecting property owners directly with buyers without any intermediary costs. Premium listing options are available for enhanced visibility.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    How long does it take for my property to get approved?
                  </AccordionTrigger>
                  <AccordionContent>
                    Most property listings are approved within 24 hours. Our verification team reviews all listings to ensure quality and legitimacy before they go live on the platform.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    Who can see my contact information?
                  </AccordionTrigger>
                  <AccordionContent>
                    Only registered and verified users who express interest in your property can see your contact details. We protect your privacy and only share information with serious potential buyers.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    Can I edit my property listing after submitting?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, you can edit your property listing at any time through your dashboard. Changes to critical information may require re-approval by our verification team.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    What are the benefits of premium listings?
                  </AccordionTrigger>
                  <AccordionContent>
                    Premium listings receive featured placement on the homepage and search results, professional photo editing, virtual tours, and detailed analytics on viewer engagement with your property.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">
                    How do I communicate with potential buyers?
                  </AccordionTrigger>
                  <AccordionContent>
                    When a buyer expresses interest, you'll receive a notification with their contact details. You can then communicate directly via phone, email, or our built-in messaging system.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        
        {/* Login modal */}
        <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
              <DialogDescription>
                You need to be logged in to post a property. Please login or create an account to continue.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600 mb-4">
                Logging in helps us verify your identity and secure your property listing.
              </p>
            </div>
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setShowLoginModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={handleLoginClick}
              >
                Go to Login
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}