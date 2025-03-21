import { Check } from "lucide-react";

export default function MobileApp() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-6 leading-tight">
              Download Our Mobile App
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Take Urgentsales.in with you wherever you go. Search properties,
              chat with owners, and get instant notifications.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary/10 p-1 rounded-md text-primary">
                  <Check className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">
                    Property Search on the Go
                  </h3>
                  <p className="text-gray-600">
                    Find properties anytime, anywhere
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary/10 p-1 rounded-md text-primary">
                  <Check className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">
                    Real-time Chat with Owners
                  </h3>
                  <p className="text-gray-600">
                    Communicate directly through the app
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary/10 p-1 rounded-md text-primary">
                  <Check className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">
                    Instant Property Alerts
                  </h3>
                  <p className="text-gray-600">
                    Get notified when new properties match your criteria
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="inline-flex items-center bg-black text-white py-3 px-5 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <i className="ri-apple-fill text-2xl mr-2"></i>
                <div>
                  <p className="text-xs">Download on the</p>
                  <p className="text-sm font-medium">App Store</p>
                </div>
              </a>

              <a
                href="#"
                className="inline-flex items-center bg-black text-white py-3 px-5 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <i className="ri-google-play-fill text-2xl mr-2"></i>
                <div>
                  <p className="text-xs">Get it on</p>
                  <p className="text-sm font-medium">Google Play</p>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative w-full max-w-md mx-auto lg:ml-auto">
              {/* Phone Mockup */}
              <div className="relative z-10">
                <div className="w-full h-[550px] rounded-3xl shadow-2xl bg-primary flex items-center justify-center overflow-hidden">
                  <div className="text-white text-center p-6">
                    <i className="ri-home-smile-line text-5xl mb-4"></i>
                    <h3 className="text-2xl font-bold mb-2">
                      Urgent Sales.IN App
                    </h3>
                    <p>Coming Soon to App Store & Google Play</p>
                  </div>
                </div>
              </div>

              {/* Background Elements */}
              <div className="absolute top-[-2rem] right-[-2rem] w-48 h-48 bg-primary-100 rounded-full"></div>
              <div className="absolute bottom-[-1rem] left-[-1rem] w-32 h-32 bg-yellow-500 bg-opacity-20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
