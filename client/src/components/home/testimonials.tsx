interface Testimonial {
  id: number;
  content: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  avatar: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      content: "I saved over ₹4 lakhs in broker commission when selling my apartment. The platform connected me directly with serious buyers, and the entire process was smooth.",
      name: "Rajesh Sharma",
      role: "Property Seller",
      location: "Mumbai",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      content: "As a first-time buyer, I was nervous about dealing directly with owners. But the platform made it easy with helpful guides and support. Found my dream home within a month!",
      name: "Priya Patel",
      role: "Property Buyer",
      location: "Bangalore",
      rating: 4.5,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      content: "I had tried traditional brokers for months without luck. Listed my property here and got three serious inquiries in just a week. Sold at a better price than expected!",
      name: "Vikram Singh",
      role: "Property Seller",
      location: "Delhi",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="ri-star-fill"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-fill"></i>);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="ri-star-line"></i>);
    }

    return stars;
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 text-lg">Real success stories from people who saved time and money</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="text-amber-400 flex">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
