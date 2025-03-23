import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Property } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FileUpload, { FileWithPreview } from '@/components/upload/file-upload';
import {
  Bed,
  Droplet,
  Ruler,
  Home,
  PlusCircle,
  Settings,
  User,
  ListFilter,
  Search,
  Loader2,
  Edit,
  Eye,
  Trash2,
  AlertCircle,
  Bookmark,
  Heart,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('properties');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user properties
  const { 
    data: properties, 
    isLoading, 
    isError,
    refetch
  } = useQuery<Property[]>({
    queryKey: ['/api/user/properties'],
  });
  
  // Fetch saved properties
  const {
    data: savedProperties,
    isLoading: isSavedPropertiesLoading,
    isError: isSavedPropertiesError,
    refetch: refetchSavedProperties
  } = useQuery<Property[]>({
    queryKey: ['/api/user/saved'],
  });

  // Format the price in Indian currency format
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(0)} Lac`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  // Demo delete mutation (would connect to a real endpoint in production)
  const deleteMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      // This would be the real endpoint in production
      // await apiRequest(`/api/properties/${propertyId}`, "DELETE");
      
      // For now we'll just simulate success
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/properties'] });
      refetch();
      
      toast({
        title: "Property deleted",
        description: "The property has been removed from your listings",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting property",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Unsave property mutation 
  const unsaveMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      await apiRequest({
        url: `/api/properties/${propertyId}/save`,
        method: "DELETE"
      });
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/saved'] });
      refetchSavedProperties();
      
      toast({
        title: "Property unsaved",
        description: "The property has been removed from your saved list",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error removing saved property",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Placeholder function for delete confirmation
  const handleDeleteProperty = (propertyId: number) => {
    if (confirm("Are you sure you want to delete this property?")) {
      deleteMutation.mutate(propertyId);
    }
  };
  
  // Function to handle unsaving properties
  const handleUnsaveProperty = (propertyId: number) => {
    unsaveMutation.mutate(propertyId);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your property listings and account settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-0">
                  <div className="p-6 border-b">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                          <img 
                            src={profileImage} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button 
                      className={`w-full text-left px-6 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${activeTab === 'properties' ? 'text-primary font-medium' : 'text-gray-700'}`}
                      onClick={() => setActiveTab('properties')}
                    >
                      <Home className="h-5 w-5" />
                      <span>My Properties</span>
                    </button>
                    <button 
                      className={`w-full text-left px-6 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${activeTab === 'saved' ? 'text-primary font-medium' : 'text-gray-700'}`}
                      onClick={() => setActiveTab('saved')}
                    >
                      <Bookmark className="h-5 w-5" />
                      <span>Saved Properties</span>
                    </button>
                    <button 
                      className={`w-full text-left px-6 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${activeTab === 'account' ? 'text-primary font-medium' : 'text-gray-700'}`}
                      onClick={() => setActiveTab('account')}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Account Settings</span>
                    </button>
                  </div>
                  <div className="p-6 border-t">
                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link href="/add-property">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        <span>Add New Property</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Properties</span>
                      <span className="font-semibold">
                        {isLoading ? <Skeleton className="h-4 w-10" /> : (properties && properties.length) || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Featured Properties</span>
                      <span className="font-semibold">
                        {isLoading ? 
                          <Skeleton className="h-4 w-10" /> : 
                          (properties && properties.filter(p => p.featured).length) || 0
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Saved Properties</span>
                      <span className="font-semibold">
                        {isSavedPropertiesLoading ? 
                          <Skeleton className="h-4 w-10" /> : 
                          (savedProperties && savedProperties.length) || 0
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Account Status</span>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="properties">My Properties</TabsTrigger>
                  <TabsTrigger value="saved">Saved Properties</TabsTrigger>
                  <TabsTrigger value="account">Account Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="properties">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <CardTitle>Your Property Listings</CardTitle>
                          <CardDescription>
                            Manage your real estate listings
                          </CardDescription>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-2">
                          <Button variant="outline" size="sm" className="text-gray-600">
                            <ListFilter className="h-4 w-4 mr-2" />
                            <span>Filter</span>
                          </Button>
                          <Button variant="outline" size="sm" className="text-gray-600">
                            <Search className="h-4 w-4 mr-2" />
                            <span>Search</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        // Loading skeletons
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="border rounded-lg p-4">
                              <div className="flex flex-col md:flex-row gap-4">
                                <Skeleton className="h-24 w-32 rounded-md" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-6 w-2/3" />
                                  <Skeleton className="h-4 w-1/3" />
                                  <div className="flex gap-4">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-16" />
                                  </div>
                                </div>
                                <div className="flex md:flex-col gap-2 mt-2 md:mt-0">
                                  <Skeleton className="h-8 w-20" />
                                  <Skeleton className="h-8 w-20" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : isError ? (
                        <div className="text-center py-8">
                          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Error Loading Properties</h3>
                          <p className="text-gray-600 mb-4">There was a problem loading your properties.</p>
                          <Button onClick={() => refetch()}>Try Again</Button>
                        </div>
                      ) : properties && properties.length > 0 ? (
                        <div className="space-y-4">
                          {properties.map((property) => (
                            <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex flex-col md:flex-row gap-4">
                                <div className="w-full md:w-32 h-24 bg-gray-100 rounded-md overflow-hidden">
                                  <img 
                                    src={property.imageUrls?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'} 
                                    alt={property.title} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-1">
                                    {property.title}
                                    {property.featured && (
                                      <Badge className="ml-2 bg-primary">Featured</Badge>
                                    )}
                                  </h3>
                                  <p className="text-gray-600 text-sm mb-2">{property.location}, {property.city}</p>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    {property.bedrooms && (
                                      <div className="flex items-center">
                                        <Bed className="h-4 w-4 mr-1" />
                                        <span>{property.bedrooms} Beds</span>
                                      </div>
                                    )}
                                    {property.bathrooms && (
                                      <div className="flex items-center">
                                        <Droplet className="h-4 w-4 mr-1" />
                                        <span>{property.bathrooms} Baths</span>
                                      </div>
                                    )}
                                    <div className="flex items-center">
                                      <Ruler className="h-4 w-4 mr-1" />
                                      <span>{property.area} sq.ft</span>
                                    </div>
                                    <div className="font-medium text-primary">
                                      {formatPrice(property.price)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex md:flex-col gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-gray-600"
                                    onClick={() => navigate(`/property/${property.id}`)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    <span>View</span>
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-blue-600"
                                    onClick={() => navigate(`/edit-property/${property.id}`)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    <span>Edit</span>
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-red-600"
                                    onClick={() => handleDeleteProperty(property.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    <span>Delete</span>
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-2 pt-2 border-t text-xs text-gray-500 flex justify-between">
                                <span>Listed {property.createdAt ? formatDistanceToNow(new Date(property.createdAt), { addSuffix: true }) : 'recently'}</span>
                                <span>ID: #{property.id}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-100 rounded-full text-gray-500">
                            <Home className="h-8 w-8" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">No Properties Listed Yet</h3>
                          <p className="text-gray-600 mb-6">Get started by adding your first property listing</p>
                          <Button asChild>
                            <Link href="/add-property">
                              <PlusCircle className="h-4 w-4 mr-2" />
                              <span>Add New Property</span>
                            </Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="saved">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <CardTitle>Saved Properties</CardTitle>
                          <CardDescription>
                            Properties you've saved for future reference
                          </CardDescription>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-2">
                          <Button variant="outline" size="sm" className="text-gray-600">
                            <ListFilter className="h-4 w-4 mr-2" />
                            <span>Filter</span>
                          </Button>
                          <Button variant="outline" size="sm" className="text-gray-600">
                            <Search className="h-4 w-4 mr-2" />
                            <span>Search</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isSavedPropertiesLoading ? (
                        // Loading skeletons
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="border rounded-lg p-4">
                              <div className="flex flex-col md:flex-row gap-4">
                                <Skeleton className="h-24 w-32 rounded-md" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-6 w-2/3" />
                                  <Skeleton className="h-4 w-1/3" />
                                  <div className="flex gap-4">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-16" />
                                  </div>
                                </div>
                                <div className="flex md:flex-col gap-2 mt-2 md:mt-0">
                                  <Skeleton className="h-8 w-20" />
                                  <Skeleton className="h-8 w-20" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : isSavedPropertiesError ? (
                        <div className="text-center py-8">
                          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Error Loading Saved Properties</h3>
                          <p className="text-gray-600 mb-4">There was a problem loading your saved properties.</p>
                          <Button onClick={() => refetchSavedProperties()}>Try Again</Button>
                        </div>
                      ) : savedProperties && savedProperties.length > 0 ? (
                        <div className="space-y-4">
                          {savedProperties.map((property) => (
                            <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex flex-col md:flex-row gap-4">
                                <div className="w-full md:w-32 h-24 bg-gray-100 rounded-md overflow-hidden">
                                  <img 
                                    src={property.imageUrls?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'} 
                                    alt={property.title} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-1">
                                    {property.title}
                                    {property.premium && (
                                      <Badge className="ml-2 bg-yellow-500">Premium</Badge>
                                    )}
                                  </h3>
                                  <p className="text-gray-600 text-sm mb-2">{property.location}, {property.city}</p>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    {property.bedrooms && (
                                      <div className="flex items-center">
                                        <Bed className="h-4 w-4 mr-1" />
                                        <span>{property.bedrooms} Beds</span>
                                      </div>
                                    )}
                                    {property.bathrooms && (
                                      <div className="flex items-center">
                                        <Droplet className="h-4 w-4 mr-1" />
                                        <span>{property.bathrooms} Baths</span>
                                      </div>
                                    )}
                                    <div className="flex items-center">
                                      <Ruler className="h-4 w-4 mr-1" />
                                      <span>{property.area} sq.ft</span>
                                    </div>
                                    <div className="font-medium text-primary">
                                      {formatPrice(property.price)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex md:flex-col gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-gray-600"
                                    onClick={() => navigate(`/property/${property.id}`)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    <span>View</span>
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-red-600"
                                    onClick={() => handleUnsaveProperty(property.id)}
                                  >
                                    <Heart className="h-4 w-4 mr-2 fill-current" />
                                    <span>Unsave</span>
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-2 pt-2 border-t text-xs text-gray-500 flex justify-between">
                                <span>{property.propertyType} · {property.rentOrSale}</span>
                                <span>ID: #{property.id}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-100 rounded-full text-gray-500">
                            <Bookmark className="h-8 w-8" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">No Saved Properties Yet</h3>
                          <p className="text-gray-600 mb-6">Start browsing properties and save your favorites</p>
                          <Button asChild>
                            <Link href="/properties-page">
                              <Search className="h-4 w-4 mr-2" />
                              <span>Browse Properties</span>
                            </Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your personal information and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Profile Image Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Profile Image</h3>
                          <div className="flex items-start gap-6">
                            <div className="relative">
                              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
                                {profileImage ? (
                                  <img 
                                    src={profileImage} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="h-16 w-16 text-gray-400" />
                                )}
                              </div>
                              <button 
                                className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Camera className="h-4 w-4" />
                              </button>
                              <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      setProfileImage(event.target?.result as string);
                                      toast({
                                        title: "Profile image updated",
                                        description: "Your profile image has been updated successfully",
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">Upload Profile Picture</h4>
                              <p className="text-sm text-gray-500 mb-3">
                                Add a profile photo to personalize your account. 
                                This will be visible to other users on the platform.
                              </p>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  <span>Upload Image</span>
                                </Button>
                                {profileImage && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-red-600"
                                    onClick={() => {
                                      setProfileImage(null);
                                      toast({
                                        title: "Profile image removed",
                                        description: "Your profile image has been removed",
                                      });
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    <span>Remove</span>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Personal Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">Full Name</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                                value={user.name}
                                readOnly
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">Username</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                                value={user.username}
                                readOnly
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">Email Address</label>
                              <input 
                                type="email" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                                value={user.email}
                                readOnly
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">Phone Number</label>
                              <input 
                                type="tel" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                                placeholder="Phone number not available"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Change Password</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">Current Password</label>
                              <input 
                                type="password" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                                placeholder="Enter current password"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">New Password</label>
                              <input 
                                type="password" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                                placeholder="Enter new password"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Notification Preferences</h3>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id="email-notifications" 
                                className="h-4 w-4 text-primary"
                                defaultChecked
                              />
                              <label htmlFor="email-notifications" className="ml-2 text-sm text-gray-700">
                                Email notifications for new property inquiries
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id="sms-notifications" 
                                className="h-4 w-4 text-primary"
                              />
                              <label htmlFor="sms-notifications" className="ml-2 text-sm text-gray-700">
                                SMS notifications for urgent updates
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id="marketing-notifications" 
                                className="h-4 w-4 text-primary"
                                defaultChecked
                              />
                              <label htmlFor="marketing-notifications" className="ml-2 text-sm text-gray-700">
                                Marketing communications and offers
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Cancel</Button>
                      <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
