import { useState } from 'react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Search } from 'lucide-react';

export default function HeroSection() {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [, navigate] = useLocation();

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
    <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
          alt="Modern luxury home" 
          className="w-full h-full object-cover object-center opacity-30"
        />
      </div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-6">
            Find Your Dream Home, <span className="text-primary-400">Without The Broker</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Direct connections between owners and buyers. No commissions, no hassle.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-lg p-4 max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    type="text" 
                    placeholder="Enter location, neighborhood, or address" 
                    className="pl-10 pr-4 py-6 text-gray-700 bg-gray-50"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-row space-x-2">
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="bg-gray-50 border border-gray-300 text-gray-700 h-12 min-w-[180px]">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="plot">Land</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="py-6 px-5 whitespace-nowrap flex items-center bg-primary hover:bg-primary/90"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-5 w-5" />
                  <span>Search</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
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
  );
}
