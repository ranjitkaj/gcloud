import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">HomeDirectly</h3>
            <p className="mb-4">India's leading platform for direct property transactions without broker commissions.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/properties" className="hover:text-white transition-colors">Search Properties</Link></li>
              <li><Link href="/add-property" className="hover:text-white transition-colors">List Your Property</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/properties?tag=urgent" className="hover:text-white transition-colors">Urgency Sales</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Home Loans</Link></li>
            </ul>
          </div>

          {/* Column 3: Property Types */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li><Link href="/properties?type=apartment" className="hover:text-white transition-colors">Apartments</Link></li>
              <li><Link href="/properties?type=house" className="hover:text-white transition-colors">Houses & Villas</Link></li>
              <li><Link href="/properties?type=plot" className="hover:text-white transition-colors">Plots & Land</Link></li>
              <li><Link href="/properties?type=commercial" className="hover:text-white transition-colors">Commercial Spaces</Link></li>
              <li><Link href="/properties" className="hover:text-white transition-colors">PG & Co-living</Link></li>
              <li><Link href="/properties" className="hover:text-white transition-colors">Farmhouses</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="ri-map-pin-line mt-1 mr-3"></i>
                <span>123 Tech Park, Whitefield, Bangalore - 560066, India</span>
              </li>
              <li className="flex items-center">
                <i className="ri-phone-line mr-3"></i>
                <span>+91 8800123456</span>
              </li>
              <li className="flex items-center">
                <i className="ri-mail-line mr-3"></i>
                <span>support@homedirectly.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} HomeDirectly. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              <Link href="/post-property-free" className="hover:text-white transition-colors">Post Property Free</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
