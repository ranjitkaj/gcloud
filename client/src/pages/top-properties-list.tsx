import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import PropertyCard from "@/components/property/property-card";
import { Property } from "@shared/schema";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : properties ? (
            <>
              <h1 className="text-3xl font-bold mb-8">{getCategoryTitle()} Properties</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">No Properties Found</h2>
              <p>There are currently no properties in this category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}