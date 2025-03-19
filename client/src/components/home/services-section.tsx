import React from 'react';
import { Building, Home, Search, Key, Shield, HandHelping, DollarSign, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-t-4 border-t-blue-500">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="mb-4 bg-blue-100 p-3 rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default function ServicesSection() {
  const services = [
    {
      icon: <Building className="h-8 w-8 text-blue-500" />,
      title: "Property Management",
      description: "Professional management services for landlords and property owners"
    },
    {
      icon: <Search className="h-8 w-8 text-blue-500" />,
      title: "Property Search",
      description: "Find your dream property with our advanced search engine"
    },
    {
      icon: <Home className="h-8 w-8 text-blue-500" />,
      title: "Home Valuation",
      description: "Get an accurate estimate of your property's market value"
    },
    {
      icon: <Key className="h-8 w-8 text-blue-500" />,
      title: "Rental Services",
      description: "Comprehensive rental solutions for tenants and landlords"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Legal Assistance",
      description: "Expert legal advice for real estate transactions"
    },
    {
      icon: <HandHelping className="h-8 w-8 text-blue-500" />,
      title: "Consultant Services",
      description: "Professional guidance for property investment decisions"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-blue-500" />,
      title: "Financial Planning",
      description: "Mortgage advice and financial planning for property buyers"
    },
    {
      icon: <Settings className="h-8 w-8 text-blue-500" />,
      title: "Renovation Services",
      description: "Trusted renovation and property improvement services"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of real estate services designed to make your property journey smooth and successful.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}