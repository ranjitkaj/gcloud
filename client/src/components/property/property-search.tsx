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
import { MapPin, Search } from "lucide-react";
import { propertyTypes } from "@shared/schema";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Added import
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label"; // Added import


// Define the interface for the component props
interface PropertySearchProps {
  className?: string;
  showAdvanced?: boolean;
}

// Main component definition
export default function PropertySearch({
  className = "",
  showAdvanced = false,
}: PropertySearchProps) {
  // State variables for managing form inputs and UI state
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
  // New state to track filter menu open state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [categoryTab, setCategoryTab] = useState('all'); // Added state for category tabs
  const [areaRange, setAreaRange] = useState([0, 10000]); // Added state for area range
  const [amenities, setAmenities] = useState([]); // Added state for amenities
  const [showLocationClear, setShowLocationClear] = useState(false); // Added state for clear button

  // Hook to manage URL location
  const [_, setUrlLocation] = useLocation();

  // Toggle filter menu function
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button[data-filter-toggle="true"]')
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to get user's current location using Geolocation API
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
              setShowLocationClear(true); // Update showLocationClear state
            } else {
              setLocationValue(
                `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              );
              setShowLocationClear(true); // Update showLocationClear state

            }
          } else {
            setLocationValue(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setShowLocationClear(true); // Update showLocationClear state
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

  // Effect to initialize form values from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get("city");
    const typeParam = params.get("propertyType");
    const minPriceParam = params.get("minPrice");
    const maxPriceParam = params.get("maxPrice");
    const bedroomsParam = params.get("minBedrooms");

    if (cityParam) {
      setLocationValue(cityParam);
      setShowLocationClear(true); // Update showLocationClear state
    }
    if (typeParam && propertyTypes.includes(typeParam as any)) {
      setPropertyType(typeParam as (typeof propertyTypes)[number]);
    }
    if (minPriceParam) setMinPrice(parseInt(minPriceParam));
    if (maxPriceParam) setMaxPrice(parseInt(maxPriceParam));
    if (bedroomsParam) setBedrooms(parseInt(bedroomsParam));
  }, []);

  // Function to handle search button click and update URL with query parameters
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
      if (areaRange[0] > 0) {
        queryParams.append("minArea", areaRange[0].toString());
      }
      if (areaRange[1] < 10000) {
        queryParams.append("maxArea", areaRange[1].toString());
      }
      queryParams.append("amenities", amenities.join(','));

    }

    setUrlLocation(`/properties?${queryParams.toString()}`);
  };

  // Function to format price for display
  const formatPrice = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)} Lac`;
    } else {
      return `₹${value.toLocaleString()}`;
    }
  };

  // Render the component
  return (
    <div
      ref={containerRef}
      className={`bg-white rounded-xl shadow-lg p-2 max-w-4xl mx-auto ${className} relative`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Location Input Section */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex">
                <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Enter location, neighborhood, or address"
                  className="pl-10 pr-8 py-6 text-gray-700 bg-gray-50 rounded-r-none w-full"
                  value={locationValue}
                  onChange={(e) => {
                    setLocationValue(e.target.value);
                    setShowLocationClear(e.target.value !== "");
                  }}
                />
                {showLocationClear && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      setLocationValue("");
                      setShowLocationClear(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
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

          {/* Advanced Search Options Section */}
          <div className="flex flex-row space-x-2">
            {/* Custom Filter Button */}
            <Button
              variant={isFilterOpen ? "default" : "outline"}
              className={`min-w-[50px] py-6 relative ${
                isFilterOpen ? "bg-primary text-white" : ""
              }`}
              onClick={toggleFilter}
              data-filter-toggle="true"
            >
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

            {/* Property Type Selector */}
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

            {/* Search Button */}
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

      {/* Custom Filter Mega Menu */}
      {isFilterOpen && (
        <div
          ref={filterMenuRef}
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-5 z-50 transition-all duration-200 ease-in-out"
          style={{
            opacity: 1,
            transform: "translateY(0)",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category Tabs */}
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-sm text-gray-700">Category</h4>
              <Tabs value={categoryTab} onValueChange={setCategoryTab}>
                <TabsList className="w-full grid grid-cols-4 gap-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="for_sale">For Sale</TabsTrigger>
                  <TabsTrigger value="for_rent">For Rent</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>


            {/* Property Type Selector */}
            <div className="space-y-2">
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
                <SelectContent position="popper" className="max-h-[200px]">
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sale/Rent Selector */}
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

            {/* Price Range Inputs */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Price Range</h4>
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

            {/* Area Range */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Area Range (sq ft)</h4>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={areaRange[0]}
                  onChange={(e) => setAreaRange([Number(e.target.value), areaRange[1]])}
                  className="w-full"
                />
                <span className="text-gray-500">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={areaRange[1]}
                  onChange={(e) => setAreaRange([areaRange[0], Number(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {['Parking', 'Swimming Pool', 'Garden', 'Security', 'Gym', 'Power Backup'].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAmenities([...amenities, amenity]);
                        } else {
                          setAmenities(amenities.filter(a => a !== amenity));
                        }
                      }}
                    />
                    <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Bedrooms Selector */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Bedrooms</h4>
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
        </div>
      )}
    </div>
  );
}