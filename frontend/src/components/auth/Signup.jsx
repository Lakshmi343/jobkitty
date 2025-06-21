import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, Mail, Lock, User, Building, Phone, Upload, Camera } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />
            <div className='flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8'>
                <div className='w-full max-w-lg'>
                    <div className='bg-white rounded-2xl shadow-xl border border-gray-200 p-6 lg:p-8'>
                        <div className='text-center mb-8'>
                            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Create Account</h1>
                            <p className='text-gray-600'>Join us and start your journey</p>
                        </div>

                        <form onSubmit={submitHandler} className='space-y-6'>
                            {/* Full Name Field */}
                            <div className='space-y-2'>
                                <Label htmlFor="fullname" className="text-sm font-medium text-gray-700">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        id="fullname"
                                        type="text"
                                        value={input.fullname}
                                        name="fullname"
                                        onChange={changeEventHandler}
                                        placeholder="Enter your full name"
                                        className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
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

                            {/* Phone Number Field */}
                            <div className='space-y-2'>
                                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        id="phoneNumber"
                                        type="tel"
                                        value={input.phoneNumber}
                                        name="phoneNumber"
                                        onChange={changeEventHandler}
                                        placeholder="Enter your phone number"
                                        className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className='space-y-2'>
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={input.password}
                                        name="password"
                                        onChange={changeEventHandler}
                                        placeholder="Create a password"
                                        className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className='space-y-3'>
                                <Label className="text-sm font-medium text-gray-700">I am a</Label>
                                <RadioGroup 
                                    value={input.role} 
                                    onValueChange={(value) => setInput({...input, role: value})}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    <div className="relative">
                                        <RadioGroupItem 
                                            value="Jobseeker" 
                                            id="jobseeker" 
                                            className="peer sr-only"
                                        />
                                        <Label 
                                            htmlFor="jobseeker" 
                                            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <User className="w-6 h-6 text-gray-600 mb-2" />
                                            <span className="text-sm font-medium">Jobseeker</span>
                                        </Label>
                                    </div>
                                    <div className="relative">
                                        <RadioGroupItem 
                                            value="Employer" 
                                            id="employer" 
                                            className="peer sr-only"
                                        />
                                        <Label 
                                            htmlFor="employer" 
                                            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <Building className="w-6 h-6 text-gray-600 mb-2" />
                                            <span className="text-sm font-medium">Employer</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Profile Photo Upload */}
                            <div className='space-y-3'>
                                <Label className="text-sm font-medium text-gray-700">Profile Photo</Label>
                                <div className="relative">
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={changeFileHandler}
                                        className="hidden"
                                        id="profile-photo"
                                        required
                                    />
                                    <Label 
                                        htmlFor="profile-photo"
                                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                                    >
                                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-600">
                                            {input.file ? input.file.name : 'Click to upload profile photo'}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                                    </Label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>

                        {/* Login Link */}
                        <div className='mt-6 text-center'>
                            <span className='text-sm text-gray-600'>
                                Already have an account?{' '}
                                <Link to="/login" className='text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200'>
                                    Sign in
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup