import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ADMIN_API_END_POINT, BASE_URL } from '../../utils/constant';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Mail, ArrowLeft, Shield } from 'lucide-react';

const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // First, check if we can reach the backend
      try {
        // Try to ping the base URL first
        await axios.get(BASE_URL, { timeout: 3000 });
        
        // Then check the health endpoint if available
        try {
          const healthCheck = await axios.get(`${ADMIN_API_END_POINT.replace('/admin', '')}/health`, {
            timeout: 3000
          });
          
          if (healthCheck.data?.status !== 'ok') {
            throw new Error('Backend is not responding properly');
          }
        } catch (healthError) {
          console.warn('Health check failed but continuing with password reset attempt:', healthError);
          // Continue with password reset even if health check fails
        }
      } catch (networkError) {
        console.error('Network connectivity error:', networkError);
        throw new Error('Cannot connect to the server. Please check your internet connection and ensure the backend is running.');
      }
      
      // Proceed with forgot password
      const response = await axios.post(
        `${ADMIN_API_END_POINT}/forgot-password`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          timeout: 10000, // 10 seconds timeout
        }
      );

      if (response.data?.success) {
        setEmailSent(true);
        toast.success('Password reset instructions have been sent to your email');
        
        // For development - show the reset token (remove in production)
        if (response.data.resetToken) {
          console.log('Reset Token (for development):', response.data.resetToken);
          toast.info(`Reset Token: ${response.data.resetToken}`, {
            autoClose: 10000
          });
        }
      } else {
        throw new Error(response.data?.message || 'Failed to process your request');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        toast.error('Cannot connect to the server. Please check your internet connection and try again.');
      } else if (error.response?.status === 404) {
        toast.error('No admin account found with this email address');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message.includes('timeout') || error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please check your connection and try again.');
      } else {
        toast.error(error.message || 'An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Password Reset</CardTitle>
          <p className="text-gray-600">
            {emailSent 
              ? 'Check your email for reset instructions'
              : 'Enter your email to receive password reset instructions'
            }
          </p>
        </CardHeader>
        
        <CardContent>
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-center mb-2">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-800 mb-2">Email Sent!</h3>
                <p className="text-green-700 text-sm">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
                <p className="text-green-600 text-xs mt-2">
                  Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>
              
              <Button 
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                variant="outline"
                className="w-full"
              >
                Send to Different Email
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link 
              to="/admin/login" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Admin Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminForgotPassword;
