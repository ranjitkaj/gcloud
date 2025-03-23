import { useState } from "react";
import { useLocation } from "wouter";

interface PropertyFilterBarProps {
  className?: string;
}

export default function PropertyFilterBar({ className }: PropertyFilterBarProps) {
  const [, navigate] = useLocation();
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Properties" },
    { id: "sale", label: "For Sale" },
    { id: "premium", label: "Premium" },
  ];

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    if (filterId === "all") {
      navigate("/properties");
    } else {
      navigate(`/properties?propertyStatus=${filterId}`);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm w-full ${className}`}>
      <div className="flex">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`flex-1 py-3 px-4 text-center text-sm sm:text-base transition-colors duration-200 ${
              activeFilter === filter.id
                ? "bg-primary text-white font-medium"
                : "text-gray-600 hover:bg-gray-100"
            } ${filter.id === "all" ? "rounded-l-lg" : ""} ${
              filter.id === "premium" ? "rounded-r-lg" : ""
            }`}
            onClick={() => handleFilterClick(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}