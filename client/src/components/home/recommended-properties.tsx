import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import PropertyCard from "../property/property-card";
import { queryClient, getQueryFn } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function RecommendedProperties() {
  const { user } = useAuth();
  
  const { data: recommendations = [], isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/recommendations"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user, // Only fetch if user is logged in
  });

  // Fallback to featured properties if user is not logged in or there was an error
  const { data: featuredProperties = [], isLoading: isFeaturedLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !user || !!error,
  });
  
  const properties = user && recommendations.length > 0 ? recommendations : featuredProperties;
  const isLoadingProperties = (user && isLoading) || (!user && isFeaturedLoading);
  const title = user && recommendations.length > 0 ? "Recommended For You" : "Featured Properties";

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          {user && (
            <div className="mt-2 md:mt-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <p className="text-gray-600">
                  Personalized recommendations based on your browsing history and saved properties
                </p>
              </div>
              {recommendations.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Our AI analyzes your preferences to find properties that match your taste
                </p>
              )}
            </div>
          )}
        </div>

        {isLoadingProperties ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: Property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                isAiRecommended={!!user && recommendations.length > 0 && recommendations.some(r => r.id === property.id)}
              />
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