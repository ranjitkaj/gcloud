import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from '@/components/ui/input-otp';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface OTPVerificationProps {
  userId: number;
  email: string;
  phone?: string;
  type: 'email' | 'whatsapp' | 'sms';
  onVerified: () => void;
  onCancel: () => void;
}

export default function OTPVerification({
  userId,
  email,
  phone,
  type = 'email',
  onVerified,
  onCancel
}: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const getRecipientContact = () => {
    if (type === 'email') return email;
    return phone ? phone : 'your phone';
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the 6-digit code sent to you',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationStatus('idle');

      // Enhanced debugging logs for OTP verification
      console.log("=== OTP VERIFICATION REQUEST ===");
      console.log("User ID:", userId);
      console.log("OTP:", otp);
      console.log("Type:", type);
      console.log("=============================");

      // Make the API request with detailed error handling
      const response = await apiRequest(
        'POST',
        '/api/verify-otp',
        { userId, otp, type }
      );
      
      // Parse the response data
      const data = await response.json();
      
      // Log the complete response for debugging
      console.log("=== OTP VERIFICATION RESPONSE ===");
      console.log("Status:", response.status);
      console.log("Response data:", data);
      console.log("================================");

      if (data.success) {
        setVerificationStatus('success');
        toast({
          title: 'Verification successful',
          description: `Your ${type} has been verified.`,
          variant: 'default'
        });
        
        // Update user data if the verification returns updated user info
        if (data.user) {
          console.log("Updated user information:", data.user);
        }
        
        // Notify parent component about successful verification
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        setVerificationStatus('error');
        toast({
          title: 'Verification failed',
          description: data.message || 'Invalid or expired OTP',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setVerificationStatus('error');
      
      // Provide more specific error message if possible
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during verification';
      
      toast({
        title: 'Verification failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      
      // Enhanced debugging for OTP resend
      console.log("=== RESEND OTP REQUEST ===");
      console.log("User ID:", userId);
      console.log("Type:", type);
      console.log("Recipient:", getRecipientContact());
      console.log("==========================");
      
      const response = await apiRequest(
        'POST',
        '/api/resend-otp',
        { 
          userId: userId, // Explicitly include userId
          type: type 
        }
      );

      // Parse the response data with detailed logging
      const data = await response.json();
      console.log("=== RESEND OTP RESPONSE ===");
      console.log("Status:", response.status);
      console.log("Response data:", data);
      console.log("===========================");

      if (data.success) {
        toast({
          title: 'OTP resent',
          description: `A new verification code has been sent to ${getRecipientContact()}`,
          variant: 'default'
        });
        
        // Show the OTP from the response for debugging purposes (only in development)
        if (data.otp && process.env.NODE_ENV !== 'production') {
          console.log("Development OTP:", data.otp);
        }
      } else {
        toast({
          title: 'Failed to resend OTP',
          description: data.message || 'Please try again later',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      
      // Provide more specific error message if possible
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred while resending the verification code';
      
      toast({
        title: 'Failed to resend OTP',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verification Required</CardTitle>
        <CardDescription>
          Enter the 6-digit verification code sent to {getRecipientContact()} via {type}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP 
            maxLength={6} 
            value={otp} 
            onChange={setOtp}
            disabled={isVerifying || verificationStatus === 'success'}
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

        {verificationStatus === 'success' && (
          <div className="flex items-center justify-center text-green-600 gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>Verification successful</span>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div className="flex items-center justify-center text-red-600 gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Invalid or expired code. Please try again.</span>
          </div>
        )}

        <div className="text-sm text-center">
          Didn't receive the code?{' '}
          <button
            onClick={handleResendOTP}
            disabled={isResending || isVerifying}
            className="text-primary hover:underline font-medium"
          >
            {isResending ? 'Sending...' : 'Resend code'}
          </button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isVerifying || verificationStatus === 'success'}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleVerify}
          disabled={otp.length !== 6 || isVerifying || verificationStatus === 'success'}
          className="w-full sm:w-auto"
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}