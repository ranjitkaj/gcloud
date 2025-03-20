import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { useLocation } from "wouter";
import PropertyCard from "../property/property-card";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const TOP_CATEGORIES = [
  { id: "top10", label: "Top 10", limit: 10 },
  { id: "top20", label: "Top 20", limit: 20 },
  { id: "top30", label: "Top 30", limit: 30 },
  { id: "top50", label: "Top 50", limit: 50 },
  { id: "top70plus", label: "Top 70+", limit: 70 },
];

export default function TopProperties() {
  const [selectedCategory, setSelectedCategory] = useState("top10");
  const [, navigate] = useLocation();

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/top", selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/properties/top/${selectedCategory}`);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Top Listing Properties
        </h2>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {TOP_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties?.length ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {properties.length > 6 && (
              <div className="text-center mt-8">
                <Button
                  onClick={() =>
                    navigate(`/properties/top/${selectedCategory}`)
                  }
                  variant="outline"
                >
                  View All{" "}
                  {TOP_CATEGORIES.find((c) => c.id === selectedCategory)?.label}{" "}
                  Properties
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No properties available in this category
          </div>
        )}
      </div>
    </section>
  );
}
