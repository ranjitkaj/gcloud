import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertUserSchema,
  verificationMethods,
  userRoles,
} from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Loader2, Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import our custom verification components
import OTPVerification from "@/components/auth/otp-verification";
import VerificationMethodSelector from "@/components/auth/verification-method-selector";

// Extend the insert schema with additional validation
const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = insertUserSchema
  .extend({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    role: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [_, setLocation] = useLocation();
  const { user, login, signup, isLoading } = useAuth();
  const { toast } = useToast();

  // Helper function to navigate with wouter
  const navigate = (path: string) => setLocation(path);

  // Track the registration flow state
  const [registrationState, setRegistrationState] = useState<
    "form" | "verification-method" | "verification"
  >("form");
  const [selectedVerificationMethod, setSelectedVerificationMethod] = useState<
    "email" | "whatsapp" | "sms"
  >("email");
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
      phone: "",
      role: "user",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
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

      // Success toast
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      });

      // Create property recommendation notification
      try {
        await fetch("/api/notifications/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Property Recommendations",
            message:
              "We have some new property recommendations based on your preferences",
            type: "property",
            linkTo: "/",
          }),
        });
      } catch (notifError) {
        console.error("Failed to create notification:", notifError);
      }

      // Navigate to homepage instead of dashboard
      navigate("/");
    } catch (error) {
      setAuthError("Login failed. Please check your credentials.");
      console.error("Login error:", error);

      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
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
        });
        setRegistrationState("verification-method");
      } else {
        // No phone provided, use email verification directly
        await signupWithVerification(registerData, "email");
      }
    } catch (error) {
      setAuthError("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const signupWithVerification = async (
    userData: any,
    verificationMethod: "email" | "whatsapp" | "sms",
  ) => {
    try {
      setIsRegisterLoading(true);

      // Add verification method to the request
      const response = await signup({
        ...userData,
        verificationMethod,
      });

      // Store the registered user for the verification step
      setRegisteredUser(response);
      setSelectedVerificationMethod(verificationMethod);

      // Show OTP verification UI
      setRegistrationState("verification");

      // Show toast for OTP sent
      const recipient =
        verificationMethod === "email" ? userData.email : userData.phone;
      toast({
        title: "Verification required",
        description: `A verification code has been sent to ${recipient}`,
      });
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError("Registration failed. Please try again.");
      // Go back to form on error
      setRegistrationState("form");
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const handleVerificationMethodSelected = (
    method: "email" | "whatsapp" | "sms",
  ) => {
    setSelectedVerificationMethod(method);
    signupWithVerification(registeredUser, method);
  };

  const handleVerificationCompleted = async () => {
    // First notify the user of successful verification
    toast({
      title: "Account verified",
      description: "Your account has been verified successfully.",
    });

    // Try to create recommendation notification
    try {
      await fetch("/api/notifications/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Welcome to Urgent Sales",
          message:
            "Check out personalized property recommendations based on your preferences",
          type: "system",
          linkTo: "/",
        }),
      });

      // Refresh user data to ensure we have the latest verification status
      try {
        const userResponse = await fetch("/api/user");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          // Force reload the page to update all components with the new user state
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
          return;
        }
      } catch (refreshError) {
        console.error("Error refreshing user data:", refreshError);
      }
    } catch (error) {
      console.error("Failed to create notification:", error);
    }

    // Redirect to homepage even if notification creation fails
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleVerificationCancelled = () => {
    setRegistrationState("form");
    setRegisteredUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 max-w-md mx-auto md:mx-0">
              {registrationState === "verification-method" && registeredUser ? (
                <VerificationMethodSelector
                  email={registeredUser.email}
                  phone={registeredUser.phone}
                  onMethodSelected={handleVerificationMethodSelected}
                  onCancel={handleVerificationCancelled}
                />
              ) : registrationState === "verification" && registeredUser ? (
                <OTPVerification
                  userId={registeredUser.id}
                  email={registeredUser.email}
                  phone={registeredUser.phone}
                  type={selectedVerificationMethod}
                  onVerified={handleVerificationCompleted}
                  onCancel={handleVerificationCancelled}
                />
              ) : (
                <div className="w-full shadow-lg rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/90 to-primary text-white pb-10 pt-6 px-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary opacity-80 z-0"></div>
                    <div className="relative z-10">
                      <h1 className="text-2xl font-bold">
                        Welcome to Urgent Sales
                      </h1>
                      <p className="text-white/80 mt-1">
                        Your one-stop destination for all your real estate needs
                      </p>
                    </div>
                    <div className="flex space-x-2 relative z-10 mt-4">
                      <Button
                        variant={activeTab === "login" ? "default" : "outline"}
                        onClick={() => setActiveTab("login")}
                        className={
                          activeTab === "login"
                            ? "bg-white text-primary"
                            : "bg-transparent text-white border-white/30 hover:bg-white/10"
                        }
                      >
                        Login
                      </Button>
                      <Button
                        variant={
                          activeTab === "register" ? "default" : "outline"
                        }
                        onClick={() => setActiveTab("register")}
                        className={
                          activeTab === "register"
                            ? "bg-white text-primary"
                            : "bg-transparent text-white border-white/30 hover:bg-white/10"
                        }
                      >
                        Register
                      </Button>
                    </div>
                  </div>

                  {activeTab === "login" && (
                    <div className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-semibold">
                            Login to your account
                          </h2>
                          <p className="text-gray-500">
                            Enter your credentials to access your account
                          </p>
                        </div>
                        <form
                          onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              {...loginForm.register("username")}
                              placeholder="Enter your username"
                            />
                            {loginForm.formState.errors.username && (
                              <p className="text-sm text-red-500">
                                {loginForm.formState.errors.username.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              {...loginForm.register("password")}
                              placeholder="Enter your password"
                            />
                            {loginForm.formState.errors.password && (
                              <p className="text-sm text-red-500">
                                {loginForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="remember"
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <Label
                                htmlFor="remember"
                                className="text-sm font-normal"
                              >
                                Remember me
                              </Label>
                            </div>
                            <a
                              href="#"
                              className="text-sm text-primary hover:underline"
                            >
                              Forgot password?
                            </a>
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 mt-4"
                            disabled={isLoginLoading}
                          >
                            {isLoginLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                              </>
                            ) : (
                              "Login"
                            )}
                          </Button>
                        </form>
                      </div>
                    </div>
                  )}

                  {activeTab === "register" && (
                    <div className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-semibold">
                            Create an account
                          </h2>
                          <p className="text-gray-500">
                            Enter your details to create a new account
                          </p>
                        </div>
                        <form
                          onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="reg-name">Full Name</Label>
                            <Input
                              id="reg-name"
                              {...registerForm.register("name")}
                              placeholder="Enter your full name"
                            />
                            {registerForm.formState.errors.name && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.name.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-email">Email</Label>
                            <Input
                              id="reg-email"
                              type="email"
                              {...registerForm.register("email")}
                              placeholder="Enter your email address"
                            />
                            {registerForm.formState.errors.email && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-phone">
                              Phone Number (Optional)
                            </Label>
                            <Input
                              id="reg-phone"
                              {...registerForm.register("phone")}
                              placeholder="Enter your phone number"
                            />
                            {registerForm.formState.errors.phone && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.phone.message}
                              </p>
                            )}
                          </div>

                          {/* Role selection field - NEW */}
                          <div className="space-y-2">
                            <Label htmlFor="reg-role">Account Type</Label>
                            <Select
                              onValueChange={(value) =>
                                registerForm.setValue("role", value)
                              }
                              defaultValue="user"
                            >
                              <SelectTrigger id="reg-role">
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">
                                  Regular User
                                </SelectItem>
                                <SelectItem value="owner">
                                  Property Owner
                                </SelectItem>
                                <SelectItem value="agent">
                                  Real Estate Agent
                                </SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">
                              Select the type of account you want to create
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="reg-username">Username</Label>
                            <Input
                              id="reg-username"
                              {...registerForm.register("username")}
                              placeholder="Create a username"
                            />
                            {registerForm.formState.errors.username && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.username.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-password">Password</Label>
                            <Input
                              id="reg-password"
                              type="password"
                              {...registerForm.register("password")}
                              placeholder="Create a password"
                            />
                            {registerForm.formState.errors.password && (
                              <p className="text-sm text-red-500">
                                {registerForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reg-confirm-password">
                              Confirm Password
                            </Label>
                            <Input
                              id="reg-confirm-password"
                              type="password"
                              {...registerForm.register("confirmPassword")}
                              placeholder="Confirm your password"
                            />
                            {registerForm.formState.errors.confirmPassword && (
                              <p className="text-sm text-red-500">
                                {
                                  registerForm.formState.errors.confirmPassword
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 mt-6"
                            disabled={isRegisterLoading}
                          >
                            {isRegisterLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                              </>
                            ) : (
                              "Register"
                            )}
                          </Button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 p-6 hidden md:block">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-8 text-white shadow-xl">
                <h2 className="text-3xl font-bold mb-4">
                  Welcome to Urgent Sales
                </h2>
                <p className="text-lg mb-6">
                  India's leading platform for direct property transactions
                  without broker commissions.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-3">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Save Money</h3>
                      <p className="text-blue-100">
                        No broker commission means better deals
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-3">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Direct Communication</h3>
                      <p className="text-blue-100">
                        Connect directly with property owners or buyers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-3">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Location-Based Properties
                      </h3>
                      <p className="text-blue-100">
                        Find properties near your preferred location
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 mt-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-4 border-2 border-white/30">
                      <img
                        src="https://placehold.co/100x100?text=User"
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="italic text-sm">
                        "Found my dream home without paying any broker fees.
                        Highly recommend!"
                      </p>
                      <p className="text-xs mt-1">- Rajesh Kumar, Delhi</p>
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
