// import React, { useEffect, useState } from 'react'
// import Navbar from '../shared/Navbar'
// import { Label } from '../ui/label'
// import { Input } from '../ui/input'
// import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
// import { Button } from '../ui/button'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { USER_API_END_POINT } from '@/utils/constant'
// import { toast } from 'sonner'
// import { useDispatch, useSelector } from 'react-redux'
// import { setLoading } from '@/redux/authSlice'
// import { Mail, Lock, User, Building, Phone, Camera } from 'lucide-react'
// import LoadingSpinner from '../shared/LoadingSpinner'

// const Signup = () => {
//   const [input, setInput] = useState({
//     fullname: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//     role: "",
//     file: null
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [previewImage, setPreviewImage] = useState(null);

//   const { loading, user } = useSelector(store => store.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const changeEventHandler = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   }

//   const changeFileHandler = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setInput({ ...input, file });
//       setPreviewImage(URL.createObjectURL(file)); 
//     }
//   }

//   const validateInput = () => {
//     if (!/^[A-Za-z ]{2,30}$/.test(input.fullname)) {
//       toast.error('Full name should be 2-30 letters and spaces only.');
//       return false;
//     }
//     if (!/^\S+@\S+\.\S+$/.test(input.email)) {
//       toast.error('Please enter a valid email address.');
//       return false;
//     }
//     if (!/^\d{10}$/.test(input.phoneNumber)) {
//       toast.error('Phone number must be exactly 10 digits.');
//       return false;
//     }
//     if (input.password.length < 6 || input.password.length > 20) {
//       toast.error('Password must be 6-20 characters.');
//       return false;
//     }
//     if (input.password !== input.confirmPassword) {
//       toast.error('Passwords do not match.');
//       return false;
//     }
//     if (!input.role) {
//       toast.error('Please select your role.');
//       return false;
//     }
//     if (input.file && input.file.name.length > 50) {
//       toast.error('Profile photo file name is too long.');
//       return false;
//     }
//     return true;
//   }

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     if (!validateInput()) return;
//     // Send JSON only. Profile photo is handled later in profile update.
//     const payload = {
//       fullname: input.fullname,
//       email: input.email,
//       phoneNumber: input.phoneNumber,
//       password: input.password,
//       role: input.role,
//     };

//     try {
//       dispatch(setLoading(true));
//       const res = await axios.post(`${USER_API_END_POINT}/register`, payload, {
//         withCredentials: true,
//       });
//       if (res.data.success) {
//         navigate("/login");
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.message || "Registration failed");
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }

//   useEffect(() => {
//     if (user) {
//       navigate("/");
//     }
//   }, [user, navigate])

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <Navbar />
//       <div className='flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8'>
//         <div className='w-full max-w-lg'>
//           <div className='bg-white rounded-2xl shadow-xl border border-gray-200 p-6 lg:p-8'>
//             <div className='text-center mb-8'>
//               <h1 className='text-3xl font-bold text-gray-900 mb-2'>Create Account</h1>
//               <p className='text-gray-600'>Join us and start your journey</p>
//             </div>

//             <form onSubmit={submitHandler} className='space-y-6'>
        
//               <div className='space-y-2'>
//                 <Label htmlFor="fullname" className="text-sm font-medium text-gray-700">Full Name</Label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <Input
//                     id="fullname"
//                     type="text"
//                     value={input.fullname}
//                     name="fullname"
//                     onChange={changeEventHandler}
//                     placeholder="Enter your full name"
//                     className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className='space-y-2'>
//                 <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <Input
//                     id="email"
//                     type="email"
//                     value={input.email}
//                     name="email"
//                     onChange={changeEventHandler}
//                     placeholder="Enter your email"
//                     className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className='space-y-2'>
//                 <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <Input
//                     id="phoneNumber"
//                     type="tel"
//                     value={input.phoneNumber}
//                     name="phoneNumber"
//                     onChange={changeEventHandler}
//                     placeholder="Enter your phone number"
//                     className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className='space-y-2'>
//                 <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     value={input.password}
//                     name="password"
//                     onChange={changeEventHandler}
//                     placeholder="Create a password"
//                     className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(v => !v)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition"
//                   >
//                     {showPassword ? "🙈" : "👁️"}
//                   </button>
//                 </div>
//               </div>

