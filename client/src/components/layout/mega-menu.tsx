import { useState, useEffect } from "react";
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
  Shield
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Property, Agent, Company } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

// Mega menu items for Buy Properties
const buyMenuItems = [
  {
    title: "Residential Properties",
    href: "/properties?type=residential",
    description: "Find your dream home among our residential listings",
    icon: <Home className="h-5 w-5 text-primary" />,
    query: { propertyType: "house" },
    highlights: ["Family-friendly", "Modern amenities", "Ready to move in"],
    features: ["Community living", "Security", "Parks & recreation"]
  },
  {
    title: "Apartments & Flats",
    href: "/properties?propertyType=apartment",
    description: "Modern apartments in prime locations",
    icon: <Building className="h-5 w-5 text-primary" />,
    query: { propertyType: "apartment" },
    highlights: ["Low maintenance", "Great investment", "Urban living"],
    features: ["24x7 security", "Parking", "Clubhouse"]
  },
  {
    title: "Villas & Independent Houses",
    href: "/properties?propertyType=villa",
    description: "Luxurious villas with premium amenities",
    icon: <Building2 className="h-5 w-5 text-primary" />,
    query: { propertyType: "villa" },
    highlights: ["Luxury living", "Privacy", "Premium neighborhoods"],
    features: ["Private garden", "Swimming pools", "Spacious interiors"]
  },
  {
    title: "Plots & Land",
    href: "/properties?propertyType=plot",
    description: "Investment plots and land parcels",
    icon: <MapPin className="h-5 w-5 text-primary" />,
    query: { propertyType: "plot" },
    highlights: ["Appreciate over time", "Build custom home", "Asset investment"],
    features: ["Clear titles", "Development potential", "Prime locations"]
  },
  {
    title: "Commercial Properties",
    href: "/properties?propertyType=commercial",
    description: "Office spaces and retail properties",
    icon: <Briefcase className="h-5 w-5 text-primary" />,
    query: { propertyType: "commercial" },
    highlights: ["Business growth", "Strategic locations", "Rental income"],
    features: ["Infrastructure", "Tech-ready", "Business districts"]
  },
  {
    title: "Newly Launched Projects",
    href: "/properties?status=new_launch",
    description: "Be the first to explore latest launches",
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
    query: { status: "new_launch" },
    highlights: ["Pre-launch prices", "Modern designs", "Future appreciation"],
    features: ["Smart homes", "Green buildings", "Future-ready"]
  },
  {
    title: "Premium Properties",
    href: "/properties?premium=true",
    description: "High-end luxury properties and penthouses",
    icon: <Star className="h-5 w-5 text-primary" />,
    query: { premium: true },
    highlights: ["Exclusive listings", "Ultra-luxury", "Prestigious locations"],
    features: ["Concierge service", "Designer interiors", "Brand associations"]
  },
  {
    title: "Verified Properties",
    href: "/properties?verified=true",
    description: "All details verified by our team",
    icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
    query: { verified: true },
    highlights: ["Reliable information", "Legal clarity", "Smooth transactions"],
    features: ["Verified documents", "Transparent dealings", "Legal assistance"]
  },
];

// Mega menu items for Agents
const agentMenuItems = [
  {
    title: "Top Rated Agents",
    href: "/agents?sort=rating",
    description: "Connect with our highest rated property experts",
    icon: <Star className="h-5 w-5 text-primary" />,
    query: { sort: "rating" },
    highlights: ["Customer satisfaction", "Proven expertise", "Trusted service"],
    features: ["5-star ratings", "Client testimonials", "Performance metrics"]
  },
  {
    title: "Featured Agents",
    href: "/agents?featured=true",
    description: "Our selected top performing agents",
    icon: <Medal className="h-5 w-5 text-primary" />,
    query: { featured: true },
    highlights: ["Editor's choice", "Premium service", "Top performers"],
    features: ["Premium service", "Curated selection", "Special incentives"]
  },
  {
    title: "Agents by Area",
    href: "/agents?view=by-area",
    description: "Find specialists in your preferred location",
    icon: <MapPinned className="h-5 w-5 text-primary" />,
    query: { view: "by-area" },
    highlights: ["Local expertise", "Area specialists", "Neighborhood knowledge"],
    features: ["Market insights", "Local connections", "Area-specific data"]
  },
  {
    title: "Most Experienced",
    href: "/agents?sort=experience",
    description: "Agents with years of industry expertise",
    icon: <GraduationCap className="h-5 w-5 text-primary" />,
    query: { sort: "experience" },
    highlights: ["Industry veterans", "Market wisdom", "Seasoned negotiators"],
    features: ["Transaction history", "Market cycles experience", "Long-term clients"]
  },
  {
    title: "Most Deals Closed",
    href: "/agents?sort=deals",
    description: "Agents with impressive success records",
    icon: <ThumbsUp className="h-5 w-5 text-primary" />,
    query: { sort: "deals" },
    highlights: ["Proven results", "High volume", "Efficiency"],
    features: ["Transaction analytics", "Success rate", "Fast closings"]
  },
  {
    title: "Newly Joined",
    href: "/agents?sort=newest",
    description: "Fresh talent eager to help you",
    icon: <Clock className="h-5 w-5 text-primary" />,
    query: { sort: "newest" },
    highlights: ["Fresh perspective", "Motivated service", "Extra attention"],
    features: ["Digital savvy", "Modern approach", "Special promotions"]
  },
];

