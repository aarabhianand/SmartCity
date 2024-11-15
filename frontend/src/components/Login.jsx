import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = (data) => {
    console.log("User logged in:", data);

    // Store the common user data in localStorage
    localStorage.setItem('user', JSON.stringify(data));

    // Ensure 'role' is defined and handle any undefined cases
    if (!data.role) {
      console.error('Role is undefined for the user');
    }

    console.log("User role:", data.role); // Ensure that the role exists here

    // Store the role-specific ID based on the user's role (if necessary)
    if (data.role === 'Citizen') {
      localStorage.setItem('citizen_id', data.citizen_id);
    } else if (data.role === 'Inspector') {
      localStorage.setItem('inspector_id', data.inspector_id);
    } else if (data.role === 'UtilityProvider') {
      localStorage.setItem('provider_id', data.provider_id);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        login(data); // Store the user data and specific ID
        navigate('/home');
      } else {
        setMessage(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleLogin} className="form">
        <h2 className="title"></h2>
        <div className="inputContainer">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
            aria-label="Email"
          />
        </div>
        <div className="inputContainer">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
            aria-label="Password"
          />
        </div>
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
