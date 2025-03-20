import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertySearch from "@/components/property/property-search";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    title: "Fast Sales for Sellers, Best Deals for Buyers!",
    subtitleWords: ["Budget-Friendly Homes"],
    // color: "from-blue-900 to-blue-700",
    color: "from-gray-950 to-black/90 backdrop-blur-lg",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    title: "Fast Sales for Sellers, Best Deals for Buyers!",
    subtitleWords: [" luxury Villas at great value"],
    // color: "from-green-900 to-green-700",
    color: "from-gray-950 to-black/90 backdrop-blur-lg",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e",
    title: "Fast Sales for Sellers, Best Deals for Buyers!",
    subtitleWords: ["top commercial deals", "verified and secure plots"],
    // color: "from-red-900 to-red-700",
    color: "from-gray-950 to-black/90 backdrop-blur-lg",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b",
    title: "Fast Sales for Sellers, Best Deals for Buyers!",
    subtitleWords: ["urgent property deals", "discounted properties"],
    // color: "from-purple-900 to-purple-700",
    color: "from-gray-950 to-black/90 backdrop-blur-lg",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    title: "Fast Sales for Sellers, Best Deals for Buyers!",
    subtitleWords: ["exclusive deals – Save", " easy payment properties"],
    // color: "from-indigo-900 to-indigo-700",
    color: "from-gray-950 to-black/90 backdrop-blur-lg",
  },
];

const colors = [
  "text-red-500",
  // "text-red-400",
  // "text-green-400",
  // "text-yellow-400",
  // "text-blue-400",
  // "text-indigo-400",
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, navigate] = useLocation();
  const [wordIndex, setWordIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  // Handle slide change every 5 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setWordIndex(0); // Reset word index when slide changes
    }, 5000);

    return () => clearInterval(slideTimer);
  }, []);

  // Handle subtitle word change every 2 seconds
  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWordIndex(
        (prev) => (prev + 1) % slides[currentSlide].subtitleWords.length,
      );
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 2000);

    return () => clearInterval(wordTimer);
  }, [currentSlide]);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[40vh] lg:h-[45vh] overflow-hidden">
        {/* Background Images & Overlay */}
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-75`}
              />
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-20 px-6">
          <p className="text-2xl md:text-1xl lg:text-4xl font-bold">
            {slides[currentSlide].title}
          </p>
          <div className="bg-black/50 backdrop-blur-sm p-6 rounded-lg mt-4 max-w-2xl mx-auto w-full">
            <h3 className="text-base md:text-lg mb-6">
              Find{" "}
              <span className={`${colors[colorIndex]} font-bold`}>
                {slides[currentSlide].subtitleWords[wordIndex]}
              </span>{" "}
              now!
            </h3>
            <PropertySearch className="bg-transparent" showAdvanced={false} />
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() =>
              setCurrentSlide((prev) =>
                prev === 0 ? slides.length - 1 : prev - 1,
              )
            }
            className="absolute left-1 top-1/2 transform -translate-y-1/2  hover:bg-black/50 rounded-full p-2 z-10 text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % slides.length)
            }
            className="absolute right-1 top-1/2 transform -translate-y-1/2  hover:bg-black/50 rounded-full p-2 z-10 text-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      
    </div>
  );
}
