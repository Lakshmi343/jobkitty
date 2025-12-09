

// import React, { useState } from 'react'
// import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
// import { Button } from '../ui/button'
// import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
// import { LogOut, User2, Menu } from 'lucide-react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import axios from 'axios'
// import { USER_API_END_POINT } from '@/utils/constant'
// import { setUser } from '@/redux/authSlice'
// import { authUtils } from '@/utils/authUtils'
// import { toast } from 'sonner'
// import logo from "../../assets/jobkitty-01.png"

// const Navbar = () => {
//     const { user } = useSelector(store => store.auth);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//     const logoutHandler = async () => {
//         try {
//             const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
//             if (res.data.success) {
//                 dispatch(setUser(null));
//                 authUtils.clearTokens();
//                 navigate("/");
//                 toast.success(res.data.message);
//             }
//         } catch (error) {
//             console.log(error);
//             dispatch(setUser(null));
//             authUtils.clearTokens();
//             navigate("/");
//             toast.error(error.response?.data?.message || "Logout failed");
//         }
//     }

//     return (
//         <div className='bg-white border-b fixed top-0 left-0 w-full z-50 shadow-sm'>
//             <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                
               
//                 <Link 
//                   to="/" 
//                   className="flex items-center"
//                   onClick={() => window.scrollTo(0, 0)}
//                 >
//                     <img src={logo} alt="logo" style={{ width: "150px",objectFit:"contain" }} />
//                 </Link>
             
//                 <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//                     <Menu size={28} />
//                 </button>

//                60→                <div className='hidden md:flex items-center gap-12'>
//   61→                    <ul className='flex font-medium items-center gap-5'>
//   62→                        {
//   63→                            user && user.role === 'admin' ? (
//   64→                                <>
//   65→                                    <li><Link to="/admin/companies">Companies</Link></li>
//   66→                                    <li><Link to="/jobs">Jobs</Link></li>
//   67→                                    <li><Link to="/contact">Contact</Link></li>
//   68→                                </>
//   69→                            ) : user && user.role === 'Employer' ? (
//   70→                                <>
//   71→                                    <li><Link to="/employer/jobs">My Jobs</Link></li>
//   72→                                    <li><Link to="/employer/jobs/create">Post Job</Link></li>
//   73→                                    <li><Link to="/jobs">Browse Jobs</Link></li>
//   74→                                    <li><Link to="/contact">Contact</Link></li>
//   75→                                </>
//   76→                            ) : user && user.role === 'Jobseeker' ? (
//   77→                                <>
//   78→                                    <li><Link to="/jobs">Jobs</Link></li>
//   79→                                    <li><Link to="/browse">Browse</Link></li>
//   80→                                    <li><Link to="/jobseeker/applied-jobs">Applied Jobs</Link></li>
//   81→                                    <li><Link to="/contact">Contact</Link></li>
//   82→                                </>
//   83→                            ) : (
//   84→                                <>
//   85→                                    <li><Link to="/">Home</Link></li>
//   86→                                    <li><Link to="/jobs">Jobs</Link></li>
//   87→                                    <li><Link to="/browse">Browse</Link></li>
//   88→                                    <li><Link to="/contact">Contact</Link></li>
//   89→                                </>
//   90→                            )
//   91→                        }
//   92→                    </ul>
//   93→
//   94→                    {!user ? (
//   95→                        <div className='flex items-center gap-2'>
//   96→                            <Link to="/login"><Button variant="outline">Login</Button></Link>
//   97→                            <Link to="/signup/jobseeker"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Jobseeker Signup</Button></Link>
//   98→                            <Link to="/signup/employer"><Button className="bg-emerald-600 hover:bg-emerald-700">Employer Signup</Button></Link>
//   99→                        </div>
//  100→                    ) : (
//  101→                        <Popover>
//  102→                            <PopoverTrigger asChild>
//  103→                                <Avatar className="cursor-pointer">
//  104→                                    <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
//  105→                                    <AvatarFallback>{(user?.fullname?.[0] || 'U').toUpperCase()}</AvatarFallback>
//  106→                                </Avatar>
//  107→                            </PopoverTrigger>
//  108→                            <PopoverContent className="w-80">
//  109→                                <div>
//  110→                                    <div className='flex gap-2 space-y-2'>
//  111→                                        <Avatar>
//  112→                                            <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
//  113→                                            <AvatarFallback>{(user?.fullname?.[0] || 'U').toUpperCase()}</AvatarFallback>
//  114→                                        </Avatar>
//  115→                                        <div>
//  116→                                            <h4 className='font-medium'>{user?.fullname}</h4>
//  117→                                        </div>
//  118→                                    </div>
//  119→                                    <div className='flex flex-col my-2 text-gray-600'>
//  120→                                        {user?.role === 'Jobseeker' && (
//  121→                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
//  122→                                                <User2 />
//  123→                                                <Button variant="link"><Link to="/profile">View Profile</Link></Button>
//  124→                                            </div>
//  125→                                        )}
//  126→                                        {user?.role === 'Jobseeker' && (
//  127→                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
//  128→                                                <User2 />
//  129→                                                <Button variant="link"><Link to="/profile?edit=1">Edit Profile</Link></Button>
//  130→                                            </div>
//  131→                                        )}
//  132→                                        {user?.role === 'Employer' && (
//  133→                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
//  134→                                                <User2 />
//  135→                                                <Button variant="link"><Link to={`/employer/profile/${user._id}`}>Company Profile</Link></Button>
//  136→                                            </div>
//  137→                                        )}
//  138→                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
//  139→                                            <LogOut />
//  140→                                            <Button onClick={logoutHandler} variant="link">Logout</Button>
//  141→                                        </div>
//  142→                                    </div>
//  143→                                </div>
//  144→                            </PopoverContent>
//  145→                        </Popover>
//  146→                    )}
//   125→                </div>


