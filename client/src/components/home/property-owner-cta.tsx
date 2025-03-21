import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PropertyOwnerCTA() {
  return (
    <section className="py-8 border-b">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4 mt-14">
            <div className="border-t border-gray-300 flex-grow w-1/5"></div>
            <h2 className="text-xl font-medium text-gray-900 mx-4">
              Are you a Seller?
            </h2>
            <div className="border-t border-gray-300 flex-grow w-1/5"></div>
          </div>
          <Button
            asChild
            variant="primary"
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Link href="/post-property-free" onClick={() => window.scrollTo(0, 0)}>Post Free Property Ad</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
