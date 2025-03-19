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

      const response = await apiRequest(
        'POST',
        '/api/verify-otp',
        { otp, type }
      );

      const data = await response.json();

      if (data.success) {
        setVerificationStatus('success');
        toast({
          title: 'Verification successful',
          description: `Your ${type} has been verified.`,
          variant: 'default'
        });
        
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
      toast({
        title: 'Verification failed',
        description: 'An error occurred during verification. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      
      const response = await apiRequest(
        '/api/resend-otp',
        { type },
        { method: 'POST' }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'OTP resent',
          description: `A new verification code has been sent to ${getRecipientContact()}`,
          variant: 'default'
        });
      } else {
        toast({
          title: 'Failed to resend OTP',
          description: data.message || 'Please try again later',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast({
        title: 'Failed to resend OTP',
        description: 'An error occurred. Please try again later.',
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