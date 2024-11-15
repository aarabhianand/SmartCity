import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './AuthContext'; // Adjust path as needed
import './styles/Profile.css'; // Adjust path for CSS file
import { FaEdit, FaSave } from 'react-icons/fa'; // Import pencil and save icons

const Profile = () => {
  const { role } = useParams();
  const { user, login, logout } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Fetch user data along with role-specific profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user && user.email && role) {
        try {
          const response = await axios.get(`http://localhost:5001/api/profile/${role}`, {
            params: { email: user.email },
          });
          setProfileData(response.data);
        } catch (error) {
          console.error('Error fetching profile data:', error);
          alert('Failed to load profile data. Please try again.');
        }
      }
    };

    // Redirect to login if user or role is missing
    if (!user || !role) {
      navigate('/login');
    } else {
      fetchProfileData();
    }
  }, [role, user, navigate]);

  const handleInputChange = (e, field) => {
    setProfileData(prevData => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      await axios.post(`http://localhost:5001/api/profile/update/${role}`, profileData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile data:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || !profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-modal">
        <h2>User Profile</h2>
        <div className="profile-info">
          {role === 'Citizen' && (
            <>
              <div className="editable">
                <p><strong>Name:</strong> {isEditing ? <input type="text" value={profileData.citizen_name} onChange={(e) => handleInputChange(e, 'citizen_name')} /> : profileData.citizen_name}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Address:</strong> {isEditing ? <input type="text" value={profileData.address} onChange={(e) => handleInputChange(e, 'address')} /> : profileData.address}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Email:</strong> {isEditing ? <input type="text" value={profileData.email} onChange={(e) => handleInputChange(e, 'email')} /> : profileData.email}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Contact Number:</strong> {isEditing ? <input type="text" value={profileData.contact_number} onChange={(e) => handleInputChange(e, 'contact_number')} /> : profileData.contact_number}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Alternate Number:</strong> {isEditing ? <input type="text" value={profileData.alternate_contact_number} onChange={(e) => handleInputChange(e, 'alternate_contact_number')} /> : profileData.alternate_contact_number}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
            </>
          )}

          {role === 'Inspector' && (
            <>
              <div className="editable">
                <p><strong>Inspector Name:</strong> {isEditing ? <input type="text" value={profileData.inspector_name} onChange={(e) => handleInputChange(e, 'inspector_name')} /> : profileData.inspector_name}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Phone Number:</strong> {isEditing ? <input type="text" value={profileData.phone_number} onChange={(e) => handleInputChange(e, 'phone_number')} /> : profileData.phone_number}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Email:</strong> {isEditing ? <input type="text" value={profileData.email} onChange={(e) => handleInputChange(e, 'email')} /> : profileData.email}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Specialization:</strong> {isEditing ? <input type="text" value={profileData.spec} onChange={(e) => handleInputChange(e, 'spec')} /> : profileData.spec}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
            </>
          )}

          {role === 'UtilityProvider' && (
            <>
              <div className="editable">
                <p><strong>Provider Name:</strong> {isEditing ? <input type="text" value={profileData.provider_name} onChange={(e) => handleInputChange(e, 'provider_name')} /> : profileData.provider_name}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Service Type:</strong> {isEditing ? <input type="text" value={profileData.service_type} onChange={(e) => handleInputChange(e, 'service_type')} /> : profileData.service_type}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Service Area:</strong> {isEditing ? <input type="text" value={profileData.service_area} onChange={(e) => handleInputChange(e, 'service_area')} /> : profileData.service_area}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Contact Number:</strong> {isEditing ? <input type="text" value={profileData.contact_number} onChange={(e) => handleInputChange(e, 'contact_number')} /> : profileData.contact_number}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Email:</strong> {isEditing ? <input type="email" value={profileData.email} onChange={(e) => handleInputChange(e, 'email')} /> : profileData.email}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Number of Members:</strong> {isEditing ? <input type="number" value={profileData.no_of_members} onChange={(e) => handleInputChange(e, 'no_of_members')} /> : profileData.no_of_members}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Operational Hours:</strong> {isEditing ? <input type="text" value={profileData.operational_hours} onChange={(e) => handleInputChange(e, 'operational_hours')} /> : profileData.operational_hours}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>

            </>
          )}
          {role === 'Admin' && (
            <>
              <div className="editable">
                <p><strong>Username:</strong> {isEditing ? <input type="text" value={profileData.username} onChange={(e) => handleInputChange(e, 'username')} /> : profileData.username}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
              <div className="editable">
                <p><strong>Email:</strong> {isEditing ? <input type="email" value={profileData.email} onChange={(e) => handleInputChange(e, 'email')} /> : profileData.email}</p>
                <i onClick={isEditing ? handleSave : handleEditToggle}>{isEditing ? <FaSave /> : <FaEdit />}</i>
              </div>
            </>
          )}
        </div>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default Profile;
