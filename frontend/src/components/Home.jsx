import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from './AuthContext'; // Adjust path as needed
import { FaUserCircle } from 'react-icons/fa'; // Profile icon
import './styles/Home.css';

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="header">
        <div className="welcome-message">
          <h1>Welcome!</h1>
        </div>
        <div className="profile-icon-container">
          {user ? (
            <Link to={`/profile/${user.role}`} title="View Profile" className="profile-icon">
              <FaUserCircle size={40} />
            </Link>
          ) : (
            <p>Please log in to access your profile.</p>
          )}
        </div>
      </div>

      <div className="content">
        {user ? (
          <p className="user-role">You are logged in as a <strong>{user.role}</strong>.</p>
        ) : (
          <p>Please log in to access your profile.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
