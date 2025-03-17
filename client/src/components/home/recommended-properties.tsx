import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertyCard from "../property/property-card";
import { queryClient, getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function RecommendedProperties() {
  const { user } = useAuth();
  
  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ["/api/recommendations"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user, // Only fetch if user is logged in
  });

  // Fallback to featured properties if user is not logged in or there was an error
  const { data: featuredProperties, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ["/api/properties/featured"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !user || !!error,
  });
  
  const properties = recommendations || featuredProperties || [];
  const isLoadingProperties = (user && isLoading) || (!user && isFeaturedLoading);
  const title = user ? "Recommended For You" : "Featured Properties";

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          {user && (
            <p className="text-gray-600">
              Based on your browsing history and saved properties
            </p>
          )}
        </div>

        {isLoadingProperties ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: Property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {user
                ? "No recommendations available yet. Start browsing properties to get personalized recommendations!"
                : "No featured properties available at the moment."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}