import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  PlusCircle,
  Bell,
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  Star,
  ChevronLeft,
  Headphones,
} from "lucide-react";
import { MegaMenu } from "./mega-menu";
import NotificationCenter from "@/components/ui/notification-center";
import LocationSelector from "./location-selector";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(location !== "/" && window.history.length > 1);
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false); // Close mobile menu on large screens
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false); // Close menu on logout
  };

  const navigateTo = (path: string) => {
    setLocation(path);
    setMobileMenuOpen(false); // Close menu on navigation
  };

  const goBack = () => {
    window.history.back();
    setMobileMenuOpen(false); // Close menu on back
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Back Button and Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/src/Images/logo.png"
                alt="UrgentSales.in"
                className="h-10 md:h-12 w-auto" // Adjusted the height for responsiveness
                onError={(e) => {
                  console.error("Logo failed to load:", e);
                  e.currentTarget.src = "/src/Images/logo.png";
                }}
              />
            </Link>
            <LocationSelector />
          </div>

          {/* Navigation (Desktop) */}
          <div className="hidden md:flex items-center">
            <MegaMenu />
          </div>

          {/* Post Property Button and Support Icon */}
          <div className="hidden md:flex items-center space-x-3 mr-3">
            <Link
              to={user ? "/post-property-free" : "/auth"}
              onClick={() => {
                if (!user) {
                  toast({
                    title: "Login Required",
                    description: "You need to login before posting a property.",
                    variant: "default",
                  });
                }
              }}
              className="inline-flex bg-emerald-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Post Property FREE
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Headphones className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">
                  Support Options
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => (window.location.href = "tel:+1234567890")}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  <span>Contact Number</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    (window.location.href = "mailto:support@urgentsales.com")
                  }
                >
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    (window.location.href = "https://wa.me/1234567890")
                  }
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>WhatsApp Support</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <NotificationCenter />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <User className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-medium">
                      {user.name}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard"
                        onClick={() => navigateTo("/dashboard")}
                      >
                        <Home className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/add-property"
                        onClick={() => navigateTo("/add-property")}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Add Property</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/recommendations"
                        onClick={() => navigateTo("/recommendations")}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        <span>Recommendations</span>
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" onClick={() => navigateTo("/admin")}>
                          <Home className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  onClick={() => window.scrollTo(0, 0)}
                  className="inline-flex bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </Link>
              </>
            )}
            <button
              className="md:hidden flex items-center text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-2">
          {canGoBack && (
            <button
              onClick={goBack}
              className="w-full text-left mb-2 py-2 flex items-center text-gray-700 hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="font-medium">Back</span>
            </button>
          )}
          <MegaMenu isMobile={true} />

          {/* Post Property in Mobile Menu */}
          <div className="py-2 border-t border-gray-100 mt-2">
            <Link
              to={user ? "/post-property-free" : "/auth"}
              onClick={() => {
                if (!user) {
                  toast({
                    title: "Login Required",
                    description: "You need to login before posting a property.",
                    variant: "default",
                  });
                }
                setMobileMenuOpen(false); // Close menu on click
              }}
              className="text-gray-700 hover:text-primary font-medium transition-colors py-2 flex items-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Post Property FREE
            </Link>
            {user && (
              <Link
                to="/recommendations"
                onClick={() => setMobileMenuOpen(false)} // Close menu on click
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2 flex items-center mt-2"
              >
                <Star className="mr-2 h-4 w-4" />
                Recommendations
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)} // Close menu on click
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2 flex items-center mt-2"
              >
                <Home className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Support Options in Mobile Menu */}
          <div className="py-2 border-t border-gray-100">
            <p className="font-medium text-sm text-gray-900 mb-2">
              Support Options
            </p>
            <a
              href="tel:+1234567890"
              onClick={() => setMobileMenuOpen(false)} // Close menu on click
              className="text-gray-700 hover:text-primary transition-colors py-1 flex items-center"
            >
              <Phone className="mr-2 h-4 w-4" />
              Contact Number
            </a>
            <a
              href="mailto:support@homedirectly.com"
              onClick={() => setMobileMenuOpen(false)} // Close menu on click
              className="text-gray-700 hover:text-primary transition-colors py-1 flex items-center"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Support
            </a>
            <a
              href="https://wa.me/1234567890"
              onClick={() => setMobileMenuOpen(false)} // Close menu on click
              className="text-gray-700 hover:text-primary transition-colors py-1 flex items-center"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp Support
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
