import { Link } from "wouter";
import { Building, Crown, Star, Trophy, Award } from "lucide-react";

const categories = [
  {
    id: "top10",
    label: "Top 10",
    icon: <Crown className="h-12 w-12 text-yellow-500" />,
    description: "Premium exclusive properties",
    bgColor: "bg-gradient-to-br from 50% from-amber-50 to-amber-100",
  },
  {
    id: "top20",
    label: "Top 20",
    icon: <Trophy className="h-12 w-12 text-blue-500" />,
    description: "High-value investment picks",
    bgColor: "bg-gradient-to-br from 50% from-blue-50 to-blue-100",
  },
  {
    id: "top30",
    label: "Top 30",
    icon: <Star className="h-12 w-12 text-purple-500" />,
    description: "Most viewed properties",
    bgColor: "bg-gradient-to-br from 50% from-purple-50 to-purple-100",
  },
  {
    id: "top50",
    label: "Top 50",
    icon: <Award className="h-12 w-12 text-green-500" />,
    description: "Trending properties",
    bgColor: "bg-gradient-to-br from 50% from-green-50 to-green-100",
  },
  {
    id: "top100",
    label: "Top 100",
    icon: <Building className="h-12 w-12 text-red-500" />,
    description: "Best rated properties",
    bgColor: "bg-gradient-to-br from 50% from-red-50 to-red-100",
  },
];

export default function TopProperties() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Top Listing Properties
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/properties/${category.id}`}
              className={`${category.bgColor} rounded-xl p-6 transition-transform hover:scale-105 cursor-pointer`}
            >
              <div className="flex flex-col items-center text-center">
                {category.icon}
                <h3 className="text-xl font-semibold mt-4">{category.label}</h3>
                <p className="text-gray-600 mt-2 text-sm">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}