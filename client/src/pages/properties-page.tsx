import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@shared/schema';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import PropertyCard from '@/components/property/property-card';
import PropertySearch from '@/components/property/property-search';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PropertiesPage() {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState(new URLSearchParams());
  const [sortOrder, setSortOrder] = useState('newest');

  // Parse URL parameters on component mount or location change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams(params);
  }, [location]);

  // Build query string for the API call
  const queryString = searchParams.toString();

  // Fetch properties based on search parameters
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: [`/api/properties/search?${queryString}`],
  });

  const sortProperties = (properties: Property[] | undefined) => {
    if (!properties) return [];
    
    return [...properties].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOrder === 'price-high') {
        return b.price - a.price;
      } else if (sortOrder === 'price-low') {
        return a.price - b.price;
      }
      return 0;
    });
  };

  const sortedProperties = sortProperties(properties);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Dream Property</h1>
          
          {/* Search Bar */}
          <div className="mb-8">
            <PropertySearch showAdvanced={true} />
          </div>
          
          {/* Results */}
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isLoading ? (
                    <Skeleton className="h-7 w-32" />
                  ) : (
                    `${sortedProperties.length} Properties Found`
                  )}
                </h2>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">Sort by:</span>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-high">Price (High to Low)</SelectItem>
                    <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
                    <div className="relative pb-[60%]">
                      <Skeleton className="absolute inset-0 h-full w-full" />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-4 w-32 mb-3" />
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                      <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-100 rounded-full text-gray-500">
                  <i className="ri-search-line text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search filters for more results.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
