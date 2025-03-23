import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { Property } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import PropertyCard from '@/components/property/property-card';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { MapPin, Sparkles, Filter, ChevronDown, Home, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function TopPropertiesView() {
  const [_, navigate] = useLocation();
  const params = useParams<{ count?: string }>();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  
  const count = params.count || '10';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || 'premium';
  
  const [sortBy, setSortBy] = useState<string>('price-desc');
  const [selectedCity, setSelectedCity] = useState<string>(location);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  
  // Query properties
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['/api/properties/top', { category, location: selectedCity, limit: count }],
    queryFn: async ({ queryKey }) => {
      const [_, params] = queryKey as [string, { category: string; location: string; limit: string }];
      const searchParams = new URLSearchParams();
      
      if (params.category) searchParams.append('category', params.category);
      if (params.location) searchParams.append('location', params.location);
      if (params.limit) searchParams.append('limit', params.limit);
      
      const response = await fetch(`/api/properties/top?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch top properties');
      }
      return response.json();
    }
  });

  // Get available cities for filtering
  const { data: cities } = useQuery({
    queryKey: ['/api/properties/cities'],
    queryFn: async () => {
      const response = await fetch('/api/properties/cities');
      if (!response.ok) {
        return [];
      }
      return response.json();
    }
  });

  // Filter and sort properties
  const filteredProperties = properties ? properties
    .filter((property: Property) => 
      property.price >= priceRange[0] && 
      property.price <= priceRange[1])
    .sort((a: Property, b: Property) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sortBy === 'area-asc') return a.area - b.area;
      if (sortBy === 'area-desc') return b.area - a.area;
      return 0;
    }) : [];

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (selectedCity) newParams.append('location', selectedCity);
    if (category) newParams.append('category', category);
    
    const newUrl = `/top-properties/${count}${newParams.toString() ? `?${newParams.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedCity, category, count]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center mb-8">
                <Skeleton className="h-10 w-64 mb-4" />
                <Skeleton className="h-5 w-96" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(12)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-5 w-1/3" />
                          <Skeleton className="h-5 w-1/4" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-gray-50 flex items-center justify-center">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to load top properties</h2>
            <p className="text-gray-600 mb-6">We encountered a problem fetching the top properties. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryDisplay = category.charAt(0).toUpperCase() + category.slice(1);
  const totalCount = filteredProperties.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-500 mb-6">
            <a href="/" className="hover:text-primary">Home</a> {' > '} 
            <a href="/properties" className="hover:text-primary">Properties</a> {' > '} 
            <span className="text-gray-700">Top {count} Properties</span>
          </div>
          
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">
                Top {count} {categoryDisplay} Properties
                {selectedCity && <span> in {selectedCity}</span>}
              </h1>
              <p className="text-gray-500 mt-2 max-w-2xl">
                {`Discover the highest-rated ${categoryDisplay.toLowerCase()} properties based on popularity, value, and quality ratings`}
              </p>
              {selectedCity && (
                <Badge variant="outline" className="mt-3 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{selectedCity}</span>
                </Badge>
              )}
            </div>
            
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Location filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                  <Select 
                    value={selectedCity || ''}
                    onValueChange={(value) => setSelectedCity(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Cities</SelectItem>
                      {cities && cities.map((city: string) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Price Range filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Price Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4 p-2">
                        <div className="flex justify-between">
                          <div>
                            <label className="text-sm" htmlFor="minPrice">Min Price (₹)</label>
                            <Input
                              id="minPrice"
                              type="number"
                              value={priceRange[0]}
                              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                            />
                          </div>
                          <div>
                            <label className="text-sm" htmlFor="maxPrice">Max Price (₹)</label>
                            <Input
                              id="maxPrice"
                              type="number"
                              value={priceRange[1]}
                              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2">
                          {[1000000, 2500000, 5000000, 10000000].map((price) => (
                            <Button 
                              key={price}
                              variant="outline" 
                              size="sm" 
                              onClick={() => setPriceRange([0, price])}
                              className="text-xs"
                            >
                              Up to {(price / 1000000).toFixed(1)}M
                            </Button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Category filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                  <Select 
                    value={category}
                    onValueChange={(value) => navigate(`/top-properties/${count}?category=${value}${selectedCity ? `&location=${encodeURIComponent(selectedCity)}` : ''}`)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="urgent">Urgent Sale</SelectItem>
                      <SelectItem value="newest">Newly Listed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Sort by */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Sort By</label>
                  <Select 
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="area-desc">Area: Largest First</SelectItem>
                      <SelectItem value="area-asc">Area: Smallest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Results count */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{totalCount}</span> properties
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Change View</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {['10', '20', '30', '50', '100'].map((num) => (
                    <DropdownMenuItem 
                      key={num}
                      onClick={() => navigate(`/top-properties/${num}${window.location.search}`)}
                      className="flex items-center"
                    >
                      {num === count && <Check className="h-4 w-4 mr-2" />}
                      <span className={num === count ? 'font-medium' : ''}>Top {num}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Property listings */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property: Property, index: number) => (
                  <div key={property.id} className="relative">
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <Badge className={`
                          ${index === 0 ? 'bg-yellow-500' : ''}
                          ${index === 1 ? 'bg-gray-400' : ''}
                          ${index === 2 ? 'bg-amber-700' : ''}
                          text-white flex items-center gap-1 px-3 py-1
                        `}>
                          <Sparkles className="h-3 w-3" />
                          <span>#{index + 1}</span>
                        </Badge>
                      </div>
                    )}
                    <PropertyCard 
                      property={property} 
                      isAiRecommended={!!property.premium} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Home className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">No Properties Found</h3>
                <p className="text-gray-500 mb-6">
                  We couldn't find any properties matching your current filters.
                </p>
                <Button onClick={() => {
                  setSelectedCity('');
                  setPriceRange([0, 10000000]);
                  setSortBy('price-desc');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}