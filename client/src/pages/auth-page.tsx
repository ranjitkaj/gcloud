import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertUserSchema, verificationMethods } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Import our custom verification components
import OTPVerification from '@/components/auth/otp-verification';
import VerificationMethodSelector from '@/components/auth/verification-method-selector';

// Extend the insert schema with additional validation
const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [location, navigate] = useWouterNavigate();
  const { user, login, signup, isLoading } = useAuth();
  const { toast } = useToast();

  // Track the registration flow state
  const [registrationState, setRegistrationState] = useState<'form' | 'verification-method' | 'verification'>('form');
  const [selectedVerificationMethod, setSelectedVerificationMethod] = useState<'email' | 'whatsapp' | 'sms'>('email');
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      name: '',
      email: '',
      phone: '',
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoginLoading(true);
      setAuthError(null);
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      setAuthError('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      setIsRegisterLoading(true);
      setAuthError(null);
      
      // Remove confirmPassword as it's not in the API schema
      const { confirmPassword, ...registerData } = data;
      
      // If phone is provided, show verification method selection
      if (data.phone) {
        setRegisteredUser({
          ...registerData,
          id: -1, // Temporary ID until user is created
        });
        setRegistrationState('verification-method');
      } else {
        // No phone provided, use email verification directly
        await signupWithVerification(registerData, 'email');
      }
    } catch (error) {
      setAuthError('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsRegisterLoading(false);
    }
  };
  
  const signupWithVerification = async (userData: any, verificationMethod: 'email' | 'whatsapp' | 'sms') => {
    try {
      setIsRegisterLoading(true);
      
      // Add verification method to the request
      const response = await signup({
        ...userData,
        verificationMethod
      });
      
      // Store the registered user for the verification step
      setRegisteredUser(response);
      setSelectedVerificationMethod(verificationMethod);
      
      // Show OTP verification UI
      setRegistrationState('verification');
      
      // Show toast for OTP sent
      const recipient = verificationMethod === 'email' ? userData.email : userData.phone;
      toast({
        title: 'Verification required',
        description: `A verification code has been sent to ${recipient}`,
      });
    } catch (error) {
      console.error('Registration error:', error);
      setAuthError('Registration failed. Please try again.');
      // Go back to form on error
      setRegistrationState('form');
    } finally {
      setIsRegisterLoading(false);
    }
  };
  
  const handleVerificationMethodSelected = (method: 'email' | 'whatsapp' | 'sms') => {
    setSelectedVerificationMethod(method);
    signupWithVerification(registeredUser, method);
  };
  
  const handleVerificationCompleted = () => {
    toast({
      title: 'Account verified',
      description: 'Your account has been verified successfully.',
    });
    navigate('/dashboard');
  };
  
  const handleVerificationCancelled = () => {
    setRegistrationState('form');
    setRegisteredUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 max-w-md mx-auto md:mx-0">
              {registrationState === 'verification-method' && registeredUser ? (
                <VerificationMethodSelector
                  email={registeredUser.email}
                  phone={registeredUser.phone}
                  onMethodSelected={handleVerificationMethodSelected}
                  onCancel={handleVerificationCancelled}
                />
              ) : registrationState === 'verification' && registeredUser ? (
                <OTPVerification
                  userId={registeredUser.id}
                  email={registeredUser.email}
                  phone={registeredUser.phone}
                  type={selectedVerificationMethod}
                  onVerified={handleVerificationCompleted}
                  onCancel={handleVerificationCancelled}
                />
              ) : (
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <Card>
                      <CardHeader>
                        <CardTitle>Login to your account</CardTitle>
                        <CardDescription>
                          Enter your username and password to access your account
                        </CardDescription>
                      </CardHeader>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input 
                              id="username" 
                              {...loginForm.register('username')} 
                              placeholder="Enter your username" 
                            />
                            {loginForm.formState.errors.username && (
                              <p className="text-sm text-red-500">{loginForm.formState.errors.username.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                              id="password" 
                              type="password" 
                              {...loginForm.register('password')} 
                              placeholder="Enter your password" 
                            />
                            {loginForm.formState.errors.password && (
                              <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            type="submit" 
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={isLoginLoading}
                          >
                            {isLoginLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                              </>
                            ) : (
                              'Login'
                            )}
                          </Button>
                        </CardFooter>
                      </form>
                    </Card>
                  </TabsContent>

                  <TabsContent value="register">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create an account</CardTitle>
                        <CardDescription>
                          Enter your details to create a new account
                        </CardDescription>
                      </CardHeader>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="reg-name">Full Name</Label>
                            <Input 
                              id="reg-name" 
                              {...registerForm.register('name')} 
                              placeholder="Enter your full name" 
                            />
                            {registerForm.formState.errors.name && (
                              <p className="text-sm text-red-500">{registerForm.formState.errors.name.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-email">Email</Label>
                            <Input 
                              id="reg-email" 
                              type="email" 
                              {...registerForm.register('email')} 
                              placeholder="Enter your email address" 
                            />
                            {registerForm.formState.errors.email && (
                              <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-phone">Phone Number (Optional)</Label>
                            <Input 
                              id="reg-phone" 
                              {...registerForm.register('phone')} 
                              placeholder="Enter your phone number" 
                            />
                            {registerForm.formState.errors.phone && (
                              <p className="text-sm text-red-500">{registerForm.formState.errors.phone.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-username">Username</Label>
                            <Input 
                              id="reg-username" 
                              {...registerForm.register('username')} 
                              placeholder="Create a username" 
                            />
                            {registerForm.formState.errors.username && (
                              <p className="text-sm text-red-500">{registerForm.formState.errors.username.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-password">Password</Label>
                            <Input 
                              id="reg-password" 
                              type="password" 
                              {...registerForm.register('password')}
                              placeholder="Create a password" 
                            />
                            {registerForm.formState.errors.password && (
                              <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                            <Input 
                              id="reg-confirm-password" 
                              type="password" 
                              {...registerForm.register('confirmPassword')} 
                              placeholder="Confirm your password" 
                            />
                            {registerForm.formState.errors.confirmPassword && (
                              <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            type="submit" 
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={isRegisterLoading}
                          >
                            {isRegisterLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                              </>
                            ) : (
                              'Register'
                            )}
                          </Button>
                        </CardFooter>
                      </form>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>

            <div className="w-full md:w-1/2 p-6 hidden md:block">
              <div className="bg-gradient-to-br from-primary to-primary-700 rounded-xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">Welcome to HomeDirectly</h2>
                <p className="text-lg mb-6">India's leading platform for direct property transactions without broker commissions.</p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white bg-opacity-20 p-1 rounded-md mr-3">
                      <i className="ri-check-line"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold">Save Money</h3>
                      <p className="text-blue-100">No broker commission means better deals</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white bg-opacity-20 p-1 rounded-md mr-3">
                      <i className="ri-check-line"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold">Direct Communication</h3>
                      <p className="text-blue-100">Connect directly with property owners or buyers</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white bg-opacity-20 p-1 rounded-md mr-3">
                      <i className="ri-check-line"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold">Verified Listings</h3>
                      <p className="text-blue-100">All properties are verified for authenticity</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm">Join thousands of users who trust HomeDirectly</p>
                  <div className="flex justify-center mt-4 space-x-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-sm">
                      +10K
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}