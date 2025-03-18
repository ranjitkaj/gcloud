import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Property, Agent, Company } from "@shared/schema";
import { Home, Building, Building2, MapPin, Briefcase, Star, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Helper types for menu items
type MenuItem = {
  title: string;
  href: string;
  description: string;
  icon: React.ReactNode;
  query?: Record<string, string | boolean | number>;
};

// Menu data
const buyMenuItems: MenuItem[] = [
  {
    title: "Residential Properties",
    href: "/properties?type=residential",
    description: "Find your dream home among our residential listings",
    icon: <Home className="h-5 w-5 text-primary" />,
    query: { propertyType: "house" }
  },
  {
    title: "Apartments & Flats",
    href: "/properties?propertyType=apartment",
    description: "Modern apartments in prime locations",
    icon: <Building className="h-5 w-5 text-primary" />,
    query: { propertyType: "apartment" }
  },
  {
    title: "Villas & Houses",
    href: "/properties?propertyType=villa",
    description: "Luxurious villas with premium amenities",
    icon: <Building2 className="h-5 w-5 text-primary" />,
    query: { propertyType: "villa" }
  },
  {
    title: "Plots & Land",
    href: "/properties?propertyType=plot",
    description: "Investment plots and land parcels",
    icon: <MapPin className="h-5 w-5 text-primary" />,
    query: { propertyType: "plot" }
  },
  {
    title: "Commercial Properties",
    href: "/properties?propertyType=commercial",
    description: "Office spaces and retail properties",
    icon: <Briefcase className="h-5 w-5 text-primary" />,
    query: { propertyType: "commercial" }
  }
];

const agentMenuItems: MenuItem[] = [
  {
    title: "Top Rated Agents",
    href: "/agents?sort=rating",
    description: "Connect with our highest rated property experts",
    icon: <Star className="h-5 w-5 text-primary" />,
    query: { sort: "rating" }
  },
  {
    title: "Featured Agents",
    href: "/agents?featured=true",
    description: "Our selected top performing agents",
    icon: <Star className="h-5 w-5 text-primary" />,
    query: { featured: true }
  }
];

// Property mini card for dropdown menu
function PropertyMiniCard({ property }: { property: Property }) {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-24">
        <img
          src={property.imageUrls?.[0] || 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {property.premium && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-amber-500 text-white">Premium</Badge>
        )}
      </div>
      <div className="p-2">
        <h3 className="font-medium text-xs truncate">{property.title}</h3>
        <p className="text-xs text-gray-500 truncate">{property.location}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-medium">
            ₹{property.price.toLocaleString('en-IN')}
          </span>
          <div className="flex items-center space-x-1">
            {property.bedrooms && (
              <span className="text-xs flex items-center" title="Bedrooms">
                {property.bedrooms} bed
              </span>
            )}
            {property.bathrooms && (
              <span className="text-xs flex items-center ml-1" title="Bathrooms">
                | {property.bathrooms} bath
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Agent mini card for dropdown menu
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
        <p className="text-xs text-gray-500 truncate">{agent.specializations?.join(', ') || 'Property Expert'}</p>
        <div className="flex items-center mt-0.5">
          <div className="flex">
            {[...Array(Math.min(5, Math.round(agent.rating || 0)))].map((_, i) => (
              <Star key={i} className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
            ))}
          </div>
          <span className="text-xs ml-1">{agent.reviewCount || 0} reviews</span>
        </div>
      </div>
    </div>
  );
}

interface MegaMenuProps {
  isMobile?: boolean;
}

export default function MegaMenu({ isMobile = false }: MegaMenuProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Fetch featured properties
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties/featured'],
    enabled: !isMobile
  });

  // Fetch featured agents
  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ['/api/agents/featured'],
    enabled: !isMobile
  });

  // Create a search URL with parameters
  const createSearchUrl = (menuItem: MenuItem) => {
    if (!menuItem || !menuItem.query) return '/search-results';
    
    const searchParams = new URLSearchParams();
    
    // Add all query parameters to the search URL
    for (const [key, value] of Object.entries(menuItem.query)) {
      searchParams.append(key, String(value));
    }
    
    return `/search-results?${searchParams.toString()}`;
  };

  // Handle dropdown toggle
  const handleDropdownToggle = (dropdown: string) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

  // Mobile menu (simplified)
  if (isMobile) {
    return (
      <div className="flex flex-col w-full space-y-2">
        <Link to="/properties" className={cn(
          "px-3 py-2 rounded-md hover:bg-gray-100",
          pathname.startsWith("/properties") && "bg-gray-100 text-primary font-medium"
        )}>
          Buy
        </Link>
        <Link to="/agents" className={cn(
          "px-3 py-2 rounded-md hover:bg-gray-100",
          pathname.startsWith("/agents") && "bg-gray-100 text-primary font-medium"
        )}>
          Agents
        </Link>
        <Link to="/post-property-free" className={cn(
          "px-3 py-2 rounded-md hover:bg-gray-100",
          pathname === "/post-property-free" && "bg-gray-100 text-primary font-medium"
        )}>
          Post Property Free
        </Link>
        <Link to="/add-property" className={cn(
          "px-3 py-2 rounded-md hover:bg-gray-100",
          pathname === "/add-property" && "bg-gray-100 text-primary font-medium"
        )}>
          Sell
        </Link>
        <Link to="/resources" className={cn(
          "px-3 py-2 rounded-md hover:bg-gray-100",
          pathname.startsWith("/resources") && "bg-gray-100 text-primary font-medium"
        )}>
          Resources
        </Link>
      </div>
    );
  }

  // Desktop menu with dropdowns
  return (
    <div className="hidden lg:flex items-center space-x-1">
      {/* Buy Dropdown */}
      <div className="relative group">
        <Button 
          variant="ghost" 
          className={cn(
            "px-3 flex items-center gap-1",
            (pathname.startsWith("/properties") || openDropdown === 'buy') && "text-primary font-medium",
            openDropdown === 'buy' && "bg-slate-50"
          )}
          onClick={() => handleDropdownToggle('buy')}
        >
          Buy <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
        
        {openDropdown === 'buy' && (
          <div className="absolute left-0 top-full mt-1 z-50 bg-white rounded-md shadow-lg border overflow-hidden w-[800px]">
            <div className="grid grid-cols-6 p-4">
              <div className="col-span-2 p-2">
                <div className="mb-2 mt-1 text-base font-medium">Property Types</div>
                <div className="space-y-1">
                  {buyMenuItems.map((item) => (
                    <Link
                      key={item.title}
                      to={createSearchUrl(item)}
                      className="flex cursor-pointer items-start space-x-3 rounded-md p-2.5 hover:bg-muted"
                    >
                      {item.icon}
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="col-span-4 p-2">
                <div className="mb-3 mt-1 text-base font-medium">
                  Featured Properties
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {properties.slice(0, 4).map((property) => (
                    <div key={property.id} className="col-span-1">
                      <Link to={`/properties/${property.id}`}>
                        <PropertyMiniCard property={property} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Agents Dropdown */}
      <div className="relative group">
        <Button 
          variant="ghost" 
          className={cn(
            "px-3 flex items-center gap-1",
            (pathname.startsWith("/agents") || openDropdown === 'agents') && "text-primary font-medium",
            openDropdown === 'agents' && "bg-slate-50"
          )}
          onClick={() => handleDropdownToggle('agents')}
        >
          Agents <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
        
        {openDropdown === 'agents' && (
          <div className="absolute left-0 top-full mt-1 z-50 bg-white rounded-md shadow-lg border overflow-hidden w-[600px]">
            <div className="grid grid-cols-6 p-4">
              <div className="col-span-2 p-2">
                <div className="mb-2 mt-1 text-base font-medium">Find Agents</div>
                <div className="space-y-1">
                  {agentMenuItems.map((item) => (
                    <Link
                      key={item.title}
                      to={createSearchUrl(item)}
                      className="flex cursor-pointer items-start space-x-3 rounded-md p-2.5 hover:bg-muted"
                    >
                      {item.icon}
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="col-span-4 p-2">
                <div className="mb-3 mt-1 text-base font-medium">
                  Featured Agents
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {agents.slice(0, 4).map((agent) => (
                    <div key={agent.id} className="col-span-1">
                      <Link to={`/agents/${agent.id}`}>
                        <AgentMiniCard agent={agent} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Post Property Free */}
      <Link to="/post-property-free">
        <Button 
          variant="ghost"
          className={cn(
            "px-3",
            pathname === "/post-property-free" && "text-primary font-medium"
          )}
        >
          Post Property Free
        </Button>
      </Link>

      {/* Sell */}
      <Link to="/add-property">
        <Button 
          variant="ghost"
          className={cn(
            "px-3",
            pathname === "/add-property" && "text-primary font-medium"
          )}
        >
          Sell
        </Button>
      </Link>

      {/* Resources */}
      <div className="relative group">
        <Button 
          variant="ghost" 
          className={cn(
            "px-3 flex items-center gap-1",
            (pathname.startsWith("/resources") || openDropdown === 'resources') && "text-primary font-medium",
            openDropdown === 'resources' && "bg-slate-50"
          )}
          onClick={() => handleDropdownToggle('resources')}
        >
          Resources <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
        
        {openDropdown === 'resources' && (
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-md shadow-lg border overflow-hidden w-[400px]">
            <div className="p-4">
              <div className="mb-2 mt-1 text-base font-medium">Guides & Articles</div>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/resources/buying-guide" className="flex cursor-pointer items-start space-x-3 rounded-md p-3 hover:bg-muted">
                  <Home className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Buying Guide</div>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      Complete roadmap to purchasing property
                    </p>
                  </div>
                </Link>
                <Link to="/resources/investment-tips" className="flex cursor-pointer items-start space-x-3 rounded-md p-3 hover:bg-muted">
                  <Star className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Investment Tips</div>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      Expert advice on real estate investment
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}