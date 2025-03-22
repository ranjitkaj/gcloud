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
  FilterSelect,
  FilterSelectContent,
  FilterSelectItem,
  FilterSelectTrigger,
  FilterSelectValue,
} from "./property-select";
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
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [bedrooms, setBedrooms] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [saleType, setSaleType] = useState<"all" | "Sale" | "Agent">("all");
  const containerRef = useRef<HTMLDivElement>(null);
  // New state to track filter menu open state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [categoryTab, setCategoryTab] = useState("all"); // Added state for category tabs
  const [minArea, setMinArea] = useState<number | undefined>(undefined); // Min area 
  const [maxArea, setMaxArea] = useState<number | undefined>(undefined); // Max area
  const [amenities, setAmenities] = useState<string[]>([]); // Added state for amenities
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    propertyType: "",
    saleType: "",
    priceRange: [0, 10000000],
    amenities: [] as string[],
    bedrooms: 0,
    location: "",
  });

  // Format selected filters for display
  const getFilterDisplay = () => {
    const filters = [];
    if (locationValue) filters.push(locationValue);
    if (selectedFilters.propertyType)
      filters.push(selectedFilters.propertyType);
    if (selectedFilters.saleType && selectedFilters.saleType !== "all")
      filters.push(selectedFilters.saleType);
    if (selectedFilters.bedrooms > 0)
      filters.push(`${selectedFilters.bedrooms}+ beds`);
    if (selectedFilters.amenities.length > 0)
      filters.push(`${selectedFilters.amenities.length} amenities`);
    return filters.join(" • ");
  };

  // Hook to manage URL location
  const [_, setUrlLocation] = useLocation();

  // Toggle filter menu function
  const toggleFilter = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop click from bubbling
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

  // Effect to initialize form values from URL query parameters
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
      if (minPrice !== undefined && minPrice > 0) {
        queryParams.append("minPrice", minPrice.toString());
      }

      if (maxPrice !== undefined) {
        queryParams.append("maxPrice", maxPrice.toString());
      }

      if (bedrooms > 0) {
        queryParams.append("minBedrooms", bedrooms.toString());
      }
      if (minArea !== undefined && minArea > 0) {
        queryParams.append("minArea", minArea.toString());
      }
      if (maxArea !== undefined) {
        queryParams.append("maxArea", maxArea.toString());
      }
      queryParams.append("amenities", amenities.join(","));
    }

    setUrlLocation(`/properties?${queryParams.toString()}`);
  };

  // Function to format price for display
  const formatPrice = (value: number | undefined) => {
    if (!value) return "Any";
    
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
                <Input
                  type="text"
                  placeholder="Enter location, neighborhood, or address"
                  className="pl-10 pr-4 py-6 text-gray-700 bg-gray-50 rounded-r-none"
                  value={getFilterDisplay()}
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
            <FilterSelect
              value={propertyType}
              onValueChange={(value: (typeof propertyTypes)[number]) =>
                setPropertyType(value)
              }
            >
              <FilterSelectTrigger className="bg-gray-50 border border-gray-300 text-gray-700 h-12 min-w-[10px]">
                <FilterSelectValue placeholder="Property Type" />
              </FilterSelectTrigger>
              <FilterSelectContent position="popper">
                {propertyTypes.map((type) => (
                  <FilterSelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </FilterSelectItem>
                ))}
              </FilterSelectContent>
            </FilterSelect>

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
          onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-5 z-50 transition-all duration-200 ease-in-out"
          style={{
            opacity: 1,
            transform: "translateY(0)",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Property Type Selector */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">
                Property Type
              </h4>
              <FilterSelect
                value={propertyType}
                onValueChange={(value: (typeof propertyTypes)[number]) =>
                  setPropertyType(value)
                }
              >
                <FilterSelectTrigger className="w-full">
                  <FilterSelectValue placeholder="Select type" />
                </FilterSelectTrigger>
                <FilterSelectContent position="popper" className="max-h-[200px]">
                  {propertyTypes.map((type) => (
                    <FilterSelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </FilterSelectItem>
                  ))}
                </FilterSelectContent>
              </FilterSelect>
            </div>

            {/* Sale/Rent Selector */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">
                For Sale/Agent
              </h4>
              <FilterSelect
                value={saleType}
                onValueChange={(value: "all" | "Sale" | "Agent") =>
                  setSaleType(value)
                }
              >
                <FilterSelectTrigger className="w-full">
                  <FilterSelectValue placeholder="Select type" />
                </FilterSelectTrigger>
                <FilterSelectContent position="popper">
                  <FilterSelectItem value="all">All Properties</FilterSelectItem>
                  <FilterSelectItem value="Sale">For Sale</FilterSelectItem>
                  <FilterSelectItem value="Agent">For Agent</FilterSelectItem>
                </FilterSelectContent>
              </FilterSelect>
            </div>

            {/* Price Range Inputs */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Price Range</h4>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice === undefined ? "" : minPrice}
                  onChange={(e) => {
                    const val = e.target.value === "" ? undefined : Number(e.target.value);
                    setMinPrice(val);
                  }}
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-gray-500">-</span>
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice === undefined ? "" : maxPrice}
                  onChange={(e) => {
                    const val = e.target.value === "" ? undefined : Number(e.target.value);
                    setMaxPrice(val);
                  }}
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="text-sm text-gray-500">
                {formatPrice(minPrice)} - {formatPrice(maxPrice)}
              </div>
            </div>

            {/* Area Range */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">
                Area Range (sq ft)
              </h4>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min Area"
                  value={minArea === undefined ? "" : minArea}
                  onChange={(e) => {
                    const val = e.target.value === "" ? undefined : Number(e.target.value);
                    setMinArea(val);
                  }}
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-gray-500">-</span>
                <Input
                  type="number"
                  placeholder="Max Area"
                  value={maxArea === undefined ? "" : maxArea}
                  onChange={(e) => {
                    const val = e.target.value === "" ? undefined : Number(e.target.value);
                    setMaxArea(val);
                  }}
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="text-sm text-gray-500">
                {!minArea ? "Any" : minArea} - {!maxArea ? "Any" : maxArea} sq ft
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Parking",
                  "Swimming Pool",
                  "Garden",
                  "Security",
                  "Gym",
                  "Power Backup",
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAmenities([...amenities, amenity]);
                        } else {
                          setAmenities(amenities.filter((a) => a !== amenity));
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Bedrooms Selector */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Bedrooms</h4>
              <FilterSelect
                value={bedrooms.toString()}
                onValueChange={(value) => setBedrooms(parseInt(value))}
              >
                <FilterSelectTrigger className="w-full">
                  <FilterSelectValue placeholder="Any" />
                </FilterSelectTrigger>
                <FilterSelectContent position="popper">
                  <FilterSelectItem value="0">Any</FilterSelectItem>
                  <FilterSelectItem value="1">1+</FilterSelectItem>
                  <FilterSelectItem value="2">2+</FilterSelectItem>
                  <FilterSelectItem value="3">3+</FilterSelectItem>
                  <FilterSelectItem value="4">4+</FilterSelectItem>
                  <FilterSelectItem value="5">5+</FilterSelectItem>
                </FilterSelectContent>
              </FilterSelect>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
