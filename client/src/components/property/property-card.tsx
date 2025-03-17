import { useState } from 'react';
import { Link } from 'wouter';
import { Property } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Bed, Droplet, Ruler } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(0)} Lac`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const shareProperty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Share functionality would go here
  };

  return (
    <Link href={`/property/${property.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="relative pb-[60%]">
          {property.featured && (
            <Badge className="absolute top-2 left-2 z-10 bg-primary">FEATURED</Badge>
          )}
          <img 
            src={property.imageUrls ? property.imageUrls[0] : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'} 
            alt={property.title} 
            className="absolute inset-0 h-full w-full object-cover" 
          />
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <button 
              onClick={toggleFavorite}
              className="bg-black bg-opacity-60 text-white p-1.5 rounded-md hover:bg-opacity-70"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={shareProperty}
              className="bg-black bg-opacity-60 text-white p-1.5 rounded-md hover:bg-opacity-70"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
            <span className="text-xl font-bold text-primary">{formatPrice(property.price)}</span>
          </div>
          <p className="text-gray-600 mb-3">{property.location}, {property.city}</p>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed className="text-gray-500 mr-1 h-4 w-4" />
                  <span>{property.bedrooms} Beds</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Droplet className="text-gray-500 mr-1 h-4 w-4" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              )}
              <div className="flex items-center">
                <Ruler className="text-gray-500 mr-1 h-4 w-4" />
                <span>{property.area} sq.ft</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <i className="ri-time-line mr-1"></i>
              <span>
                Listed {property.createdAt 
                  ? formatDistanceToNow(new Date(property.createdAt), { addSuffix: true }) 
                  : 'recently'}
              </span>
            </div>
            <div className="inline-flex text-sm">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Owner Direct
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
