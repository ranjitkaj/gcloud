import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Users,
  Home,
  Building,
  MapPin,
  TrendingUp,
  Briefcase,
  Landmark,
  UserSquare2,
  Layers3,
  Star,
  AreaChart,
  Medal,
  CheckCircle2,
  Clock,
  ThumbsUp,
  GraduationCap,
  Award,
  MapPinned,
  LineChart,
  IndianRupee,
  Bed,
  Bath,
  Maximize,
  Shield,
  ChevronRight,
  ChevronDown,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Property, Agent, Company } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface MegaMenuProps {
  isMobile?: boolean;
}

function PropertyMiniCard({ property }: { property: Property }) {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-24">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 right-2">{property.type}</Badge>
      </div>
      <div className="p-2">
        <h3 className="font-medium text-sm truncate">{property.title}</h3>
        <p className="text-xs text-muted-foreground">{property.location}</p>
        <div className="flex items-center gap-2 mt-1 text-xs">
          <span className="flex items-center">
            <Bed className="h-3 w-3 mr-1" />
            {property.bedrooms}
          </span>
          <span className="flex items-center">
            <Bath className="h-3 w-3 mr-1" />
            {property.bathrooms}
          </span>
          <span className="flex items-center">
            <Maximize className="h-3 w-3 mr-1" />
            {property.area} sq.ft
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-medium flex items-center">
            <IndianRupee className="h-3 w-3" />
            {property.price}
          </span>
          <Badge variant="outline" className="text-xs">
            {property.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export function MegaMenu({ isMobile = false }: MegaMenuProps) {
  const [pathname] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
    enabled: !isMobile,
  });

  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents/featured"],
    enabled: !isMobile,
  });

  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["/api/companies/featured"],
    enabled: !isMobile,
  });

  const menuItems = {
    buy: [
      { title: "Residential", icon: <Home className="h-5 w-5" />, link: "/properties/residential" },
      { title: "Commercial", icon: <Building className="h-5 w-5" />, link: "/properties/commercial" },
      { title: "Premium", icon: <TrendingUp className="h-5 w-5" />, link: "/properties/premium" }
    ],
    rent: [
      { title: "Houses", icon: <Home className="h-5 w-5" />, link: "/rent/houses" },
      { title: "Apartments", icon: <Building2 className="h-5 w-5" />, link: "/rent/apartments" },
      { title: "Office Space", icon: <Briefcase className="h-5 w-5" />, link: "/rent/office" }
    ],
    agents: [
      { title: "Find Agent", icon: <Users className="h-5 w-5" />, link: "/agents/find" },
      { title: "Top Agents", icon: <Landmark className="h-5 w-5" />, link: "/agents/top" }
    ]
  };

  if (isMobile) {
    return (
      <div className="w-full">
        {Object.entries(menuItems).map(([category, items]) => (
          <div key={category} className="mb-4">
            <button
              className="flex items-center justify-between w-full p-3 bg-background rounded-lg"
              onClick={() => setActiveCategory(activeCategory === category ? null : category)}
            >
              <span className="font-medium capitalize">{category}</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  activeCategory === category ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {activeCategory === category && (
              <div className="mt-2 space-y-1">
                {items.map((item) => (
                  <Link
                    key={item.title}
                    href={item.link}
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {Object.entries(menuItems).map(([category, items]) => (
          <NavigationMenuItem key={category}>
            <NavigationMenuTrigger
              className={cn(navigationMenuTriggerStyle(), "capitalize")}
            >
              {category}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <div className="grid gap-1">
                  {items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.link}
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
                {properties.length > 0 && category === "buy" && (
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Featured Properties</h3>
                    <div className="space-y-2">
                      {properties.slice(0, 2).map((property) => (
                        <PropertyMiniCard key={property.id} property={property} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// Agent mini card for menu
function AgentMiniCard({ agent }: { agent: Agent }) {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow p-2 flex items-center">
      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-2 flex-shrink-0">
        <img
          src={`https://randomuser.me/api/portraits/men/${agent.id}.jpg`}
          alt="Agent"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <h3 className="font-medium text-xs truncate">Agent {agent.userId}</h3>
        <p className="text-xs text-gray-500 truncate">
          {agent.specializations?.join(", ") || "Property Expert"}
        </p>
        <div className="flex items-center mt-0.5">
          <div className="flex">
            {[...Array(Math.min(5, Math.round(agent.rating || 0)))].map(
              (_, i) => (
                <Star
                  key={i}
                  className="h-2.5 w-2.5 text-amber-500 fill-amber-500"
                />
              ),
            )}
          </div>
          <span className="text-xs ml-1">{agent.reviewCount || 0} reviews</span>
        </div>
      </div>
    </div>
  );
}

// Company mini card for menu
function CompanyMiniCard({ company }: { company: Company }) {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow p-2 flex items-center">
      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-2 flex-shrink-0 flex items-center justify-center">
        <Building className="h-6 w-6 text-gray-500" />
      </div>
      <div className="min-w-0">
        <h3 className="font-medium text-xs truncate">{company.name}</h3>
        <p className="text-xs text-gray-500 truncate">{company.city}</p>
        <div className="flex items-center mt-0.5">
          {company.verified && (
            <Badge
              variant="outline"
              className="text-[8px] h-4 border-green-500 text-green-600 flex items-center"
            >
              <Shield className="h-2 w-2 mr-0.5" /> Verified
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}