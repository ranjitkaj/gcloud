import { Link } from "wouter";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Company Info */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img
                src="/src/Images/logo.png"
                alt="UrgentSales.in"
                className="h-10 md:h-12 w-auto"
                onError={(e) => {
                  console.error("Logo failed to load:", e);
                  e.currentTarget.src = "/src/Images/logo.png";
                }}
              />
            </Link>
            <p className="mb-4">
              India's leading platform for direct property transactions without
              broker commissions.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/profile.php?id=61574427475230"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://x.com/Urgentsales"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/urgentsales/?hl=en"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/properties?type=residential"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  {" "}
                  Search Properties{" "}
                </Link>
              </li>
              <li>
                <Link
                  href="/post-property-free?type=residential"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Post Property FREE
                </Link>
              </li>

              <li>
                <Link
                  href="/?tag=urgent?type=residential"
                  onClick={() => window.scrollTo(1000, 1000)}
                  className="hover:text-white transition-colors"
                >
                  Urgency Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Property Types */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Property Types
            </h3>
            <ul className="space-y-2">
              <li>
                <li>
                  <Link
                    href="/properties?propertyType=apartment"
                    onClick={() => window.scrollTo(0, 0)}
                    className="hover:text-white transition-colors"
                  >
                    Apartments
                  </Link>
                </li>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=house&propertyType=villa"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Houses & Villas
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=plot&propertyType=Land"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Plots & Land
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?propertyType=commercial"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Commercial Spaces
                </Link>
              </li>

              <li>
                <Link
                  href="/properties?propertyType=farmhouse"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Farmhouses
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mt-1 mr-3 flex-shrink-0" />
                <span>
                  Address: #301, Madhavaram Towers, Kukatpally Y Junction,
                  Moosapet, Hyderabad-500018
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 flex-shrink-0" />
                <span>Phone: +91-99512 11555</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 flex-shrink-0" />
                <span>support@UrgentSales.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link
                href="/feedback"
                onClick={() => window.scrollTo(0, 0)}
                className="hover:text-white transition-colors"
              >
                Send Feedback
              </Link>
            </div>
          </div>
        </div>

        {/* Legal & Policy Links */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="text-white text-sm font-medium mb-2">Legal</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Link
                  href="/terms-conditions"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/privacy-policy"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/disclaimer"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Disclaimer
                </Link>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-white text-sm font-medium mb-2">Support</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Link
                  href="/feedback"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Feedback
                </Link>
                <Link
                  href="/report-problem"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Report a Problem
                </Link>
                <Link
                  href="/contact"
                  onClick={() => window.scrollTo(0, 0)}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>
              &copy; {new Date().getFullYear()} Powered by
              <a
                href="https://omnexaai.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Omnexa AI Labs{" "}
              </a>
              All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0 text-sm">
              <Link
                to="/about"
                onClick={() => window.scrollTo(0, 0)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                About Us
              </Link>

              <Link
                to="/add-property"
                onClick={() => window.scrollTo(0, 0)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Post Property Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
