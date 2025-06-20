import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import EditJob from './components/admin/EditJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AppliedJobs from './components/jobseeker/AppliedJobs'
import Contact from './components/Contact'


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/job/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <ProtectedRoute allowedRoles={['Jobseeker']}><Profile /></ProtectedRoute>
  },

  // Admin Routes (for admin role only)
  {
    path:"/admin/companies",
    element: <ProtectedRoute allowedRoles={['admin']}><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute allowedRoles={['admin']}><CompanySetup/></ProtectedRoute> 
  },

 
  {
    path: "/employer/profile/:id",
    element: <ProtectedRoute allowedRoles={['Employer']}><CompanySetup/></ProtectedRoute>
  },
  
  {
    path:"/employer/jobs",
    element:<ProtectedRoute allowedRoles={['Employer']}><AdminJobs/></ProtectedRoute> 
  },
  {
    path:"/employer/jobs/create",
    element:<ProtectedRoute allowedRoles={['Employer']}><PostJob/></ProtectedRoute> 
  },
  {
    path:"/employer/jobs/:id/edit",
    element:<ProtectedRoute allowedRoles={['Employer']}><EditJob/></ProtectedRoute> 
  },
  {
    path:"/employer/jobs/:id/applicants",
    element:<ProtectedRoute allowedRoles={['Employer']}><Applicants/></ProtectedRoute> 
  },


  {
    path:"/jobseeker/applied-jobs",
    element:<ProtectedRoute allowedRoles={['Jobseeker']}><AppliedJobs /></ProtectedRoute> 
  },

])

function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App


