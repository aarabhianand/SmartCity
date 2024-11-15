import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assuming you have this context for user info

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth(); // Accessing the current user and role

  // If there's no user or the user role is not in the allowed roles, redirect to home
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />; // Render the child route (outlet)
};

export default ProtectedRoute;