//               <div className='space-y-2'>
//                 <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <Input
//                     id="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     value={input.confirmPassword}
//                     name="confirmPassword"
//                     onChange={changeEventHandler}
//                     placeholder="Re-enter your password"
//                     className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(v => !v)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition"
//                   >
//                     {showConfirmPassword ? "🙈" : "👁️"}
//                   </button>
//                 </div>
//               </div>

// <div className='space-y-3'>
//   <Label className="text-sm font-medium text-gray-700">I am a</Label>
//   <div className="grid grid-cols-2 gap-4">

//     <div
//       onClick={() => setInput({ ...input, role: "Jobseeker" })}
//       className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
//         ${input.role === "Jobseeker" 
//           ? "border-violet-500 bg-violet-50" 
//           : "border-violet-200 hover:bg-violet-100"
//         }`}
//     >
//       <User className="w-6 h-6 text-gray-600 mb-2" />
//       <span className="text-sm font-medium">Jobseeker</span>
//     </div>

   
//     <div
//       onClick={() => setInput({ ...input, role: "Employer" })}
//       className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
//         ${input.role === "Employer" 
//           ? "border-emerald-500 bg-emerald-50" 
//           : "border-emerald-200 hover:bg-emerald-100"
//         }`}
//     >
//       <Building className="w-6 h-6 text-gray-600 mb-2" />
//       <span className="text-sm font-medium">Employer</span>
//     </div>
//   </div>
// </div>



          
//               <div className='space-y-3'>
//                 <Label className="text-sm font-medium text-gray-700">Profile Photo (optional)</Label>
//                 <div className="relative flex flex-col items-center">
//                   <input
//                     accept="image/*"
//                     type="file"
//                     onChange={changeFileHandler}
//                     className="hidden"
//                     id="profile-photo"
//                   />
//                   <Label
//                     htmlFor="profile-photo"
//                     className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
//                   >
//                     <Camera className="w-8 h-8 text-gray-400 mb-2" />
//                     <span className="text-sm text-gray-600">
//                       {input.file ? input.file.name : 'Click to upload profile photo (optional)'}
//                     </span>
//                     <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB • You can skip this for now</span>
//                   </Label>
//                   {previewImage && (
//                     <img
//                       src={previewImage}
//                       alt="Preview"
//                       className="mt-3 w-24 h-24 rounded-full object-cover border shadow"
//                     />
//                   )}
//                 </div>
//               </div>

            
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center">
//                     <LoadingSpinner size={20} color="#ffffff" />
//                     <span className="ml-2">Creating account...</span>
//                   </div>
//                 ) : (
//                   'Create Account'
//                 )}
//               </Button>
//             </form>

       
//             <div className='mt-6 text-center'>
//               <span className='text-sm text-gray-600'>
//                 Already have an account?{' '}
//                 <Link to="/login" className='text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200'>
//                   Sign in
//                 </Link>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Signup


import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Mail, Lock, User, Building, Phone } from 'lucide-react'
import LoadingSpinner from '../shared/LoadingSpinner'

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

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
    if (!input.role) {
      toast.error('Please select your role.');
      return false;
    }
    return true;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    
    const payload = {
      fullname: input.fullname,
      email: input.email,
      phoneNumber: input.phoneNumber,
      password: input.password,
      role: input.role,
    };

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Registration failed");
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

              {/* Phone Number */}
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
                    placeholder="Create a password"
                    className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className='space-y-2'>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={input.confirmPassword}
                    name="confirmPassword"
                    onChange={changeEventHandler}
                    placeholder="Re-enter your password"
                    className="pl-10 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition"
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className='space-y-3'>
                <Label className="text-sm font-medium text-gray-700">I am a</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setInput({ ...input, role: "Jobseeker" })}
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${input.role === "Jobseeker" 
                        ? "border-violet-500 bg-violet-50" 
                        : "border-violet-200 hover:bg-violet-100"
                      }`}
                  >
                    <User className="w-6 h-6 text-gray-600 mb-2" />
                    <span className="text-sm font-medium">Jobseeker</span>
                  </div>

                  <div
                    onClick={() => setInput({ ...input, role: "Employer" })}
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${input.role === "Employer" 
                        ? "border-emerald-500 bg-emerald-50" 
                        : "border-emerald-200 hover:bg-emerald-100"
                      }`}
                  >
                    <Building className="w-6 h-6 text-gray-600 mb-2" />
                    <span className="text-sm font-medium">Employer</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size={20} color="#ffffff" />
                    <span className="ml-2">Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

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