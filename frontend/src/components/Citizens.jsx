import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './styles/Citizens.css';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

const Citizens = () => {
    const [citizens, setCitizens] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);  // State to control modal visibility
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    // Fetch citizens data from the backend
    useEffect(() => {
        axios.get('http://localhost:5001/citizens')
            .then(response => setCitizens(response.data))
            .catch(error => console.error('Error fetching citizens:', error));
    }, []);

    // Handle click event to navigate to citizen details page
    const handleCitizenClick = (id) => {
        navigate(`/citizens/${id}`);
    };

    useEffect(() => {
        // Add a class to the body when the component is mounted
        document.body.classList.add('citizens-background');

        // Clean up by removing the class on unmount
        return () => {
            document.body.classList.remove('citizens-background');
        };
    }, []);

    // Filter citizens based on the search query
    const filteredCitizens = citizens.filter((citizen) =>
        citizen.citizen_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        citizen.citizen_id.toString().includes(searchQuery)
    );

    // Handle the add citizen button click
    const handleAddCitizenClick = () => {
        navigate('/add-citizen'); // Navigate to add citizen page
    };

    // Handle modal visibility
    const handleAddCredentialsClick = () => {
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
    };

    // Handle form submission for adding credentials
    const handleSubmitCredentials = async (e) => {
        e.preventDefault();

        // Hash password using bcrypt before sending to backend
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = {
            username,
            email,
            password_hash: hashedPassword
        };

        // Send the POST request to add user credentials to the 'users' table
        try {
            await axios.post('http://localhost:5001/add-credentials', newUser);
            alert('Credentials added successfully!');
            setShowModal(false); // Close modal after successful submission
        } catch (error) {
            console.error('Error adding credentials:', error);
        }
    };

    return (
        <div className="citizen-container">
            <motion.div className="title">
                Citizens List
            </motion.div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search citizens"
                    className="citizen-search-bar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Button container for add citizen and add credentials */}
            <div className="add-buttons-container">
                <div className="add-citizen-container">
                    <button className="add-citizen-btn" onClick={handleAddCitizenClick}>
                        Add Citizen
                    </button>
                </div>
                <div className="add-credentials-container">
                    <button className="add-credentials-btn" onClick={handleAddCredentialsClick}>
                        Add Credentials
                    </button>
                </div>
            </div>

            {/* Modal for adding credentials */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <form onSubmit={handleSubmitCredentials}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="modal-actions">
                                <button type="submit">Submit</button>
                                <button type="button" onClick={closeModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Display the list of citizens */}
            <div className="citizen-list">
                {filteredCitizens.map((citizen) => (
                    <div
                        key={citizen.citizen_id}
                        className="citizen-box"
                        onClick={() => handleCitizenClick(citizen.citizen_id)}
                    >
                        <h2>{citizen.citizen_name}</h2>
                        <p>{citizen.citizen_id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Citizens;
