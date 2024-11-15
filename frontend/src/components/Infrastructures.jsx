import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './styles/Infrastructures.css';

const Infrastructures = () => {
    const [infrastructures, setInfrastructures] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Fetch infrastructures data from the backend
    useEffect(() => {
        axios.get('http://localhost:5001/infrastructures')
            .then(response => setInfrastructures(response.data))
            .catch(error => console.error('Error fetching infrastructure:', error));
    }, []);

    // Handle click event to navigate to details page
    const handleInfrastructuresClick = (id) => {
        navigate(`/infrastructures/${id}`);
    };

    useEffect(() => {
        // Add a class to the body when the component is mounted
        document.body.classList.add('infra-background');

        // Clean up by removing the class on unmount
        return () => {
            document.body.classList.remove('infra-background');
        };
    }, []);

    // Filter infrastructures based on the search query
    const filteredInfrastructures = infrastructures.filter((infrastructure) =>
        infrastructure.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        infrastructure.infrastructure_id.toString().includes(searchQuery)
    );

    // Handle the add infrastructure button click
    const handleAddInfrastructureClick = () => {
        navigate('/add-infrastructure'); // Navigate to add infrastructure page
    };

    return (
        <div className="infrastructure-container">
            <h1 className="title">Infrastructure</h1>
            
            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search by name or ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Add Infrastructure Button */}
            <div className="add-infrastructure-container">
                <motion.button
                    className="add-infrastructure-btn"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleAddInfrastructureClick}
                >
                    Add Infrastructure
                </motion.button>
            </div>

            {/* Infrastructure List */}
            <div className="infrastructure-list">
                {filteredInfrastructures.map((infrastructure) => (
                    <motion.div
                        key={infrastructure.infrastructure_id}
                        className="infrastructure-box"
                        onClick={() => handleInfrastructuresClick(infrastructure.infrastructure_id)}
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(0,0,0)" }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>{infrastructure.type}</h2> {/* Infrastructure type */}
                        <p><strong>ID:</strong> {infrastructure.infrastructure_id}</p> {/* Infrastructure ID */}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Infrastructures;
