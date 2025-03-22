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
  Shield,
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
    features: ["Community living", "Security", "Parks & recreation"],
  },
  {
    title: "Apartments & Flats",
    href: "/properties?propertyType=apartment",
    description: "Modern apartments in prime locations",
    icon: <Building className="h-5 w-5 text-primary" />,
    query: { propertyType: "apartment" },
    highlights: ["Low maintenance", "Great investment", "Urban living"],
    features: ["24x7 security", "Parking", "Clubhouse"],
  },
  {
    title: "Villas & Independent Houses",
    href: "/properties?propertyType=villa",
    description: "Luxurious villas with premium amenities",
    icon: <Building2 className="h-5 w-5 text-primary" />,
    query: { propertyType: "villa" },
    highlights: ["Luxury living", "Privacy", "Premium neighborhoods"],
    features: ["Private garden", "Swimming pools", "Spacious interiors"],
  },
  {
    title: "Plots & Land",
    href: "/properties?propertyType=plot",
    description: "Investment plots and land parcels",
    icon: <MapPin className="h-5 w-5 text-primary" />,
    query: { propertyType: "plot" },
    highlights: [
      "Appreciate over time",
      "Build custom home",
      "Asset investment",
    ],
    features: ["Clear titles", "Development potential", "Prime locations"],
  },
  {
    title: "Commercial Properties",
    href: "/properties?propertyType=commercial",
    description: "Office spaces and retail properties",
    icon: <Briefcase className="h-5 w-5 text-primary" />,
    query: { propertyType: "commercial" },
    highlights: ["Business growth", "Strategic locations", "Rental income"],
    features: ["Infrastructure", "Tech-ready", "Business districts"],
  },
  {
    title: "Newly Launched Projects",
    href: "/properties?status=new_launch",
    description: "Be the first to explore latest launches",
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
    query: { status: "new_launch" },
    highlights: ["Pre-launch offers", "Modern designs", "Latest amenities"],
    features: ["Payment plans", "Early-bird discounts", "Choice locations"],
  },
];

// Mega menu items for Rent Properties
const rentMenuItems = [
  {
    title: "Residential Rentals",
    href: "/properties?type=residential&rentOrSale=rent",
    description: "Quality homes for your comfortable living",
    icon: <Home className="h-5 w-5 text-primary" />,
    query: { propertyType: "house", rentOrSale: "rent" },
    highlights: ["Move-in ready", "Flexible terms", "Quality living"],
    features: ["Maintenance", "Verified landlords", "Tenant protection"],
  },
  {
    title: "Apartment Rentals",
    href: "/properties?propertyType=apartment&rentOrSale=rent",
    description: "Urban apartments with modern amenities",
    icon: <Building className="h-5 w-5 text-primary" />,
    query: { propertyType: "apartment", rentOrSale: "rent" },
    highlights: ["City living", "Secured complexes", "Community amenities"],
    features: ["Professional management", "Maintenance services", "Parking"],
  },
  {
    title: "Villa Rentals",
    href: "/properties?propertyType=villa&rentOrSale=rent",
    description: "Premium villas for luxury lifestyle",
    icon: <Building2 className="h-5 w-5 text-primary" />,
    query: { propertyType: "villa", rentOrSale: "rent" },
    highlights: ["Exclusive living", "Premium locations", "Spacious homes"],
    features: ["Private yards", "Premium amenities", "Long-term options"],
  },
  {
    title: "Commercial Rentals",
    href: "/properties?propertyType=commercial&rentOrSale=rent",
    description: "Workspaces for your growing business",
    icon: <Briefcase className="h-5 w-5 text-primary" />,
    query: { propertyType: "commercial", rentOrSale: "rent" },
    highlights: ["Business ready", "Prime locations", "Flexible terms"],
    features: ["Maintenance", "Security", "Modern infrastructure"],
  },
  {
    title: "PG & Co-living",
    href: "/properties?propertyType=coliving&rentOrSale=rent",
    description: "Shared accommodations for modern living",
    icon: <Users className="h-5 w-5 text-primary" />,
    query: { propertyType: "coliving", rentOrSale: "rent" },
    highlights: ["Budget friendly", "Community living", "Convenience"],
    features: ["Fully furnished", "Utilities included", "Flexible stays"],
  },
  {
    title: "Short-term Rentals",
    href: "/properties?propertyType=short_term&rentOrSale=rent",
    description: "Temporary stays for your needs",
    icon: <Clock className="h-5 w-5 text-primary" />,
    query: { propertyType: "short_term", rentOrSale: "rent" },
    highlights: ["No long commitments", "Fully furnished", "Quick move-in"],
    features: ["All utilities", "Flexible terms", "Premium locations"],
  },
];

