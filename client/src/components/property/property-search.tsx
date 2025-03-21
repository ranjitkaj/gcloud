import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MapPin, Search } from "lucide-react";
import { propertyTypes } from "@shared/schema";

interface PropertySearchProps {
  className?: string;
  showAdvanced?: boolean;
}

export default function PropertySearch({
  className = "",
  showAdvanced = false,
}: PropertySearchProps) {
  const [locationValue, setLocationValue] = useState("");
  const [propertyType, setPropertyType] = useState<
    (typeof propertyTypes)[number] | ""
  >("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [bedrooms, setBedrooms] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [saleType, setSaleType] = useState<"all" | "Sale" | "Rent">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  const [_, setUrlLocation] = useLocation();

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );

          if (response.ok) {
            const data = await response.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb ||
              data.address.neighbourhood ||
              data.address.state;

            if (city) {
              setLocationValue(city);
            } else {
              setLocationValue(
                `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              );
            }
          } else {
            setLocationValue(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          console.error("Error getting location:", error);
          alert("Unable to fetch your location details");
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocationLoading(false);
        alert(
          "Unable to get your location. Please enable location services and try again.",
        );
      },
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get("city");
    const typeParam = params.get("propertyType");
    const minPriceParam = params.get("minPrice");
    const maxPriceParam = params.get("maxPrice");
    const bedroomsParam = params.get("minBedrooms");

    if (cityParam) setLocationValue(cityParam);
    if (typeParam && propertyTypes.includes(typeParam as any)) {
      setPropertyType(typeParam as (typeof propertyTypes)[number]);
    }
    if (minPriceParam) setMinPrice(parseInt(minPriceParam));
    if (maxPriceParam) setMaxPrice(parseInt(maxPriceParam));
    if (bedroomsParam) setBedrooms(parseInt(bedroomsParam));
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    if (locationValue) {
      queryParams.append("city", locationValue);
    }

    if (propertyType) {
      queryParams.append("propertyType", propertyType);
    }

    if (saleType !== "all") {
      queryParams.append("saleType", saleType);
    }

    if (showAdvanced) {
      if (minPrice > 0) {
        queryParams.append("minPrice", minPrice.toString());
      }

      if (maxPrice < 10000000) {
        queryParams.append("maxPrice", maxPrice.toString());
      }

      if (bedrooms > 0) {
        queryParams.append("minBedrooms", bedrooms.toString());
      }
    }

    setUrlLocation(`/properties?${queryParams.toString()}`);
  };

  const formatPrice = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)} Lac`;
    } else {
      return `₹${value.toLocaleString()}`;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-white rounded-xl shadow-lg p-2 max-w-4xl mx-auto ${className}`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Enter location, neighborhood, or address"
                  className="pl-10 pr-4 py-6 text-gray-700 bg-gray-50 rounded-r-none"
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="rounded-l-none border-l-0 px-3 py-6 bg-gray-50 hover:bg-gray-100"
                  onClick={getUserLocation}
                  disabled={isLocationLoading}
                >
                  {isLocationLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mr-0"></div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <circle cx="12" cy="12" r="8"></circle>
                      <line x1="12" y1="2" x2="12" y2="4"></line>
                      <line x1="12" y1="20" x2="12" y2="22"></line>
                      <line x1="2" y1="12" x2="4" y2="12"></line>
                      <line x1="20" y1="12" x2="22" y2="12"></line>
                    </svg>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-row space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[50px] py-6 relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="20" y1="12" x2="20" y2="3"></line>
                    <line x1="1" y1="14" x2="7" y2="14"></line>
                    <line x1="9" y1="8" x2="15" y2="8"></line>
                    <line x1="17" y1="16" x2="23" y2="16"></line>
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[90vw] max-w-[400px] p-6 bg-white rounded-lg shadow-xl md:w-[400px]"
                align="start"
                side="bottom"
                sideOffset={4}
                alignOffset={-8}
                collisionPadding={8}
                sticky="always"
                avoidCollisions={true}
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-gray-700">
                      Property Type
                    </h4>
                    <Select
                      value={propertyType}
                      onValueChange={(value: (typeof propertyTypes)[number]) =>
                        setPropertyType(value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-gray-700">
                      For Sale/Rent
                    </h4>
                    <Select
                      value={saleType}
                      onValueChange={(value: "all" | "Sale" | "Rent") =>
                        setSaleType(value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Properties</SelectItem>
                        <SelectItem value="Sale">For Sale</SelectItem>
                        <SelectItem value="Rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-gray-700">
                      Price Range
                    </h4>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-gray-500">-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-gray-700">
                      Bedrooms
                    </h4>
                    <Select
                      value={bedrooms.toString()}
                      onValueChange={(value) => setBedrooms(parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Select
              value={propertyType}
              onValueChange={(value: (typeof propertyTypes)[number]) =>
                setPropertyType(value)
              }
            >
              <SelectTrigger className="bg-gray-50 border border-gray-300 text-gray-700 h-12 min-w-[10px]">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="py-6 px-2 whitespace-nowrap flex items-center bg-primary hover:bg-primary/90"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
