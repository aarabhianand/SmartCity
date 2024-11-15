import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const InspectorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inspector, setInspector] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editableInspector, setEditableInspector] = useState({});

    useEffect(() => {
        console.log(`Fetching inspector details for ID: ${id}`);
        axios.get(`http://localhost:5001/inspector/${id}`)
            .then(response => {
                console.log('Inspector details fetched:', response.data);
                setInspector(response.data);
                setEditableInspector(response.data); // Initialize editable fields
            })
            .catch(error => console.error('Error fetching inspector details:', error));
    }, [id]);

    const handleEditProfile = () => {
        console.log('Entering edit mode');
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Changing ${name} to ${value}`);
        setEditableInspector(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSaveChanges = () => {
        console.log('Saving changes:', editableInspector);
        axios.post(`http://localhost:5001/inspector/update/${id}`, editableInspector)
            .then(response => {
                console.log('Profile updated successfully:', response.data);
                setInspector(editableInspector); // Update displayed data
                setIsEditing(false); // Exit editing mode
                alert('Profile updated successfully');
            })
            .catch(error => console.error('Error updating inspector details:', error));
    };
    
    const handleDeleteProfile = () => {
        console.log(`Deleting profile with ID: ${id}`);
        axios.post(`http://localhost:5001/inspector/delete/${id}`)
            .then(response => {
                console.log('Profile deleted successfully:', response.data);
                alert('Profile deleted successfully');
                navigate('/inspectors'); // Redirect after deletion
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
                        name="inspector_name"
                        value={editableInspector.inspector_name}
                        onChange={handleInputChange}
                    />
                ) : (
                    inspector.inspector_name
                )}</h2>

                <p><strong>Specialization:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="spec"
                        value={editableInspector.spec}
                        onChange={handleInputChange}
                    />
                ) : (
                    inspector.spec
                )}</p>

                <p><strong>Assigned Inspection:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="assigned_inspection"
                        value={editableInspector.assigned_inspection}
                        onChange={handleInputChange}
                    />
                ) : (
                    inspector.assigned_inspection || 'None'
                )}</p>

                <p><strong>Phone:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="phone_number"
                        value={editableInspector.phone_number}
                        onChange={handleInputChange}
                    />
                ) : (
                    inspector.phone_number
                )}</p>

                <p><strong>Email:</strong> {isEditing ? (
                    <input
                        type="email"
                        name="email"
                        value={editableInspector.email}
                        onChange={handleInputChange}
                    />
                ) : (
                    inspector.email
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

export default InspectorDetails;
