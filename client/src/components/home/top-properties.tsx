import { Link } from "wouter";

const categories = [
  {
    id: "top10",
    label: "Top 10",
    description: "Urgent Sales",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    borderColor: "border-red-300",
    textColor: "text-amber-50",
    descColor: "text-amber-100",
    animation: "animate-float",
    size: "w-full h-64",
  },
  {
    id: "top20",
    label: "Top 20",
    description: "Urgent Sales",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    borderColor: "border-blue-300",
    textColor: "text-blue-50",
    descColor: "text-blue-100",
    animation: "animate-float-delay-1",
    size: "w-3/5 h-52",
  },
  {
    id: "top30",
    label: "Top 30",
    description: "Urgent Sales",
    imageUrl: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e",
    borderColor: "border-purple-300",
    textColor: "text-purple-50",
    descColor: "text-purple-100",
    animation: "animate-float-delay-2",
    size: "w-1/5 h-36",
  },
  {
    id: "top50",
    label: "Top 50",
    description: "Urgent Sales",
    imageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b",
    borderColor: "border-green-300",
    textColor: "text-green-50",
    descColor: "text-green-100",
    animation: "animate-float-delay-3",
    size: "w-1/5 h-36",
  },
  {
    id: "top100",
    label: "Top 100",
    description: "Urgent Sales",
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    borderColor: "border-amber-300",
    textColor: "text-amber-50",
    descColor: "text-amber-100",
    animation: "animate-float-delay-4",
    size: "w-1/10 h-28",
  },
];

