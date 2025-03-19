import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Property, User } from '@shared/schema';
import { AlertCircle, CheckCircle2, XCircle, Search, Database, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [rejectionReason, setRejectionReason] = React.useState<{ [key: number]: string }>({});
  const [searchTerm, setSearchTerm] = React.useState('');

  // Redirect if not admin
  React.useEffect(() => {
    if (user && user.role !== 'admin') {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You do not have permission to access this page.',
      });
      navigate('/');
    }
  }, [user, navigate, toast]);

  // Fetch pending properties
  const { data: pendingProperties, isLoading: pendingLoading, refetch: refetchPending } = useQuery({
    queryKey: ['/api/properties/pending'],
    enabled: !!user && user.role === 'admin',
  });

  // Fetch all properties
  const { data: allProperties, isLoading: allLoading } = useQuery({
    queryKey: ['/api/properties/all'],
    enabled: !!user && user.role === 'admin',
  });

  // Filter properties based on search term
  const filteredProperties = React.useMemo(() => {
    if (!allProperties) return [];
    
    return allProperties.filter((property: Property) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        property.title?.toLowerCase().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower) ||
        property.location?.toLowerCase().includes(searchLower) ||
        property.city?.toLowerCase().includes(searchLower) ||
        property.address?.toLowerCase().includes(searchLower) ||
        property.propertyType?.toLowerCase().includes(searchLower)
      );
    });
  }, [allProperties, searchTerm]);

  // Approve property
  const handleApprove = async (propertyId: number) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user?.id,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Property Approved',
          description: 'The property has been approved and is now published.',
        });
        refetchPending();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve property');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'An error occurred while approving the property',
      });
    }
  };

  // Reject property
  const handleReject = async (propertyId: number) => {
    try {
      if (!rejectionReason[propertyId] || rejectionReason[propertyId].trim() === '') {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please provide a reason for rejection',
        });
        return;
      }

      const response = await fetch(`/api/properties/${propertyId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: user?.id,
          rejectionReason: rejectionReason[propertyId],
        }),
      });

      if (response.ok) {
        toast({
          title: 'Property Rejected',
          description: 'The property has been rejected.',
        });
        setRejectionReason({ ...rejectionReason, [propertyId]: '' });
        refetchPending();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject property');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'An error occurred while rejecting the property',
      });
    }
  };

  if (!user) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (user.role !== 'admin') {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            Pending Approvals
            {pendingProperties?.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingProperties.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Properties Pending Approval</CardTitle>
                <CardDescription>
                  Review and approve or reject property listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : pendingProperties?.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No properties pending approval
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingProperties?.map((property: Property) => (
                      <div key={property.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{property.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              ID: {property.id} • Type: {property.propertyType} • 
                              Price: ₹{property.price?.toLocaleString()} • 
                              Location: {property.city}, {property.location}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium">Bedrooms</p>
                                <p>{property.bedrooms || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Bathrooms</p>
                                <p>{property.bathrooms || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Area</p>
                                <p>{property.area} sq.ft.</p>
                              </div>
                            </div>
                            
                            <p className="text-sm mb-4">{property.description?.substring(0, 150)}...</p>
                            
                            {property.imageUrls && property.imageUrls.length > 0 && (
                              <div className="flex space-x-2 mb-4 overflow-x-auto">
                                {property.imageUrls.map((url, index) => (
                                  <img 
                                    key={index} 
                                    src={url} 
                                    alt={`Property ${index + 1}`} 
                                    className="h-20 w-20 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor={`rejection-${property.id}`} className="block text-sm font-medium mb-1">
                              Rejection Reason (required if rejecting)
                            </label>
                            <Textarea
                              id={`rejection-${property.id}`}
                              placeholder="Provide reason for rejection"
                              value={rejectionReason[property.id] || ''}
                              onChange={(e) => 
                                setRejectionReason({
                                  ...rejectionReason,
                                  [property.id]: e.target.value,
                                })
                              }
                              className="w-full"
                            />
                          </div>
                          
                          <div className="flex space-x-3">
                            <Button 
                              onClick={() => handleApprove(property.id)}
                              className="flex-1"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => handleReject(property.id)}
                              className="flex-1"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Properties</CardTitle>
              <CardDescription>View and manage all properties</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {allLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No properties found
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProperties.map((property: Property) => (
                    <div key={property.id} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{property.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {property.id} • Price: ₹{property.price?.toLocaleString()} • 
                            {property.bedrooms && `${property.bedrooms} bed`} • 
                            {property.area && `${property.area} sq.ft.`}
                          </p>
                        </div>
                        <div>
                          {property.approvalStatus === 'pending' && (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              Pending
                            </Badge>
                          )}
                          {property.approvalStatus === 'approved' && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              Approved
                            </Badge>
                          )}
                          {property.approvalStatus === 'rejected' && (
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                              Rejected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-muted-foreground">
                User management coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}