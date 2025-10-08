import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import authUtils from '@/utils/authUtils';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Mail, Lock, User, Phone, GraduationCap, Award, MapPin } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';

const JobseekerSignup = () => {
  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    place: '',
    degree: '',
    education: '',
    institution: '',
    yearOfCompletion: '',
    experience: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const onResumeChange = (e) => {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);
  };

  const validateInput = () => {
    if (!/^[A-Za-z ]{2,30}$/.test(input.fullname)) {
      toast.error('Full name should be 2-30 letters and spaces only.');
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
    if (!acceptTerms) {
      toast.error('Please accept the Terms & Privacy Policy.');
      return false;
    }
    if (!input.place || !input.place.trim()) {
      toast.error('Please enter your location.');
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
      role: 'Jobseeker',
      acceptTerms,

      place: input.place?.trim() || undefined,
      education: JSON.stringify({
        degree: input.degree?.trim() || '',
        institution: input.institution?.trim() || '',
        yearOfCompletion: input.yearOfCompletion ? Number(input.yearOfCompletion) : undefined,
        grade: '',
      }),
      experience: input.experience?.trim() ? JSON.stringify({ years: '', field: input.experience.trim() }) : undefined,
    };

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.data.success) {
        // If a resume was selected (or education provided), do a quick background init by logging in and uploading
        let initialized = false;
        if (resumeFile || input.degree || input.institution || input.yearOfCompletion || input.education) {
          try {
            const loginRes = await axios.post(`${USER_API_END_POINT}/login`, {
              email: input.email,
              password: input.password,
            }, {
              withCredentials: true,
              headers: { 'Content-Type': 'application/json' }
            });

            const accessToken = loginRes.data?.accessToken || '';
            if (accessToken) {
              const fd = new FormData();
              fd.append('fullname', input.fullname);
              fd.append('email', input.email);
              fd.append('phoneNumber', input.phoneNumber);
              fd.append('bio', '');
              fd.append('skills', '');
              if (input.place?.trim()) fd.append('place', input.place.trim());

              const edu = {
                degree: input.degree?.trim() || '',
                institution: input.institution?.trim() || '',
                yearOfCompletion: input.yearOfCompletion ? Number(input.yearOfCompletion) : undefined,
                grade: '',
              };
              fd.append('education', JSON.stringify(edu));

              if (input.experience?.trim()) {
                fd.append('experience', JSON.stringify({ years: '', field: input.experience.trim() }));
              }

              if (resumeFile) {
                fd.append('file', resumeFile);
              }

              await axios.post(`${USER_API_END_POINT}/profile/update`, fd, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
              });
              initialized = true;
            }
          } catch (e) {
            // Background init failed; proceed to login page
          }
        }

        // Save hints for prefill after login (optional)
        try {
          const hints = {
            place: input.place?.trim() || '',
            degree: input.degree?.trim() || '',
            institution: input.institution?.trim() || '',
            yearOfCompletion: input.yearOfCompletion || '',
            education: input.education?.trim() || '',
            experience: input.experience?.trim() || '',
          };
          if (Object.values(hints).some(Boolean)) {
            localStorage.setItem('jobseekerSignupHints', JSON.stringify(hints));
          }
        } catch {}

        toast.success(initialized ? 'Account created. Your details were saved. Please login.' : 'Account created. Please login to complete your profile.');
        navigate('/login');
        return;
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Jobseeker Signup</h1>
              <p className="text-gray-600">Create your jobseeker account</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input id="fullname" name="fullname" value={input.fullname} onChange={changeEventHandler} placeholder="Enter your full name" className="pl-10 py-3" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="place">Location </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input id="place" name="place" value={input.place} onChange={changeEventHandler} placeholder="City / District" className="pl-10 py-3" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="degree">Highest Education </Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input id="degree" name="degree" value={input.degree} onChange={changeEventHandler} placeholder="e.g. B.Tech" className="pl-10 py-3" required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution / College</Label>
                  <Input id="institution" name="institution" value={input.institution} onChange={changeEventHandler} placeholder="e.g. ABC University" className="py-3" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearOfCompletion">Year of Completion</Label>
                  <Input id="yearOfCompletion" name="yearOfCompletion" type="number" value={input.yearOfCompletion} onChange={changeEventHandler} placeholder="e.g. 2023" className="py-3" required />
                </div>
              </div>
             

              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Input id="experience" name="experience" value={input.experience} onChange={changeEventHandler} placeholder="e.g. 2 years as Frontend Developer" className="py-3" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Upload CV </Label>
                <Input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" onChange={onResumeChange} className="py-2" required />
                <p className="text-xs text-gray-500">You can also upload your resume later from your profile.</p>
              </div>

              <div className="flex items-center gap-2">
                <input id="acceptTerms" type="checkbox" checked={acceptTerms} onChange={(e)=>setAcceptTerms(e.target.checked)} />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">I agree to the <Link to="/terms" className="text-violet-600">Terms</Link> and <Link to="/privacy" className="text-violet-600">Privacy Policy</Link></label>
              </div>

              <Button type="submit" disabled={loading} className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg">
                {loading ? (
                  <div className="flex items-center justify-center"><LoadingSpinner size={20} color="#ffffff" /><span className="ml-2">Creating account...</span></div>
                ) : (
                  'Create Jobseeker Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Already have an account? <Link to="/login" className="text-violet-600 hover:text-violet-700 font-medium">Sign in</Link>
              </span>
              <p className="text-xs text-gray-500 mt-2">Tip: After login, complete your profile to save education, experience, location and resume.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobseekerSignup;