// Mega menu items for Companies
const companyMenuItems = [
  {
    title: "Top Companies",
    href: "/companies?sort=rating",
    description: "Leading real estate firms with exceptional service",
    icon: <Award className="h-5 w-5 text-primary" />,
    query: { sort: "rating" },
    highlights: ["Industry leaders", "Quality standards", "Trusted brands"],
    features: ["Corporate guarantee", "Standardized process", "After-sales support"]
  },
  {
    title: "By City",
    href: "/companies?view=by-city",
    description: "Find reputable agencies in your city",
    icon: <MapPin className="h-5 w-5 text-primary" />,
    query: { view: "by-city" },
    highlights: ["Local presence", "City specialists", "Neighborhood expertise"],
    features: ["Local offices", "City-wide network", "Community involvement"]
  },
  {
    title: "Most Listings",
    href: "/companies?sort=listings",
    description: "Companies with the largest property portfolios",
    icon: <Layers3 className="h-5 w-5 text-primary" />,
    query: { sort: "listings" },
    highlights: ["Wide selection", "Market coverage", "Diverse options"],
    features: ["Extensive inventory", "Market share", "Category leadership"]
  },
  {
    title: "Established Agencies",
    href: "/companies?sort=established",
    description: "Firms with decades of industry presence",
    icon: <Landmark className="h-5 w-5 text-primary" />,
    query: { sort: "established" },
    highlights: ["Legacy brands", "Market pioneers", "Proven stability"],
    features: ["Institutional knowledge", "Historical insights", "Multi-generational clients"]
  },
  {
    title: "Verified Companies",
    href: "/companies?verified=true",
    description: "All credentials verified by our team",
    icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
    query: { verified: true },
    highlights: ["Authentic partners", "Legal compliance", "Secure transactions"],
    features: ["KYC verified", "Legal documentation", "Regulatory compliance"]
  },
];

// Mega menu items for Resources
const resourceMenuItems = [
  {
    title: "Buying Guide",
    href: "/resources/buying-guide",
    description: "Complete roadmap to purchasing property",
    icon: <GraduationCap className="h-5 w-5 text-primary" />,
  },
  {
    title: "Investment Tips",
    href: "/resources/investment-tips",
    description: "Expert advice on real estate investment",
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
  },
  {
    title: "Market Trends",
    href: "/resources/market-trends",
    description: "Latest updates on property market trends",
    icon: <LineChart className="h-5 w-5 text-primary" />,
  },
  {
    title: "Legal Assistance",
    href: "/resources/legal",
    description: "Legal aspects of property transactions",
    icon: <Briefcase className="h-5 w-5 text-primary" />,
  },
  {
    title: "Housing Loan Guide",
    href: "/resources/loan-guide",
    description: "Understanding mortgage and financing options",
    icon: <Landmark className="h-5 w-5 text-primary" />,
  },
  {
    title: "Property Insights",
    href: "/resources/insights",
    description: "In-depth analysis of property market",
    icon: <AreaChart className="h-5 w-5 text-primary" />,
  },
];

interface MegaMenuProps {
  isMobile?: boolean;
}

