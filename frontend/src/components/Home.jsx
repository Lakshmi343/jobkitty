import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import ClientShowcase from './ClientShowcase'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const [skillsPromptOpen, setSkillsPromptOpen] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  useEffect(() => {
  
    setSkillsPromptOpen(false);
  }, [user]);
  
  return (
    <div>
      
      <Navbar/>
      <HeroSection/>
      <CategoryCarousel/>
      <LatestJobs/>
      <ClientShowcase/>
  
    </div>
  )
}

export default Home