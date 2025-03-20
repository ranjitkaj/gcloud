
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Property } from "@shared/schema";
import PropertyCard from "@/components/property/property-card";
import { Loader2 } from "lucide-react";
import LocationSelector from "@/components/layout/location-selector";
import { useState } from "react";

export default function TopPropertiesPage() {
  const { category } = useParams();
  const [selectedCity, setSelectedCity] = useState<string>("");

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/top", category, selectedCity],
    queryFn: async () => {
      const url = `/api/properties/top/${category}${selectedCity ? `?city=${selectedCity}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        {category?.toUpperCase()} Properties
      </h1>

      <div className="mb-8">
        <LocationSelector 
          onCitySelect={(city) => setSelectedCity(city)}
          selectedCity={selectedCity}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : properties?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No properties available in this category
          {selectedCity && ` for ${selectedCity}`}
        </div>
      )}
    </div>
  );
}
