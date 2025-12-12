

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { LogOut, User2, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { authUtils } from '@/utils/authUtils';
import { toast } from 'sonner';
import logo from "../../assets/jobkitty_xmass.png";

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                authUtils.clearTokens();
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            dispatch(setUser(null));
            authUtils.clearTokens();
            navigate("/");
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    return (
        <>
          
            <div className="fixed top-0 left-0 w-full h-32 pointer-events-none z-40 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-white text-lg animate-fall-slow"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${10 + Math.random() * 10}s`,
                            opacity: 0.6
                        }}
                    >
                        {Math.random() > 0.5 ? '❅' : '❆'}
                    </div>
                ))}
            </div>

            <div className="bg-white/95 backdrop-blur-sm border-b border-red-100 fixed top-0 left-0 w-full z-50 shadow-lg">
              
                <div className="h-1 bg-gradient-to-r from-red-600 via-green-600 to-red-600"></div>

                <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                  
                    <Link to="/" className="flex items-center relative group ms-4" onClick={() => window.scrollTo(0, 0)}>
                        <img 
                            src={logo} 
                            alt="JobKitty Christmas" 
                            className="h-12 w-auto object-contain transition-transform group-hover:scale-110 duration-300"
                        />
                    
                        <span className="absolute -top-3 -right-3 text-3xl animate-twinkle">✨</span>
                 
                        <span className="absolute -top-6 -right-2 text-4xl animate-bounce-slow">🎅</span>
                    </Link>

                   
                    <button 
                        className="md:hidden p-2 relative" 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <Menu size={28} className="text-gray-800" />
                        <span className="absolute -top-1 -right-1 text-xl">❄️</span>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-12">
                        <ul className="flex font-medium items-center gap-6 text-gray-700">
                            {user && user.role === 'admin' ? (
                                <>
                                    <li><Link to="/admin/companies" className="hover:text-red-600 transition">Companies</Link></li>
                                    <li><Link to="/jobs" className="hover:text-green-600 transition">Jobs</Link></li>
                                    <li><Link to="/job-fair" className="hover:text-red-600 transition">Job Fairs</Link></li>
                                    <li><Link to="/internships" className="hover:text-green-600 transition">Internships</Link></li>
                                    <li><Link to="/contact" className="hover:text-red-600 transition">Contact</Link></li>
                                </>
                            ) : user && user.role === 'Employer' ? (
                                <>
                                    <li><Link to="/employer/jobs" className="hover:text-emerald-600 transition">My Jobs</Link></li>
                                    <li><Link to="/employer/jobs/create" className="hover:text-red-600 transition">Post Job</Link></li>
                                    <li><Link to="/internships" className="hover:text-green-600 transition">Internships</Link></li>
                                    <li><Link to="/jobs" className="hover:text-green-600 transition">Browse Jobs</Link></li>
                                    <li><Link to="/contact" className="hover:text-red-600 transition">Contact</Link></li>
                                </>
                            ) : user && user.role === 'Jobseeker' ? (
                                <>
                                    <li><Link to="/jobs" className="hover:text-red-600 transition">Jobs</Link></li>
                                    <li><Link to="/job-fair" className="hover:text-green-600 transition">Job Fairs</Link></li>
                                    <li><Link to="/internships" className="hover:text-red-600 transition">Internships</Link></li>
                                    <li><Link to="/browse" className="hover:text-green-600 transition">Browse</Link></li>
                                    <li><Link to="/contact" className="hover:text-red-600 transition">Contact</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className="hover:text-red-600 transition">Home</Link></li>
                                    <li><Link to="/jobs" className="hover:text-green-600 transition">Jobs</Link></li>
                                    <li><Link to="/internships" className="hover:text-green-600 transition">Internships</Link></li>
                                    <li><Link to="/job-fair" className="hover:text-red-600 transition">Job Fairs</Link></li>
                                    <li><Link to="/contact" className="hover:text-green-600 transition">Contact</Link></li>
                                </>
                            )}
                        </ul>

                        {!user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/login"><Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">Login</Button></Link>
                                <Link to="/signup/jobseeker"><Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">Jobseeker Signup</Button></Link>
                                <Link to="/signup/employer"><Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">Employer Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="relative cursor-pointer group">
                                        <Avatar className="ring-4 ring-white shadow-lg">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            <AvatarFallback className="bg-gradient-to-br from-red-500 to-green-500 text-white">
                                                {(user?.fullname?.[0] || 'U').toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {/* Santa Hat on Avatar */}
                                        <span className="absolute -top-4 -right-2 text-2xl animate-bounce">🎄</span>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 border-red-100">
                                    <div className="flex gap-4 items-center mb-4">
                                        <Avatar>
                                            <AvatarImage src={user?.profile?.profilePhoto} />
                                            <AvatarFallback>{(user?.fullname?.[0] || 'U').toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold text-lg">{user?.fullname}</h4>
                                            <p className="text-sm text-gray-600">Merry Christmas! 🎅</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 text-gray-700">
                                        {user?.role === 'Jobseeker' && (
                                            <>
                                                <Button variant="ghost" className="justify-start"><User2 className="mr-2" /><Link to="/profile">View Profile</Link></Button>
                                                <Button variant="ghost" className="justify-start"><User2 className="mr-2" /><Link to="/profile?edit=1">Edit Profile</Link></Button>
                                            </>
                                        )}
                                        {user?.role === 'Employer' && (
                                            <Button variant="ghost" className="justify-start"><User2 className="mr-2" /><Link to={`/employer/profile/${user._id}`}>Company Profile</Link></Button>
                                        )}
                                        <Button onClick={logoutHandler} variant="ghost" className="justify-start text-red-600 hover:bg-red-50">
                                            <LogOut className="mr-2" /> Logout
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </div>
            </div>

            {/* Christmas Animations */}
            <style jsx>{`
                @keyframes fall-slow {
                    0% { transform: translateY(-100px); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(200px); opacity: 0; }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.4); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-fall-slow { animation: fall-slow linear infinite; }
                .animate-twinkle { animation: twinkle 2s infinite; }
                .animate-bounce-slow { animation: bounce-slow 3s infinite; }
            `}</style>
        </>
    );
};

export default Navbar;