// Mega menu items for Agents
const agentMenuItems = [
  {
    title: "Top Agents",
    href: "/agents/top",
    description: "Connect with our highest-rated property experts",
    icon: <Star className="h-5 w-5 text-primary" />,
    query: { sort: "rating" },
    highlights: ["Verified experts", "High customer satisfaction", "Fast response"],
    features: ["Personalized service", "Market knowledge", "Negotiation skills"],
  },
  {
    title: "Agents by Area",
    href: "/agents/areas",
    description: "Find local experts who know your neighborhood",
    icon: <MapPinned className="h-5 w-5 text-primary" />,
    query: { groupBy: "area" },
    highlights: ["Local expertise", "Area specialists", "Neighborhood knowledge"],
    features: ["Community insights", "Local market data", "Area developments"],
  },
  {
    title: "Agents by Specialization",
    href: "/agents/specialization",
    description: "Property specialists for your specific needs",
    icon: <UserSquare2 className="h-5 w-5 text-primary" />,
    query: { groupBy: "specialization" },
    highlights: ["Focused expertise", "Specialized knowledge", "Tailored service"],
    features: ["Niche property types", "Special requirements", "Target audiences"],
  },
  {
    title: "Agent Reviews",
    href: "/agents/reviews",
    description: "Read what clients say about our agents",
    icon: <ThumbsUp className="h-5 w-5 text-primary" />,
    query: { view: "reviews" },
    highlights: ["Transparent feedback", "Real experiences", "Honest opinions"],
    features: ["Customer satisfaction", "Service quality", "Trust indicators"],
  },
  {
    title: "Property Consultants",
    href: "/agents/consultants",
    description: "Expert guidance for complex property decisions",
    icon: <GraduationCap className="h-5 w-5 text-primary" />,
    query: { role: "consultant" },
    highlights: ["Strategic advice", "Investment guidance", "Market insights"],
    features: ["Financial analysis", "Market trends", "Investment potential"],
  },
  {
    title: "Become an Agent",
    href: "/agent-signup",
    description: "Join our platform as a property professional",
    icon: <Award className="h-5 w-5 text-primary" />,
    query: {},
    highlights: ["Grow your business", "Access to clients", "Marketing tools"],
    features: ["Profile visibility", "Client connections", "Business tools"],
  },
];

