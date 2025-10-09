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
    // Show popup on home if jobseeker has no skills
    if (user?.role === 'Jobseeker') {
      const needsSkills = !(Array.isArray(user?.profile?.skills) && user.profile.skills.length > 0);
      setSkillsPromptOpen(!!needsSkills);
    } else {
      setSkillsPromptOpen(false);
    }
  }, [user]);
  
  return (
    <div>
      {/* Skills/Profile completion modal on Home */}
      <Dialog open={skillsPromptOpen} onOpenChange={setSkillsPromptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please update your skills</DialogTitle>
            <DialogDescription>
              Add your skills to complete your profile. This helps employers find you faster.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setSkillsPromptOpen(false)}>Later</Button>
            <Button onClick={() => { setSkillsPromptOpen(false); navigate('/profile?edit=1&step=skills'); }}>Update Now</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Navbar/>
      <HeroSection/>
      <CategoryCarousel/>
      <LatestJobs/>
      <ClientShowcase/>
  
    </div>
  )
}

export default Home