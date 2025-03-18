import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Home, PlusCircle, Bell, HelpCircle, Phone, Mail, MessageSquare } from "lucide-react";
import { MegaMenu } from "./mega-menu";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl text-primary font-bold font-heading">HomeDirectly</span>
            <span className="hidden sm:block px-2 py-1 text-xs font-medium bg-green-500 text-white rounded-md">No Broker</span>
          </Link>

          {/* Navigation (Desktop) */}
          <div className="hidden md:flex items-center">
            <MegaMenu />
          </div>

          {/* Post Property Free Button and Support */}
          <div className="hidden md:flex items-center space-x-3 mr-3">
            <Link href="/post-property-free" className="inline-flex bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Post Property Free
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">Support Options</DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = "tel:+1234567890"}>
                  <Phone className="mr-2 h-4 w-4" />
                  <span>Contact Number</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = "mailto:support@homedirectly.com"}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = "https://wa.me/1234567890"}>
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
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <User className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-medium">{user.name}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = "/dashboard"}>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = "/add-property"}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Add Property</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth" className="hidden md:inline-flex hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                  Login
                </Link>
                <Link href="/auth" className="inline-flex bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors">
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
          <MegaMenu isMobile={true} />
          
          {/* Post Property in Mobile Menu */}
          <div className="py-2 border-t border-gray-100 mt-2">
            <Link href="/post-property-free" className="text-gray-700 hover:text-primary font-medium transition-colors py-2 flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Post Property Free
            </Link>
          </div>
          
          {/* Support Options in Mobile Menu */}
          <div className="py-2 border-t border-gray-100">
            <p className="font-medium text-sm text-gray-900 mb-2">Support Options</p>
            <a href="tel:+1234567890" className="text-gray-700 hover:text-primary transition-colors py-1 flex items-center">
              <Phone className="mr-2 h-4 w-4" />
              Contact Number
            </a>
            <a href="mailto:support@homedirectly.com" className="text-gray-700 hover:text-primary transition-colors py-1 flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email Support
            </a>
            <a href="https://wa.me/1234567890" className="text-gray-700 hover:text-primary transition-colors py-1 flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp Support
            </a>
          </div>
          
          {!user && (
            <div className="pt-2 border-t border-gray-100 mt-2">
              <Link href="/auth" className="text-gray-700 hover:text-primary font-medium transition-colors py-2 block">
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