// Mega menu items for Projects
const projectMenuItems = [
  {
    title: "New Launches",
    href: "/projects/new-launches",
    description: "Explore newly launched real estate projects",
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
    query: { status: "new_launch" },
    highlights: ["Early bird pricing", "Pre-launch benefits", "Prime locations"],
    features: ["Payment plans", "Priority selection", "Launch offers"],
  },
  {
    title: "Under Construction",
    href: "/projects/under-construction",
    description: "Projects currently in development phase",
    icon: <Layers3 className="h-5 w-5 text-primary" />,
    query: { status: "under_construction" },
    highlights: ["Investment potential", "Customization options", "Price advantage"],
    features: ["Construction updates", "Stage-wise payments", "Layout choices"],
  },
  {
    title: "Ready to Move",
    href: "/projects/ready-to-move",
    description: "Completed projects ready for immediate possession",
    icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
    query: { status: "ready_to_move" },
    highlights: ["Immediate possession", "No GST", "Ready infrastructure"],
    features: ["Move-in ready", "Complete amenities", "Established communities"],
  },
  {
    title: "Affordable Housing",
    href: "/projects/affordable",
    description: "Budget-friendly housing projects",
    icon: <IndianRupee className="h-5 w-5 text-primary" />,
    query: { category: "affordable" },
    highlights: ["Budget friendly", "Government subsidies", "Value for money"],
    features: ["PMAY benefits", "Low maintenance", "Essential amenities"],
  },
  {
    title: "Luxury Projects",
    href: "/projects/luxury",
    description: "Premium projects with exclusive amenities",
    icon: <Medal className="h-5 w-5 text-primary" />,
    query: { category: "luxury" },
    highlights: ["Premium living", "Exclusive features", "Status symbol"],
    features: ["Premium amenities", "Concierge services", "Branded fittings"],
  },
  {
    title: "Township Projects",
    href: "/projects/townships",
    description: "Self-sufficient integrated townships",
    icon: <Landmark className="h-5 w-5 text-primary" />,
    query: { category: "township" },
    highlights: ["Community living", "Self-sufficient", "Quality lifestyle"],
    features: ["Schools & hospitals", "Shopping centers", "Sports facilities"],
  },
];

// Mega menu items for Services
const serviceMenuItems = [
  {
    title: "Home Loans",
    href: "/services/home-loans",
    description: "Compare and apply for the best home loans",
    icon: <IndianRupee className="h-5 w-5 text-primary" />,
    query: {},
    highlights: ["Competitive rates", "Quick approval", "Transparent process"],
    features: ["Multiple lenders", "Loan calculators", "Eligibility check"],
  },
  {
    title: "Legal Services",
    href: "/services/legal",
    description: "Property legal verification and documentation",
    icon: <Shield className="h-5 w-5 text-primary" />,
    query: {},
    highlights: ["Reliable information", "Legal clarity", "Smooth transactions"],
    features: ["Verified documents", "Transparent dealings", "Expert advice"],
  },
  {
    title: "Property Valuation",
    href: "/services/valuation",
    description: "Get accurate estimation of property value",
    icon: <LineChart className="h-5 w-5 text-primary" />,
    query: {},
    highlights: ["Market-based rates", "Professional assessment", "Detailed reports"],
    features: ["Location factors", "Amenity assessment", "Comparison data"],
  },
  {
    title: "Home Interior",
    href: "/services/interior",
    description: "Interior design services for your new home",
    icon: <Maximize className="h-5 w-5 text-primary" />,
    query: {},
    highlights: ["Customized designs", "Quality materials", "Professional service"],
    features: ["3D visualization", "Budget options", "Turnkey solutions"],
  },
  {
    title: "Vastu Consultation",
    href: "/services/vastu",
    description: "Vastu analysis and remedial solutions",
    icon: <MapPin className="h-5 w-5 text-primary" />,
    query: {},
    highlights: ["Expert consultants", "Detailed analysis", "Practical solutions"],
    features: ["Property assessment", "Remedial measures", "Design guidance"],
  },
  {
    title: "Property Management",
    href: "/services/property-management",
    description: "Professional management of your property",
    icon: <AreaChart className="h-5 w-5 text-primary" />,
    query: {},
    highlights: ["Hassle-free ownership", "Regular maintenance", "Rental management"],
    features: ["Tenant screening", "Rent collection", "Maintenance coordination"],
  },
];

