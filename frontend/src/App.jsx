
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
import BlogPage from './components/BlogPage'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import EmployerCompanySetup from './components/admin/EmployerCompanySetup'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminLayout from './components/admin/AdminLayout'
import AdminProtectedRoute from './components/admin/AdminProtectedRoute'
import AdminUsers from './components/admin/AdminUsers'
import AdminCategories from './components/admin/AdminCategories'
import AdminAnalytics from './components/admin/AdminAnalytics'
import AdminApplications from './components/admin/AdminApplications'
import EmployerJobs from './components/employer/EmployerJobs'

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
    path: '/blog',
    element: <BlogPage />
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

  // Admin Routes
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  {
    path: "/admin/dashboard",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },
  {
    path: "/admin/users",
    element: (
      <AdminProtectedRoute allowedRoles={['superadmin']}>
        <AdminLayout>
          <AdminUsers />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },
  {
    path: "/admin/jobs",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminJobs />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },
  {
    path: "/admin/companies",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <Companies />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },
  {
    path: "/admin/companies/:id",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <CompanySetup />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },
  {
    path: "/admin/categories",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminCategories />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },
  {
    path: "/admin/analytics",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminAnalytics />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },
  {
    path: "/admin/applications",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminApplications />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },

  // Employer Routes
  {
    path: "/employer/profile/:id",
    element: <ProtectedRoute allowedRoles={['Employer']}><CompanySetup/></ProtectedRoute>
  },
  {
    path: "/employer/jobs",
    element: <ProtectedRoute allowedRoles={['Employer']}><EmployerJobs/></ProtectedRoute> 
  },
  {
    path: "/employer/jobs/create",
    element: <ProtectedRoute allowedRoles={['Employer']}><PostJob/></ProtectedRoute> 
  },
  {
    path: "/employer/jobs/:id/edit",
    element: <ProtectedRoute allowedRoles={['Employer']}><EditJob/></ProtectedRoute> 
  },
  {
    path: "/employer/jobs/:id/applicants",
    element: <ProtectedRoute allowedRoles={['Employer']}><Applicants/></ProtectedRoute> 
  },

  // Jobseeker Routes
  {
    path: "/jobseeker/applied-jobs",
    element: <ProtectedRoute allowedRoles={['Jobseeker']}><AppliedJobs /></ProtectedRoute> 
  },

  // Auth Routes
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />
  },
  {
    path: "/employer/company/setup",
    element: <ProtectedRoute allowedRoles={['Employer']}><EmployerCompanySetup/></ProtectedRoute> 
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


