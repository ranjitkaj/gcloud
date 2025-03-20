
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PropertyOwnerCTA() {
  return (
    <section className="py-8 border-b">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Are you a Property Owner?</h2>
          <Button asChild variant="primary" size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/post-property-free">
              Post Free Property Ad
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