// Property mini card component for mega menu
function PropertyMiniCard({ property }: { property: Property }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
        <img
          src={property.imageUrls?.[0] || "/placeholder-property.jpg"}
          alt={property.title}
          className="object-cover w-full h-full"
        />
        <Badge variant="secondary" className="absolute bottom-0 right-0 text-xs px-1 py-0">
          {property.propertyType}
        </Badge>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium line-clamp-1">{property.title}</span>
        <span className="text-xs text-muted-foreground line-clamp-1">
          {property.location.city}
        </span>
        <span className="text-xs font-medium">
          ₹{property.price.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// Agent mini card component for mega menu
function AgentMiniCard({ agent }: { agent: Agent }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={agent.photoUrl || "/placeholder-agent.jpg"}
          alt={agent.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium line-clamp-1">{agent.name}</span>
        <span className="text-xs text-muted-foreground line-clamp-1">
          {agent.specialization}
        </span>
        <div className="flex items-center">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-xs ml-1">{agent.rating?.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

// Company mini card component for mega menu
function CompanyMiniCard({ company }: { company: Company }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
        <img
          src={company.logoUrl || "/placeholder-company.jpg"}
          alt={company.name}
          className="object-contain w-8 h-8"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium line-clamp-1">{company.name}</span>
        <span className="text-xs text-muted-foreground line-clamp-1">
          {company.city}
        </span>
        <span className="text-xs">
          {company.propertiesCount || 0} properties
        </span>
      </div>
    </div>
  );
}

// Mega Menu Component
interface MegaMenuProps {
  isMobile?: boolean;
}

export function MegaMenu({ isMobile = false }: MegaMenuProps) {
  const [, setLocation] = useLocation();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [featuredAgents, setFeaturedAgents] = useState<Agent[]>([]);
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);

  // API data fetch for featured items
  const { data: propertiesData } = useQuery({
    queryKey: ["/api/properties/featured"],
    enabled: !isMobile,
  });

  const { data: agentsData } = useQuery({
    queryKey: ["/api/agents/featured"],
    enabled: !isMobile,
  });

  const { data: companiesData } = useQuery({
    queryKey: ["/api/companies/featured"],
    enabled: !isMobile,
  });

  // Set data once fetched
  useEffect(() => {
    if (propertiesData) {
      setFeaturedProperties(propertiesData);
    }
    if (agentsData) {
      setFeaturedAgents(agentsData);
    }
    if (companiesData) {
      setTopCompanies(companiesData);
    }
  }, [propertiesData, agentsData, companiesData]);

  // For mobile, use simple links instead of mega menu
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2 w-full px-3 py-2 text-foreground">
        <Link href="/properties?rentOrSale=buy" className="block py-2 hover:text-primary transition-colors">
          Buy
        </Link>
        <Link href="/properties?rentOrSale=rent" className="block py-2 hover:text-primary transition-colors">
          Rent
        </Link>
        <Link href="/post-property-free" className="block py-2 hover:text-primary transition-colors">
          Sell
        </Link>
        <Link href="/agents" className="block py-2 hover:text-primary transition-colors">
          Agents
        </Link>
        <Link href="/projects" className="block py-2 hover:text-primary transition-colors">
          Projects
        </Link>
        <Link href="/services" className="block py-2 hover:text-primary transition-colors">
          Services
        </Link>
      </div>
    );
  }

  // Desktop navigation with mega menu
  return (
    <NavigationMenu delayDuration={100}>
      <NavigationMenuList>
        {/* Buy Properties */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Buy</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-12 w-[850px] gap-3 p-4">
              <div className="col-span-8 grid grid-cols-3 gap-3">
                {buyMenuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex flex-col space-y-1 rounded-md p-3 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <h3 className="text-sm font-medium">{item.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="col-span-4 bg-muted/30 rounded-md p-3">
                <h3 className="font-medium text-sm mb-2">Featured Properties</h3>
                <div className="space-y-2">
                  {featuredProperties?.slice(0, 3).map((property, index) => (
                    <PropertyMiniCard key={index} property={property} />
                  ))}
                  {!featuredProperties?.length && (
                    <p className="text-xs text-muted-foreground">
                      No featured properties at the moment.
                    </p>
                  )}
                </div>
                <Link
                  href="/properties/featured"
                  className="text-xs text-primary hover:underline block mt-3"
                >
                  View all featured properties →
                </Link>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Rent Properties */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Rent</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-12 w-[850px] gap-3 p-4">
              <div className="col-span-8 grid grid-cols-3 gap-3">
                {rentMenuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex flex-col space-y-1 rounded-md p-3 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <h3 className="text-sm font-medium">{item.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="col-span-4 bg-muted/30 rounded-md p-3">
                <h3 className="font-medium text-sm mb-2">Popular Rentals</h3>
                <div className="space-y-2">
                  {featuredProperties?.slice(0, 3).map((property, index) => (
                    <PropertyMiniCard key={index} property={property} />
                  ))}
                  {!featuredProperties?.length && (
                    <p className="text-xs text-muted-foreground">
                      No featured rentals at the moment.
                    </p>
                  )}
                </div>
                <Link
                  href="/properties?rentOrSale=rent"
                  className="text-xs text-primary hover:underline block mt-3"
                >
                  View all rental properties →
                </Link>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Sell Properties - Direct Link */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/post-property-free" className={navigationMenuTriggerStyle()}>
              Sell
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Agents */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Agents</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-12 w-[850px] gap-3 p-4">
              <div className="col-span-8 grid grid-cols-3 gap-3">
                {agentMenuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex flex-col space-y-1 rounded-md p-3 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <h3 className="text-sm font-medium">{item.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="col-span-4 bg-muted/30 rounded-md p-3">
                <h3 className="font-medium text-sm mb-2">Top Agents</h3>
                <div className="space-y-2">
                  {featuredAgents?.slice(0, 3).map((agent, index) => (
                    <AgentMiniCard key={index} agent={agent} />
                  ))}
                  {!featuredAgents?.length && (
                    <p className="text-xs text-muted-foreground">
                      No featured agents at the moment.
                    </p>
                  )}
                </div>
                <Link
                  href="/agents"
                  className="text-xs text-primary hover:underline block mt-3"
                >
                  View all agents →
                </Link>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Projects */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-12 w-[850px] gap-3 p-4">
              <div className="col-span-8 grid grid-cols-3 gap-3">
                {projectMenuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex flex-col space-y-1 rounded-md p-3 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <h3 className="text-sm font-medium">{item.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="col-span-4 bg-muted/30 rounded-md p-3">
                <h3 className="font-medium text-sm mb-2">Featured Developers</h3>
                <div className="space-y-2">
                  {topCompanies?.slice(0, 3).map((company, index) => (
                    <CompanyMiniCard key={index} company={company} />
                  ))}
                  {!topCompanies?.length && (
                    <p className="text-xs text-muted-foreground">
                      No featured developers at the moment.
                    </p>
                  )}
                </div>
                <Link
                  href="/companies"
                  className="text-xs text-primary hover:underline block mt-3"
                >
                  View all developers →
                </Link>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Services */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-12 w-[850px] gap-3 p-4">
              <div className="col-span-8 grid grid-cols-3 gap-3">
                {serviceMenuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex flex-col space-y-1 rounded-md p-3 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <h3 className="text-sm font-medium">{item.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="col-span-4 bg-muted/30 rounded-md p-3">
                <div className="p-3 mb-3 bg-primary/10 rounded-md border border-primary/20">
                  <h3 className="font-medium text-sm mb-1">Need guidance?</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Our experts can help you navigate the property market with personalized advice.
                  </p>
                  <Link
                    href="/contact"
                    className="text-xs text-primary hover:underline"
                  >
                    Talk to an expert →
                  </Link>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <h3 className="font-medium text-sm mb-1">Blogs & Insights</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Read our latest articles on property market trends and tips.
                  </p>
                  <Link
                    href="/blog"
                    className="text-xs text-primary hover:underline"
                  >
                    Read our blog →
                  </Link>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}