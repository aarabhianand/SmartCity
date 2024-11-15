import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Modal from 'react-modal'; // Import the modal package
import './styles/UtilityProviders.css';

const UtilityProviders = () => {
    const [providers, setProviders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); // State to handle modal visibility
    const [credentials, setCredentials] = useState({ username: '', email: '', password_hash: '' });
    const navigate = useNavigate();

    // Fetch utility providers data from the backend
    useEffect(() => {
        axios.get('http://localhost:5001/providers')
            .then(response => setProviders(response.data))
            .catch(error => console.error('Error fetching providers:', error));
    }, []);

    // Handle click event to navigate to provider details page
    const handleProviderClick = (id) => {
        navigate(`/provider/${id}`);
    };

    useEffect(() => {
        // Add a class to the body when the component is mounted
        document.body.classList.add('infra-background');

        // Clean up by removing the class on unmount
        return () => {
            document.body.classList.remove('infra-background');
        };
    }, []);

    // Filter providers based on the search query
    const filteredProviders = providers.filter((provider) =>
        provider.provider_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.service_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle the add provider button click
    const handleAddProviderClick = () => {
        navigate('/add-provider'); // Navigate to add provider page
    };

    // Handle the add credentials button click
    const handleAddCredentialsClick = () => {
        setModalIsOpen(true); // Open the modal
    };

    // Handle input change for credentials
    const handleCredentialsChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Submit the credentials to the backend
    const handleSubmitCredentials = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5001/usersup', credentials)
            .then(response => {
                console.log('Credentials added successfully:', response.data);
                setModalIsOpen(false); // Close the modal after successful submission
            })
            .catch(error => console.error('Error adding credentials:', error));
    };

    // Close the modal
    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="provider-container">
            <h1 className="title">Utility Providers</h1>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search by name or service type"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Add Provider Button */}
            <div className="add-provider-container">
                <motion.button
                    className="add-provider-btn"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleAddProviderClick}
                >
                    Add Provider
                </motion.button>
            </div>

            {/* Add Credentials Button */}
            <div className="add-credentials-container">
                <motion.button
                    className="add-credentials-btn"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleAddCredentialsClick}
                >
                    Add Credentials
                </motion.button>
            </div>

            {/* Provider List */}
            <div className="provider-list">
                {filteredProviders.map((provider) => (
                    <motion.div
                        key={provider.provider_id}
                        className="provider-box"
                        onClick={() => handleProviderClick(provider.provider_id)}
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(0,0,0)" }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>{provider.provider_name}</h2> {/* Provider Name */}
                        <p><strong>Service Type:</strong> {provider.service_type}</p> {/* Service Type */}
                        <p><strong>Provider ID:</strong> {provider.provider_id}</p> {/* Provider ID */}
                    </motion.div>
                ))}
            </div>

            {/* Modal to Add Credentials */}
            <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    contentLabel="Add Credentials"
    ariaHideApp={false} // Hide app from screen readers when modal is open
    className="modal"
    overlayClassName="modal-overlay"
>
    
    <form onSubmit={handleSubmitCredentials}>
        <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleCredentialsChange}
            required
        />
        <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleCredentialsChange}
            required
        />
        <input
            type="password"
            name="password_hash"
            placeholder="Password"
            value={credentials.password_hash}
            onChange={handleCredentialsChange}
            required
        />
        <button type="submit">Add Credentials</button>
    </form>
    <button className="close-btn" onClick={closeModal}>Close</button>
</Modal>

        </div>
    );
};

export default UtilityProviders;
