
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertyCard from "@/components/property/property-card";
import { Loader2 } from "lucide-react";

export default function TopPropertiesList({ params }: { params: { category: string } }) {
  const { category } = params;
  
  const categoryLabels: Record<string, string> = {
    top10: "Top 10",
    top20: "Top 20",
    top30: "Top 30", 
    top50: "Top 50",
    top100: "Top 100"
  };

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: [`/api/properties/top/${category}`],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">{categoryLabels[category] || "Top Properties"}</h1>
        <p className="text-gray-600 mb-8">Discover our highest rated properties</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties?.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {(!properties || properties.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            No properties available in this category
          </div>
        )}
      </div>
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import PropertyCard from "@/components/property/property-card";
import { Property } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function TopPropertiesList() {
  const { category } = useParams();
  
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: [`/api/properties/top/${category}`],
  });

  const getCategoryTitle = () => {
    switch (category) {
      case 'top10': return 'Top 10';
      case 'top20': return 'Top 20';
      case 'top30': return 'Top 30';
      case 'top50': return 'Top 50';
      case 'top100': return 'Top 100';
      default: return 'Top Properties';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{getCategoryTitle()} Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties?.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
