import { Property } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Bed, Bath, Building2 } from "lucide-react";
import { Link } from "wouter";

interface PropertyCardProps {
  property: Property;
  isAiRecommended?: boolean;
}

export function PropertyCard({ property, isAiRecommended }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
        <div className="relative h-48">
          {property.imageUrls && property.imageUrls.length > 0 ? (
            <img 
              src={property.imageUrls[0]} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Building2 className="h-12 w-12 text-gray-400" />
            </div>
          )}

          {property.premium && (
            <Badge variant="secondary" className="absolute top-2 right-2 bg-amber-500 text-white">
              Premium
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg line-clamp-1">{property.title}</h3>
            <Badge variant="outline">{property.propertyType}</Badge>
          </div>

          <p className="text-gray-500 text-sm mb-3">{property.location}</p>

          <div className="flex items-center gap-4">
            {property.bedrooms && (
              <span className="text-sm flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms && (
              <span className="text-sm flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {property.bathrooms} Baths
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-semibold flex items-center">
              <IndianRupee className="h-4 w-4" />
              {property.price.toLocaleString("en-IN")}
            </span>
            {isAiRecommended && (
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                AI Recommended
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default PropertyCard;