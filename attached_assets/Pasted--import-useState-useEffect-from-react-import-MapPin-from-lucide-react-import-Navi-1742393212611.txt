
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const districts = {
  telangana: [
    "Hyderabad", "Rangareddy", "Medchal", "Warangal", "Karimnagar", 
    "Nizamabad", "Khammam", "Nalgonda", "Mahbubnagar"
  ],
  andhraPradesh: [
    "Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kurnool", 
    "Kakinada", "Rajahmundry", "Nellore", "Anantapur"
  ]
};

export default function LocationSelector() {
  const [selectedState, setSelectedState] = useState("telangana");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    // Here you would typically get user's location and set the state
    navigator.geolocation.getCurrentPosition((position) => {
      // For demo, just using Telangana as default
      setSelectedState("telangana");
    });
  }, []);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-accent">
            <MapPin className="h-4 w-4 mr-2" />
            {selectedDistrict || selectedState}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-2 w-[400px] gap-2 p-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Telangana</h4>
                <div className="space-y-1">
                  {districts.telangana.map((district) => (
                    <button
                      key={district}
                      className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-accent ${
                        selectedState === "telangana" && selectedDistrict === district
                          ? "bg-accent"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedState("telangana");
                        setSelectedDistrict(district);
                      }}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Andhra Pradesh</h4>
                <div className="space-y-1">
                  {districts.andhraPradesh.map((district) => (
                    <button
                      key={district}
                      className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-accent ${
                        selectedState === "andhraPradesh" && selectedDistrict === district
                          ? "bg-accent"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedState("andhraPradesh");
                        setSelectedDistrict(district);
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
