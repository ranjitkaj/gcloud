import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertySearch from "@/components/property/property-search";
import { useAuth } from "@/hooks/use-auth";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Slideshow data
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      title: "Premium Properties",
      subtitle: "Exclusive Listings at Competitive Prices",
      buttonText: "View Premium",
      buttonLink: "/properties?premium=true",
      color: "from-blue-900 to-blue-700",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      title: "Urgent Sales",
      subtitle: "Time-Limited Offers with Massive Discounts",
      buttonText: "View Urgent Sales",
      buttonLink: "/properties?status=urgent_sale",
      color: "from-yellow-900 to-yellow-700",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e",
      title: "New Launches",
      subtitle: "Be the First to Explore Latest Properties",
      buttonText: "View New Launches",
      buttonLink: "/properties?status=new_launch",
      color: "from-green-900 to-green-700",
    },
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Navigation functions
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative">
      {/* Slideshow Banner Section */}
      <section className="relative h-[300px] md:h-[300px] overflow-hidden">
        {/* Slideshow Images */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-70`}
            ></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl text-white">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 transition-all duration-500 ease-in-out transform translate-y-0">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 mb-6">
                    {slide.subtitle}
                  </p>
                  <Link
                    to={slide.buttonLink}
                    className="inline-flex bg-white text-gray-900 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors shadow-lg"
                  >
                    {slide.buttonText}
                  </Link>
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
                    className="inline-flex ml-4 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-lg"
                  >
                    Post Property FREE
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-2 z-10 text-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-2 w-2" />
        </button>
        <button
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-2 z-10 text-white"
          aria-label="Next slide"
        >
          <ChevronRight className="h-2 w-2" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                } transition-all duration-300`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Property Search - Positioned over the banner */}
      <div className="absolute left-0 right-0 bottom-0 transform translate-y-1/2 z-20 px-4">
        <div className="container mx-auto">
          <PropertySearch
            className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm"
            showAdvanced={false}
          />
        </div>
      </div>

      {/* Add spacing to accommodate the overlapping search box */}
    </div>
  );
}
