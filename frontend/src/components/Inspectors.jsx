import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Modal from 'react-modal'; // Import the modal package
import './styles/Inspectors.css';

const Inspectors = () => {
    const [inspectors, setInspectors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); // State for inspector modal visibility
    const [credentialsModalIsOpen, setCredentialsModalIsOpen] = useState(false); // State for credentials modal
    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password_hash: '',
    }); // State for credentials form data
    const navigate = useNavigate();

    // Fetch inspectors data from the backend
    useEffect(() => {
        axios.get('http://localhost:5001/inspectors')
            .then(response => setInspectors(response.data))
            .catch(error => console.error('Error fetching inspectors:', error));
    }, []);

    // Handle click event to navigate to inspector details page
    const handleInspectorClick = (id) => {
        navigate(`/inspector/${id}`);
    };

    // Filter inspectors based on the search query
    const filteredInspectors = inspectors.filter((inspector) =>
        inspector.inspector_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inspector.spec.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle the add inspector button click
    const handleAddInspectorClick = () => {
        setModalIsOpen(true); // Open the modal
    };

    // Handle the add credentials button click
    const handleAddCredentialsClick = () => {
        setCredentialsModalIsOpen(true); // Open credentials modal
    };

    // Close the modal for adding inspector
    const closeModal = () => {
        setModalIsOpen(false);
    };

    // Close the modal for adding credentials
    const closeCredentialsModal = () => {
        setCredentialsModalIsOpen(false);
    };

    // Handle form submission for adding credentials
    const handleCredentialsSubmit = (e) => {
        e.preventDefault();

        // Send credentials data to the backend to add to the users table
        axios.post('http://localhost:5001/add-credentials', credentials)
            .then(response => {
                console.log('Credentials added successfully:', response.data);
                closeCredentialsModal(); // Close the modal after successful submission
            })
            .catch(error => {
                console.error('Error adding credentials:', error);
            });
    };

    return (
        <div className="inspector-container">
            <h1 className="title">Inspectors</h1>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search by name or specialization"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="add-buttons-container">
    <motion.button
        className="add-inspector-btn"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        onClick={handleAddInspectorClick}
    >
        Add Inspector
    </motion.button>
    
    <motion.button
        className="add-credentials-btn"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        onClick={handleAddCredentialsClick}
    >
        Add Credentials
    </motion.button>
</div>


            {/* Inspector List */}
            <div className="inspector-list">
                {filteredInspectors.map((inspector) => (
                    <motion.div
                        key={inspector.inspector_id}
                        className="inspector-box"
                        onClick={() => handleInspectorClick(inspector.inspector_id)}
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(0,0,0)" }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>{inspector.inspector_name}</h2> {/* Inspector Name */}
                        <p><strong>Specialization:</strong> {inspector.spec}</p> {/* Specialization */}
                    </motion.div>
                ))}
            </div>

            {/* Modal for Adding Inspector */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Add Inspector"
                ariaHideApp={false}
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Add New Inspector</h2>
                {/* Add Inspector Form */}
                <form onSubmit={(e) => {/* Form submit logic */}}>
                    {/* Form fields for inspector's details */}
                    <input type="text" placeholder="Name" required />
                    <input type="text" placeholder="Phone Number" required />
                    <input type="email" placeholder="Email" required />
                    <select required>
                        <option value="Health">Health Inspector</option>
                        <option value="Quality">Quality Inspector</option>
                        <option value="Safety">Safety Inspector</option>
                        <option value="Environmental">Environmental Inspector</option>
                    </select>
                    <button type="submit">Add Inspector</button>
                </form>
                <button onClick={closeModal}>Close</button>
            </Modal>

            {/* Modal for Adding Credentials */}
            <Modal
                isOpen={credentialsModalIsOpen}
                onRequestClose={closeCredentialsModal}
                contentLabel="Add Credentials"
                ariaHideApp={false}
                className="modal"
                overlayClassName="modal-overlay"
            >
                
                {/* Add Credentials Form */}
                <form onSubmit={handleCredentialsSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={credentials.password_hash}
                        onChange={(e) => setCredentials({ ...credentials, password_hash: e.target.value })}
                        required
                    />
                    <div className="modal-button-container">
                        <button type="submit">Add Credentials</button>
                        <button type="button" className="close-button" onClick={closeCredentialsModal}>Close</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Inspectors;
