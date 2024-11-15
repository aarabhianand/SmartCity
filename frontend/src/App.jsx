import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Signup from './components/Signup';
import Entry from './components/Entry';
import About from './components/About';
import Profile from './components/Profile';
import Home from './components/Home';
import SensorChart from './components/SensorChart';
import InfrastructureList from './components/InfrastructureList';
import InfrastructureDashboard from './components/InfrastructureDashboard';
import IssueReportPage from './components/ReportIssues';
import { UserProvider, useAuth } from './components/AuthContext';
import MaintenanceRequest from './components/MaintenanceRequest';
import Contact from './components/Contact';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ScheduleInspection from './components/ScheduleInspection';
import ViewInspection from './components/ViewInspection';
import Dashboard from './components/Dashboard/Dashboard';
import Inspectors from './components/Inspectors';
import InspectorDetails from './components/InspectorDetails';
import Citizens from './components/Citizens';
import CitizenDetails from './components/CitizenDetails';
import Infrastructures from './components/Infrastructures';
import InfrastructureDetails from './components/InfrastructureDetails';
import ProviderDetails from './components/ProviderDetails';
import AddInfrastructure from './components/AddInfrastructure';
import AddCitizen from './components/AddCitizen';
import AddInspector from './components/AddInspector';
import AddProvider from './components/AddProvider';
import UtilityProviders from './components/UtilityProviders';
//import Sensors from './components/EnvironmentalSensors';
//import SensorDetails from './components/SensorDetails';




const App = () => {
  const { user } = useAuth() || {}; // Ensure fallback to empty object to avoid undefined errors
  console.log('User role:', user?.role); // Log user role for debugging

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Route without sidebar */}
          <Route path="/" element={<Entry />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes with sidebar */}
          <Route element={<AppLayout role={user?.role} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Profile page accessible to all authenticated users */}
            <Route path="/profile/:role" element={<Profile />} />

            {/* Protected Routes based on roles */}
            <Route element={<ProtectedRoute allowedRoles={['Citizen', 'Admin']} />}>
              <Route path="/infrastructure" element={<InfrastructureList />} />
              <Route path="/infrastructure/:id" element={<InfrastructureDashboard />} />
              <Route path="/issues" element={<IssueReportPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['UtilityProvider', 'Admin']} />}>
              <Route path="/maintenance" element={<MaintenanceRequest />} />
            </Route>

            {/* Inspector-only routes */}
            <Route element={<ProtectedRoute allowedRoles={['Inspector','Admin']} />}>
              <Route path="/schedule-inspection" element={<ScheduleInspection />} />
              <Route path="/view-inspections" element={<ViewInspection />} />
              <Route path="/inspectors" element={<Inspectors />} />
              <Route path="/inspector/:id" element={<InspectorDetails />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/citizens" element={<Citizens />} />
              <Route path="/infrastructures" element={<Infrastructures />} />
              <Route path="/providers" element={<UtilityProviders />} />
              <Route path="/citizens/:id" element={<CitizenDetails />} />
              <Route path="/infrastructures/:id" element={<InfrastructureDetails />} />
              <Route path="/inspectors/:id" element={<InspectorDetails />} />
              <Route path="/provider/:id" element={<ProviderDetails />} />
              <Route path="/add-infrastructure" element={<AddInfrastructure />} />
              <Route path="/add-citizen" element={<AddCitizen />} />
              <Route path="/add-inspector" element={<AddInspector />} />
              <Route path="/add-provider" element={<AddProvider />} />


            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;



