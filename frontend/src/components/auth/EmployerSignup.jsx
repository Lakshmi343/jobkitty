import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Mail, Lock, User, Phone, Building } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';

const EmployerSignup = () => {
  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const validateInput = () => {
    if (!/^[A-Za-z ]{2,40}$/.test(input.fullname)) {
      toast.error('Full name should be 2-40 letters and spaces only.');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(input.email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    if (!/^\d{10}$/.test(input.phoneNumber)) {
      toast.error('Phone number must be exactly 10 digits.');
      return false;
    }
    if (input.password.length < 6 || input.password.length > 20) {
      toast.error('Password must be 6-20 characters.');
      return false;
    }
    if (input.password !== input.confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    const payload = {
      fullname: input.fullname,
      email: input.email,
      phoneNumber: input.phoneNumber,
      password: input.password,
      role: 'Employer',
    };

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.data.success) {
        toast.success('Employer account created. Please login.');
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Registration failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 lg:p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Signup</h1>
              <p className="text-gray-600">Create an employer account to post jobs</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullname">Your Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input id="fullname" name="fullname" value={input.fullname} onChange={changeEventHandler} placeholder="Enter your full name" className="pl-10 py-3" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} placeholder="Enter your email" className="pl-10 py-3" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input id="phoneNumber" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} placeholder="10-digit mobile" className="pl-10 py-3" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} value={input.password} onChange={changeEventHandler} placeholder="Create a password" className="pl-10 py-3" required />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? '🙈' : '👁️'}</button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={input.confirmPassword} onChange={changeEventHandler} placeholder="Re-enter password" className="pl-10 py-3" required />
                  <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showConfirmPassword ? '🙈' : '👁️'}</button>
                </div>
              </div>

              <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800 flex items-start gap-2">
                <Building className="h-4 w-4 mt-0.5" />
                <span>After signup, complete your company setup in the Employer Profile section to start posting jobs.</span>
              </div>

              <Button type="submit" disabled={loading} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg">
                {loading ? (
                  <div className="flex items-center justify-center"><LoadingSpinner size={20} color="#ffffff" /><span className="ml-2">Creating account...</span></div>
                ) : (
                  'Create Employer Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Already have an account? <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">Sign in</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignup;
