import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Assuming you have a hook for accessing user role
import Sidebar from './Sidebar'; // Importing the Sidebar component

const AppLayout = ({ role }) => {
  const { user } = useAuth();  // Accessing the current user and role

  const accessibleRoutes = {
    Citizen: ['/home', '/dashboard', '/infrastructure', '/infrastructure/:id', '/issues', '/profile/:role', '/about', '/contact'],
    Inspector: ['/home', '/dashboard', '/schedule-inspection','/view-inspection','/profile/:role', '/inspectors','inspectors/:id','citizens','citizens/:id'],
    UtilityProvider: ['/home', '/dashboard', '/profile/:role', '/maintenance'],
    Admin: ['/home', '/dashboard', '/maintenance', '/inspection', '/inspectors', '/infrastructure', '/about', '/contact'],
  };

  // Check if the current route is accessible based on the user role
  const currentRoute = window.location.pathname; // Get the current route

  // If the current route is not allowed for this user role, redirect to the homepage or another restricted page
  if (!accessibleRoutes[user?.role]?.includes(currentRoute)) {
    return <Navigate to="/home" />;
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar rendering */}
      <Sidebar role={user?.role} />
      
      {/* Main content area */}
      <div style={{ flex: 1 }}>
        <Outlet /> {/* Render the child route components */}
      </div>
    </div>
  );
};

export default AppLayout;
