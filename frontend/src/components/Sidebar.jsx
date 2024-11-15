import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaChartBar,
  FaClipboardList,
  FaTools,
  FaInfoCircle,
  FaEnvelope,
  FaBars,
} from 'react-icons/fa';
import '../styles.css';

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Define menu items for each role
  const menuItems = {
    Citizen: [
      { name: 'Home', path: '/home', icon: <FaHome className="icon" /> },
      { name: 'Dashboard', path: '/dashboard', icon: <FaChartBar className="icon" /> },
      { name: 'Infrastructure', path: '/infrastructure', icon: <FaClipboardList className="icon" /> },
      { name: 'About', path: '/about', icon: <FaInfoCircle className="icon" /> },
      { name: 'Contact', path: '/contact', icon: <FaEnvelope className="icon" /> },
    ],
    Inspector: [
      { name: 'Home', path: '/home', icon: <FaHome className="icon" /> },
      { name: 'Dashboard', path: '/dashboard', icon: <FaChartBar className="icon" /> },
      { name: 'Schedule Inspection', path: '/schedule-inspection', icon: <FaClipboardList className="icon" /> },
      { name: 'View Inspection', path: '/view-inspections', icon: <FaTools className="icon" /> },
      { name: 'About', path: '/about', icon: <FaInfoCircle className="icon" /> },
      { name: 'Contact', path: '/contact', icon: <FaEnvelope className="icon" /> }



    ],
    UtilityProvider: [
      { name: 'Home', path: '/home', icon: <FaHome className="icon" /> },
      { name: 'Dashboard', path: '/dashboard', icon: <FaChartBar className="icon" /> },
      { name: 'Maintenance Requests', path: '/maintenance', icon: <FaTools className="icon" /> },
    ],
    Admin: [
      { name: 'Home', path: '/home', icon: <FaHome className="icon" /> },
      { name: 'Dashboard', path: '/dashboard', icon: <FaChartBar className="icon" /> },
      { name: 'Maintenance Requests', path: '/maintenance', icon: <FaTools className="icon" /> },
      { name: 'Citizens', path: '/citizens', icon: <FaTools className="icon" /> },
      { name: 'Infrastructure', path: '/infrastructures', icon: <FaTools className="icon" /> },
      { name: 'Utility Providers', path: '/providers', icon: <FaTools className="icon" /> },
      { name: 'Inspectors', path: '/inspectors', icon: <FaTools className="icon" /> },
      { name: 'About', path: '/about', icon: <FaInfoCircle className="icon" /> },
      { name: 'Contact', path: '/contact', icon: <FaEnvelope className="icon" /> },
    ],
  };

  // Get the items for the current role, default to empty array if role not defined
  const items = menuItems[role] || [];

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <ul>
          {items.length > 0 ? (
            items.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>
                  {item.icon} {item.name}
                </Link>
              </li>
            ))
          ) : (
            <li>No accessible menu items available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
