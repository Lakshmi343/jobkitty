 
 
 
 import React, { useState } from 'react'
 import { Button } from './ui/button'
 import { Search, MapPin, Briefcase } from 'lucide-react'
 import { useDispatch } from 'react-redux';
 import { setSearchedQuery } from '@/redux/jobSlice';
 import { useNavigate } from 'react-router-dom';
 
const HeroSection = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = () => {
    const searchTerm = location ? `${query} ${location}` : query;
    dispatch(setSearchedQuery(searchTerm));
    navigate("/browse");
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchJobHandler();
        }
    }
    return (
        <div className='relative w-full overflow-hidden min-h-screen' 
             style={{
                 background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                 backgroundSize: '200% 200%',
                 animation: 'gradient 20s ease infinite'
             }}>
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -top-24 -left-24 w-96 h-96 bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
                <div className='absolute -bottom-24 -right-24 w-96 h-96 bg-purple-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000'></div>
            </div>
            <div className='absolute inset-0 overflow-hidden'>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className='absolute w-2 h-2 bg-indigo-400/30 rounded-full animate-float'
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>
            <div className='relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-12 lg:py-24'>
                <div className='w-full max-w-6xl mx-auto'>
                    <div className='flex flex-col gap-8 lg:gap-12 items-center text-center'>
                        <div className='flex items-center gap-3 text-white/90 animate-fade-in'>
                            <span className='text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text animate-pulse'>
                                3,000+
                            </span>
                            <span className='text-lg lg:text-xl'>Browse Jobs</span>
                        </div>
                        <div className='text-center lg:text-left'>
                            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white animate-slide-up px-4'>
                                Find Jobs, Employment & <br className="hidden sm:block" />
                                <span className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] rounded bg-clip-text text-transparent'>
                                    Career Opportunities
                                </span>
                            </h1>                       
                            <p className='text-base md:text-lg text-gray-300 max-w-3xl animate-fade-in animation-delay-200 px-4'>
                                Discover your next career move with our extensive job listings. 
                                From entry-level positions to executive roles, find the perfect opportunity 
                                that matches your skills and aspirations.
                            </p>
                        </div>
                        <div className='w-full max-w-4xl animate-slide-up animation-delay-400'>
                            <div className='flex flex-col sm:flex-row gap-4 px-4'>
                                <div className='flex-1'>
                                    <input
                                        type="text"
                                        placeholder="Job title, keywords, or company"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className='w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>
                                <button
                                    onClick={searchJobHandler}
                                    className='px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200'
                                >
                                    Search Jobs
                                </button>
                            </div>
                        </div>
                        {/* Popular Searches */}
                        <div className='flex flex-wrap justify-center items-center gap-4 mt-6 text-sm text-gray-300 animate-fade-in animation-delay-600 px-4'>
                            <span className='font-medium'>Popular:</span>
                            {['Software Developer', 'Project Manager', 'Data Analyst', 'UI/UX Designer'].map((term, index) => (
                                <button 
                                    key={index}
                                    onClick={() => {
                                        setQuery(term);
                                        searchJobHandler();
                                    }} 
                                    className='hover:text-indigo-300 transition-colors duration-200 px-3 py-1 rounded-full hover:bg-white/10'
                                >
                                    {term}
                                </button>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
 )
}
export default HeroSection