import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Addcitizen.css';

const AddCitizen = () => {
    const [citizen_name, setCitizenName] = useState('');
    const [address, setAddress] = useState('');
    const [contact_number, setContactNumber] = useState('');
    const [alternate_contact_number, setAltContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const newCitizen = {
            citizen_name,
            address,
            contact_number,
            alternate_contact_number,
            email
        };

        // Send the POST request to create a new infrastructure
        axios.post('http://localhost:5001/citizens', newCitizen)
            .then(response => {
                console.log('New Citizen added:', response.data);
                navigate('/citizens'); // Redirect back to the infrastructure list
            })
            .catch(error => {
                setError('Failed to add new citizen. Please try again.');
                console.error('Error adding citizen:', error);
            });
    };

    return (
        <div className="add-citizen-container">
            <h1>Add New Citizen</h1>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={citizen_name}
                        onChange={(e) => setCitizenName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Address:
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Contact Number:
                    <input
                        type="text"
                        value={contact_number}
                        onChange={(e) => setContactNumber(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Alternate Contact Number:
                    <input
                        type="text"
                        value={alternate_contact_number}
                        onChange={(e) => setAltContactNumber(e.target.value)}
                        required

                    />  
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                

                <button type="submit">Add Citizen</button>
            </form>
        </div>
    );
};

export default AddCitizen;
