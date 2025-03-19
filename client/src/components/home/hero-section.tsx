import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Search, Navigation } from 'lucide-react';
import PropertySearch from '@/components/property/property-search';

export default function HeroSection() {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Function to get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Available",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }
    
    setIsLocationLoading(true);
    
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
            
            // Extract city or locality information
            const city = data.address.city || 
                        data.address.town || 
                        data.address.village || 
                        data.address.suburb ||
                        data.address.neighbourhood ||
                        data.address.state;
                        
            if (city) {
              setLocation(city);
              toast({
                title: "Location Found",
                description: `Using your current location: ${city}`,
              });
            } else {
              setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          } else {
            // If geocoding fails, just use coordinates
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Unable to fetch your location details. Please enter manually.",
            variant: "destructive",
          });
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLocationLoading(false);
        toast({
          title: "Location Error",
          description: "Unable to get your location. Please enable location services and try again.",
          variant: "destructive",
        });
      }
    );
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    
    if (location) {
      queryParams.append('city', location);
    }
    
    if (propertyType) {
      queryParams.append('propertyType', propertyType);
    }
    
    navigate(`/properties?${queryParams.toString()}`);
  };

  return (
    <>
      {/* Reduced Banner Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
            alt="Modern luxury home" 
            className="w-full h-full object-cover object-center opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-heading leading-tight mb-3">
              Find Your Dream Home, <span className="text-primary-400">Without The Broker</span>
            </h1>
            <p className="text-base md:text-lg text-gray-200 mb-3">
              Direct connections between owners and buyers. No commissions, no hassle.
            </p>
            <div className="flex space-x-4 mt-3">
              <Link to="/post-property-free" className="inline-flex bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Post Property FREE
              </Link>
              <Link to="/properties" className="inline-flex bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                View All Properties
              </Link>
            </div>
          </div>
        </div>
        
        {/* Property Search - Integrated with banner */}
        <div className="container mx-auto px-4 pb-6 relative z-20 -mb-16">
          <PropertySearch className="shadow-xl" showAdvanced={false} />
        </div>

        {/* Stats Bar */}
        <div className="bg-white bg-opacity-95 py-4 md:py-6 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-2">
                <p className="text-primary text-2xl md:text-3xl font-bold">10,000+</p>
                <p className="text-gray-700">Properties Listed</p>
              </div>
              <div className="p-2">
                <p className="text-primary text-2xl md:text-3xl font-bold">15,000+</p>
                <p className="text-gray-700">Happy Customers</p>
              </div>
              <div className="p-2">
                <p className="text-primary text-2xl md:text-3xl font-bold">₹1.2 Cr</p>
                <p className="text-gray-700">Broker Fees Saved</p>
              </div>
              <div className="p-2">
                <p className="text-primary text-2xl md:text-3xl font-bold">4.8/5</p>
                <p className="text-gray-700">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add spacing to accommodate the property search that overlaps */}
      <div className="h-24 md:h-28 bg-gray-50"></div>
    </>
  );
}
