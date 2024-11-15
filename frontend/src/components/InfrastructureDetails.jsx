import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const InfrastructureDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [infrastructure, setInfrastructure] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editableInfra, setEditableInfra] = useState({});

    useEffect(() => {
        console.log(`Fetching infrastructure details for ID: ${id}`);
        axios.get(`http://localhost:5001/infrastructures/${id}`)
            .then(response => {
                console.log('Infra details fetched:', response.data);
                setInfrastructure(response.data);
                setEditableInfra(response.data); // Initialize editable fields
            })
            .catch(error => console.error('Error fetching infra details:', error));
    }, [id]);

    const handleEditProfile = () => {
        console.log('Entering edit mode');
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Changing ${name} to ${value}`);
        setEditableInfra(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSaveChanges = () => {
        console.log('Saving changes:', editableInfra);
        axios.post(`http://localhost:5001/infrastructures/update/${id}`, editableInfra)
            .then(response => {
                console.log('Profile updated successfully:', response.data);
                setInfrastructure(editableInfra); // Update displayed data
                setIsEditing(false); // Exit editing mode
                alert('Profile updated successfully');
            })
            .catch(error => console.error('Error updating infra details:', error));
    };
    
    const handleDeleteProfile = () => {
        console.log(`Deleting profile with ID: ${id}`);
        axios.post(`http://localhost:5001/infrastructures/delete/${id}`)
            .then(response => {
                console.log('Profile deleted successfully:', response.data);
                alert('Profile deleted successfully');
                navigate('/infrastructures'); // Redirect after deletion
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
                        name="infrastructure_type"
                        value={editableInfra.type}
                        onChange={handleInputChange}
                    />
                ) : (
                    infrastructure.type
                )}</h2>

                <p><strong>Location:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="location"
                        value={editableInfra.location}
                        onChange={handleInputChange}
                    />
                ) : (
                    infrastructure.location
                )}</p>

                <p><strong>Installed Date:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="installed_date"
                        value={editableInfra.installed_date}
                        onChange={handleInputChange}
                    />
                ) : (
                    infrastructure.installed_date
                )}</p>

                <p><strong>Status:</strong> {isEditing ? (
                    <select
                        name="status"
                        value={editableInfra.status}
                        onChange={handleInputChange}
                    >
                        <option value="Operational">Operational</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                        <option value="Construction">Construction</option>
                    </select>
                ) : (
                    infrastructure.status
                )}</p>

                <p><strong>Provider:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="provider_id"
                        value={editableInfra.provider_id}
                        onChange={handleInputChange}
                    />
                ) : (
                    infrastructure.provider_id
                )}</p>

                <p><strong>Connected Infrastructure:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="super_infrastructure_id"
                        value={editableInfra.super_infrastructure_id}
                        onChange={handleInputChange}
                    />
                ) : (
                    infrastructure.super_infrastructure_id || 'None'
                )}</p>

                <p><strong>Image URL:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="image_url"
                        value={editableInfra.image_url}
                        onChange={handleInputChange}
                    />
                ) : (
                    infrastructure.image_url
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
                        Edit Infrastructure
                    </motion.button>
                )}

                <motion.button
                    className="delete-profile-btn"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleDeleteProfile}
                >
                    Delete Infrastructure
                </motion.button>
            </div>
        </motion.div>
    );
};

export default InfrastructureDetails;
