import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Property } from '@shared/schema';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardFooter 
} from '@/components/ui/card';
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
  Mail
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch property details
  const { data: property, isLoading, isError } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });

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
    setIsFavorite(!isFavorite);
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
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>Call Owner</span>
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>Email Owner</span>
                      </Button>
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
    </div>
  );
}
