

import React, { useState, useEffect, useRef } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '../../redux/authSlice';
import { Loader2, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { authUtils } from '../../utils/authUtils';
import LoadingSpinner from '../shared/LoadingSpinner';
import Navbar from '../shared/Navbar';

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const { loading, user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [acceptCode, setAcceptCode] = useState("");
  const delayedPromptTimer = useRef(null);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const validateInput = () => {
    if (!/^\S+@\S+\.\S+$/.test(input.email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    if (input.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    
    try {
      dispatch(setLoading(true));
      const loginData = {
        email: input.email,
        password: input.password,
      };

      if (isBlocked && acceptCode) {
        loginData.acceptCode = acceptCode;
      }

      const res = await axios.post(`${USER_API_END_POINT}/login`, loginData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (res.data.success) {
      
        dispatch(setUser(res.data.user));
        authUtils.setUser(res.data.user);
        
       
        if (res.data.accessToken && res.data.refreshToken) {
          authUtils.setTokens(res.data.accessToken, res.data.refreshToken);
        } else if (res.data.token) {
          authUtils.setTokens(res.data.token, res.data.token);
        }

       
        const isJobseeker = res.data?.user?.role === 'Jobseeker';
        
    
        const pendingApplication = localStorage.getItem('pendingJobApplication');
        if (pendingApplication) {
          try {
            const applicationData = JSON.parse(pendingApplication);
            toast.success('Welcome back! Redirecting to apply for the job...');
            navigate(applicationData.returnUrl || '/jobs');
            return;
          } catch (e) {
            console.error('Error parsing pending application:', e);
            localStorage.removeItem('pendingJobApplication');
          }
        }
        
        
        if (isJobseeker) {
          navigate('/jobs');
        } else {
          navigate('/admin/dashboard');
        }
        
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 403 && error.response?.data?.blocked) {
        setIsBlocked(true);
        toast.error("Your account has been blocked by the admin.");
      } else {
        toast.error(error.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className='flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8'>
        <div className='w-full max-w-md'>
          <div className='bg-white rounded-2xl shadow-xl border border-gray-200 p-6 lg:p-8'>
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back</h1>
              <p className='text-gray-600'>Sign in to your account to continue</p>
            </div>

            <form onSubmit={submitHandler} className='space-y-6'>
             
              <div className='space-y-2'>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={input.email}
                    name="email"
                    onChange={changeEventHandler}
                    placeholder="Enter your email"
                    className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

             
              <div className='space-y-2'>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={input.password}
                    name="password"
                    onChange={changeEventHandler}
                    placeholder="Enter your password"
                    className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

             
              {isBlocked && (
                <div className='space-y-2'>
                  <Label htmlFor="acceptCode" className="text-sm font-medium text-red-700">Accept Code</Label>
                  <div className="relative">
                    <Input
                      id="acceptCode"
                      type="text"
                      value={acceptCode}
                      onChange={(e) => setAcceptCode(e.target.value)}
                      placeholder="Enter admin-provided accept code"
                      className="py-3 border-red-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <p className="text-xs text-red-600">
                    Your account is blocked. Enter the accept code provided by the admin.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size={20} color="#ffffff" />
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

         
            <div className="mt-4 text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Forgot Password?
              </Link>
            </div>

            <div className='mt-6 text-center'>
              <span className='text-sm text-gray-600'>
                Don&apos;t have an account?{' '}
                <Link to="/signup" className='text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200'>
                  Sign up
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;
