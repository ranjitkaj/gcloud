import { useState, useEffect } from 'react';
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
import {
  Slider
} from '@/components/ui/slider';
import { MapPin, Search } from 'lucide-react';
import { propertyTypes } from '@shared/schema';

interface PropertySearchProps {
  className?: string;
  showAdvanced?: boolean;
}

export default function PropertySearch({ className = '', showAdvanced = false }: PropertySearchProps) {
  const [locationValue, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000); // 1 crore default max
  const [bedrooms, setBedrooms] = useState(0);
  const [, navigate] = useLocation();
  
  // Fixing redirect issues - react-router-dom uses useNavigate instead of wouter's navigate

  // Parse URL parameters if any
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get('city');
    const typeParam = params.get('propertyType');
    const minPriceParam = params.get('minPrice');
    const maxPriceParam = params.get('maxPrice');
    const bedroomsParam = params.get('minBedrooms');

    if (cityParam) setLocation(cityParam);
    if (typeParam) setPropertyType(typeParam);
    if (minPriceParam) setMinPrice(parseInt(minPriceParam));
    if (maxPriceParam) setMaxPrice(parseInt(maxPriceParam));
    if (bedroomsParam) setBedrooms(parseInt(bedroomsParam));
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    
    if (locationValue) {
      queryParams.append('city', locationValue);
    }
    
    if (propertyType) {
      queryParams.append('propertyType', propertyType);
    }

    if (showAdvanced) {
      if (minPrice > 0) {
        queryParams.append('minPrice', minPrice.toString());
      }
      
      if (maxPrice < 10000000) {
        queryParams.append('maxPrice', maxPrice.toString());
      }
      
      if (bedrooms > 0) {
        queryParams.append('minBedrooms', bedrooms.toString());
      }
    }
    
    // Redirect to search-results page instead of properties page
    navigate(`/search-results?${queryParams.toString()}`);
  };

  const formatPrice = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)} Lac`;
    } else {
      return `₹${value.toLocaleString()}`;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 ${className}`}>
      <div className="flex flex-col space-y-4">
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
                value={locationValue}
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
                {propertyTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
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
        
        {showAdvanced && (
          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="px-2">
                  <Slider 
                    defaultValue={[minPrice, maxPrice]} 
                    max={10000000} 
                    step={100000}
                    onValueChange={(values) => {
                      setMinPrice(values[0]);
                      setMaxPrice(values[1]);
                    }}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>{formatPrice(minPrice)}</span>
                    <span>{formatPrice(maxPrice)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <Select value={bedrooms.toString()} onValueChange={(value) => setBedrooms(parseInt(value))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
