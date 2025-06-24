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
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Lock, User, Building } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
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
                <div className='w-full max-w-md'>
                    <div className='bg-white rounded-2xl shadow-xl border border-gray-200 p-6 lg:p-8'>
                        <div className='text-center mb-8'>
                            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back</h1>
                            <p className='text-gray-600'>Sign in to your account to continue</p>
                        </div>

                        <form onSubmit={submitHandler} className='space-y-6'>
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
                                        placeholder="Enter your password"
                                        className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="text-right mt-1">
                                    <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot Password?</Link>
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

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        {/* Sign Up Link */}
                        <div className='mt-6 text-center'>
                            <span className='text-sm text-gray-600'>
                                Don't have an account?{' '}
                                <Link to="/signup" className='text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200'>
                                    Sign up
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login