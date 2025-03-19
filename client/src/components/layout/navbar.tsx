import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
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
import LocationSelector from "./location-selector"; // Import LocationSelector

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if we can go back (if we're not on the home page)
    setCanGoBack(location !== "/" && window.history.length > 1);
  }, [location]);

  const handleLogout = () => {
    logout();
  };

  const navigateTo = (path: string) => {
    setLocation(path);
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Back Button and Logo */}
          <div className="flex items-center space-x-2">
            {canGoBack && (
              <button
                onClick={goBack}
                className="mr-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/src/Images/logo.png"
                alt="UrgentSales.in"
                className="h-12 w-auto"
                onError={(e) => {
                  console.error("Logo failed to load:", e);
                  e.currentTarget.src = "/src/Images/logo.png";
                }}
              />
            </Link>
            <LocationSelector /> {/* Add LocationSelector here */}
          </div>

          {/* Navigation (Desktop) */}
          <div className="hidden md:flex items-center">
            <MegaMenu />
          </div>

          {/* Post Property Button and Support Icon */}
          <div className="hidden md:flex items-center space-x-3 mr-3">
            <Link
              to="/post-property-free"
              className="inline-flex bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
                      <Link to="/dashboard">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/add-property">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Add Property</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/recommendations">
                        <Star className="mr-2 h-4 w-4" />
                        <span>Recommendations</span>
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
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
                  className="hidden md:inline-flex hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
            <button
              className="md:hidden flex items-center text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
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
              to="/post-property-free"
              className="text-gray-700 hover:text-primary font-medium transition-colors py-2 flex items-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Post Property FREE
            </Link>
            {user && (
              <Link
                to="/recommendations"
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2 flex items-center mt-2"
              >
                <Star className="mr-2 h-4 w-4" />
                Recommendations
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin"
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
              className="text-gray-700 hover:text-primary transition-colors py-1 flex items-center"
            >
              <Phone className="mr-2 h-4 w-4" />
              Contact Number
            </a>
            <a
              href="mailto:support@homedirectly.com"
              className="text-gray-700 hover:text-primary transition-colors py-1 flex items-center"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Support
            </a>
            <a
              href="https://wa.me/1234567890"
              className="text-gray-700 hover:text-primary transition-colors py-1 flex items-center"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp Support
            </a>
          </div>

          {!user && (
            <div className="pt-2 border-t border-gray-100 mt-2">
              <Link
                to="/auth"
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2 block"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
