import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Property } from '@shared/schema';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import NeighborhoodInsights from '@/components/property/neighborhood-insights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MapPin,
  Bed,
  Droplet,
  Ruler,
  Calendar,
  Check,
  MapIcon,
  HomeIcon,
  Share2,
  Heart,
  Phone,
  Mail,
  Sparkles
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAiRecommendation, setShowAiRecommendation] = useState(false);
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);
  const [interestName, setInterestName] = useState('');
  const [interestEmail, setInterestEmail] = useState('');
  const [interestPhone, setInterestPhone] = useState('');
  const [interestMessage, setInterestMessage] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch property details
  const { data: property, isLoading, isError } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });

  // Track property view with recommendation engine
  const trackInteractionMutation = useMutation({
    mutationFn: async ({ propertyId, interactionType }: { propertyId: number, interactionType: 'view' | 'save' | 'inquiry' }) => {
      return apiRequest('/api/recommendations/track', 'POST', { propertyId, interactionType });
    }
  });

  // Save/unsave property mutation
  const savePropertyMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      return apiRequest(`/api/properties/${propertyId}/save`, 'POST');
    },
    onSuccess: () => {
      setIsFavorite(true);
      toast({
        title: "Property saved",
        description: "You can find it in your saved properties list",
      });
      // Track saving as an interaction for recommendations
      if (user && property) {
        trackInteractionMutation.mutate({
          propertyId: property.id,
          interactionType: 'save'
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save property. Please try again.",
        variant: "destructive",
      });
    }
  });

  const unsavePropertyMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      return apiRequest(`/api/properties/${propertyId}/save`, 'DELETE');
    },
    onSuccess: () => {
      setIsFavorite(false);
      toast({
        title: "Property removed",
        description: "Property has been removed from your saved list",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove property. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Check if property is saved for logged-in user
  const { data: savedProperties = [] } = useQuery<Property[]>({
    queryKey: ['/api/user/saved'],
    enabled: !!user,
  });

  // Track view on component mount
  useEffect(() => {
    if (user && property) {
      trackInteractionMutation.mutate({
        propertyId: property.id,
        interactionType: 'view'
      });
      
      // Check if property is already saved
      const isSaved = savedProperties.some(prop => prop.id === property.id);
      setIsFavorite(isSaved);
      
      // Randomly show AI recommendation badge (in a real app, this would be based on more complex logic)
      setShowAiRecommendation(Math.random() > 0.7);
    }
  }, [user, property, savedProperties]);

  // Format the price in Indian currency format
  const formatPrice = (price?: number) => {
    if (!price) return "Price on request";
    
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(0)} Lac`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const toggleFavorite = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save properties",
      });
      return;
    }
    
    if (property) {
      if (isFavorite) {
        unsavePropertyMutation.mutate(property.id);
      } else {
        savePropertyMutation.mutate(property.id);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-[400px] w-full rounded-xl" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Skeleton className="h-40 w-full rounded-xl" />
                </div>
                <div>
                  <Skeleton className="h-60 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8 bg-gray-50">
          <div className="container mx-auto px-4 text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
            <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/properties">Browse Properties</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Use the first image from imageUrls array or a default image
  const images = property.imageUrls?.length 
    ? property.imageUrls 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/properties" className="text-gray-500 hover:text-primary">Properties</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{property.title}</span>
          </div>

          {/* Property Title & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.location}, {property.city}</span>
              </div>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
                onClick={toggleFavorite}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{isFavorite ? 'Saved' : 'Save'}</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                <span>Share</span>
              </Button>
            </div>
          </div>

          {/* Property Images */}
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden bg-gray-100 h-[400px] mb-2">
              <img 
                src={images[activeImageIndex]} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
              {property.featured && (
                <Badge className="absolute top-4 left-4 z-10 bg-primary">FEATURED</Badge>
              )}
              {showAiRecommendation && (
                <Badge className="absolute top-4 right-4 z-10 bg-indigo-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>AI RECOMMENDED</span>
                </Badge>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
                {images.map((image, index) => (
                  <div 
                    key={index}
                    className={`h-16 w-24 rounded-md overflow-hidden cursor-pointer border-2 ${index === activeImageIndex ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${property.title} - ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Property Information */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap mb-6">
                    <div className="w-full md:w-1/2 mb-4 md:mb-0">
                      <h2 className="text-2xl font-bold text-gray-900">{formatPrice(property.price)}</h2>
                      <p className="text-gray-500">
                        {property.area && `${property.area} sq.ft`}
                        {property.bedrooms && ` · ${property.bedrooms} Beds`}
                        {property.bathrooms && ` · ${property.bathrooms} Baths`}
                      </p>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-wrap md:justify-end">
                      <div className="flex items-center mr-4 text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Listed {formatDistanceToNow(new Date(property.createdAt || new Date()), { addSuffix: true })}</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Owner Direct
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {property.bedrooms && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Bed className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold">{property.bedrooms}</p>
                        <p className="text-gray-500 text-sm">Bedrooms</p>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Droplet className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold">{property.bathrooms}</p>
                        <p className="text-gray-500 text-sm">Bathrooms</p>
                      </div>
                    )}
                    {property.area && (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Ruler className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                        <p className="text-gray-700 font-semibold">{property.area}</p>
                        <p className="text-gray-500 text-sm">Sq. Ft.</p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <HomeIcon className="h-5 w-5 mx-auto mb-2 text-gray-500" />
                      <p className="text-gray-700 font-semibold capitalize">{property.propertyType}</p>
                      <p className="text-gray-500 text-sm">Property Type</p>
                    </div>
                  </div>

                  <Tabs defaultValue="description">
                    <TabsList className="mb-4">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="features">Features</TabsTrigger>
                      <TabsTrigger value="location">Location</TabsTrigger>
                    </TabsList>
                    <TabsContent value="description">
                      <div className="space-y-4 text-gray-700">
                        <p>{property.description}</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="features">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Modern Kitchen',
                          'Air Conditioning',
                          'Balcony',
                          'Power Backup',
                          'Security',
                          'Parking',
                          'Swimming Pool',
                          'Gym'
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="location">
                      <div className="rounded-lg overflow-hidden bg-gray-100 h-[300px] flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <MapIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                          <p>Map location: {property.address}</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              {/* Neighborhood Insights */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <NeighborhoodInsights 
                    neighborhood={property.location} 
                    city={property.city} 
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Contact & Details */}
            <div>
              <Card className="mb-6 sticky top-20">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Property Owner</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-lg font-semibold">
                          {property.userId.toString().charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">Owner</p>
                        <p className="text-sm text-gray-500">Direct owner - no broker fees</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {accessGranted ? (
                        <>
                          <Button className="w-full bg-primary hover:bg-primary/90">
                            <Phone className="h-4 w-4 mr-2" /> Call Owner
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Mail className="h-4 w-4 mr-2" /> Email Owner
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={() => setShowInterestForm(true)}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            <span>Request Contact Info</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setShowInterestForm(true)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            <span>Express Interest</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 rounded-b-lg border-t">
                  <div className="w-full text-center text-sm text-gray-600">
                    <p>Property ID: #{property.id}</p>
                    <p>Last updated: {formatDistanceToNow(new Date(property.createdAt || new Date()), { addSuffix: true })}</p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Interest Form Dialog */}
      {showInterestForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowInterestForm(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-4 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold">Express Interest</h3>
              <p className="text-gray-600 mt-1">
                This property listing is private. Submit your information to get access to contact details.
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setIsSubmittingInterest(true);
              
              // Simulate sending interest to admin/company
              setTimeout(() => {
                setIsSubmittingInterest(false);
                setAccessGranted(true);
                setShowInterestForm(false);
                
                toast({
                  title: "Interest Submitted",
                  description: "Your request has been sent to the property owner. Contact details are now available.",
                });
              }, 1500);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={interestName}
                  onChange={(e) => setInterestName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={interestEmail}
                  onChange={(e) => setInterestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={interestPhone}
                  onChange={(e) => setInterestPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Your contact number"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                  placeholder="Please let me know more about this property..."
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmittingInterest}>
                {isSubmittingInterest ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Interest"
                )}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By submitting this form, you agree to our terms and privacy policy.
                Your information will be sent to the property owner or manager.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
