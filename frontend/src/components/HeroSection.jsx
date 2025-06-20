import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import CategoryCarousel from './CategoryCarousel';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='relative w-full overflow-hidden' 
             style={{
                 background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                 minHeight: '100%',
                 backgroundSize: '200% 200%',
                 animation: 'gradient 20s ease infinite'
             }}>

            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -top-24 -left-24 w-96 h-96 bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
                <div className='absolute -bottom-24 -right-24 w-96 h-96 bg-purple-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000'></div>
            </div>

 
            <div className='absolute inset-0 overflow-hidden'>
                {[...Array(35)].map((_, i) => (
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

          
            <div className='sticky top-0 w-full min-h-screen flex flex-col items-center justify-center overflow-hidden'>
                <div className='relative z-10 w-full max-w-7xl mx-auto px-4 py-24'>
                    <div className='flex flex-col gap-12 items-center text-center'>
                        <div className='flex items-center gap-3 text-white/90 animate-fade-in'>
                            <span className='text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text animate-pulse'>
                                3,000+
                            </span>
                            <span className='text-xl'>Browse Jobs</span>
                        </div>
                        
                        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white animate-slide-up'>
                            Find Jobs, Employment & <br />
                            <span className='bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 text-transparent bg-clip-text'>
                                Career Opportunities
                            </span>
                        </h1>
                        
                        <p className='text-base md:text-lg text-gray-300 max-w-3xl animate-fade-in animation-delay-200'>
                            Discover your next career move with our extensive job listings. 
                            From entry-level positions to executive roles, find the perfect opportunity 
                            that matches your skills and aspirations.
                        </p>

                        <div className='flex w-full max-w-3xl shadow-lg border border-indigo-500/20 pl-6 rounded-full items-center gap-4 bg-indigo-900/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-slide-up animation-delay-400 group'>
                            <input
                                type="text"
                                placeholder='Search for jobs, companies, or keywords'
                                onChange={(e) => setQuery(e.target.value)}
                                className='outline-none border-none w-full py-4 text-base bg-transparent text-white placeholder-gray-400 group-hover:placeholder-gray-300 transition-colors'
                            />
                            <Button 
                                onClick={searchJobHandler} 
                                className="rounded-r-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 transition-all duration-300 group-hover:scale-105"
                            >
                                <Search className='h-4 w-4' />
                            </Button>
                        </div>

                        <div className='flex gap-6 mt-4 text-sm text-gray-300 animate-fade-in animation-delay-600'>
                            <span className='text-white/80'>Popular:</span>
                            <button onClick={() => searchJobHandler('Software Developer')} className='hover:text-indigo-300 transition-colors'>Software Developer</button>
                            <button onClick={() => searchJobHandler('Project Manager')} className='hover:text-indigo-300 transition-colors'>Project Manager</button>
                            <button onClick={() => searchJobHandler('Data Analyst')} className='hover:text-indigo-300 transition-colors'>Data Analyst</button>
                        </div>
                    </div>

   
                    <div className='mt-20 relative z-10 animate-fade-in animation-delay-800'>
                        <h2 className='text-2xl md:text-3xl font-bold text-center mb-8 text-white'>
                            Popular Job Categories
                        </h2>
                        <div className='p-4'>
                            <CategoryCarousel />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection