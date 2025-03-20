
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { PropertyCard } from "@/components/property/property-card";
import { getQueryFn } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function TopPropertiesList() {
  const { category } = useParams();
  const [selectedCity, setSelectedCity] = useState<string>("");
  
  const { data: properties, isLoading } = useQuery({
    queryKey: [`/api/properties/top/${category}`, selectedCity],
    queryFn: getQueryFn(),
  });

  const pageTitle = {
    top10: "Top 10 Premium Properties",
    top20: "Top 20 High-Value Properties",
    top30: "Top 30 Most Viewed Properties",
    top50: "Top 50 Trending Properties",
    top100: "Top 100 Best Rated Properties"
  }[category || ""] || "Top Properties";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Cities</SelectItem>
            <SelectItem value="bangalore">Bangalore</SelectItem>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="delhi">Delhi</SelectItem>
            <SelectItem value="gurgaon">Gurgaon</SelectItem>
          </SelectContent>
        </Select>
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
