import { useState } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { insertPropertySchema, propertyTypes } from '@shared/schema';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, Upload, Home, Check } from 'lucide-react';
import FileUpload, { FileWithPreview } from '@/components/upload/file-upload';
import SubscriptionSelector, { SubscriptionLevel } from '@/components/property/subscription-selector';

// Extend the insert schema with additional validation and fields
const addPropertyFormSchema = insertPropertySchema.extend({
  imageUrlsInput: z.string().optional(),
  subscriptionLevel: z.enum(['free', 'paid', 'premium']).default('free'),
}).omit({ imageUrls: true, userId: true });

type FormValues = z.infer<typeof addPropertyFormSchema>;

export default function AddProperty() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [subscriptionLevel, setSubscriptionLevel] = useState<SubscriptionLevel>('free');

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(addPropertyFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      location: '',
      city: '',
      address: '',
      propertyType: 'apartment',
      bedrooms: undefined,
      bathrooms: undefined,
      area: undefined,
      featured: false,
      imageUrlsInput: '',
      subscriptionLevel: 'free',
    },
  });

  // Handle form submission and API call
  const propertyMutation = useMutation({
    mutationFn: async (propertyData: any) => {
      // Process the imageUrls from comma-separated string to array
      if (propertyData.imageUrlsInput) {
        const imageUrls = propertyData.imageUrlsInput
          .split(',')
          .map((url: string) => url.trim())
          .filter((url: string) => url.length > 0);
        
        propertyData.imageUrls = imageUrls.length > 0 ? imageUrls : undefined;
        delete propertyData.imageUrlsInput;
      }

      const res = await apiRequest("POST", "/api/properties", {
        ...propertyData,
        userId: user?.id,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/properties'] });
      
      toast({
        title: "Property listed successfully",
        description: "Your property has been added to our listings.",
      });
      
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add property",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    propertyMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Property</h1>
            <p className="text-gray-600">
              Fill in the details below to list your property directly to potential buyers without broker fees.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                  <CardDescription>
                    Provide accurate information to attract serious buyers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Luxury 3BHK Apartment in Whitefield" {...field} />
                              </FormControl>
                              <FormDescription>
                                A clear title helps buyers find your property
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="propertyType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Property Type</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select property type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {propertyTypes.map(type => (
                                      <SelectItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price (₹)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="e.g. 7500000" 
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Enter the price in rupees (without commas)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your property, include important features, amenities, and why it's a good investment" 
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Separator className="my-6" />
                        <h3 className="text-lg font-semibold mb-4">Location Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Bangalore" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Area/Locality</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Whitefield" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Address</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter the complete address of the property" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Separator className="my-6" />
                        <h3 className="text-lg font-semibold mb-4">Property Specifications</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bedrooms</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="e.g. 3" 
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="bathrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bathrooms</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="e.g. 2" 
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="area"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Area (sq.ft)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="e.g. 1200" 
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Separator className="my-6" />
                        <h3 className="text-lg font-semibold mb-4">Property Images</h3>

                        <FormField
                          control={form.control}
                          name="imageUrlsInput"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URLs</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter image URLs separated by commas" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Add URLs to your property images, separated by commas
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="bg-gray-50 p-4 rounded-lg mt-2">
                          <div className="flex items-start">
                            <Upload className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-gray-900">Don't have image URLs?</h4>
                              <p className="text-sm text-gray-600">
                                You can use image hosting services like Imgur, Cloudinary, or ImgBB to upload your images, 
                                then paste the direct image links above.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'List My Property'
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card className="bg-primary text-white">
                  <CardHeader>
                    <CardTitle>Listing Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 bg-white bg-opacity-20 p-1 rounded-md mr-2">
                          <Check className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold">No Broker Commission</h4>
                          <p className="text-sm text-blue-100">Save up to 3% in brokerage fees</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 bg-white bg-opacity-20 p-1 rounded-md mr-2">
                          <Check className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Direct Buyer Contact</h4>
                          <p className="text-sm text-blue-100">Communicate without middlemen</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 bg-white bg-opacity-20 p-1 rounded-md mr-2">
                          <Check className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Listing Visibility</h4>
                          <p className="text-sm text-blue-100">Reach thousands of genuine buyers</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tips for Faster Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-primary">
                          <span className="text-xs font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Add Quality Photos</h4>
                          <p className="text-sm text-gray-600">Properties with good photos sell 32% faster</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-primary">
                          <span className="text-xs font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Be Descriptive</h4>
                          <p className="text-sm text-gray-600">Include all relevant details and unique selling points</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-primary">
                          <span className="text-xs font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Set the Right Price</h4>
                          <p className="text-sm text-gray-600">Research market rates in your area for faster conversions</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Home className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Need assistance?</h3>
                        <p className="text-sm text-gray-600">Our property experts can help</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Having trouble listing your property or need professional advice? Our team is here to help.
                    </p>
                    <Button variant="outline" className="w-full">
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
