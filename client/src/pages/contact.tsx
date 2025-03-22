import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  Building,
  CheckCircle2,
  Sparkles,
  Smartphone,
} from "lucide-react";

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup with validation
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      // Send the form data to the server
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const result = await response.json();

      // Show success message
      toast({
        title: "Message Sent",
        description:
          "We've received your message and will get back to you shortly.",
        variant: "default",
      });

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description:
          "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contact Us
              </h1>
              <p className="text-lg text-gray-600">
                We're here to help you with any questions about properties,
                listing process, or our services. Reach out to our team and
                we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Our Office</h3>
                </div>
                <p className="text-gray-600 mb-2">
                  #301, Madhavaram Towers, Kukatpally Y Junction,
                </p>
                <p className="text-gray-600 mb-2"> Moosapet, Hyderabad</p>
                <p className="text-gray-600">Telangana, India - 500018</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Email Us</h3>
                </div>
                <p className="text-gray-600 mb-2">General Inquiries:</p>
                <p className="text-primary font-medium mb-3">
                  contact@urgentsales.in
                </p>
                <p className="text-gray-600 mb-2">Support:</p>
                <p className="text-primary font-medium">
                  contact@urgentsales.in
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Call Us</h3>
                </div>
                <p className="text-gray-600 mb-2">Customer Support:</p>
                <p className="text-primary font-medium mb-3">+91 99512 11555</p>
                <p className="text-gray-600 mb-2">Property Assistance:</p>
                <p className="text-primary font-medium">+91 99512 11555</p>
              </div>
            </div>
          </div>
        </section>

        {/* Urgency Sales Contact Information */}
        <section className="py-12 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Clock className="h-4 w-4" />
                <span>Priority Support</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Urgency Sales Contact</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Need to sell your property quickly? Our Urgency Sales team is
                here to help you list and sell your property with our special
                25% off program.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <Badge className="bg-red-600 text-white mr-3">
                      <Sparkles className="h-3 w-3 mr-1" />
                    </Badge>
                    <h3 className="text-xl font-semibold">
                      Dedicated Urgency Sales Support
                    </h3>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Urgency Sales Hotline</p>
                        <p className="text-gray-600">+91 99512 11555</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Urgent Inquiries</p>
                        <p className="text-gray-600">contact@urgentsales.in</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">WhatsApp Support</p>
                        <p className="text-gray-600">+91 99512 11555</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Extended Hours</p>
                        <p className="text-gray-600">
                          9AM - 9PM, 7 days a week
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="font-semibold mb-3">
                      Urgency Sales Benefits:
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        <span>
                          Priority listing verification (24 hour turnaround)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        <span>Featured placement in Urgency Sales section</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        <span>
                          Dedicated sales representative for your property
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-100 p-8">
                  <img
                    src="https://images.unsplash.com/photo-1553531384-397c80973a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Urgency Sales Team"
                    className="rounded-lg shadow-md mb-6 w-full h-48 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-4">
                    Schedule an Urgency Consultation
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our Urgency Sales specialists will guide you through the
                    entire process of listing, marketing, and selling your
                    property within your desired timeframe.
                  </p>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => (window.location.href = "tel:+919951211555")}
                  >
                    Book Consultation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
                <p className="text-gray-600">
                  Have a question or need assistance? Fill out the form below
                  and our team will get back to you as soon as possible.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 md:p-8 shadow-sm">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Full Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                required
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Email Address{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="urgentsale.in@gmail.com"
                                required
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Phone Number{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+91 1234567894"
                                required
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Subject <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Property Inquiry"
                                required
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Message <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us how we can help you..."
                              className="min-h-32 resize-none"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full md:w-auto bg-primary text-white"
                      disabled={isSubmitting}
                      onClick={() => {
                        window.location.href = "mailto:contact@urgentsales.in";
                      }}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </section>

        {/* Business Hours */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold">Business Hours</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="border-t border-gray-200"></div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="border-t border-gray-200"></div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Sunday</span>
                      <span>Closed</span>
                    </div>
                    <div className="border-t border-gray-200"></div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Urgency Sales Support</span>
                      <span className="text-red-600">
                        9:00 AM - 9:00 PM (Daily)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold">Download Our App</h3>
                  </div>

                  <p className="text-gray-600 mb-6">
                    Get instant property alerts, chat with agents, and browse
                    listings on the go with our mobile app.
                  </p>

                  <div className="flex space-x-4">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
                      alt="Get it on Google Play"
                      className="h-10"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png"
                      alt="Download on App Store"
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
