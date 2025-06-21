import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  
  // Only redirect admin users to admin panel
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);
  
  return (
    <div>
      <Navbar />
      <HeroSection />
      <LatestJobs />
      <CategoryCarousel />
      <Footer />
    </div>
  )
}

export default Home