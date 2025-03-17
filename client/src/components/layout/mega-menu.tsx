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
  LineChart
} from "lucide-react";

// Mega menu items for Buy Properties
const buyMenuItems = [
  {
    title: "Residential Properties",
    href: "/properties?type=residential",
    description: "Find your dream home among our residential listings",
    icon: <Home className="h-5 w-5 text-primary" />,
  },
  {
    title: "Apartments & Flats",
    href: "/properties?propertyType=apartment",
    description: "Modern apartments in prime locations",
    icon: <Building className="h-5 w-5 text-primary" />,
  },
  {
    title: "Villas & Independent Houses",
    href: "/properties?propertyType=villa",
    description: "Luxurious villas with premium amenities",
    icon: <Building2 className="h-5 w-5 text-primary" />,
  },
  {
    title: "Plots & Land",
    href: "/properties?propertyType=plot",
    description: "Investment plots and land parcels",
    icon: <MapPin className="h-5 w-5 text-primary" />,
  },
  {
    title: "Commercial Properties",
    href: "/properties?propertyType=commercial",
    description: "Office spaces and retail properties",
    icon: <Briefcase className="h-5 w-5 text-primary" />,
  },
  {
    title: "Newly Launched Projects",
    href: "/properties?status=new_launch",
    description: "Be the first to explore latest launches",
    icon: <TrendingUp className="h-5 w-5 text-primary" />,
  },
  {
    title: "Premium Properties",
    href: "/properties?premium=true",
    description: "High-end luxury properties and penthouses",
    icon: <Star className="h-5 w-5 text-primary" />,
  },
  {
    title: "Verified Properties",
    href: "/properties?verified=true",
    description: "All details verified by our team",
    icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
  },
];

// Mega menu items for Agents
const agentMenuItems = [
  {
    title: "Top Rated Agents",
    href: "/agents?sort=rating",
    description: "Connect with our highest rated property experts",
    icon: <Star className="h-5 w-5 text-primary" />,
  },
  {
    title: "Featured Agents",
    href: "/agents?featured=true",
    description: "Our selected top performing agents",
    icon: <Medal className="h-5 w-5 text-primary" />,
  },
  {
    title: "Agents by Area",
    href: "/agents?view=by-area",
    description: "Find specialists in your preferred location",
    icon: <MapPinned className="h-5 w-5 text-primary" />,
  },
  {
    title: "Most Experienced",
    href: "/agents?sort=experience",
    description: "Agents with years of industry expertise",
    icon: <GraduationCap className="h-5 w-5 text-primary" />,
  },
  {
    title: "Most Deals Closed",
    href: "/agents?sort=deals",
    description: "Agents with impressive success records",
    icon: <ThumbsUp className="h-5 w-5 text-primary" />,
  },
  {
    title: "Newly Joined",
    href: "/agents?sort=newest",
    description: "Fresh talent eager to help you",
    icon: <Clock className="h-5 w-5 text-primary" />,
  },
];

// Mega menu items for Companies
const companyMenuItems = [
  {
    title: "Top Companies",
    href: "/companies?sort=rating",
    description: "Leading real estate firms with exceptional service",
    icon: <Award className="h-5 w-5 text-primary" />,
  },
  {
    title: "By City",
    href: "/companies?view=by-city",
    description: "Find reputable agencies in your city",
    icon: <MapPin className="h-5 w-5 text-primary" />,
  },
  {
    title: "Most Listings",
    href: "/companies?sort=listings",
    description: "Companies with the largest property portfolios",
    icon: <Layers3 className="h-5 w-5 text-primary" />,
  },
  {
    title: "Established Agencies",
    href: "/companies?sort=established",
    description: "Firms with decades of industry presence",
    icon: <Landmark className="h-5 w-5 text-primary" />,
  },
  {
    title: "Verified Companies",
    href: "/companies?verified=true",
    description: "All credentials verified by our team",
    icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
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

export function MegaMenu({ isMobile = false }: MegaMenuProps) {
  const [location] = useLocation();
  
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
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(
            "font-medium",
            location.startsWith("/properties") && "text-primary"
          )}>Buy</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
              {buyMenuItems.map((item) => (
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

        {/* Agents Mega Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(
            "font-medium",
            location.startsWith("/agents") && "text-primary"
          )}>Agents</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
              {agentMenuItems.map((item) => (
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

        {/* Companies Mega Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(
            "font-medium",
            location.startsWith("/companies") && "text-primary"
          )}>Companies</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
              {companyMenuItems.map((item) => (
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
            <div className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
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