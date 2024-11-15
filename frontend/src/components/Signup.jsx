import React, { useState } from 'react';
import './styles/Signup.css'; // Ensure this imports your CSS
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
  const [username, setUsername] = useState(''); // Changed name to username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('');
  const [subRole, setSubRole] = useState(''); // To handle Utility Provider sub-roles
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [altContactNumber, setAltContactNumber] = useState('');
  const [specialization, setSpecialization] = useState('');

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
  
    const userData = {
      username,
      email,
      password,
      role,
      fullName: role === 'Citizen' || role === 'Inspector' ? fullName : undefined,
      address: role === 'Citizen' ? address : undefined,
      contactNumber: role === 'Citizen' || role === 'Inspector' || subRole === 'Maintenance Team' ? contactNumber : undefined,
      altContactNumber: role === 'Citizen' ? altContactNumber : undefined,
      specialization: role === 'Inspector' ? specialization : undefined,
    };
  
    try {
      const response = await fetch('http://localhost:5001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Signup successful'); // Success alert
        setMessage('Signup successful'); // Optionally set a message
        navigate('/'); // Navigate to home after signup
      } else {
        setMessage(data.error || 'An error occurred during signup');
        alert(data.error || 'An error occurred during signup'); // Show error in alert
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert('An error occurred during signup');
    }
  };
  

  return (
    <div className="signupContainer">
      <form className="signupForm" onSubmit={handleSignup}>

        {/* Role Selection (Dropdown) */}
        <div className="inputContainer">
          <label className="label"></label>
          <select
            className="input"
            value={role}
            onChange={(e) => { setRole(e.target.value); setSubRole(''); }}
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Citizen">Citizen</option>
            <option value="Inspector">Inspector</option>
          </select>
        </div>

        {/* Username, Email, and Password Fields */}
        <div className="inputContainer">
          <input
            type="text"
            className="input"
            placeholder="Username"
            value={username} // Username input
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="inputContainer">
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="inputContainer">
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Fields for Citizen */}
        {role === 'Citizen' && (
          <>
            <div className="inputContainer">
              <input
                type="text"
                className="input"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="inputContainer">
              <input
                type="text"
                className="input"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="inputContainer">
              <input
                type="tel"
                className="input"
                placeholder="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>
            <div className="inputContainer">
              <input
                type="tel"
                className="input"
                placeholder="Alternative Contact Number"
                value={altContactNumber}
                onChange={(e) => setAltContactNumber(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Fields for Inspector */}
        {role === 'Inspector' && (
          <>
            <div className="inputContainer">
              <input
                type="text"
                className="input"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="inputContainer">
              <input
                type="tel"
                className="input"
                placeholder="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>
            <div className="inputContainer">
              <select
                className="input"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
              >
                <option value="">Select Specialization</option>
                <option value="Safety Inspector">Safety Inspector</option>
                <option value="Environmental Inspector">Environmental Inspector</option>
                <option value="Quality Inspector">Quality Inspector</option>
                <option value="Health Inspector">Health Inspector</option>
              </select>
            </div>
          </>
        )}

        <button className="submitButton" type="submit">Sign Up</button>

        {/* Message for the user */}
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
};

export default Signup;
