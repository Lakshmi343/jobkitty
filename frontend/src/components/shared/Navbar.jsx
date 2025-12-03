

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

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Menu } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { authUtils } from '@/utils/authUtils'
import { toast } from 'sonner'
import logo from "../../assets/jobkitty-01.png"

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
    }

    return (
        <div className='bg-white border-b fixed top-0 left-0 w-full z-50 shadow-sm'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                
               
                <Link 
                  to="/" 
                  className="flex items-center"
                  onClick={() => window.scrollTo(0, 0)}
                >
                    <img src={logo} alt="logo" style={{ width: "150px",objectFit:"contain" }} />
                </Link>
             
                <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <Menu size={28} />
                </button>

                {/* Desktop Navigation */}
                <div className='hidden md:flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'admin' ? (
                                <>
                                    
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/job-fair">Job Fairs</Link></li>
                                    <li><Link to="/internships">Internships</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </>
                            ) : user && user.role === 'Employer' ? (
                                <>
                                    
                                    <li><Link to="/employer/jobs">My Jobs</Link></li>
                                    <li><Link to="/employer/jobs/create">Post Job</Link></li>
                                    <li><Link to="/jobs">Browse Jobs</Link></li>
                                    <li><Link to="/job-fair">Job Fairs</Link></li>
                                    <li><Link to="/internships">Internships</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </>
                            ) : user && user.role === 'Jobseeker' ? (
                                <>
                              
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/job-fair">Job Fairs</Link></li>
                                    <li><Link to="/internships">Internships</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                    <li><Link to="/jobseeker/applied-jobs">Applied Jobs</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </>
                            ) : (
                                <>
                                   
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/job-fair">Job Fairs</Link></li>
                                    <li><Link to="/internships">Internships</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </>
                            )
                        }
                    </ul>

                    {!user ? (
                        <div className='flex items-center gap-2'>
                            <Link to="/login"><Button variant="outline">Login</Button></Link>
                            <Link to="/signup/jobseeker"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Jobseeker Signup</Button></Link>
                            <Link to="/signup/employer"><Button className="bg-emerald-600 hover:bg-emerald-700">Employer Signup</Button></Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
                                    <AvatarFallback>{(user?.fullname?.[0] || 'U').toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div>
                                    <div className='flex gap-2 space-y-2'>
                                        <Avatar>
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
                                            <AvatarFallback>{(user?.fullname?.[0] || 'U').toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className='font-medium'>{user?.fullname}</h4>
                                        </div>
                                    </div>
                                    <div className='flex flex-col my-2 text-gray-600'>
                                        {user?.role === 'Jobseeker' && (
                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <User2 />
                                                <Button variant="link"><Link to="/profile">View Profile</Link></Button>
                                            </div>
                                        )}
                                        {user?.role === 'Jobseeker' && (
                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <User2 />
                                                <Button variant="link"><Link to="/profile?edit=1">Edit Profile</Link></Button>
                                            </div>
                                        )}
                                        {user?.role === 'Employer' && (
                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <User2 />
                                                <Button variant="link"><Link to={`/employer/profile/${user._id}`}>Company Profile</Link></Button>
                                            </div>
                                        )}
                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                            <LogOut />
                                            <Button onClick={logoutHandler} variant="link">Logout</Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="absolute top-16 left-0 w-full bg-white shadow-md z-50 md:hidden animate-fade-in">
                        <ul className='flex flex-col font-medium items-start gap-4 p-4 border-b'>
                            {
                                user && user.role === 'admin' ? (
                                    <>
                                        <li className="font-semibold text-gray-500">Category</li>
                                        <li><Link to="/admin/companies" onClick={() => setMobileMenuOpen(false)}>Companies</Link></li>
                                        <li><Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Jobs</Link></li>
                                        <li><Link to="/job-fair" onClick={() => setMobileMenuOpen(false)}>Job Fairs</Link></li>
                                        <li><Link to="/internships" onClick={() => setMobileMenuOpen(false)}>Internships</Link></li>
                                        <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
                                    </>
                                ) : user && user.role === 'Employer' ? (
                                    <>
                                        <li className="font-semibold text-gray-500">Category</li>
                                        <li><Link to="/employer/jobs" onClick={() => setMobileMenuOpen(false)}>My Jobs</Link></li>
                                        <li><Link to="/employer/jobs/create" onClick={() => setMobileMenuOpen(false)}>Post Job</Link></li>
                                        <li><Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Browse Jobs</Link></li>
                                        <li><Link to="/job-fair" onClick={() => setMobileMenuOpen(false)}>Job Fairs</Link></li>
                                        <li><Link to="/internships" onClick={() => setMobileMenuOpen(false)}>Internships</Link></li>
                                        <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
                                    </>
                                ) : user && user.role === 'Jobseeker' ? (
                                    <>
                                        <li className="font-semibold text-gray-500">Category</li>
                                        <li><Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Jobs</Link></li>
                                        <li><Link to="/job-fair" onClick={() => setMobileMenuOpen(false)}>Job Fairs</Link></li>
                                        <li><Link to="/internships" onClick={() => setMobileMenuOpen(false)}>Internships</Link></li>
                                        <li><Link to="/browse" onClick={() => setMobileMenuOpen(false)}>Browse</Link></li>
                                        <li><Link to="/jobseeker/applied-jobs" onClick={() => setMobileMenuOpen(false)}>Applied Jobs</Link></li>
                                        <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li className="font-semibold text-gray-500">Category</li>
                                        <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
                                        <li><Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Jobs</Link></li>
                                        <li><Link to="/job-fair" onClick={() => setMobileMenuOpen(false)}>Job Fairs</Link></li>
                                        <li><Link to="/internships" onClick={() => setMobileMenuOpen(false)}>Internships</Link></li>
                                        <li><Link to="/browse" onClick={() => setMobileMenuOpen(false)}>Browse</Link></li>
                                        <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
                                    </>
                                )
                            }
                        </ul>
                        {!user ? (
                            <div className='flex flex-col gap-2 p-4'>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}><Button variant="outline" className="w-full">Login</Button></Link>
                                <Link to="/signup/jobseeker" onClick={() => setMobileMenuOpen(false)}><Button className="bg-[#6A38C2] hover:bg-[#5b30a6] w-full mb-2">Jobseeker Signup</Button></Link>
                                <Link to="/signup/employer" onClick={() => setMobileMenuOpen(false)}><Button className="bg-emerald-600 hover:bg-emerald-700 w-full">Employer Signup</Button></Link>
                            </div>
                        ) : (
                            <div className='flex flex-col gap-2 p-4'>
                                {user?.role === 'Jobseeker' && (
                                    <>
                                        <Button variant="link" className="w-full flex items-center gap-2 justify-start" onClick={() => setMobileMenuOpen(false)}>
                                            <User2 /> <Link to="/profile">View Profile</Link>
                                        </Button>
                                        <Button variant="link" className="w-full flex items-center gap-2 justify-start" onClick={() => setMobileMenuOpen(false)}>
                                            <User2 /> <Link to="/profile?edit=1">Edit Profile</Link>
                                        </Button>
                                    </>
                                )}
                                {user?.role === 'Employer' && (
                                    <Button variant="link" className="w-full flex items-center gap-2 justify-start" onClick={() => setMobileMenuOpen(false)}>
                                        <User2 /> <Link to={`/employer/profile/${user._id}`}>Company Profile</Link>
                                    </Button>
                                )}
                                <Button onClick={() => { logoutHandler(); setMobileMenuOpen(false); }} variant="link" className="w-full flex items-center gap-2 justify-start">
                                    <LogOut /> Logout
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar