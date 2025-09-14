

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/authSlice';
import './utils/axiosInterceptor';
import { authUtils } from './utils/authUtils';

// Shared Layout
import Layout from './components/shared/Layout';

// Pages
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './components/Home';
import Jobs from './components/Jobs';
import Browse from './components/Browse';
import Profile from './components/Profile';
import JobDescription from './components/JobDescription';
import Contact from './components/Contact';
import BlogPage from './components/BlogPage';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import BlockedAccount from './components/BlockedAccount';

// Admin
import Companies from './components/admin/Companies';
import CompanySetup from './components/admin/CompanySetup';
import AdminJobs from "./components/admin/AdminJobs";
import AdminEditJob from './components/admin/AdminEditJob';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminUsers from './components/admin/AdminUsers';
import AdminCategories from './components/admin/AdminCategories';
import AdminAnalytics from './components/admin/AdminAnalytics';
import AdminApplications from './components/admin/AdminApplications';
import AdminCVManagement from './components/admin/AdminCVManagement';
import JobseekerTable from './components/admin/JobseekerTable';
import EmployerTable from './components/admin/EmployerTable';
import AdminManagement from './components/admin/AdminManagement';
import SuperAdminUserManagement from './components/admin/SuperAdminUserManagement';
import AdminJobPosting from './components/admin/AdminJobPosting';
import AdminJobEdit from './components/admin/AdminJobEdit';
import AdminForgotPassword from './components/admin/AdminForgotPassword';
import AdminResetPassword from './components/admin/AdminResetPassword';

// Employer & Jobseeker
import EmployerJobs from './components/employer/EmployerJobs';
import EmployerApplicants from './components/employer/EmployerApplicants';
import EmployerProfile from './components/employer/EmployerProfile';
import EmployerCompanySetup from './components/admin/EmployerCompanySetup';
import PostJob from './components/admin/PostJob';
import EditJob from './components/admin/EditJob';
import AppliedJobs from './components/jobseeker/AppliedJobs';
import ProtectedRoute from './components/admin/ProtectedRoute';
import JobseekerManagement from './components/admin/JobseekerManagement';
import EmployerManagement from './components/admin/EmployerManagement';

const appRouter = createBrowserRouter([
  // ✅ User-facing routes with Layout
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    )
  },
  {
    path: '/login',
    element: (
      <Layout>
        <Login />
      </Layout>
    )
  },
  {
    path: '/signup',
    element: (
      <Layout>
        <Signup />
      </Layout>
    )
  },
  {
    path: '/contact',
    element: (
      <Layout>
        <Contact />
      </Layout>
    )
  },
  {
    path: '/blocked-account',
    element: (
      <Layout>
        <BlockedAccount />
      </Layout>
    )
  },
  {
    path: "/jobs",
    element: (
      <Layout>
        <Jobs />
      </Layout>
    )
  },
  {
    path: "/job/:id",
    element: (
      <Layout>
        <JobDescription />
      </Layout>
    )
  },
  {
    path: "/browse",
    element: (
      <Layout>
        <Browse />
      </Layout>
    )
  },
  {
    path: "/profile",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['Jobseeker']}>
          <Profile />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: "/jobseeker/applied-jobs",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['Jobseeker']}>
          <AppliedJobs />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: '/forgot-password',
    element: (
      <Layout>
        <ForgotPassword />
      </Layout>
    )
  },
  {
    path: '/reset-password/:token',
    element: (
      <Layout>
        <ResetPassword />
      </Layout>
    )
  },

  // ✅ Employer Routes (still with Layout, so they see Navbar/Footer)
  {
    path: "/employer/profile/:id",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['Employer']}>
          <EmployerProfile />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: "/employer/jobs",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['Employer']}>
          <EmployerJobs />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: "/employer/jobs/create",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['Employer']}>
          <PostJob />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: "/employer/jobs/:id/edit",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['Employer']}>
          <EditJob />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: "/employer/jobs/:id/applicants",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['Employer']}>
          <EmployerApplicants />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: "/employer/company/setup",
    element: (
      <Layout>
        <ProtectedRoute allowedRoles={['Employer']}>
          <EmployerCompanySetup />
        </ProtectedRoute>
      </Layout>
    )
  },

  // ✅ Admin routes (NO Navbar/Footer)
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  {
    path: "/admin/forgot-password",
    element: <AdminForgotPassword />
  },
  {
    path: "/admin/reset-password",
    element: <AdminResetPassword />
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
    path: "/admin/jobseekers",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <JobseekerTable />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },
  {
    path: "/admin/employers",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <EmployerTable />
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
    path: "/admin/jobs/:id/edit",
    element: (
      <AdminProtectedRoute allowedRoles={['super_admin', 'admin']}>
        <AdminLayout>
          <AdminJobEdit />
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
  {
    path: "/admin/cv-management",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminCVManagement />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },
  {
    path: "/admin/user-management",
    element: (
      <AdminProtectedRoute allowedRoles={['super_admin']}>
        <AdminLayout>
          <SuperAdminUserManagement />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },
  {
    path: "/admin/job-posting",
    element: (
      <AdminProtectedRoute allowedRoles={['super_admin', 'admin']}>
        <AdminLayout>
          <AdminJobPosting />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },
  {
    path: "/admin/jobseeker-management",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <JobseekerManagement />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },
  {
    path: "/admin/employer-management",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <EmployerManagement />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  },
  {
    path: "/admin/admin-management",
    element: (
      <AdminProtectedRoute>
        <AdminLayout>
          <AdminManagement />
        </AdminLayout>
      </AdminProtectedRoute>
    )
  }
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = authUtils.getUser();
    if (storedUser && authUtils.isAuthenticated()) {
      dispatch(setUser(storedUser));
    }
  }, [dispatch]);

  return <RouterProvider router={appRouter} />;
}

export default App;

