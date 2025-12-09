 
 
 
//  import React, { useState } from 'react'
//  import { Button } from './ui/button'
//  import { Search, MapPin, Briefcase } from 'lucide-react'
//  import { useDispatch } from 'react-redux';
//  import { setSearchedQuery } from '@/redux/jobSlice';
//  import { useNavigate } from 'react-router-dom';
 
// const HeroSection = () => {
//     const [query, setQuery] = useState("");
//     const [location, setLocation] = useState("");
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const searchJobHandler = () => {
//     const searchTerm = location ? `${query} ${location}` : query;
//     dispatch(setSearchedQuery(searchTerm));
//     navigate("/browse");
//     }
//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             searchJobHandler();
//         }
//     }
//     return (
//         <div className='relative w-full overflow-hidden min-h-screen' 
//              style={{
//                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
//                  backgroundSize: '200% 200%',
//                  animation: 'gradient 20s ease infinite'
//              }}>
//             <div className='absolute inset-0 overflow-hidden'>
//                 <div className='absolute -top-24 -left-24 w-96 h-96 bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
//                 <div className='absolute -bottom-24 -right-24 w-96 h-96 bg-purple-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
//                 <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000'></div>
//             </div>
//             <div className='absolute inset-0 overflow-hidden'>
//                 {[...Array(20)].map((_, i) => (
//                     <div
//                         key={i}
//                         className='absolute w-2 h-2 bg-indigo-400/30 rounded-full animate-float'
//                         style={{
//                             left: `${Math.random() * 100}%`,
//                             top: `${Math.random() * 100}%`,
//                             animationDelay: `${Math.random() * 5}s`,
//                             animationDuration: `${5 + Math.random() * 10}s`
//                         }}
//                     />
//                 ))}
//             </div>
//             <div className='relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-12 lg:py-24'>
//                 <div className='w-full max-w-6xl mx-auto'>
//                     <div className='flex flex-col gap-8 lg:gap-12 items-center text-center'>
//                         <div className='flex items-center gap-3 text-white/90 animate-fade-in'>
//                             <span className='text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text animate-pulse'>
//                                 3,000+
//                             </span>
//                             <span className='text-lg lg:text-xl'>Browse Jobs</span>
//                         </div>
//                         <div className='text-center lg:text-left'>
//                             <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white animate-slide-up px-4'>
//                                 Find Jobs, Employment & <br className="hidden sm:block" />
//                                 <span className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded bg-clip-text text-transparent'>
//                                     Career Opportunities
//                                 </span>
//                             </h1>                       
//                             <p className='text-base md:text-lg text-gray-300 max-w-3xl animate-fade-in animation-delay-200 px-4'>
//                                 Discover your next career move with our extensive job listings. 
//                                 From entry-level positions to executive roles, find the perfect opportunity 
//                                 that matches your skills and aspirations.
//                             </p>
//                         </div>
//                         <div className='w-full max-w-4xl animate-slide-up animation-delay-400'>
//                             <div className='flex flex-col sm:flex-row gap-4 px-4'>
//                                 <div className='flex-1'>
//                                     <input
//                                         type="text"
//                                         placeholder="Job title, keywords, or company"
//                                         value={query}
//                                         onChange={(e) => setQuery(e.target.value)}
//                                         className='w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
//                                     />
//                                 </div>
//                                 <button
//                                     onClick={searchJobHandler}
//                                     className='px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200'
//                                 >
//                                     Search Jobs
//                                 </button>
//                             </div>
//                         </div>
//                         {/* Popular Searches */}
//                         <div className='flex flex-wrap justify-center items-center gap-4 mt-6 text-sm text-gray-300 animate-fade-in animation-delay-600 px-4'>
//                             <span className='font-medium'>Popular:</span>
//                             {['Software Developer', 'Project Manager', 'Data Analyst', 'UI/UX Designer'].map((term, index) => (
//                                 <button 
//                                     key={index}
//                                     onClick={() => {
//                                         setQuery(term);
//                                         searchJobHandler();
//                                     }} 
//                                     className='hover:text-indigo-300 transition-colors duration-200 px-3 py-1 rounded-full hover:bg-white/10'
//                                 >
//                                     {term}
//                                 </button>
//                             ))}
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </div>
//  )
// }
// export default HeroSection

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query.trim() || "jobs"));
        navigate("/browse");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') searchJobHandler();
    };

    return (
        <div className="relative w-full overflow-hidden min-h-screen">
            {/* Animated Christmas Gradient Background */}
            <div 
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #8B0000 0%, #1a1a2e 30%, #0f1a3d 70%, #000000 100%)',
                    backgroundSize: '400% 400%',
                    animation: 'christmasGlow 15s ease infinite'
                }}
            />

            {/* Falling Snow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-white text-2xl animate-fall"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${8 + Math.random() * 10}s`,
                            opacity: Math.random() * 0.8 + 0.2
                        }}
                    >
                        {Math.random() > 0.5 ? '❅' : '❆'}
                    </div>
                ))}
            </div>

            {/* Flying Santa Sleigh (appears every 30 seconds) */}
            <div className="absolute top-20 left-0 animate-sleigh">
                <span className="text-5xl">🎅🛷</span>
            </div>

            {/* Twinkling Stars */}
            <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-yellow-200 text-xl animate-twinkle"
                        style={{
                            top: `${Math.random() * 50}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    >
                        ✦
                    </div>
                ))}
            </div>

            {/* Floating Ornaments & Gifts */}
            <div className="absolute inset-0 overflow-hidden">
                {['🎄', '🎁', '🔔', '🕯️', '❄️'].map((emoji, i) => (
                    <div
                        key={i}
                        className="absolute text-4xl animate-float-slow"
                        style={{
                            top: `${20 + i * 15}%`,
                            left: `${10 + i * 15}%`,
                            animationDelay: `${i * 1.5}s`
                        }}
                    >
                        {emoji}
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-24">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Christmas Greeting */}
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
                        {/* <span className="bg-gradient-to-r from-red-500 via-green-500 to-yellow-400 bg-clip-text text-transparent">
                            Merry Christmas & Happy Job Hunting! 
                        </span> */}
                    </h2>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mt-6 leading-tight">
                        Find Your Dream Job This <br />
                        <span className="bg-gradient-to-r from-red-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent animate-pulse">
                            Holiday Season
                        </span>{' '}
                        🎅
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 mt-6 max-w-2xl mx-auto">
                        Unwrap new career opportunities while the world celebrates. 
                        Your next big role is waiting under the tree!
                    </p>

                    {/* Search Bar */}
                    <div className="mt-10 max-w-3xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Job title, skills, or company (e.g. React Developer)"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full pl-12 pr-6 py-5 rounded-full text-gray-900 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all placeholder-gray-500"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🎄</span>
                            </div>
                            <button
                                onClick={searchJobHandler}
                                className="px-10 py-5 bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white font-bold rounded-full text-lg shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                            >
                                <span>Search Jobs</span>
                                <span>✨</span>
                            </button>
                        </div>
                    </div>

                    {/* Popular Christmas-themed Searches */}
                    <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
                        <span className="text-gray-300 font-medium">Festive Searches:</span>
                        {['Remote Developer', 'Winter Internship', 'Tech Gifts Team', 'Holiday Marketing'].map((term) => (
                            <button
                                key={term}
                                onClick={() => {
                                    setQuery(term);
                                    searchJobHandler();
                                }}
                                className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white transition-all hover:scale-110"
                            >
                                {term} 🎁
                            </button>
                        ))}
                    </div>

                    {/* Footer Wish */}
                    <p className="mt-12 text-xl text-amber-300 font-medium italic animate-pulse">
                        May your career be merry and bright! ☃️✨
                    </p>
                </div>
            </div>

            {/* Custom Christmas Animations */}
            <style jsx>{`
                @keyframes christmasGlow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes fall {
                    0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
                @keyframes sleigh {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(120vw); }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                }
                .animate-fall { animation: fall linear infinite; }
                .animate-sleigh { animation: sleigh 35s linear infinite; }
                .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
                .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default HeroSection;