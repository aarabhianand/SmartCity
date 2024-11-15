import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const ProviderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editableProvider, setEditableProvider] = useState({});

    useEffect(() => {
        console.log(`Fetching provider details for ID: ${id}`);
        axios.get(`http://localhost:5001/provider/${id}`)
            .then(response => {
                console.log('Provider details fetched:', response.data);
                setProvider(response.data);
                setEditableProvider(response.data); // Initialize editable fields
            })
            .catch(error => console.error('Error fetching provider details:', error));
    }, [id]);

    const handleEditProfile = () => {
        console.log('Entering edit mode');
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Changing ${name} to ${value}`);
        setEditableProvider(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSaveChanges = () => {
        console.log('Saving changes:', editableProvider);
        axios.post(`http://localhost:5001/provider/update/${id}`, editableProvider)
            .then(response => {
                console.log('Provider updated successfully:', response.data);
                setProvider(editableProvider); // Update displayed data
                setIsEditing(false); // Exit editing mode
                alert('Provider updated successfully');
            })
            .catch(error => console.error('Error updating provider details:', error));
    };

    const handleDeleteProfile = () => {
        console.log(`Deleting provider profile with ID: ${id}`);
        axios.post(`http://localhost:5001/provider/delete/${id}`)
            .then(response => {
                console.log('Provider deleted successfully:', response.data);
                alert('Provider deleted successfully');
                navigate('/providers'); // Redirect after deletion
            })
            .catch(error => console.error('Error deleting provider profile:', error));
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
                        name="provider_name"
                        value={editableProvider.provider_name}
                        onChange={handleInputChange}
                    />
                ) : (
                    provider.provider_name
                )}</h2>

                <p><strong>Service Type:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="service_type"
                        value={editableProvider.service_type}
                        onChange={handleInputChange}
                    />
                ) : (
                    provider.service_type
                )}</p>

                <p><strong>Service Area:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="service_area"
                        value={editableProvider.service_area}
                        onChange={handleInputChange}
                    />
                ) : (
                    provider.service_area
                )}</p>

                <p><strong>Contact Number:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="contact_number"
                        value={editableProvider.contact_number}
                        onChange={handleInputChange}
                    />
                ) : (
                    provider.contact_number
                )}</p>

                <p><strong>Email:</strong> {isEditing ? (
                    <input
                        type="email"
                        name="email"
                        value={editableProvider.email}
                        onChange={handleInputChange}
                    />
                ) : (
                    provider.email
                )}</p>

                <p><strong>Number of Members:</strong> {isEditing ? (
                    <input
                        type="number"
                        name="no_of_members"
                        value={editableProvider.no_of_members}
                        onChange={handleInputChange}
                    />
                ) : (
                    provider.no_of_members
                )}</p>

                <p><strong>Operational Hours:</strong> {isEditing ? (
                    <input
                        type="text"
                        name="operational_hours"
                        value={editableProvider.operational_hours}
                        onChange={handleInputChange}
                    />
                ) : (
                    provider.operational_hours
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
                        Edit Provider
                    </motion.button>
                )}

                <motion.button
                    className="delete-profile-btn"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleDeleteProfile}
                >
                    Delete Provider
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ProviderDetails;
