import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useToast } from "@/hooks/use-toast";

const districts = {
  telangana: [
    "Hyderabad",
    "Adilabad",
    "Bhadradri Kothagudem",
    "Jagitial",
    "Jangaon",
    "Jayashankar Bhupalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Kumuram Bheem",
    "Mahabubabad",
    "Mahabubnagar",
    "Mancherial",
    "Medak",
    "Medchal–Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Rangareddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri",
  ],
  andhraPradesh: [
    "Anantapur",
    "Alluri Sitarama Raju",
    "Anakapalli",
    "Bapatla",
    "Chittoor",
    "East Godavari",
    "Eluru",
    "Guntur",
    "Kakinada",
    "Krishna",
    "Kurnool",
    "Nandyal",
    "NTR",
    "Palnadu",
    "Parvathipuram Manyam",
    "Prakasam",
    "Sri Potti Sriramulu Nellore",
    "Sri Sathya Sai",
    "Srikakulam",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "YSR Kadapa",
    "Konaseema",
    "Annamayya",
  ],
};

export default function LocationSelector() {
  const [selectedState, setSelectedState] = useState("telangana");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [cityLocation, setCityLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const detectUserLocation = async () => {
      if (!navigator.geolocation) {
        toast({
          title: "Location Not Available",
          description: "Geolocation is not supported by your browser",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        );

        if (response.ok) {
          const data = await response.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.district ||
            data.address.suburb;

          setCityLocation(city || "Select Location");

          const state = data.address.state;
          if (state?.toLowerCase().includes("telangana")) {
            setSelectedState("telangana");
          } else if (state?.toLowerCase().includes("andhra pradesh")) {
            setSelectedState("andhraPradesh");
          }
        }
      } catch (error) {
        console.error("Error getting location:", error);
        toast({
          title: "Location Error",
          description:
            "Unable to detect your location. Please select manually.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    detectUserLocation();
  }, []);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-accent px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="truncate max-w-[120px] sm:max-w-[200px]">
              {isLoading ? "Detecting..." : cityLocation}
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="top-15 data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto z-[100] fixed sm:absolute left-0 right-0 sm:left-auto max-h-[70vh] sm:max-h-[80vh] overflow-y-auto w-full sm:w-[600px] lg:w-[900px] bg-white shadow-lg">
            <div className="p-4 space-y-4">
              {/* Telangana Districts */}
              <div>
                <h4 className="font-semibold text-sm text-primary sticky top-0 bg-white py-2">
                  Telangana
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {districts.telangana.map((district) => (
                    <button
                      key={district}
                      className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-colors whitespace-nowrap
                        ${
                          selectedState === "telangana" &&
                          selectedDistrict === district
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      onClick={() => {
                        setSelectedState("telangana");
                        setSelectedDistrict(district);
                        setCityLocation(district);
                      }}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>

              {/* Andhra Pradesh Districts */}
              <div>
                <h4 className="font-semibold text-sm text-primary sticky top-0 bg-white py-2">
                  Andhra Pradesh
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {districts.andhraPradesh.map((district) => (
                    <button
                      key={district}
                      className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-colors whitespace-nowrap
                        ${
                          selectedState === "andhraPradesh" &&
                          selectedDistrict === district
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      onClick={() => {
                        setSelectedState("andhraPradesh");
                        setSelectedDistrict(district);
                        setCityLocation(district);
                      }}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
