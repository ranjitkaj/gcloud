import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle, Mail, Phone, MessageCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

interface CombinedVerificationProps {
  userId: number;
  email: string;
  phone?: string;
  initialVerificationMethod?: "email" | "whatsapp" | "sms";
  onVerified: () => void;
  onCancel: () => void;
}

export default function CombinedVerification({
  userId,
  email,
  phone,
  initialVerificationMethod = "email",
  onVerified,
  onCancel,
}: CombinedVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [verificationMethod, setVerificationMethod] = useState<"email" | "whatsapp" | "sms">(initialVerificationMethod);
  const [currentStep, setCurrentStep] = useState<"method" | "otp">("method");
  const { toast } = useToast();
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  
  // Check if user is authenticated and matches the expected userId
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!user) {
        try {
          // If user is not authenticated in context but we have userId, attempt to check user
          const response = await fetch('/api/user');
          if (!response.ok) {
            console.warn('User not authenticated for verification');
            toast({
              title: "Authentication issue",
              description: "Please try logging in again before verification",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Auth check error:', error);
        }
      }
    };
    
    checkAuthStatus();
  }, [user, userId, toast]);

  // Get the recipient contact info based on verification method
  const getRecipientContact = () => {
    if (verificationMethod === "email") return email;
    return phone ? phone : "your phone";
  };

  // Handle method selection and send initial OTP
  const handleMethodSelected = async () => {
    try {
      setIsSendingOtp(true);

      // Send OTP via the selected method
      const response = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ type: verificationMethod }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send verification code");
      }
      
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Verification code sent",
          description: `A verification code has been sent to ${getRecipientContact()}`,
        });
        
        // Move to OTP input step
        setCurrentStep("otp");
      } else {
        toast({
          title: "Failed to send verification code",
          description: data.message || "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast({
        title: "Failed to send verification code",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit code sent to you",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationStatus("idle");

      // Verify the OTP
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ otp, type: verificationMethod }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed");
      }
      
      const data = await response.json();

      if (data.success) {
        setVerificationStatus("success");
        
        // Refresh user data to ensure we have updated verification status
        try {
          await fetch('/api/user', { 
            method: 'GET',
            credentials: 'include'
          });
        } catch (refreshError) {
          console.warn("Failed to refresh user data:", refreshError);
        }
        
        toast({
          title: "Verification successful",
          description: `Your ${verificationMethod} has been verified.`,
        });

        // Redirect to homepage after successful verification
        setTimeout(() => {
          onVerified();
          navigate("/");
        }, 1500);
      } else {
        setVerificationStatus("error");
        setOtp(""); // Clear the OTP field on error
        toast({
          title: "Verification failed",
          description: data.message || "Invalid or expired code. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setVerificationStatus("error");
      setOtp(""); // Clear the OTP field on error
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      setIsResending(true);

      // Resend the OTP
      const response = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ type: verificationMethod }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to resend verification code");
      }
      
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Code resent",
          description: `A new verification code has been sent to ${getRecipientContact()}`,
        });
      } else {
        toast({
          title: "Failed to resend code",
          description: data.message || "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast({
        title: "Failed to resend code",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  // Go back to method selection
  const handleBackToMethodSelection = () => {
    setCurrentStep("method");
    setOtp("");
    setVerificationStatus("idle");
  };

  // Show phone methods only if phone is provided
  const phoneMethodsAvailable = !!phone;

  // Render the appropriate step
  if (currentStep === "method") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Choose Verification Method</CardTitle>
          <CardDescription>
            Select how you'd like to receive your verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={verificationMethod}
            onValueChange={(value) =>
              setVerificationMethod(value as "email" | "whatsapp" | "sms")
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label
                htmlFor="email"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                <div>
                  <div>Email</div>
                  <div className="text-sm text-muted-foreground">{email}</div>
                </div>
              </Label>
            </div>

            {phoneMethodsAvailable && (
              <>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="whatsapp"
                    id="whatsapp"
                    disabled={!phoneMethodsAvailable}
                  />
                  <Label
                    htmlFor="whatsapp"
                    className={`flex items-center gap-2 ${!phoneMethodsAvailable ? "opacity-50" : "cursor-pointer"}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <div>
                      <div>WhatsApp</div>
                      <div className="text-sm text-muted-foreground">
                        {phone || "No phone number provided"}
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="sms"
                    id="sms"
                    disabled={!phoneMethodsAvailable}
                  />
                  <Label
                    htmlFor="sms"
                    className={`flex items-center gap-2 ${!phoneMethodsAvailable ? "opacity-50" : "cursor-pointer"}`}
                  >
                    <Phone className="h-4 w-4" />
                    <div>
                      <div>SMS</div>
                      <div className="text-sm text-muted-foreground">
                        {phone || "No phone number provided"}
                      </div>
                    </div>
                  </Label>
                </div>
              </>
            )}
          </RadioGroup>

          {!phoneMethodsAvailable && (
            <div className="mt-4 text-sm text-amber-500">
              Add your phone number in your profile to enable WhatsApp and SMS
              verification.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
            disabled={isSendingOtp}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleMethodSelected} 
            className="w-full sm:w-auto"
            disabled={isSendingOtp}
          >
            {isSendingOtp ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // OTP verification step
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToMethodSelection}
            disabled={isVerifying || verificationStatus === "success"}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Enter Verification Code</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {getRecipientContact()}{" "}
              via {verificationMethod}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={isVerifying || verificationStatus === "success"}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {verificationStatus === "success" && (
          <div className="flex items-center justify-center text-green-600 gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>Verification successful! Redirecting to homepage...</span>
          </div>
        )}

        {verificationStatus === "error" && (
          <div className="flex items-center justify-center text-red-600 gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Invalid or expired code. Please try again.</span>
          </div>
        )}

        <div className="text-sm text-center">
          Didn't receive the code?{" "}
          <button
            onClick={handleResendOTP}
            disabled={isResending || isVerifying || verificationStatus === "success"}
            className="text-primary hover:underline font-medium"
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isVerifying || verificationStatus === "success"}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          onClick={handleVerify}
          disabled={
            otp.length !== 6 || isVerifying || verificationStatus === "success"
          }
          className="w-full sm:w-auto"
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}