//                 {mobileMenuOpen && (
//                     <div className="absolute top-16 left-0 w-full bg-white shadow-md z-50 md:hidden animate-fade-in">
//                         <ul className='flex flex-col font-medium items-start gap-4 p-4 border-b'>
// {{ ... }}
//                                 user && user.role === 'admin' ? (
//                                     <>
//                                         <li><Link to="/admin/companies" onClick={() => setMobileMenuOpen(false)}>Companies</Link></li>
//                                         <li><Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Jobs</Link></li>
//                                         <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
//                                     </>
//                                 ) : user && user.role === 'Employer' ? (
//                                     <>
//                                         <li><Link to="/employer/jobs" onClick={() => setMobileMenuOpen(false)}>My Jobs</Link></li>
//                                         <li><Link to="/employer/jobs/create" onClick={() => setMobileMenuOpen(false)}>Post Job</Link></li>
//                                         <li><Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Browse Jobs</Link></li>
//                                         <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
//                                     </>
//                                 ) : user && user.role === 'Jobseeker' ? (
//                                     <>
//                                         <li><Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Jobs</Link></li>
//                                         <li><Link to="/browse" onClick={() => setMobileMenuOpen(false)}>Browse</Link></li>
//                                         <li><Link to="/jobseeker/applied-jobs" onClick={() => setMobileMenuOpen(false)}>Applied Jobs</Link></li>
//                                         <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
//                                         <li><Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Jobs</Link></li>
//                                         <li><Link to="/browse" onClick={() => setMobileMenuOpen(false)}>Browse</Link></li>
//                                         <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
//                                     </>
//                                 )
//                             }
//                         </ul>
//                         {!user ? (
//                             <div className='flex flex-col gap-2 p-4'>
//                                 <Link to="/login" onClick={() => setMobileMenuOpen(false)}><Button variant="outline" className="w-full">Login</Button></Link>
//                                 <Link to="/signup" onClick={() => setMobileMenuOpen(false)}><Button className="bg-[#6A38C2] hover:bg-[#5b30a6] w-full">Signup</Button></Link>
//                             </div>
//                         ) : (
//                             <div className='flex flex-col gap-2 p-4'>
//                                 {user?.role === 'Jobseeker' && (
//                                     <>
//                                         <Button variant="link" className="w-full flex items-center gap-2 justify-start" onClick={() => setMobileMenuOpen(false)}>
//                                             <User2 /> <Link to="/profile">View Profile</Link>
//                                         </Button>
//                                         <Button variant="link" className="w-full flex items-center gap-2 justify-start" onClick={() => setMobileMenuOpen(false)}>
//                                             <User2 /> <Link to="/profile?edit=1">Edit Profile</Link>
//                                         </Button>
//                                     </>
//                                 )}
//                                 {user?.role === 'Employer' && (
//                                     <Button variant="link" className="w-full flex items-center gap-2 justify-start" onClick={() => setMobileMenuOpen(false)}>
//                                         <User2 /> <Link to={`/employer/profile/${user._id}`}>Company Profile</Link>
//                                     </Button>
//                                 )}
//                                 <Button onClick={() => { logoutHandler(); setMobileMenuOpen(false); }} variant="link" className="w-full flex items-center gap-2 justify-start">
//                                     <LogOut /> Logout
//                                 </Button>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default Navbar

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
            {/* Christmas Snow Overlay (only visible when navbar is visible) */}
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
                {/* Festive Top Border Glow */}
                <div className="h-1 bg-gradient-to-r from-red-600 via-green-600 to-red-600"></div>

                <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                    {/* Logo with Twinkling Star + Santa Hat */}
                    <Link to="/" className="flex items-center relative group ms-4" onClick={() => window.scrollTo(0, 0)}>
                        <img 
                            src={logo} 
                            alt="JobKitty Christmas" 
                            className="h-12 w-auto object-contain transition-transform group-hover:scale-110 duration-300"
                        />
                        {/* Twinkling Star */}
                        <span className="absolute -top-3 -right-3 text-3xl animate-twinkle">✨</span>
                        {/* Santa Hat on Logo */}
                        <span className="absolute -top-6 -right-2 text-4xl animate-bounce-slow">🎅</span>
                    </Link>

                    {/* Mobile Menu Button with Snow */}
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