// Property mini card for menu
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
          <span className="text-xs font-medium flex items-center">
            <IndianRupee className="h-3 w-3 mr-0.5" />
            {property.price.toLocaleString('en-IN')}
          </span>
          <div className="flex items-center space-x-1">
            {property.bedrooms && (
              <span className="text-xs flex items-center" title="Bedrooms">
                <Bed className="h-3 w-3 mr-0.5" />
                {property.bedrooms}
              </span>
            )}
            {property.bathrooms && (
              <span className="text-xs flex items-center ml-1" title="Bathrooms">
                <Bath className="h-3 w-3 mr-0.5" />
                {property.bathrooms}
              </span>
            )}
            <span className="text-xs flex items-center ml-1" title="Area">
              <Maximize className="h-3 w-3 mr-0.5" />
              {property.area}m²
            </span>
          </div>
        </div>
      </div>
    </div>
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
            <Badge variant="outline" className="text-[8px] h-4 border-green-500 text-green-600 flex items-center">
              <Shield className="h-2 w-2 mr-0.5" /> Verified
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export function MegaMenu({ isMobile = false }: MegaMenuProps) {
  const [location] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
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
  
  // Fetch featured companies
  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ['/api/companies/featured'],
    enabled: !isMobile
  });
  
  // Filter properties based on the active category query
  const getFilteredProperties = (category: any) => {
    if (!category || !category.query) return [];
    
    return properties.filter(property => {
      for (const [key, value] of Object.entries(category.query)) {
        if (key === 'propertyType' && property.propertyType !== value) return false;
        if (key === 'premium' && property.premium !== value) return false;
        if (key === 'verified' && property.verified !== value) return false;
        // Add more filters as needed
      }
      return true;
    }).slice(0, 2); // Display only 2 properties per category
  };
  
  if (isMobile) {
    // Mobile view with simple list
    return (
      <div className="flex flex-col space-y-3 pt-2 pb-3">
        <Link href="/properties" className="text-gray-700 hover:text-primary font-medium transition-colors py-2">
          Buy
        </Link>
        <Link href="/agents" className="text-gray-700 hover:text-primary font-medium transition-colors py-2">
          Agents
        </Link>
        <Link href="/companies" className="text-gray-700 hover:text-primary font-medium transition-colors py-2">
          Companies
        </Link>
        <Link href="/add-property" className="text-gray-700 hover:text-primary font-medium transition-colors py-2">
          Sell
        </Link>
        <Link href="/resources" className="text-gray-700 hover:text-primary font-medium transition-colors py-2">
          Resources
        </Link>
        <Link href="/about" className="text-gray-700 hover:text-primary font-medium transition-colors py-2">
          About
        </Link>
        <Link href="/contact" className="text-gray-700 hover:text-primary font-medium transition-colors py-2">
          Contact
        </Link>
      </div>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Buy Properties Mega Menu */}
        <NavigationMenuItem 
          onMouseEnter={() => setActiveCategory('buy')}
          onMouseLeave={() => setActiveCategory(null)}
        >
          <NavigationMenuTrigger className={cn(
            "font-medium",
            location.startsWith("/properties") && "text-primary"
          )}>Buy</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[950px] p-4">
              <div className="grid grid-cols-12 gap-6">
                {/* Categories */}
                <div className="col-span-4">
                  <div className="space-y-1">
                    {buyMenuItems.map((item) => (
                      <Link key={item.title} href={item.href}>
                        <NavigationMenuLink asChild>
                          <div className="flex cursor-pointer items-start space-x-3 rounded-md p-2.5 hover:bg-muted">
                            {item.icon}
                            <div>
                              <div className="text-sm font-medium">{item.title}</div>
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Preview & Featured Items */}
                <div className="col-span-8 border-l pl-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Featured Properties</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {getFilteredProperties(buyMenuItems.find(item => item.title === "Premium Properties")).length > 0 ? (
                        getFilteredProperties(buyMenuItems.find(item => item.title === "Premium Properties")).map(property => (
                          <PropertyMiniCard key={property.id} property={property} />
                        ))
                      ) : (
                        properties.slice(0, 2).map(property => (
                          <PropertyMiniCard key={property.id} property={property} />
                        ))
                      )}
                    </div>
                    
                    {/* Highlights */}
                    <div className="mt-4">
                      <h4 className="text-xs font-medium mb-2 text-gray-500 uppercase tracking-wide">Highlights</h4>
                      <div className="flex flex-wrap gap-2">
                        {buyMenuItems.flatMap(item => item.highlights || []).slice(0, 5).map((highlight, index) => (
                          <Badge key={index} variant="outline" className="px-2 py-1 text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="mt-4">
                      <h4 className="text-xs font-medium mb-2 text-gray-500 uppercase tracking-wide">Features</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {buyMenuItems.flatMap(item => item.features || []).slice(0, 6).map((feature, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-600">
                            <CheckCircle2 className="h-3 w-3 text-green-500 mr-1.5" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Agents Mega Menu */}
        <NavigationMenuItem
          onMouseEnter={() => setActiveCategory('agents')}
          onMouseLeave={() => setActiveCategory(null)}
        >
          <NavigationMenuTrigger className={cn(
            "font-medium",
            location.startsWith("/agents") && "text-primary"
          )}>Agents</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[900px] p-4">
              <div className="grid grid-cols-12 gap-6">
                {/* Categories */}
                <div className="col-span-4">
                  <div className="space-y-1">
                    {agentMenuItems.map((item) => (
                      <Link key={item.title} href={item.href}>
                        <NavigationMenuLink asChild>
                          <div className="flex cursor-pointer items-start space-x-3 rounded-md p-2.5 hover:bg-muted">
                            {item.icon}
                            <div>
                              <div className="text-sm font-medium">{item.title}</div>
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Preview & Featured Items */}
                <div className="col-span-8 border-l pl-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Featured Agents</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {agents.slice(0, 4).map(agent => (
                        <AgentMiniCard key={agent.id} agent={agent} />
                      ))}
                    </div>
                    
                    {/* Note about verification */}
                    <div className="mt-4 bg-muted rounded-md p-3">
                      <h4 className="text-xs font-medium mb-1 flex items-center">
                        <Shield className="h-4 w-4 mr-1.5 text-primary" />
                        Enhanced Privacy Protection
                      </h4>
                      <p className="text-xs text-gray-600">
                        To protect property owner data, all agent and company accounts are verified before they can access contact details.
                        Our verification process ensures legitimacy through professional license validation.
                      </p>
                    </div>
                    
                    {/* Highlights */}
                    <div className="mt-4">
                      <h4 className="text-xs font-medium mb-2 text-gray-500 uppercase tracking-wide">Agent Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Luxury Properties", "First-time Buyers", "Investment Properties", "NRI Services", "Commercial"].map((specialty, index) => (
                          <Badge key={index} variant="outline" className="px-2 py-1 text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Companies Mega Menu */}
        <NavigationMenuItem
          onMouseEnter={() => setActiveCategory('companies')}
          onMouseLeave={() => setActiveCategory(null)}
        >
          <NavigationMenuTrigger className={cn(
            "font-medium",
            location.startsWith("/companies") && "text-primary"
          )}>Companies</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[900px] p-4">
              <div className="grid grid-cols-12 gap-6">
                {/* Categories */}
                <div className="col-span-4">
                  <div className="space-y-1">
                    {companyMenuItems.map((item) => (
                      <Link key={item.title} href={item.href}>
                        <NavigationMenuLink asChild>
                          <div className="flex cursor-pointer items-start space-x-3 rounded-md p-2.5 hover:bg-muted">
                            {item.icon}
                            <div>
                              <div className="text-sm font-medium">{item.title}</div>
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Preview & Featured Items */}
                <div className="col-span-8 border-l pl-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Featured Companies</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {companies.slice(0, 4).map(company => (
                        <CompanyMiniCard key={company.id} company={company} />
                      ))}
                    </div>
                    
                    {/* Company verification info */}
                    <div className="mt-4 bg-muted rounded-md p-3">
                      <h4 className="text-xs font-medium mb-1 flex items-center">
                        <Shield className="h-4 w-4 mr-1.5 text-primary" />
                        Verified Company Program
                      </h4>
                      <p className="text-xs text-gray-600">
                        Companies undergo a thorough verification process including document authentication, office address verification, and license validation before they can access owner information.
                      </p>
                    </div>
                    
                    {/* Highlights */}
                    <div className="mt-4">
                      <h4 className="text-xs font-medium mb-2 text-gray-500 uppercase tracking-wide">Benefits</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {["Professional management", "Legal expertise", "Market knowledge", "Marketing reach", "After-sales support", "Documentation help"].map((feature, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-600">
                            <CheckCircle2 className="h-3 w-3 text-green-500 mr-1.5" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Sell Direct Link */}
        <NavigationMenuItem>
          <Link href="/add-property">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              "font-medium",
              location === "/add-property" && "text-primary"
            )}>
              Sell
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* Resources Mega Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(
            "font-medium",
            location.startsWith("/resources") && "text-primary"
          )}>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
              {resourceMenuItems.map((item) => (
                <Link key={item.title} href={item.href}>
                  <NavigationMenuLink asChild>
                    <div className="flex cursor-pointer items-start space-x-3 rounded-md p-3 hover:bg-muted">
                      {item.icon}
                      <div>
                        <div className="text-sm font-medium">{item.title}</div>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </NavigationMenuLink>
                </Link>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* About & Contact Links */}
        <NavigationMenuItem>
          <Link href="/about">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              "font-medium",
              location === "/about" && "text-primary"
            )}>
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/contact">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              "font-medium",
              location === "/contact" && "text-primary"
            )}>
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}