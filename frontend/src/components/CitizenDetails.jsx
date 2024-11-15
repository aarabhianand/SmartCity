import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './styles/CitizenDetails.css';

const CitizenDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [citizen, setCitizen] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editableCitizen, setEditableCitizen] = useState({});

    useEffect(() => {
        console.log(`Fetching citizen details for ID: ${id}`);
        axios.get(`http://localhost:5001/citizen/${id}`)
            .then(response => {
                console.log('Citizen details fetched:', response.data);
                setCitizen(response.data);
                setEditableCitizen(response.data); // Initialize editable fields
            })
            .catch(error => console.error('Error fetching citizen details:', error));
    }, [id]);

    const handleEditProfile = () => {
        console.log('Entering edit mode');
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Changing ${name} to ${value}`);
        setEditableCitizen(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSaveChanges = () => {
        console.log('Saving changes:', editableCitizen);
        axios.post(`http://localhost:5001/citizen/update/${id}`, editableCitizen)
            .then(response => {
                console.log('Profile updated successfully:', response.data);
                setCitizen(editableCitizen); // Update displayed data
                setIsEditing(false); // Exit editing mode
                alert('Profile updated successfully');
            })
            .catch(error => console.error('Error updating Citizen details:', error));
    };
    
    const handleDeleteProfile = () => {
        console.log(`Deleting profile with ID: ${id}`);
        axios.post(`http://localhost:5001/citizen/delete/${id}`)
            .then(response => {
                console.log('Profile deleted successfully:', response.data);
                alert('Profile deleted successfully');
                navigate('/citizens'); // Redirect after deletion
            })
            .catch(error => console.error('Error deleting profile:', error));
    };

    return (
        <motion.div
            className="details-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="details-card"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2>{isEditing ? (
                    <input
                        type="text"
                        name="citizen_name"
                        value={editableCitizen.citizen_name}
                        onChange={handleInputChange}
                    />
                ) : (
                    citizen.citizen_name
                )}</h2>

                <p><strong>Address:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="address"
                        value={editableCitizen.address}
                        onChange={handleInputChange}
                    />
                ) : (
                    citizen.address
                )}</p>

                <p><strong>Contact Number:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="contact_number"
                        value={editableCitizen.contact_number}
                        onChange={handleInputChange}
                    />
                ) : (
                    citizen.contact_number
                )}</p>

                <p><strong>Alterate Contact Number:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="alternate_contact_number"
                        value={editableCitizen.alternate_contact_number}
                        onChange={handleInputChange}
                    />
                ) : (
                    citizen.alternate_contact_number
                )}</p>

                <p><strong>Email:</strong> {isEditing ? (
                    <input
                        type="email"
                        name="email"
                        value={editableCitizen.email}
                        onChange={handleInputChange}
                    />
                ) : (
                    citizen.email
                )}</p>
            </motion.div>

            <div className="buttons-container">
                {isEditing ? (
                    <motion.button
                        className="save-changes-btn"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleSaveChanges}
                    >
                        Save Changes
                    </motion.button>
                ) : (
                    <motion.button
                        className="edit-profile-btn"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleEditProfile}
                    >
                        Edit Profile
                    </motion.button>
                )}

                <motion.button
                    className="delete-profile-btn"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleDeleteProfile}
                >
                    Delete Profile
                </motion.button>
            </div>
        </motion.div>
    );
};

export default CitizenDetails;