export default function TopProperties() {
  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 relative inline-block font-serif">
          Top Urgent Sales's
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent"></span>
        </h2>

        {/* Mobile layout */}
        <div className="block sm:hidden">
          {/* Top 10 card - Full width */}
          <div className="mb-4">
            <Link
              key={categories[0].id}
              href={`/top-properties/${categories[0].id}`}
              onClick={() => window.scrollTo(0, 0)}
              className={`rounded-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-2 ${categories[0].borderColor} ${categories[0].animation} overflow-hidden relative block h-40`}
              style={{
                backgroundImage: `url(${categories[0].imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                willChange: "transform",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="flex flex-col items-center justify-center text-center p-6 h-full relative z-10">
                <h3
                  className={`font-bold text-3xl ${categories[0].textColor} font-serif drop-shadow-md`}
                >
                  {categories[0].label}
                </h3>
                <p
                  className={`mt-3 font-medium ${categories[0].descColor} text-lg font-sans drop-shadow-md`}
                >
                  {categories[0].description}
                </p>
              </div>
            </Link>
          </div>

          {/* Top 20 and Top 30 in first row */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Link
              key={categories[1].id}
              href={`/top-properties/${categories[1].id}`}
              onClick={() => window.scrollTo(0, 0)}
              className={`rounded-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-2 ${categories[1].borderColor} ${categories[1].animation} overflow-hidden relative block h-32`}
              style={{
                backgroundImage: `url(${categories[1].imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                willChange: "transform",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="flex flex-col items-center justify-center text-center p-4 h-full relative z-10">
                <h3
                  className={`font-bold text-xl ${categories[1].textColor} font-serif drop-shadow-md`}
                >
                  {categories[1].label}
                </h3>
                <p
                  className={`mt-2 font-medium ${categories[1].descColor} text-sm font-sans drop-shadow-md`}
                >
                  {categories[1].description}
                </p>
              </div>
            </Link>

            <Link
              key={categories[2].id}
              href={`/top-properties/${categories[2].id}`}
              onClick={() => window.scrollTo(0, 0)}
              className={`rounded-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-2 ${categories[2].borderColor} ${categories[2].animation} overflow-hidden relative block h-32`}
              style={{
                backgroundImage: `url(${categories[2].imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                willChange: "transform",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="flex flex-col items-center justify-center text-center p-4 h-full relative z-10">
                <h3
                  className={`font-bold text-xl ${categories[2].textColor} font-serif drop-shadow-md`}
                >
                  {categories[2].label}
                </h3>
                <p
                  className={`mt-2 font-medium ${categories[2].descColor} text-sm font-sans drop-shadow-md`}
                >
                  {categories[2].description}
                </p>
              </div>
            </Link>
          </div>

          {/* Top 50 and Top 100 in second row */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              key={categories[3].id}
              href={`/top-properties/${categories[3].id}`}
              onClick={() => window.scrollTo(0, 0)}
              className={`rounded-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-2 ${categories[3].borderColor} ${categories[3].animation} overflow-hidden relative block h-32`}
              style={{
                backgroundImage: `url(${categories[3].imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                willChange: "transform",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="flex flex-col items-center justify-center text-center p-4 h-full relative z-10">
                <h3
                  className={`font-bold text-xl ${categories[3].textColor} font-serif drop-shadow-md`}
                >
                  {categories[3].label}
                </h3>
                <p
                  className={`mt-2 font-medium ${categories[3].descColor} text-sm font-sans drop-shadow-md`}
                >
                  {categories[3].description}
                </p>
              </div>
            </Link>

            <Link
              key={categories[4].id}
              href={`/top-properties/${categories[4].id}`}
              onClick={() => window.scrollTo(0, 0)}
              className={`rounded-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-2 ${categories[4].borderColor} ${categories[4].animation} overflow-hidden relative block h-32`}
              style={{
                backgroundImage: `url(${categories[4].imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                willChange: "transform",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="flex flex-col items-center justify-center text-center p-4 h-full relative z-10">
                <h3
                  className={`font-bold text-xl ${categories[4].textColor} font-serif drop-shadow-md`}
                >
                  {categories[4].label}
                </h3>
                <p
                  className={`mt-2 font-medium ${categories[4].descColor} text-sm font-sans drop-shadow-md`}
                >
                  {categories[4].description}
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-12 gap-4">
            {/* Top 10 - Large card on left side */}
            <div className="col-span-6 row-span-2">
              <Link
                key={categories[0].id}
                href={`/top-properties/${categories[0].id}`}
                onClick={() => window.scrollTo(0, 0)}
                className={`rounded-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-2 ${categories[0].borderColor} ${categories[0].animation} overflow-hidden relative block h-full`}
                style={{
                  backgroundImage: `url(${categories[0].imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  willChange: "transform",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="flex flex-col items-center justify-center text-center p-6 h-full relative z-10">
                  <h3
                    className={`font-bold text-5xl ${categories[0].textColor} font-serif drop-shadow-lg`}
                  >
                    {categories[0].label}
                  </h3>
                  <p
                    className={`mt-3 font-medium ${categories[0].descColor} text-xl font-sans`}
                  >
                    {categories[0].description}
                  </p>
                </div>
              </Link>
            </div>

            {/* Top 20 - Top right */}
            <div className="col-span-4 row-span-1">
              <Link
                key={categories[1].id}
                href={`/top-properties/${categories[1].id}`}
                onClick={() => window.scrollTo(0, 0)}
                className={`rounded-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-2 ${categories[1].borderColor} ${categories[1].animation} overflow-hidden relative block h-full`}
                style={{
                  backgroundImage: `url(${categories[1].imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  willChange: "transform",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="flex flex-col items-center justify-center text-center p-6 h-full relative z-10">
                  <h3
                    className={`font-bold text-4xl ${categories[1].textColor} font-serif drop-shadow-lg`}
                  >
                    {categories[1].label}
                  </h3>
                  <p
                    className={`mt-3 font-medium ${categories[1].descColor} text-lg font-sans`}
                  >
                    {categories[1].description}
                  </p>
                </div>
              </Link>
            </div>

            {/* Top 50 - Top right corner */}
            <div className="col-span-2 row-span-1">
              <Link
                key={categories[3].id}
                href={`/top-properties/${categories[3].id}`}
                onClick={() => window.scrollTo(0, 0)}
                className={`rounded-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-2 ${categories[3].borderColor} ${categories[3].animation} overflow-hidden relative block h-full`}
                style={{
                  backgroundImage: `url(${categories[3].imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  willChange: "transform",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="flex flex-col items-center justify-center text-center p-5 h-full relative z-10">
                  <h3
                    className={`font-bold text-3xl ${categories[3].textColor} font-serif drop-shadow-lg`}
                  >
                    {categories[3].label}
                  </h3>
                  <p
                    className={`mt-2 font-medium ${categories[3].descColor} text-base font-sans`}
                  >
                    {categories[3].description}
                  </p>
                </div>
              </Link>
            </div>

            {/* Top 30 - Bottom right */}
            <div className="col-span-4 row-span-1">
              <Link
                key={categories[2].id}
                href={`/top-properties/${categories[2].id}`}
                onClick={() => window.scrollTo(0, 0)}
                className={`rounded-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-2 ${categories[2].borderColor} ${categories[2].animation} overflow-hidden relative block h-full`}
                style={{
                  backgroundImage: `url(${categories[2].imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  willChange: "transform",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="flex flex-col items-center justify-center text-center p-4 h-full relative z-10">
                  <h3
                    className={`font-bold text-2xl ${categories[2].textColor} font-serif drop-shadow-lg`}
                  >
                    {categories[2].label}
                  </h3>
                  <p
                    className={`mt-2 font-medium ${categories[2].descColor} text-sm font-sans`}
                  >
                    {categories[2].description}
                  </p>
                </div>
              </Link>
            </div>

            {/* Top 100 - Bottom right corner */}
            <div className="col-span-2 row-span-1">
              <Link
                key={categories[4].id}
                href={`/top-properties/${categories[4].id}`}
                onClick={() => window.scrollTo(0, 0)}
                className={`rounded-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-2 ${categories[4].borderColor} ${categories[4].animation} overflow-hidden relative block h-full`}
                style={{
                  backgroundImage: `url(${categories[4].imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  willChange: "transform",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="flex flex-col items-center justify-center text-center p-3 h-full relative z-10">
                  <h3
                    className={`font-bold text-xl ${categories[4].textColor} font-serif drop-shadow-lg`}
                  >
                    {categories[4].label}
                  </h3>
                  <p
                    className={`mt-1 font-medium ${categories[4].descColor} text-xs font-sans`}
                  >
                    {categories[4].description}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
            box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.1);
          }
          50% {
            transform: translateY(-10px);
            box-shadow: 0 25px 15px 0px rgba(0, 0, 0, 0.05);
          }
          100% {
            transform: translateY(0px);
            box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.1);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay-1 {
          animation: float 6s ease-in-out 0.5s infinite;
        }

        .animate-float-delay-2 {
          animation: float 6s ease-in-out 1s infinite;
        }

        .animate-float-delay-3 {
          animation: float 6s ease-in-out 1.5s infinite;
        }

        .animate-float-delay-4 {
          animation: float 6s ease-in-out 2s infinite;
        }
      `}</style> */}
    </section>
  );
}
