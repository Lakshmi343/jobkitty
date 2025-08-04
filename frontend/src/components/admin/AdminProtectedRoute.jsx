import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminRole = localStorage.getItem('adminRole');
    const admin = localStorage.getItem('admin');

    if (!adminToken || !adminRole || !admin) {
      navigate("/admin/login");
      return;
    }

    // Check if admin has required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(adminRole)) {
      navigate("/admin/dashboard");
      return;
    }
  }, [navigate, allowedRoles]);

  const adminToken = localStorage.getItem('adminToken');
  const adminRole = localStorage.getItem('adminRole');
  const admin = localStorage.getItem('admin');

  if (!adminToken || !adminRole || !admin) {
    return null;
  }

  // Check if admin has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(adminRole)) {
    return null;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute; 